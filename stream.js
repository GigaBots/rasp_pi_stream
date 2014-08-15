/*
* Live video-stream program for Rasp Pi
*/

var websocket = require('websocket');

var	BigBangClient = require("./BigBangClient.js"),
	PewRuntime = require("./BigBangClient.js"),
	bbNode = require("./NodeBigBangClient.js");

var client = new bbNode.NodeBigBangClient();

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

	var intervalMessages = setInterval( function () { sendMessages()}, 1000);

}

function sendMessages() {
	console.log("sending message...");
}

