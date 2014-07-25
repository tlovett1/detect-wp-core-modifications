'use strict';

function scanWP() {
	var wpPath;

	/**
	 * Process command arguments
	 */
	if (process.argv.length > 2) {
		// Read the first additional argument passed to the program
		wpPath = process.argv[2];

		if (wpPath.substr(-1) == '/') {
			wpPath = wpPath.substr(0, wpPath.length - 1);
		}
	} else {
		wpPath = '.';
	}

	var exec = require("child_process").exec;
	var fs = require('fs');
	var path = require('path');

	var dirString = path.dirname(fs.realpathSync(__filename));
	var wpVersion;
	var installType;

	exec(dirString + '/../bin/get-wp-install-info ' + wpPath, function(error, stdout, stderr) {

		if (stdout === '') {
			console.log('No WordPress installation found!');
		} else {
			console.log(stdout);

			wpVersion = stdout.match(/Version: (.*)/i)[1];
			installType = stdout.match(/Install type: (.*)/i)[1];

			if (installType == 'trunk') {
				exec("svn status " + wpPath + " --ignore-externals | grep -v '\\(" + wpPath + "/\\)\\?wp-content' | grep -v ? | grep -v X | grep -v 'A '", function(error, stdout, stderr) {
					if (stdout) {
						console.log("Modifications found...\n\n" + stdout);
					} else {
						console.log('Success: No modifications found.');
					}
				});
			} else {
				exec(dirString + '/../bin/wp-version-diff ' + wpPath + ' ' + wpVersion, function(error, stdout, stderr) {
					if (stdout) {
						console.log("Modifications found...\n\n" + stdout);
					} else {
						console.log('Success: No modifications found.');
					}
				});
			}
		}
	});
}

exports.scanWP = scanWP;