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

app.controller('register', ['$scope', function($scope){
  $scope.formModel = {};
  $scope.onSubmit = function() {
    alert("click");
    console.log($scope.formModel);
    if(localStorage !== undefined){
      if(localStorage.length === 0){
        localStorage.users = JSON.stringify([]);
      }
      var users = JSON.parse(localStorage.users);
      users.push($scope.formModel);
      localStorage.users = JSON.stringify(users);
    }
  }
}]);