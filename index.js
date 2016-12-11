var http = require('http');
var fs = require('fs');
var path = require('path');
var webSocket = require("websocket").server;

var server = http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './public/html/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, {'Content-Type': contentType});
        response.end(content, 'utf-8');
    });
});

const port = 8000;
server.listen(port, function () {
    console.log("server is listening on port " + port)
});

var webServer = new webSocket({
    httpServer: server
});

var users = [];

function isNotCommand(message) {
    return message.utf8Data.toString().split(": ")[1].substring(0, 1) != '/';
}

webServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    console.log("connected");

    var userIndex = users.push({connection: connection, color: "blue"}) - 1;
    color.push('blue');

    connection.on('message', function (message) {
        if (isNotCommand(message)) {
            users.forEach(function (user) {
                user.connection.sendUTF(JSON.stringify({
                    data: message.utf8Data,
                    color: users[userIndex].color
                }));
            });
        } else {
            users[userIndex].color = message.utf8Data.toString().split("/setColor ")[1];
        }
    });

    connection.on('close', function () {
        users.splice(userIndex, 1);
    });
});


