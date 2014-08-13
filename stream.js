/*
* Live video-stream program for Rasp Pi
*/

var websocket = require('websocket');

var BrowserBigBangClient = require("./BigBangClient.js"),
	BigBangClient = require("./BigBangClient.js"),
	PewRuntime = require("./BigBangClient.js"),
	NodeBigBangClient = require("./NodeBigBangClient.js");


require(['BigBangClient', 'PewRuntime'], function (bigbang, pew) {

	var client = new bigbang.client.BigBangClient();

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
		console.log("Commence ze streaming now!!!");
		/*
		*TODO
		*
		*/
	}

});

