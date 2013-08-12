var express = require('express'),
	app = express(),
	server = require('http').createServer(app);
	io = require('socket.io').listen(server),
  api = require('./api/api-endpoints');

server.listen(3000);

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/js/app", express.static(__dirname + '/public/js/app'));
app.use("/js/lib", express.static(__dirname + '/public/js/lib'));
app.use("/font", express.static(__dirname + '/public/font'));
app.use("/images", express.static(__dirname + '/public/images'));

app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/index.html');
});

// API ENDPOINTS
app.get('/api/customers/:id', api.findById);
app.get('/api/customers', api.findAll);


// sets the log level of socket.io, with
// log level 2 we wont see all the heartbits
// of each socket but only the handshakes and
// disconnections
//io.set('log level', 2);

// setting the transports by order, if some client
// is not supporting 'websockets' then the server will
// revert to 'xhr-polling' (like Comet/Long polling).
// for more configurations got to:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
//io.set('transports', [ 'xhr-polling' ]);

// socket.io events, each connection goes through here
// and each event is emited in the client.
// I created a function to handle each event
/*io.sockets.on('connection', function(socket){

  console.log('client has connected');

  socket.emit('news', { hello: 'world' });
  socket.on('buy', function (data) {
    socket.broadcast.emit('purchase', {product: data, amount: 2});
  });

  socket.on('disconnect', function(){
  	socket.broadcast.emit('leave');
  });
});*/

console.log('server is running and listening to port %d', 3000);