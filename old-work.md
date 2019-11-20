---
layout: page
title: Older Work
permalink: /older-work/
---

## VirtuTrace After-Action Review


VirtuTrace is my lab's flagship simulator software. It's built on top of [VR
Juggler](https://github.com/vrjuggler/vrjuggler), which lets us run it
on everything from a mobile phone to a
[CAVE](http://en.wikipedia.org/wiki/Cave_automatic_virtual_environment)[^fn-c6].
One of its key features is the ability to combine physiological data
with decision tracing data to determine how users in a simulation are
making decisions and what's influencing them. This research is two-fold:
developing a better understanding of how decisions are made and figuring
out how we can help improve those decisions. A valuable tool for that
job is the [after-action review
(AAR)](http://betterevaluation.org/evaluation-options/after_action_review),
where participants can replay their performance in the simulation.
Typical AARs are based on notes from a trainer, and if you're lucky,
some static video — here, we can provide a fully immersive playback from
any angle, speed, and location.

Building the AAR interface is challenging for two reasons: first, the relative
complexity of actions that the user can take, and second, a lack of a
graphical user interface (GUI) with which the user can directly
interact. Unlike most software interfaces which allow the user to
interact with UI elements via a mouse or finger, the display in virtual
reality is an infinite, empty 3D space surrounding the user. There is no
screen, only empty space to project an interface on. I briefly
considered trying to make a 3D interface, but I decided that it would be
too clumsy and unintuitive to navigate in[^fn-example], especially if the user is
also trying to navigate the world itself.

It turns out that rendering a UI in VR is harder than it sounds[^fn-valve]. Based on my research,
I decided to limit heads-up display (HUD) information as much as
possible, preferring to leave the user's field of vision empty.

![](/assets/images/aar/camera-modes.png)

Instead of giving the user a series of
buttons floating in space, I thought it would be easier to interact with
the system via the gamepad, providing clear information about the
current state of the system and making it very easy to switch between
those states. This way, the user can press a button on the gamepad, see
immediately what state they're in, and if they made a mistake, they can
rapidly switch to what they intended to do. This means that the
interface has to be highly responsive but also not lock the user into
any course of action — if they accidentally enter free camera mode, it
should be just as easy to leave it without having to go through a
complicated exit routine.

Because we had just a few camera modes (free camera, locked-on, first
person, and overhead), I decided to map each button on the lower-left
d-pad to one of the camera modes. There's no need to cycle through them
or memorize a key command — just press the button and you switch modes.
When used regularly, this quickly becomes muscle memory, but it isn't
fair to require the user to memorize each direction's corresponding
camera mode. In keeping with the need to limit on-screen GUI, a small
icon displaying the d-pad, the camera modes, and the selected mode
briefly appear each time a button is pressed. This gives the user enough
information when they need it, but isn't distracting.

![The full control scheme.](/assets/images/aar/xb_controller.png)

The system also allows users to move through time: fast forward, rewind,
play/pause, and jumping between bookmarks. Play pause was assigned to
the start button. Only one part of the gamepad contains fully mirrored
controls, and that's the triggers and bumpers on the top, where the
index fingers rest. While the bumpers are simple digital switches that
can only be pressed or released, the triggers are analog switches that
measure the strength of the depression. For this reason, I decided to
use them to control the fast-forward and reverse functions. A light
press causes a slow speed up or slow down in time, with stronger presses
resulting in faster speeds. This allows the user to quickly find the
general part of the timeline they're interested in, and then reduce
their pressure on the control to dial in the precise spot they want[^fn-sensitivity].
If this is too imprecise, the user can jump between bookmarks using the
bumpers. Bookmarks are displayed in the HUD when the user is moving
through time, and a list can be displayed of the existing bookmarks for
the user to jump to.

![The *body navigation* method of
simulator movement.](https://i.imgur.com/Bj8Fsic.gif) 

Navigating in 3D space works the same way as in the simulator, using the
same "body navigation" technique. The center of the floor acts as a dead
zone, while moving outside of it causes the simulation to move in that
direction. However, because the AAR is intended to give users more
freedom of movement, the controller can be used as a secondary input
method. A standard two-stick setup is used, where the left analog stick
is used to control the movement of the user and the right stick is used
to control the camera movement. In order to allow flight, the left stick
moves in the direction the camera is looking: e.g., if the user is
looking up at a 45° angle, pushing the left stick forward will cause the
user to move up and forwards at a 45° angle.

This dual-control model can be confusing if implemented poorly. First,
if the user is out of the dead zone but is pushing the movement stick in
the opposite direction, they may stand still without being aware of why.
For this reason, when the movement stick is used, body navigation
becomes disabled until the user takes a step in any direction. A more
challenging problem comes in the form of dealing with the difference
between the way the user is looking in the simulation and their usage of
the camera-control stick[^fn-dual]. Valve also had this problem[^fn-valve2], and their
insights were invaluable. I wound up adopting their *input mode one*
solution: the sticks control your body, and the head tracker controls
your head.

This system is still in the testing phase, but it already appears to be
an improvement over the previous (lack of) interface. Ideally, I'll have
the opportunity to run some controlled tests with it, but I may not have
the option before I leave in June.


## Build-a-Meal

There was a lot of excitement surrounding Swift — a dynamically-typed language that left behind a lot
of the cruft and legacy of Objective-C and dramatically reduced things
like boilerplate code and hacky solutions[^fn-caveat]. I always found Objective-C
confusing, so when I had the opportunity earlier this year to start
learning Swift, I jumped on it. I began working on an app called
Build-A-Meal (name still subject to change) which would allow the user
to figure out what ingredients work well together and which ones don't.
I couldn't find anything like it — the closest were apps that let you
find recipes based on what's [already in](http://myfridgefood.com) [your fridge](http://www.supercook.com/#/recipes/All%2520recipes). I didn't
want recipes, I wanted to know what *flavors* fit together to use as a
starting point for creating *new* recipes.

*This app is still a work in progress. You can see the progress and run
the app with a limited data set
[here](https://github.com/alilja/flavors)*.

I knew generally how I wanted it to work. It should provide a clear at-a-glance indicator of how well
foods fit together, be easy to pick ingredients and see what goes with
what you already have[^fn-pattern], and keep track of your previously used
combinations. My very first thought was a giant flavor wheel that would
be organized into the five main flavors[^fn-flavors], with foods arranged
according to how strongly they fit into a given flavor. For example a
lemon is very sour with some bitter flavors, so it would be closer to
the bitter side of the sour foods.

![The first sketches for the app.](/assets/images/food/sketches1.png)

There are a ton of problems with this design. First of all, to fit all
the foods necessary, the wheel would have to be *enormous.* Foods that
have several flavor profiles couldn't be easily categorized. Foods that
had flavors that were on opposite sides of the wheels wouldn't be able
to fit easily on it. There wouldn't have been enough room to list all
the matching foods, and that would have created a secondary interface
for the same data set. After trying out some ideas (and even
[prototyping one](/assets/images/food/prototype.png)) it became clear that this was
not a good way to go.

I started thinking about how I would use the application and what sort
of features I needed access to quickly and easily. I should be able to
come in with either some sense of what I wanted or with nothing at all
and rapidly build a set of matching flavors. The UI needed to rapidly
show me how well things fit together and then making immediate changes
based on that information. It didn't matter whether the foods were salty
or sweet or sour — I wasn't even going to be thinking of it that way
when it came to building the ingredients. I would be thinking about
individual ingredients and then wanting to get a sense of how well
they'd fit together and what kind of other foods would be good
additions.

Doug Engelbart talked about the computer as [a vast information space](http://www.dougengelbart.org/firsts/interactive-computing.html),
with the computer providing people knowledge in useful ways to help them
accomplish their job. I tried to shape the app in that same sense: it
knows how well things fit together, it's just up to you to give tell it
what items you want to check. And since it knows how things fit
together, it should provide you with information about *other* things
fit well. I don't want to have to think about fit, I want to spend my
time thinking about designing new recipes and what I can put in them to
make them even better. The computer should be the other side of a
conversation about food, someone who never gets bored when I ask how
different ingredients fit together, and politely tells me what other
things I should try that might be interesting.

What it should *never* do is make me actively consider things that aren't
food-related, like navigating the interface or finding a specific item
buried in a list. With this in mind I consciously stayed away from [a network model](https://www.visualthesaurus.com).![](/assets/images/food/autocomplete.png)
This was pretty tempting: a network of relationships between food items
seems like a home run. But I didn't like the idea of all that panning on
a small phone to find what I was looking for[^fn-discoverability], nor the distinction
between the *search set* and the *collected set*. I don't care about
potential connections between all the items out there, I'm only
interested in the relationship between the items I have now. The search
set should be a big nebulous cloud that contains the foods I'm curious
about, but only that — who cares if bearnaise sauce goes well with
crepes if I'm curious about what to use to replace fish sauce with in my
banh mi.

This got me thinking about [card-based applications](http://www.subtraction.com/2014/08/26/what-is-a-card/),
where every food would be represented as a card. It would show
information about flavor profiles and what foods matched that, on each
card. You could add cards to a bin, and tapping a matching food in a
card would put that flavor in the bin. Of course, some foods are blank
slates and match many other flavors, so you'd need some sort of search
feature to look for them. But wait — if you're going to have a per-card
search feature, why not just make it a global search that looks for
foods in both the cards and the flavors *on* each card? I thought about
how to deal with the same flavor appearing on more than one card in
search results, and realized the solution was to get rid of cards
entirely and have the interface essentially function as a front-end to a
database. You enter the food you're looking for, and it tells you how
well it matches the other foods you have.

I was lucky enough to have a fairly robust dataset from [Culinary Artistry](http://www.amazon.com/Culinary-Artistry-Andrew-Dornenburg/dp/0471287857),
which provided a long list of foods and their associated matching
flavors[^fn-aww]. When discussing my app with a friend, I mentioned this
one-to-many relationship, and he said that "it sounds like the flavors
and foods are begging to talk to each other." I took his advice and
eliminated the distinction between *foods* and their associated
*flavors.* Now, everything was connected both ways. Beef goes well with
red wine, and red wine goes well with beef.

![Once I ditched the wheel, I shifted over
to a three-part UI.](/assets/images/food/sketches2.png)

I began sketching and wireframing. The app would have three parts: the
top bar would contain the search field, just below that would be the
foods you were currently matching, and the bottom would would contain
flavors you hadn't added but that might fit well within your current
flavor profile. You could enter some foods and see how well they fit
together visually and then immediately see what else you could add. The
potential flavor set would be populated by taking all the flavors
associated with the foods being matched and ranking them by how many
foods they shared in common. If four foods were being matched and they
each went well with cream, that would appear higher than a flavor that
only went with two of the matched foods.

Showing how well flavors fit together was tricky. I developed an
algorthim that matched foods based on how well they fit together, and
then displayed how well they fit using a traffic light
metaphor. ![](/assets/images/food/lights.png) A green display means that flavor
fits well within the group, while a red color indicates a bad match.
Most people have a clear sense of "green means good and red means bad,"
so I thought this color system would make it easy to understand what was
going on without having to resort to numbers or icons. At a glance, you
can see how well everything fits together and immediately identify where
your problem areas are.

In order to get an app to feel right, there's a lot of details that have
to be handled. Autocomplete was a must for the search bar. You need to
know what's available to you, and showing a list of potential foods
combats the anxiety of just being face with a blank screen. I had wanted
to show how well each food would fit in to your existing set before even
adding it, but unfortunately, this slowed the app down too much. It's
much faster (and less distracting) to just add a food and see how it
fits than to wait a few seconds to see how *everything* fits, when all
but one of those items aren't what you want.

![Don't put foie gras in your tomato sauce
recipe.](/assets/images/food/matches.png)

This application is still a work in progress. A huge part of its success
or failure will hinge on the data in the backend, and right now, I only
have around 40% of it implemented in machine-readable format. I also
need to run user testing — both on myself, and on people who would find
this useful. I have a wish list of features I hope to implement, like an
auto-match feature that will automatically build a flavor profile from
scratch or add new matching flavors based on what you already have. If
this sounds interesting and you'd like to play around with it, you can
download a copy [from GitHub](https://github.com/alilja/flavors).
Download all the sketches [here](assets/media/food/sketches.pdf).


## VirtuTrace Physics Engine Rewrite

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


## Tiny Projects


### RateBeer API

I started working on a beer recommendation engine[^fn-kmeans], but quickly realized that I needed to build a robust API for
extracting data from beer websites, and that such a tool didn't exist
yet. I settled on using the [RateBeer](http://www.ratebeer.com) database
because of its community ethics and open attitude toward using their
data. As my needs grew, I eventually turned my attention towards an
exhaustive API for the website in Python. The project is now downloaded
[several hundred times every
week](https://pypi.python.org/pypi/ratebeer) and has two full-time
developers, along with several community contributions.

You can check it out [on GitHub](https://github.com/alilja/ratebeer).

### What's Their Face?

A goofy idea turned into a weekend hack. My friends and I were arguing
about what actors had appeared in certain movies — we could remember the
movies but not the actor's name. I put together [What's Their
Face?](http://whatstheirface.herokuapp.com) to solve this problem —
enter two movies and it'll tell you the actors that are common to both.
The project was an opportunity for me to learn how to do web programming
with Python. I chose to use [Flask](http://flask.pocoo.org) for its
simplicity; because it's such a simple application, Flask allowed me to
easily collapse the view and controller logic into a [single
file](https://github.com/alilja/WhatsTheirFace/blob/master/application.py)
and keep everything under 200 lines of code.

My goal was to make looking up movies as fast and
easy as possible. Instead of trying to label boxes with names like
"movie one," I opted for a sentence-based structure, which made it quick
and easy to figure out what the app was doing and where movie names
should go. I figured people would likely be using it in their homes[^fn-theatre],
and therefore would be watching a rented movie. With this in mind, the
app automatically fills in that day's most-rented DVD in the first spot.
Entering a new movie will auto-fill it into the first box, and will keep
it there until the movie is over. Finally, because this is based on the
sense of "I know their face but not their name," it was essential that
the results show the faces of the actors for quick recognition.

You can play with What's Their Face
[here](http://whatstheirface.herokuapp.com).

### Opaline and `libbiopacndt_py`

`libbiopacndt_py`, despite having an *extremely* catchy name, is
a fairly technical piece of software. It's a Python API that allows for
real-time processing of physiological data provided by the
[BioPac](http://www.biopac.com) system. It can be used for any
application, but right now it's tied into Opaline, a tool designed to
process both real-time and post-hoc physiological data to determine how
stressed out someone is[^fn-brs] for usage in adaptive computing. This
research has showed some promise already, and was presented at [I/ITSEC 2014](http://www.chirpe.com/EventSessions.aspx?DISPLAYMODE=2&SessionID=2674&EventID=2759).

You can find both [Opaline](https://github.com/alilja/opaline) and
[`libbiopacndt_py`](https://github.com/alilja/libbiopacndt_py) on
GitHub.

[^fn-kmeans]: Instead of using the usual method of basing recommendations on users who have similar tastes as you, like Netflix or Amazon, this system would parse user reviews to develop keyword-based flavor profiles for beers, and then use that information in a k-means clustering algorithm to make recommendations.

[^fn-theatre]: And so hopefully *not* distracting people with their bright little screens in a theatre!

[^fn-brs]: We calculate a measure called the baroreflex sensitivity, the ratio of the elasticity of the arteries to heart rate that has showed quite a bit of promise as a low-latency, accurate method of quantifying stress.

[^fn-api]: Application Programming Interface; the hooks and tie-ins to your system that let developers use it for their own purposes.

[^fn-staticdynamic]: One unexpected benefit of these choices was that it was easy to mix static and dynamic objects together. If you wanted to add just one dynamic thing to an old static scene, you didn't need to rewrite all the code — just use the new dynamic API along with the old static one.

[^fn-linear]: I wound up learning almost an entire class' worth of linear algebra for this. I let the computer handle the [four-dimensional rotation matrices](http://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation), though.

[^fn-best]: In the end, this was the best decision I made. It meant that the physics system could live in one spot and share as much code as possible while still allowing for old code to talk to it. The inputs and outputs stayed the same, it was just the inside that changed.

[^fn-c6]: Ours is called the [C6](http://www.vrac.iastate.edu/facilities/c6/) and it's pretty cool.

[^fn-example]: [A notable example](https://www.youtube.com/watch?v=dxIPcbmo1_U&t=4s). Even without dinosaurs, trying to move in 3D space with your body while using thumbsticks to control a crazy interface floating in front of you is challenging — better to let the user focus on their core goal.

[^fn-valve]: When Valve [ported Team Fortress 2 to the Oculus Rift](http://media.steampowered.com/apps/valve/2013/Team_Fortress_in_VR_GDC.pdf) (see pages 16-24), they found that showing the same image to each eye results in a mismatch where size and occlusion lead the brain to think it's very near, while convergence convinces the brain that it's actually very far away. This will quickly make people sick.

[^fn-sensitivity]: Of course, for this to be effective, the controls have to be responsive but not too touchy.

[^fn-dual]: In a dual-user scenario, where a trainee is being walked through the AAR by an instructor, this is easier to solve: you simply provide an option to disable head tracking of the user with the tracking goggles on.

[^fn-valve2]: See [pages 25-33](http://media.steampowered.com/apps/valve/2013/Team_Fortress_in_VR_GDC.pdf).

[^fn-caveat]: In practice, this was only partly true. Swift is still tied to the Cocoa API; while it's now much easier to work with it, the quirks and oddities of that system still exist.

[^fn-pattern]: The usage pattern here is that you may already have the basis of a recipe, but you want to add or alter part of it.

[^fn-flavors]: Sweet, sour, salty, bitter, and umami.

[^fn-discoverability]: Discoverability is also reduced, because you'll only ever be looking at things in your general neighborhood. If creativity is finding connections between seemingly disparate things, you want to have totally-out-of-left-field things show up to spark your imagination.

[^fn-aww]: Sadly, this means that I cannot release the app for the public because I do not own the data within it.