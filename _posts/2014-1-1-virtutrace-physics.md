---
layout: post
title:	VirtuTrace Physics Engine Rebuild
date:   2014-1-1 10:22:34 -0600
categories: work old
--- 

In our lab, we try to get insights about high-intensity, time-pressured
decisions made by people like soldiers, firefighters, and police
officers. To do this, we use VirtuTrace, our flagship simulator software
that runs in the [C6](http://www.vrac.iastate.edu/facilities/c6/), one
of the largest
[CAVE](http://en.wikipedia.org/wiki/Cave_automatic_virtual_environment)s
in the world. We like the C6 because it allows us to get really high
ecological validity for our studies, but until recently, our simulations
did not support dynamic physics — once the scene was loaded, none of the
objects could move.

It was my job to update the engine to allow for fully dynamic physics:
tools floating in zero-g in the International Space Station, houses
exploding in war zones, and even car collisions were all required in
upcoming projects. We were using the [Bullet](http://bulletphysics.org/)
physics engine just to stop people from walking through walls, but it
was designed for truly dynamic physics simulations, so I didn't have to
replace it. Even better, a [library](https://github.com/mccdo/osgbullet)
exists that ties together our visual rendering and object hierarchy tree
([OpenSceneGraph](http://www.openscenegraph.org)) and Bullet, saving me
even more time.

I think of code refactoring as a sort of design problem. The users are the developers
who have to read, understand, and use your API[^fn-api] to get their job done
and the developers who have to edit your code to add a new feature or
fix a bug. The API user's goal could be anything your system allows (and
in some cases, *doesn't* allow), so a good one needs to have clear and
explicit patterns while still remaining flexible. In contrast, the bug
fixer just wants to get in and solve their problem without spending a
ton of time digging around in complex, arcane code looking for a minus
sign in the wrong spot. I also had to make migration from the old,
static scenes to the new dynamic physics scenes as painless as possible,
which meant that no matter how fancy I wanted to get, the inputs and
outputs all had to look the same (or very similar). There's nothing
worse than updating a library and finding out that nothing works the way
you expect it to, so now you have go back and rewrite all your old code.

I discussed this at length with my primary stakeholders: Kevin, the
initial developer of VirtuTrace and its main developer once I leave, and
Nir, our advisor, who needs to understand its features and limitations
when designing experiments. It was very important to Nir that the
physics were realistic, but Kevin wasn't able to spend a ton of his time
rewriting old scenes to make them play nice with the new code. Nir had a
long list of features he wanted to see, including zero-g, variations in
mass, size, and even mass distribution (so a hammer could be heavier at
one end, for example). Even though Nir wanted a bunch of features,
Kevin's need for an easy upgrade meant that I couldn't just tear
everything out and start from scratch.

As I read through the code and experimented with changes, however, I quickly
discovered that it would be very challenging to create all these
features without breaking compatibility with old code. This led to two
key decisions: first, there should be a clear distinction between
*static* objects and *dynamic* objects, and that everything should be
static unless someone *explicitly* told them not to be. This way, old
scenes would be able to play nice with the new system, and if anyone
ever wanted to upgrade them to a dynamic scene, they would be going out
of their way to make that choice, as opposed to having it forced upon
them by the design of the system[^fn-staticdynamic].

The very first thing I did was find out what wasn't necessary.
The original, static method looked at all the objects in the scene,
created invisible boxes around each of them, and then froze them in
place. This worked fine when things weren't moving, but it wasn't going
to fly with dynamic physics. For one thing, keeping track and
synchronizing the locations of pairs of objects would be a huge hit to
performance. The old method was going to have to go. While this meant
starting over in several areas, it had a nice upside and an unexpected
downside. Bullet provides an API for adding dynamic objects
(`btRigidBodies*` in the Bullet parlance), which allowed me to specify
things like mass, size, and starting position. The downside was that all
the previous code that had done the math to put objects in the right
spot had to be removed, and because of a mismatch between how positions
were entered by the programmer and how Bullet expected them, that math
now fell to *me*[^fn-linear].

Here's an example of what it looks like:

    osg::MatrixTransform* master_node = new osg::MatrixTransform();
    master_node->setName(model_id);

    osg::Matrix matrix = osg::Matrix::scale(scale_x, scale_y, scale_z)
    * osg::Matrix::rotate(osg::inDegrees(rotate_x), osg::X_AXIS)
    * osg::Matrix::rotate(osg::inDegrees(rotate_y), osg::Y_AXIS)
    * osg::Matrix::rotate(osg::inDegrees(rotate_z), osg::Z_AXIS)
    * osg::Matrix::translate(position);
    osg::MatrixTransform* static_matrix_transform = new osg::MatrixTransform(matrix);
    std::vector<osg::Node* > non_collision_nodes = physics_visitor->get_non_collision_nodes();
    for(std::vector<osg::Node* >::iterator iter = non_collision_nodes.begin(); iter != non_collision_nodes.end(); ++iter){
        static_matrix_transform->addChild((*iter));
    }
    master_node->addChild(static_matrix_transform);

Instead of handling the initial construction and setup of dynamic and static objects
separately, I decided to treat their creation as if they were identical
until they *really* needed to be handled differently. This allowed me to
use the many of the same functions and math for both kinds of objects,
greatly simplifying the process and speeding up the simulation. Because
the math was the same, the various steps of the APIs could both point to
the same function when they needed, but still do their own independent
steps. This saved me a lot of time, and made it substantially easier for
future programmers to look at my code and see how all the pieces fit
together. With the new positioning code written, I could remove the old,
redundant code that already existed. However, doing this would remove
the API hooks the static scenes relied on, so I created new hooks that
were identical in name to the old ones, but just pointed to the new
code[^fn-best].

With the new code in place, I had assumed everything would work. And in
tests, it did! Objects flying at each other would bounce off the floors
and walls, and objects would drop out of the sky with gravity pulling
them down — and the old scenes still worked just fine. The only problem
was that the player object couldn't interact with the dynamic objects.
It didn't matter what the mass or size of the object was: as soon as the
player walked into it, they stopped dead. This was initially amusing, as
players floating down the International Space Station would come to a
crashing halt when they run into a screwdriver floating in the air. But
this wasn't exactly a high-fidelity simulation.

The solution was not easy to find. I tried a huge range of fixes, from
changing the way the physics engine treated the player object to writing
my own collision math specifically for dealing with the player. I talked
to Kevin and Nir looking for insights and advice, and I contacted the
much more experienced Ph.D students who worked in VRAC. No one could
help me. I turned to the archaic, spotty, and inconsistent Bullet
documentation over and over again, reading every page, forum post,
commit message, and code comment that seemed promising.

In the end, it was this exhaustive coverage of the documentation that
led me to my answer. Nestled in an unrelated page of the Bullet wiki was
a brief mention that player objects could have collision filters applied
to them using an old-style method from the previous version of Bullet.
Nowhere else in the official documentation was this listed, and the
function didn't even document that it could accept that kind of input.
But lo and behold, it worked.

The conversion was even more challenging than I expected. The end result
fit what both Kevin and Nir wanted, making the upgrade process painless
and providing most of the features Nir asked for with the potential to
add the rest in the near future. I tried to make my code as clear as
possible, leaving documenting comments in areas that seemed confusing
and breadcrumb trails showing how all the parts connected. And if
developers were still confused, I made sure that my email address was
available for them.


[^fn-api]: Application Programming Interface; the hooks and tie-ins to your system that let developers use it for their own purposes.

[^fn-staticdynamic]: One unexpected benefit of these choices was that it was easy to mix static and dynamic objects together. If you wanted to add just one dynamic thing to an old static scene, you didn't need to rewrite all the code — just use the new dynamic API along with the old static one.

[^fn-linear]: I wound up learning almost an entire class' worth of linear algebra for this. I let the computer handle the [four-dimensional rotation matrices](http://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation), though.

[^fn-best]: In the end, this was the best decision I made. It meant that the physics system could live in one spot and share as much code as possible while still allowing for old code to talk to it. The inputs and outputs stayed the same, it was just the inside that changed.