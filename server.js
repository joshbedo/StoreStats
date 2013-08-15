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
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

//session storage
store = new express.session.MemoryStore;
app.use(express.session({ secret: '2edc$rfv287', store: store}));

var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/storeStats'),
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

var barReportSchema = new Schema({
  id: Number,
  title: { text: String },
  xAxis: {
    categories: Array
  },
  yAxis: {
    title: {
      text: String
    }
  },
  series: [
    {
      name: String,
      data: Array
    }
  ] 
}, { strict: false });
var BarReport = mongoose.model('Report', barReportSchema, 'reports');


app.get('/', function(req, res){
  if(req.session.logincode){
    User.findOne({ logincode: req.session.logincode}, function(err, user){
      if(user){
        res.render('index', {user: user.name});
      }else{
        res.redirect('/login');
      }
    })
  }else{
    res.redirect('/login');
  }
});

//handles registration 
app.get('/register', function(req, res){
  res.render('register');
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
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        username = req.body.username,
        name = req.body.name,
        email = req.body.email;
        password = crypto.createHash('md5').update(req.body.password).digest("hex");

    //check whether all fields are posted

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
                  res.render('register', {error: 'Username is already taken'});
                }
              })
            }else{
              res.render('register', {error: 'Invalid username'});
            }
          }else{
            res.render('register', {error: 'Email already exists'});
          }
        });
      }else{
        res.render('register', { error: 'Invalid email'} );
      }
    }else{
      res.render('register', { error: 'All fields are required'} );
    }
  }
})


app.get('/login', function(req, res){
  res.render('login');
});
app.post('/login', function(req, res){
  if(req.session.logincode || req.cookies.clogincode){
    if(!req.session.logincode) req.session.logincode = req.cookies.clogincode;

    User.findOne({ logincode: req.session.logincode}, function(err, doc){
      if(doc){
        
      }else{
        res.redirect('/login');
      }
    });
  }else{
    var userid = req.body.userid,
        password = crypto.createHash('md5').update(req.body.password).digest('hex'),
        rememberme = req.body.rememberme;

    if(userid && req.body.password){
      var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

      console.log(userid);

      if(userid.match(pattern)){
        User.findOne({ email: userid, password: password}, function(err, doc){
            if(doc){
              var logincode = uuid.v4();
              req.session.logincode = logincode;
              if(rememberme) res.cookie('clogincode', logincode, { maxAge: 900000});
              var conditions = {_id: doc._id}, update = { logincode: logincode }, options = { multi: true };
              User.update(conditions, update, options, function(err, numAffected){
                res.redirect('/');
              });
            }else{
              res.render('login', { error: 'Invalid login'} );
            }
        });
      }else{
        User.findOne({ username: userid, password: password}, function(err, doc){
          if(doc){
            var logincode = uuid.v4();
            req.session.logincode = logincode;
            if(rememberme) res.cookie('clogincode', logincode, { maxAge: 900000 });
            var conditions = {_id: doc._id}, update = { logincode: logincode }, options = { multi: true };
            User.update(conditions, update, options, function(err, numAffected){
              res.redirect('/');
            });
          }else{
            res.render('login', { error: 'Invalid login'} );
          }
        });
      }
    }else{
      res.render('login', {error: 'Please try again' });
    }
  }
});

// API ENDPOINTS
app.get('/api/customers/:id', api.findById('customers'));
app.get('/api/customers', api.findAll);

app.get('/api/reports/:id', api.findById('reports'));
app.post('/api/reports/:id', function(req, res){

});

// sets the log level of socket.io, with
// log level 2 we wont see all the heartbits
// of each socket but only the handshakes and
// disconnections
io.set('log level', 2);

// setting the transports by order, if some client
// is not supporting 'websockets' then the server will
// revert to 'xhr-polling' (like Comet/Long polling).
// for more configurations got to:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
io.set('transports', [ 'xhr-polling' ]);

// socket.io events, each connection goes through here
// and each event is emited in the client.
// I created a function to handle each event
io.sockets.on('connection', function(socket){
  console.log('a socket has connected');

  socket.on('reportUpdate', function(data){
    BarReport.findOne({id: data.id}, function(err, report){
      if(!err){
        //holy fuck this was a bitch fuck Mongoose and Schemas
        var narr = [1, 2, 3];
        report.series[0].data.forEach(function(el, index, array){
          if(index == 1){
            narr.push(el + 1);
          }else{
            narr.push(el);
          }
        });
        report.series[0].name = "Josh";
        report.series[0].data = narr;
        report.save(function(err){
          if(err) console.log(err);
          socket.broadcast.emit('reportSuccess', { report: report });
        });
        /*report.save(function(err){
          if(err){
            console.log(err);
          }else{
            console.log('saved report', report);
            socket.emit('reportSuccess', { report: report }); 
          }
        });*/
      }else{
        console.log(err);
      }
    });
  });


  socket.on('disconnect', function(){
  	socket.broadcast.emit('leave');
    //should do a model save to make a post request
  });
});

console.log('server is running and listening to port %d', 3000);