Notanos - Not really an operating system
========================================

This is just a pile of Javascript pretending to be a desktop environment, but hosted from your phone or Linux box?  Weird huh.
It's Alpha stuff so don't expect too much yet...

It looks a bit like this. 
![](https://raw.github.com/Lerc/notanos/master/screenshot.png)

[This Youtube clip](http://www.youtube.com/watch?v=6ADmVk0i0JI) demonstrates Notanos serving from a Linux box. It even launches a bash terminal.

[This clip](http://www.youtube.com/watch?v=8028AwxF8_g) is (an older version) serving from a Novo7 Aurora (android-arm) and clienting from WinXP Chrome.  I am assured clienting is a real word.

You can use it as a cloud in your pocket or give your headless Linux box a HTML front end.

Installation is moderately easy.  

 * install [wsgidav](http://code.google.com/p/wsgidav/) with `easy_install -U wsgidav`
 * Make a place to put Notanos.  
   **note:** notanos will open a couple of ports (8009 & 13131) from which you can modify files.
   I would recommend running Notanos from a new user account or from a virtual machine.
 * Download and deecompress [notanos.tar.gz](http://fingswotidun.com/cruft/notanos.tar.gz) into your chosen location
 * Download and decompress support binaries websocketd and numpty
  [Arm version](http://fingswotidun.com/cruft/nossupportbin-arm.tar.gz) 
  [i386 version](http://fingswotidun.com/cruft/nossupportbin-i386.tar.gz)
 * Start the servers with `sh startnosserver.sh` 
 * Find the ip:8009 where your desktop machine can see the server
 * If on the same machine as the server open http://localhost:8009/index.html in your favourite web browser.
 
For example: If you are running an i386 Ubuntu

    sudo apt-get install python-setuptools
    sudo easy_install -U wsgidav
    sudo adduser somenewuser
    sudo login somenewuser
    
    wget http://fingswotidun.com/cruft/notanos.tar.gz
    tar -xzf notanos.tar.gz 
    wget http://fingswotidun.com/cruft/nossupportbin-i386.tar.gz
    tar -xzf nossupportbin-i386.tar.gz
    sh startnosserver.sh

The support binaries are, at present, only used by Termish.  You can run most of the system from any webdav server serving the notanos directory.


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

What it really needs is a server that is more specific to the unix file system.  Rather than using an XML PROPFIND request, a simplified model that returned JSON.  Even a server that sent the raw output of `ls -al` would be preferable to webdav's XML.

There is a lot of potential to using Websockets to facilitate a connection between server side applications and their Notanos interfaces.

