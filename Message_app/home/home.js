(function () {
    'use strict';
 
    angular
        .module('myapp')
        .controller('home', home);
 
    home.$inject = ['$scope', '$rootScope', '$location'];


  function home($scope, $rootScope, $location) {
    $scope.signout = function(){
      $rootScope.globals.currentUser.username = "";
      $location.path('/login');
    }
  }
})();