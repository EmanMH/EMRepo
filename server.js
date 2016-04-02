// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/static/"));

// Start Express http server on port 8080
var port = process.env.PORT || 8080
var webServer = http.createServer(httpApp).listen(port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(httpApp, socketServer);

easyrtc.on("getIceConfig", function(connectionObj, callback) {
  
    // This object will take in an array of XirSys STUN and TURN servers
    var iceConfig = [];
 
    request({ 
        url: 'https://service.xirsys.com/ice',
        qs: {
            ident: "emanmh",
            secret: "7a0fbaf6-dcc9-11e5-a5bc-37e3bb81d07f",
            domain: "rtcsignaling.com",
            application: "rtcsignaling",
            room: "rtcroom",
            secure: 1
        }
    },
    function (error, response, body) {
        if (!error &amp;&amp; response.statusCode == 200) {
            // body.d.iceServers is where the array of ICE servers lives
            iceConfig = body.d.iceServers;  
            console.log(iceConfig);
            callback(null, iceConfig);
        }
    });
});