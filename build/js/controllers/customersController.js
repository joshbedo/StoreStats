define([],function(){return["$scope","$http",function(e,t){t({method:"GET",url:"/api/customers"}).success(function(t,n,r,i){e.names=t}).error(function(e,t,n,r){console.log("Error loading customer data")}),e.$apply()}]});