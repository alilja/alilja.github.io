---
layout: post
title:	Build-a-Meal
date:   2014-11-18 10:22:34 -0600
categories: work old
--- 
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

[^fn-caveat]: In practice, this was only partly true. Swift is still tied to the Cocoa API; while it's now much easier to work with it, the quirks and oddities of that system still exist.

[^fn-pattern]: The usage pattern here is that you may already have the basis of a recipe, but you want to add or alter part of it.

[^fn-flavors]: Sweet, sour, salty, bitter, and umami.

[^fn-discoverability]: Discoverability is also reduced, because you'll only ever be looking at things in your general neighborhood. If creativity is finding connections between seemingly disparate things, you want to have totally-out-of-left-field things show up to spark your imagination.

[^fn-aww]: Sadly, this means that I cannot release the app for the public because I do not own the data within it.

