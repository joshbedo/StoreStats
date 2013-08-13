var express = require('express'),
	app = express(),
	server = require('http').createServer(app);
	io = require('socket.io').listen(server),
  crypto = require('crypto'),
  uuid = require('node-uuid'),
  api = require('./api/api-endpoints');

server.listen(3000);

app.use("/css", express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/js/app", express.static(__dirname + '/public/js/app'));
app.use("/js/lib", express.static(__dirname + '/public/js/lib'));
app.use("/font", express.static(__dirname + '/public/font'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use(express.bodyParser());
app.use(express.cookieParser());

//session storage
store = new express.session.MemoryStore;
app.use(express.session({ secret: '2edc$rfv287', store: store}));

var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/users'),
    Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

//define user schema for Mongoose
var userSchema = new Schema({
  username: { type: String, match: /^[a-zA-Z0-9_]+$/},
  email: String,
  password: String,
  name: String,
  logincode: String,
  addedon: Date,
  lastlogin: Date
});

var User = mongoose.model('User', userSchema);


app.get('/', function(req, res){
  if(req.session.logincode){
    User.findOne({ logincode: req.session.logincode}, function(err, user){
      if(user){
        res.send('Hello' + user.name);
      }else{
        res.sendfile( __dirname + '/public/login.html');
      }
    })
  }else{
    res.sendfile(__dirname + '/public/login.html');
  }
});

//handles registration 
app.get('/register', function(req, res){
  res.sendfile(__dirname + '/public/register.html');
});
app.post('/register', function(req, res){
  if(req.session.logincode || req.cookies.clogincode){
    if(!req.session.logincode) req.session.logincode = req.cookies.clogincode;

    User.findOne({ logincode: req.session.logincode}, function(err, doc){
      if(doc){
        //list profiles
      }else{
        //redirect to login
      }
    });
  }else{
    console.log(req.body.password);
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        username = req.body.username,
        name = req.body.name,
        email = req.body.email;
        password = crypto.createHash('md5').update(req.body.password).digest("hex");

    //check whether all fields are posted
    console.log(username, name, email, req.body.password);
    if(username && name && email && req.body.password){
      if(email.match(pattern)){
        //check for email availability
        User.findOne({ email: email}, function(err, user){
          if(!user){
            var usernameRegex = /^[a-zA-Z0-9_]+$/;

            //check whether valid username
            if(username.match(usernameRegex)){
              //check for username availability
              User.findOne({ username: username}, function(err, user){
                if(!user){
                  var user = new User();
                  user.username = username;
                  user.name = name;
                  user.email = email;
                  user.password = password;
                  user.addedon = new Date();
                  user.save();
                  res.send(user._id);
                }else{
                  res.send('Username is already taken');
                }
              })
            }else{
              res.send('Invalid username');
            }
          }else{
            res.send('email already exists');
          }
        });
      }else{
        res.send('Invalid email');
      }
    }else{
      res.send('All fields are required');
    }
  }
})


app.get('/login', function(req, res){
  res.sendfile(__dirname + '/public/login.html');
})

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