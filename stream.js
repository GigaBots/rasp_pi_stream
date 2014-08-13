/*
* Live video-stream program for Rasp Pi
*/

var BrowserBigBangClient = require("./BigBangClient.js");
var BigBangClient = require("./BigBangClient.js");
var PewRuntime = require("./BigBangClient.js");
var NodeBigBangClient = require("./NodeBigBangClient.js");

var websocket = require('websocket');


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
		console.log("Begin Stream!!");

		//TODO

}

});

