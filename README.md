Notanos - Not really an operating system
========================================

This is just a pile of Javascript pretending to be a desktop environment.

This is it running on a Novo7 Aurora [http://www.youtube.com/watch?v=8028AwxF8_g]


You can use it as a cloud in your pocket.

 * Decompress notanos.tar.gz onto a path your Android device
 * Run a simple server on your Android Device to serve the decompressed directory
 * Find the ip:port where your desktop machine can see the server
 * Visit http://ip:port/index.html in your favourite web browser.
 
What's good about it?
---------------------
 * Really easy to set up
 * Making apps is can be as easy as making a webpage that runs in a frame
 * Supports App bundles (any directory containing a bundle.json)
 * Apps do not _have_ to be HTML Frames.  Other app types can be defined by providing a module to run them.
 
 
What's bad about it?
--------------------
 * The server is just a dumb WebDav implementation.
 * Hardly any security.
 * No symlinks
 * Much of the code is written to support the bare essentials and not much else.
 * Even then a bunch of it is probably broken.
 * It's not finished, OK?
 
What could it be?
-----------------

Notanos could be very quickly extended to support a lot of existing HTML5/JS webapps and let you carry them around with you on your phone.   Any computer with a decent browser becomes a potential terminal for you to use.  Any documents you edit get saved right back to your phone.

It has the potential to be a full fledged interface to native applications.  Notanos would be acting in a role slightly similar to X11 in that respect.  This would be moving beyond Android and treating the system as the underlying Linux box that it really is.

Webdav is not the best tool for the job.  It's just what I could use now without writing any code.

What it really needs is a server that is more specific to the unix file system.  Rather than using an XML PROPFIND request, a simplified model that returned JSON with the additional ability to support Websockets.  There is a lot of potential to using Websockets to facilitate a connection between server side applications and their Notanos interfaces.

