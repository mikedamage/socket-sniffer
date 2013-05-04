#!/usr/bin/env node

// Libraries
var net = require('net');
var fs = require('fs');

var serverSocket = process.argv[2];
var clientSocket = process.argv[3];

var server = net.createServer(function(c) {
	console.log('Server connected');

	c.on('end', function() { console.log('Server disconnected'); });

	// Pipe input on the socket to console STDOUT
	c.pipe(process.stdout);
});

// Delete socket if it already exists
if (fs.existsSync(serverSocket)) {
	console.log('Unlinking %s', serverSocket);
	fs.unlinkSync(serverSocket);
}

server.listen(serverSocket, function() {
	console.log('Server bound to %s', serverSocket);
});

// Handle server teardown on CTRL-C
process.on('SIGINT', function() {
	// Close and unref the server
	console.log('Closing Server');
	server.close(function() {
		server.unref();
		console.log('Exiting...');
		process.exit(0);
	});
});
