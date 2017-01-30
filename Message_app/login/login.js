(function () {
    'use strict';
 
    angular
        .module('myapp')
        .controller('login', login);
 
    login.$inject = ['$scope', '$rootScope', '$location', 'UserService'];

    function login($scope, $rootScope, $location, UserService) {
      $scope.goto = function( path ){
        $location.path( path );
      }

      $scope.loginSubmit = function(){
        UserService.Login($scope.username, $scope.password, function(response) {
          if(response.success) {
            $rootScope.globals = {
              currentUser: {
                username: $scope.username
              }
            }
            $location.path('/home/profile');
          } else {
            alert(response.message);
          }
        });
      }
    }

})();