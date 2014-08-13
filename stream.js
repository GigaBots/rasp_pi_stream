/*
* Live video-stream program for Rasp Pi
*/

var client;

var requirejs = require('requirejs');

requirejs.config({
	baseUrl: '/rasp_pi_stream',
	nodeRequire: require,
    // paths: {
    //     "BrowserBigBangClient": "./dist/node/BigBangClient.js",
    //     "BigBangClient": "./dist/node/BigBangClient.js",
    //     "PewRuntime": "./dist/node/BigBangClient.js"
    // }
});

var BrowserBigBangClient = requirejs("./BigBangClient.js");
var PewRuntime = requirejs("./BigBangClient.js");

requirejs(['BrowserBigBangClient', 'PewRuntime'], function (bigbang, pew) {

	client = new bigbang.client.BigBangClient();

	client.connectAnonymous("thegigabots.app.bigbang.io:80", function(result) {
		if( result.success) {
			client.subscribe("newBot", function( err, c) {
				if(!err) {
					beginStream(client,c);
				}
				else {
					console.log("Subscribe failure. " + err);
				}
			})
		}
		else {
			console.log("Connect Failure.");
		}
	});

	function beginStream(client, channel) {
		console.log("Begin Stream!!");
	}

});

