define(["socketio"], function(io) {
	return ['$scope', '$http', function($scope, $http) {
		// You can access the scope of the controller from here
		//$scope.names = [{first_name: 'john', last_name: 'doe', company: 'company name'},{first_name: 'jane', last_name: 'doe', company: 'imstillreallybored'}];
		var socket = io.connect('http://localhost:3000');
		

		$scope.getCharts = function(){
			$http({method: 'GET', url: '/api/reports/1'}).
			  success(function(data, status, headers, config) {
			    // this callback will be called asynchronously
			    // when the response is available
			    $scope.basicBarChart = data;
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log('error');
			 });
		};
		$scope.getCharts();

		$('#send').on('click', function(ev){
			socket.emit('reportUpdate', { id: 1 });
			$scope.getCharts();
		});

		socket.on('reportSuccess', function(data){
			console.log('success');
			$scope.getCharts();
		});

		//convert into a service
		//$scope.customers = customers.query();
		
		// because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
		$scope.$apply();
	}];
});