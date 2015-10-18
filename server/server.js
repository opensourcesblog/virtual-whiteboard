var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var conf = require('./config.json');

var debug_log = require('debug')('whiteboard:log');
var debug_error = require('debug')('whiteboard:error');

// Webserver listen on config port
server.listen(conf.port);

// set static folder
app.configure(function(){
    app.use(express.static(__dirname + '/../public'));
});


// show index.html if the user opens localhost: conf.port /
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/../public/index.html');
});

io.sockets.on('connection', function (socket) {
     socket.on('mousemove', function(data) {
        socket.id = data.id;
        io.emit('moving', data);
     });
     socket.on('disconnect', function() {
         socket.broadcast.emit('left', socket.id);
     });
});

console.log('Whiteboard runs on: localhost:'+conf.port);
