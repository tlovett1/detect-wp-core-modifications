'use strict';

exports.parseWPInstallInfo = function(output) {
	return {
		version: output.match(/Version: (.*)/i)[1],
		type:  output.match(/Install type: (.*)/i)[1]
	};
};

exports.scanWP = function() {
	var wpPath;

	/**
	 * Process command arguments
	 */
	if (process.argv.length > 2) {
		// Read the first additional argument passed to the program
		wpPath = process.argv[2];

		if (wpPath !== '/' && wpPath.substr(-1) == '/') {
			wpPath = wpPath.substr(0, wpPath.length - 1);
		}
	} else {
		wpPath = '.';
	}

	var exec = require("child_process").exec;
	var fs = require('fs');
	var path = require('path');

	var dirString = path.dirname(fs.realpathSync(__filename));

	exec(dirString + '/../bin/get-wp-install-info ' + wpPath, function(error, stdout, stderr) {

		if (stdout === '') {
			console.log('No WordPress installation found!');
		} else {
			console.log(stdout);

			var wpInfo = exports.parseWPInstallInfo(stdout);

			if (wpInfo.type == 'trunk') {
				exec("svn status " + wpPath + " --ignore-externals | grep -v '\\(" + wpPath + "/\\)\\?wp-content' | grep -v '?' | grep -v '^X' | grep -v '^A ' | sed 's@^! \\(.*\\)@D \\1@'", function(error, stdout, stderr) {
					if (stdout) {
						console.log("Modifications found...\n\n" + stdout);
					} else {
						console.log('Success: No modifications found.');
					}
				});
			} else {
				exec(dirString + '/../bin/wp-version-diff ' + wpPath + ' ' + wpInfo.version, function(error, stdout, stderr) {
					if (stdout) {
						console.log("Modifications found...\n\n" + stdout);
					} else {
						console.log('Success: No modifications found.');
					}
				});
			}
		}
	});
};
