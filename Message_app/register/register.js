(function () {
    'use strict';
 
    angular
        .module('myapp')
        .controller('register', register);

    register.$inject = ['$scope','$rootScope', 'UserService', '$location'];

    function register($scope, $rootScope, UserService, $location){
      $rootScope.formModel = {};
      $rootScope.usernameValid = false;
      $rootScope.typing = false;
      $scope.onSubmit = function() {
        if($rootScope.usernameValid && $scope.userForm.$valid){
          if(localStorage !== undefined){
            if(!localStorage.users){
              localStorage.users = JSON.stringify([]);
            }
            var users = JSON.parse(localStorage.users);
            users.push($rootScope.formModel);
            localStorage.users = JSON.stringify(users);
          }
          $rootScope.usernameValid = false;
          $rootScope.formModel = {};

          $location.path('/');
        } else {
          alert("invalid username");
        }
        
      };

      $scope.validateUsername = function() {
        if($rootScope.formModel.username.length != 0) {
          $rootScope.typing = true;
          $rootScope.validated = false;
          $rootScope.invalidated = false;
          UserService.ValidateRegister($rootScope.formModel)
            .then(function(valid) {
              if(valid.success) {
                $rootScope.typing = false;
                $rootScope.invalidated = false;
                $rootScope.usernameValid = true;
                console.log("valid");
              } else {
                console.log("invalid");
                $rootScope.typing = false;
                $rootScope.invalidated = true;
                $rootScope.usernameValid = false;
              }
            }) 
        } else {
          $rootScope.typing = false;
          $rootScope.validated = false;
          $rootScope.invalidated = false;
        }
      }
    }
})();

