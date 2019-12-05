---
layout: post
title:	Tiny Projects
date:   2013-11-18 10:22:34 -0600
categories: work old
--- 

## RateBeer API

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

## What's Their Face?

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

## Opaline and `libbiopacndt_py`

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

