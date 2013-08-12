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
    "baseUrl": "../js",
    "paths": {
      "app": "app",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "angular": "lib/angular.min",
      "socketio": 'http://localhost:3000/socket.io/socket.io',
    },
	"shim":{
		"socketio": {
			dep: ["jquery"],
			exports: "io"
		},
    "angular": { exports: "angular" }
		/*"app/main": {
      exports: "app",
			dep: ["jquery", "socketio", "angular"]
		}*/
	}
});

// Load the main app module to start the app
requirejs(["jquery", "angular", "socketio", "app/main", "routes"], function(jquery, angular, io, app, routes){
      'use strict';
      //app.init('test module');

      angular.bootstrap(document, [app["name"]]);
    });
