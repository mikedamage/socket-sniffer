# SocketSniffer

by Mike Green (mike.is.green@gmail.com)

## About

TCP/IP traffic is easy to sniff, but Unix domain socket traffic is a bit more challenging. SocketSniffer is kind of like the `tee`
program for domain sockets. It listens to one socket, listens on another, and pipes all traffic to `STDOUT`. 
