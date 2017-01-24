var app = angular.module('myapp',['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl:'login.html',
    controller:'login'  
  })
  .when('/register', {
    templateUrl:'register.html'
  });

});

app.controller('login', ['$scope', '$location', function($scope, $location) {
  $scope.goto = function( path ){
    $location.path( path );
  }
}])