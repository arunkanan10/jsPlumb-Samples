(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//this file holds the current component source
//if this file contains a large amount of files feel free to use gulp to concat into 1 file
'use strict';
require("./src/component/jsplumbDemo.module");
require("./src/component/jsplumbDemo.mock.controller");
require("./src/component/jsplumbDemo.directive");

},{"./src/component/jsplumbDemo.directive":2,"./src/component/jsplumbDemo.mock.controller":3,"./src/component/jsplumbDemo.module":4}],2:[function(require,module,exports){
(function(angular) {

	angular.module('component.jsplumbDemo')
		.directive('jsplumbDemo', jsplumbDemo);

	jsplumbDemo.$inject = ['$log', '$q'];

	function jsplumbDemo($log, $q){

		var directive = {
				restrict: "EA",
				templateUrl: "templates/_demo.html",
				link: link
			};

		return directive;

		function link(scope, element, attrs, ngModel) {

			scope.treeHeader = "Hello";

		}
	}
})(angular);

},{}],3:[function(require,module,exports){
(function(angular, _) {

  var mod = angular.module('component.jsplumbDemo')
      .controller('jsplumbDemoMockCtrl', jsplumbDemoMockCtrl);

  jsplumbDemoMockCtrl.$inject = ['$log', '$scope'];

  function jsplumbDemoMockCtrl($log, $scope) {

    var vm = this;
    vm.treeView = {
      selectedNode: [],
      treeData: {}
    };
  }
})(angular, _);

},{}],4:[function(require,module,exports){
/**
 * @ngdoc overview
 * @name lcTree
 *
 * @description
 * Tree View component overview - Component to allow developers to display hierarchical data in a tree or a list with the ability to import and export tree data. Module also allows for a specific node to be selected (ie bound to a model).
 */
(function(){
    angular.module('component.jsplumbDemo', ['component.lcCommon', 'mgcrea.ngStrap.popover']);
})();

},{}]},{},[1]);
