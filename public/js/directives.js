define(['angular', 'services', 'highcharts'], function(angular, services) {
	'use strict';

	angular.module('myApp.directives', ['myApp.services'])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
		};
	}]);
	
	angular.module('myApp.directives', [])
		.directive('chart', function(){
			return {
				restrict: 'E',
				template: '<div></div>',
				scope: {
					chartData: "=value"
				},
				transclude: true,
				replace: true,
				link: function(scope, el, attrs){
					var chartDefaults = {
						chart: {
							renderTo: el[0],
							type: attrs.type || null,
							height: attrs.height || null,
							width: attrs.width || null
						}
					};
				scope.$watch(function(){ return scope.chartData; }, function(value){
					if(!value) return;

					var deepCopy = true,
						newSettings = {};

					$.extend(deepCopy, newSettings, chartDefaults, scope.chartData);
					var chart = new Highcharts.Chart(newSettings);
				});
			}
		};
	})
	.directive('activeLink', ['$location', function(location){
		return {
			restrict: 'A',
			link: function(scope, el, attrs, controller){
				var clazz = attrs.activeLink,
					path  = attrs.href;

				path = path.substring(1);
				scope.location = location;
				scope.$watch('location.path()', function(newPath){
					if(path === newPath){
						el.parent('li').addClass(clazz);
					}else{
						el.parent('li').removeClass(clazz);
					}
				});
			}
		};
	}]);
});