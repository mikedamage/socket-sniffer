#!/usr/bin/env node

;(function() {
	"use strict";

	// Libraries
	var net    = require('net');
	var fs     = require('fs');
	var path   = require('path');
	var colors = require('colors');

	var serverSocket = process.argv[2];
	var clientSocket = process.argv[3];

	if (!serverSocket || !clientSocket) {
		var thisScript = path.basename(process.argv[1]);

		console.log('Usage:\t\t%s LISTEN_SOCKET CONNECT_SOCKET', thisScript);
		console.log('Example:\t%s /tmp/sniffer.sock /tmp/thin.0.sock', thisScript);

		process.exit(0);
	}

	var server = net.createServer(function(c) {
		console.log('Server connected'.green);

		c.on('end', function() {
			console.log('Server disconnected'.yellow);
		});

		// Pipe input on the socket to console STDOUT
		c.on('data', function(data) {
			var input = data.toString();
			var client = net.connect({ path: clientSocket }, function() {
				console.log('Client socket connected (%s)'.green, clientSocket);
				client.write(input);
			});

			console.log(input);

			client.on('data', function(data) {
				var output = data.toString();
				console.log(output);
				c.write(output);
			});

			client.on('end', function() {
				console.log('Client disconnected'.yellow);
			});
		});

	});

	// Delete socket if it already exists
	if (fs.existsSync(serverSocket)) {
		console.log('Unlinking %s'.yellow, serverSocket);
		fs.unlinkSync(serverSocket);
	}

	server.listen(serverSocket, function() {
		console.log('Server bound to %s'.blue, serverSocket);
	});

	// Handle server teardown on CTRL-C
	process.on('SIGINT', function() {
		// Close and unref the server
		console.log('Closing Server'.yellow);
		server.close(function() {
			server.unref();
			console.log('Exiting...'.red);
			process.exit(0);
		});
	});
})();
