define(['angular', 'app/main'], function(angular, app) {
	'use strict';
	angular.module('myApp', ['myApp.directives', 'myApp.controllers'], 
	  function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'js/partials/chart.html',
			controller: 'mainController'
		});

		$routeProvider.when('/customers', {
			templateUrl: 'js/partials/customers/main.html',
			controller: 'customersController'
		});

		$routeProvider.when('/view1', {
			templateUrl: 'js/partials/partial1.html',
			controller: 'MyCtrl1',
			view: 'tab-data'
		});
		$routeProvider.when('/view2', {
			templateUrl: 'js/partials/partial2.html',
			controller: 'MyCtrl2',
		});
		$routeProvider.otherwise({redirectTo: '/home'});
	});

});