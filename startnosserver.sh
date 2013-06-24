#!/bin/bash
wsgidav --host=0.0.0.0 --port=8009 --root=./notanos &
exec ~/bin/websocketd --port=13131 ~/bin/numpty bash

