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
