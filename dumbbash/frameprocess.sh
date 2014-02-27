#!/bin/bash
FRAMEDATA=$(base64 -w0 $2)
echo "{\"protocol\":\"processframe\",\"frameContent\":\"$FRAMEDATA\"}"
exec  $1