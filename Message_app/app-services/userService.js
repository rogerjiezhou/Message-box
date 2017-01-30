(function () {
    'use strict';
 
    angular
        .module('myapp')
        .factory('UserService', UserService);
 
    UserService.$inject = ['$q','$filter', '$timeout', '$rootScope'];


  function UserService($q, $filter, $timeout, $rootScope) {
    var UserService = {};

    UserService.GetByUsername = GetByUsername;
    UserService.ValidateRegister = ValidateRegister;
    UserService.Login = Login;
    UserService.GetUserIndex = GetUserIndex;

    return UserService;
   
    function ValidateRegister(user) {
      var deferred = $q.defer();

      $timeout(function() {
        GetByUsername(user.username)
          .then(function(duplicateUser) {
            if(duplicateUser !== null){
              deferred.resolve({success: false, message: 'Username "' + user.username + '" is already taken'})
            } else {
              deferred.resolve({success: true})
            }
          });

      }, 500);

      return deferred.promise;
    }

    function Login(username, password ,callback) {
      var response;
      $timeout(function() {
        GetByUsername(username)
          .then(function(user) {
            console.log(user);
            if(user !== null && user.password === password){
              response = { success: true }
            } else {
              response = { success: false, message: 'Username or password is incorrect' };
            }
            callback(response);
          })
      }, 1000);
    }

    function GetByUsername(username) {
      var deferred = $q.defer();
      var filtered = $filter('filter')(getUsers(),{username: username},true);
      var user = filtered.length ? filtered[0] : null;
      deferred.resolve(user);
      return deferred.promise;
    }

    function GetUserIndex(username) {
      var users = getUsers();
      var index = 0;
      for(var key in users){
        if(users[key].username == $rootScope.globals.currentUser.username)
          break;
        index++;
      }
      return index;
    }

    function getUsers() {
      if(!localStorage.users){
        localStorage.users = JSON.stringify([]);
      }
        return JSON.parse(localStorage.users);    
    }
  }
})();