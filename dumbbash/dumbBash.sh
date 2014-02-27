#!/bin/bash
ls -al $WEBSESSION
socat  unix-connect:$WEBSESSION EXEC:"./frameprocess.sh $1 $2",pty,stderr,ctty
