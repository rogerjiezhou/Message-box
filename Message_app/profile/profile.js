(function () {
    'use strict';
 
    angular
        .module('myapp')
        .controller('profile', profile);
 
    profile.$inject = ['$scope', '$rootScope', 'UserService', '$location', '$timeout'];


  function profile($scope, $rootScope, UserService, $location, $timeout){

    $rootScope.userModel = {};

    UserService.GetByUsername($rootScope.globals.currentUser.username)
      .then(function(user) {
        $rootScope.userModel = user;
    });

    $rootScope.userIndex = UserService.GetUserIndex($rootScope.globals.currentUser.username);

    $rootScope.usernameValid = false;
    $rootScope.invalidated = false;
    $rootScope.typing = false;

    $scope.updateUser = function() {
      if($rootScope.usernameValid && $scope.profileForm.$valid){
        var users = JSON.parse(localStorage.users);
        users[$rootScope.userIndex] = $rootScope.userModel;
        localStorage.users = JSON.stringify(users);
        $rootScope.globals.currentUser.username = $rootScope.userModel.username;
        $rootScope.usernameValid = false;
      } else {
        alert("invalid username");
      }
      
    };
    $scope.validateUsername = function() {
      if($rootScope.userModel.username != "" && 
          $rootScope.userModel.username != $rootScope.globals.currentUser.username) {
        $rootScope.typing = true;
        $rootScope.validated = false;
        $rootScope.invalidated = false;
        UserService.ValidateRegister($rootScope.userModel)
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
      }
      else
        $rootScope.typing = false;
        $rootScope.validated = false;
        $rootScope.invalidated = false;
    }
  }
})();