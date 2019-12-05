---
layout: post
title:	VirtuTrace After-Action Review
date:   2015-11-18 10:22:34 -0600
categories: work old
--- 

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


[^fn-c6]: Ours is called the [C6](http://www.vrac.iastate.edu/facilities/c6/) and it's pretty cool.

[^fn-example]: [A notable example](https://www.youtube.com/watch?v=dxIPcbmo1_U&t=4s). Even without dinosaurs, trying to move in 3D space with your body while using thumbsticks to control a crazy interface floating in front of you is challenging — better to let the user focus on their core goal.

[^fn-valve]: When Valve [ported Team Fortress 2 to the Oculus Rift](http://media.steampowered.com/apps/valve/2013/Team_Fortress_in_VR_GDC.pdf) (see pages 16-24), they found that showing the same image to each eye results in a mismatch where size and occlusion lead the brain to think it's very near, while convergence convinces the brain that it's actually very far away. This will quickly make people sick.

[^fn-sensitivity]: Of course, for this to be effective, the controls have to be responsive but not too touchy.

[^fn-dual]: In a dual-user scenario, where a trainee is being walked through the AAR by an instructor, this is easier to solve: you simply provide an option to disable head tracking of the user with the tracking goggles on.

[^fn-valve2]: See [pages 25-33](http://media.steampowered.com/apps/valve/2013/Team_Fortress_in_VR_GDC.pdf).
