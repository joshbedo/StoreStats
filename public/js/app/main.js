define(["jquery", "angular", "controllers", "filters", "services", "directives"], function($, angular, filters, services, directives, controllers) {
'use strict';
  return angular.module('myApp', ['myApp.controllers', 'myApp.filters', 'myApp.services', 'myApp.directives']);
  /*var App = {
    init: function(txt){
      console.log(txt);
    }
  }

  return App;*/

});