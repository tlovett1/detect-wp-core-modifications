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
	var wpVersion;
	var installType;

	exec('./bin/get-wp-install-info ' + wpPath, function(error, stdout, stderr) {
		console.log(stdout);

		wpVersion = stdout.match(/Version: (.*)/i)[1];
		installType = stdout.match(/Install type: (.*)/i)[1];

		if (installType == 'trunk') {
			exec("svn status " + wpPath + " --ignore-externals | grep -v ' " + wpPath + "/wp-content' | grep -v ? | grep -v 'A '", function(error, stdout, stderr) {
				console.log(stdout);
			});
		} else {
			exec('./bin/wp-version-diff ' + wpPath + ' ' + wpVersion, function(error, stdout, stderr) {
				console.log(stdout);
			});
		}
	});
}

exports.scanWP = scanWP;