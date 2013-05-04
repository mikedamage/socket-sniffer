#!/usr/bin/env node

// Libraries
var net = require('net');
var fs = require('fs');
var path = require('path');

var serverSocket = process.argv[2];
var clientSocket = process.argv[3];

if (!serverSocket || !clientSocket) {
	var thisScript = path.basename(process.argv[1]);

	console.log('Usage:\t\t%s LISTEN_SOCKET CONNECT_SOCKET', thisScript);
	console.log('Example:\t%s /tmp/sniffer.sock /tmp/thin.0.sock', thisScript);

	process.exit(0);
}

var server = net.createServer(function(c) {
	console.log('Server connected');

	c.on('end', function() {
		console.log('Server disconnected');
	});

	// Pipe input on the socket to console STDOUT
	c.on('data', function(data) {
		var input = data.toString();
		var client = net.connect({ path: clientSocket }, function() {
			console.log('Client socket connected (%s)', clientSocket);
			client.write(input);
		});

		console.log(input);

		client.on('data', function(data) {
			var output = data.toString();
			console.log(output);
			c.write(output);
		});

		client.on('end', function() {
			console.log('Client disconnected');
		});
	});

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
