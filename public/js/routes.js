define(['angular', 'app/main'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/customers', {
			templateUrl: 'js/partials/customers/main.html',
			controller: 'mainController'
		})


		$routeProvider.when('/view1', {
			templateUrl: 'js/partials/partial1.html',
			controller: 'MyCtrl1',
			view: 'tab-data'
		});
		$routeProvider.when('/view2', {
			templateUrl: 'js/partials/partial2.html',
			controller: 'MyCtrl2',
		});
		$routeProvider.otherwise({redirectTo: '/customers'});
	}]);

});