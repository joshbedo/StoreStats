define(["angular","services"],function(e,t){e.module("myApp.filters",["myApp.services"]).filter("interpolate",["version",function(e){return function(t){return String(t).replace(/\%VERSION\%/mg,e)}}])});