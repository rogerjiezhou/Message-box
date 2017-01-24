var app = angular.module('myapp',['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl:'login.html',
    controller:'login'  
  })
  .when('/test', {
    templateUrl:'test.html',
 
  })
  .when('/register', {
    templateUrl:'register.html',
    controller:'register'
  });

});

app.controller('login', ['$scope', '$location', function($scope, $location) {
  $scope.goto = function( path ){
    $location.path( path );
  }
}]);

app.controller('register', ['$scope','$rootScope', 'validation', function($scope, $rootScope, validation){
  $rootScope.formModel = {};
  $rootScope.validated = false;
  $rootScope.invalidated = false;
  $rootScope.typing = false;
  $rootScope.valided = false;
  $scope.onSubmit = function() {
    console.log($rootScope.formModel);
    if(localStorage !== undefined){
      if(!localStorage.users){
        localStorage.users = JSON.stringify([]);
      }
      var users = JSON.parse(localStorage.users);
      users.push($rootScope.formModel);
      localStorage.users = JSON.stringify(users);
    }
  };
  $scope.validateUsername = function() {
    if($rootScope.formModel.username.length != 0) {
      $rootScope.typing = true;
      $rootScope.validated = false;
      $rootScope.invalidated = false;
      validation.validateUsername($rootScope.formModel)
        .then(function(valid) {
          if(valid.success) {
            $rootScope.typing = false;
            $rootScope.validated = true;
            console.log("valid");
          } else {
            console.log("invalid");
            // $rootScope.typing = false;
            // $rootScope.invalidated = true;
          }
        }) 
    }
    else
      $rootScope.typing = false;
      $rootScope.validated = false;
      $rootScope.invalidated = false;
  }
}]);

app.factory('validation',['$q','$filter', '$timeout', function($q, $filter, $timeout) {
  var validation = {};

  validation.GetByUsername = GetByUsername,
  validation.validateUsername = validateUsername;

  return validation;
 

  function validateUsername(user) {
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