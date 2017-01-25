var app = angular.module('myapp',['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url:'/login',
    templateUrl:'login.html',
    controller:'login'  
  })
  .state('home', {
    url:'/home',
    templateUrl:'home.html'
  })
  .state('home.profile', {
    url:'/profile',
    templateUrl:'profile.html',
    contorller:'profile'
  })
  .state('home.message', {
    url:'/message',
    contorller:'login',
    templateUrl:'message.html',
  })
  // .state('home', {
  //   url:'/home',
  //   templateUrl:'home.html',
  //   contorller:'home'
  // })
  .state('/test', {
    templateUrl:'test.html',
  })
  .state('register', {
    url:'/register',
    templateUrl:'register.html',
    controller:'register'
  });
  $urlRouterProvider.otherwise("/login");

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
        $location.path('/home/profile');
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


app.factory('MessageService', ['$q','$filter', '$timeout', '$rootScope', function($q, $filter, $timeout, $rootScope) {
  var MessageService = {};

  return MessageService;
}]);

app.factory('UserService',['$q','$filter', '$timeout', '$rootScope', function($q, $filter, $timeout, $rootScope) {
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

}])


app.controller('profile', ['$scope','$rootScope', 'UserService', '$location', '$timeout', function($scope, $rootScope, UserService, $location, $timeout){

  $rootScope.userModel = {};

  UserService.GetByUsername($rootScope.globals.currentUser.username)
    .then(function(user) {
      $rootScope.userModel = user;
  });

  $rootScope.userIndex = UserService.GetUserIndex($rootScope.globals.currentUser.username);

  console.log($rootScope.userIndex);

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
}]);

app.controller('message',['$scope', 'MessageService', '$http', '$rootScope', function($scope, MessageService, $http, $rootScope) {
  $rootScope.messages = [];
  
  $http.get('message.json').then(function(data) {
    $rootScope.messages = data.data;
    localStorage.messages = JSON.stringify($rootScope.messages);
  });

}]);