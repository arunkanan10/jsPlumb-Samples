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
