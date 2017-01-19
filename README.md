Notanos - Not really an operating system
========================================

This is just a pile of Javascript pretending to be a desktop environment, but hosted from your phone or Linux box?  Weird huh.
It's Alpha stuff so don't expect too much yet...

It looks a bit like this.
![](https://raw.github.com/Lerc/notanos/master/screenshot.png)

It does some cool things.
![](https://raw.github.com/Lerc/notanos/master/DnDfile.gif)


Try it in an image on Dply. 
 [![Dply](https://dply.co/b.svg)](https://dply.co/b/QKwLwnIq)
 (select Centos 7, and a Free 2 hour server.  Wait a minute or two after you have the ip number before trying https:// )

[Latest Clip](http://www.youtube.com/watch?v=oHwNxDWwuY4)
This is the new userserv hosted notanos running on a CubieBoard2. I talk through what I'm doing,  The video shows some features of the bridge to the
host machine as well as a paint program coded from scratch at record time.

[This Youtube clip](http://www.youtube.com/watch?v=6ADmVk0i0JI) demonstrates Notanos serving from a Linux box. It even launches a bash terminal.

[This clip](http://www.youtube.com/watch?v=8028AwxF8_g) is (an older version) serving from a Novo7 Aurora (android-arm) and clienting from WinXP Chrome.  I am assured clienting is a real word.

You can use it as a cloud in your pocket or give your headless Linux box a HTML front end.

Installation was moderately easy,  then it got harder (sorry).  The install script for the Dply image can be used as a guide.

  You need to have Node.js v0.10 or better.   When I ran on the CubieBoad I just grabbed the Raspberry-pi binaries from http://nodejs.org/dist/v0.10.24/

  You also need [userserv](https://github.com/Lerc/userserv)
  Follow the instructions on the userserv page to build and install  ( it's just  git clone; make all; make install)

	Set up a reverse proxy to handle https (and hopefully http2 etc.) forwarding to localhost.  I use nginx  with the following config
```
	server {
  listen 443 ssl;
  server_name squishy.local;

  ssl on;
  ssl_certificate /etc/ssl/certs/[ GET A CERT FROM https://letsencrypt.org/ ].pem;
  ssl_certificate_key /etc/ssl/certs/[ GET A CERT FROM https://letsencrypt.org/ ].pem;
  ssl_session_timeout 15m;
  ssl_protocols SSLv3 TLSv1;
  ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDUIM:+LOW:+SSLv3:+EXP;
  ssl_prefer_server_ciphers on;

  location / {
        proxy_pass http://localhost:8082;
        proxy_buffer_size 4k;
        client_max_body_size 100M;
        client_body_buffer_size 128k;
  }

  location /bridge {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
  }
}
```

Then grab the Notanos files themselves and place then your home directory

		cd ~
    wget http://fingswotidun.com/cruft/notanos.tar.gz
    tar -xzf notanos.tar.gz
    ln -sr notanos-0.8.0/notanos ~/Notanos

To run the server component run (as root)
    userserv -nx

Then from a browser.
    https://machinename-or-ip

Once logged in go to     https://machinename-or-ip/~/Notanos/index.html


What's good about it?
---------------------
 * Making apps is can be as easy as making a webpage that runs in a frame
 * Supports App bundles (any directory containing a bundle.json)
 * Apps do not _have_ to be HTML Frames.  Other app types can be defined by providing a module to run them.
 * Linux side processes can open a connection to the browser session, via a unix-domain socket tunneling over a websocket connection
 * Linux side processes can send their own frame to the browser and then communicate in whatever protocol they program the frame to support.
 * Browser side programs can execute linux side processes.  The environment variable $WEBSESSION is set to the name of the unix-domain socket for the session,.
 * Comes with the tiniest game of pacman in the world (Written in DCPU-16 assembler!)

What's bad about it?
--------------------
 * <del>The server is just a dumb WebDav implementation.</del>  (now uses userserv)
 * <del>Hardly any security. </del> (now goes over https and requires login)
 * <del>No symlinks</del>  Dumping webdav fixed this.
 * has a root level component that hasn't had many eyes look at it yet.
 * Much of the code is written to support the bare essentials and not much else.
 * Even then a bunch of it is probably broken.
 * It's not finished, OK? (but is is much better than it was a year ago)
 * The terminal got worse in this version & I broke CKEditor again.

What could it be?
-----------------

Notanos could be very quickly extended to support a lot of existing HTML5/JS webapps and let you carry them around with you on your phone.   Any computer with a decent browser becomes a potential terminal for you to use.  Any documents you edit get saved right back to your phone.

It has the potential to be a full fledged interface to native applications.  Notanos would be acting in a role slightly similar to X11 in that respect.  This would be moving beyond Android and treating the system as the underlying Linux box that it really is.

There is a lot of potential to using Websockets to facilitate a connection between server side applications and their Notanos interfaces.

Notanos is getting to the point where it might be feasable for people to hack around with it and try and get it to do things.  
