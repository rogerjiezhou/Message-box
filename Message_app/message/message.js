(function () {
    'use strict';
 
    angular
        .module('myapp')
        .controller('message', message);

    message.$inject = ['$scope', 'MessageService', '$http', '$rootScope', '$state'];

  function message($scope, MessageService, $http, $rootScope, $state) {
    $rootScope.messages = [];
    
    if(localStorage.messages === undefined){
      $http.get('message.json').then(function(data) {
        $rootScope.messages = data.data;
        localStorage.messages = JSON.stringify($rootScope.messages);
      });
    } else {
      $rootScope.messages = JSON.parse(localStorage.messages);
    }

    $scope.isImportant = function(message) {
      if(message.important == '1')
        return true;
      else
        return false;
    }

    $scope.flag = function(id, event){
      var value = event.target.attributes.src.value;
      if(value == '/app-content/img/clicked.png')
        event.target.attributes.src.value = "/app-content/img/unclicked.png";
      else
        event.target.attributes.src.value = "/app-content/img/clicked.png";
      var messages = JSON.parse(localStorage.messages);
      for(var key in messages){
        if(messages[key].id == id){
          if(messages[key].important == '1')
            messages[key].important = '0';
          else
            messages[key].important = '1';
        }
      }
      localStorage.messages = JSON.stringify(messages);
    }

    $scope.goto = function(id) {
      $state.go('home.messageDetail', {id: id})
    }
  }
})();