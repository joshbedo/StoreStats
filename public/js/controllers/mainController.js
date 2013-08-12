define([], function() {
	return ['$scope', '$http', function($scope, $http) {
		// You can access the scope of the controller from here
		//$scope.names = [{first_name: 'john', last_name: 'doe', company: 'company name'},{first_name: 'jane', last_name: 'doe', company: 'imstillreallybored'}];

		$http({method: 'GET', url: '/api/customers'}).
		  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    $scope.names = data;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log('error');
		  });

		//convert into a service
		//$scope.customers = customers.query();
		
		// because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
		$scope.$apply();
	}];
});