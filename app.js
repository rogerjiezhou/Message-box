var app = angular.module('myapp',['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl:'login.html',
    controller:'login'  
  })
  .when('/home', {
    templateUrl:'home.html',
    contorller:'home'
  })
  .when('/test', {
    templateUrl:'test.html',
  })
  .when('/register', {
    templateUrl:'register.html',
    controller:'register'
  });


});

app.controller('login', ['$scope', '$rootScope', '$location', 'UserService', function($scope, $rootScope, $location, UserService) {
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
        $location.path('/home');
      } else {
        alert(response.message);
      }
    });
  }

}]);

app.controller('register', ['$scope','$rootScope', 'UserService', '$location', function($scope, $rootScope, UserService, $location){
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
    }
    else
      $rootScope.typing = false;
      $rootScope.validated = false;
      $rootScope.invalidated = false;
  }
}]);

app.factory('UserService',['$q','$filter', '$timeout', function($q, $filter, $timeout) {
  var UserService = {};

  UserService.GetByUsername = GetByUsername,
  UserService.ValidateRegister = ValidateRegister;
  UserService.Login = Login;

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
    var filtered = $filter('filter')(getUsers(),{username, username});
    var user = filtered.length ? filtered[0] : null;
    deferred.resolve(user);
    return deferred.promise;
  }

  function getUsers() {
    if(!localStorage.users){
      localStorage.users = JSON.stringify([]);
    }
      return JSON.parse(localStorage.users);    
  }
}])

app.controller('home', function() {

});