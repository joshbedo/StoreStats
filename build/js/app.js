
define('app/main',["jquery", "socketio"], function($, io) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
 		var socket = io.connect('http://localhost:3000');

          socket.on('purchase', function (data) {
            console.log(data);
          });

          socket.on('leave', function (data) {
            console.log(data);
          });

            $(function(){
                $('.btn').click(function(ev){
                    socket.emit('buy', { product: 'cool-shirt' });
                    ev.preventDefault();
                })
            });
});
// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
/*requirejs.config({
    "baseUrl": "../js/lib",
    "paths": {
      "app": "../app",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "socketio": '../../socket.io/socket.io',
    }
});

// Load the main app module to start the app
requirejs(["jquery", "socketio", "app/main"]);*/

requirejs.config({
    "baseUrl": "../js/lib",
    "paths": {
      "app": "../app",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "socketio": 'http://localhost:3000/socket.io/socket.io',
    },
	"shim":{
		"socketio": {
			dep: ["jquery"],
			exports: "io"
		},
		"app/main": {
			dep: ["jquery", "socketio"]
		}
	}
});

// Load the main app module to start the app
requirejs(["jquery", "socketio", "app/main"]);
define("app", function(){});
