#!/bin/bash
ls -al $WEBSESSION
exec ./exec_with_a_frame.sh bash Blahframe.html

socat  unix-connect:$WEBSESSION EXEC:"./frameprocess.sh $1 $2",pty,stderr,ctty
