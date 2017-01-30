(function () {
    'use strict';
 
    angular
        .module('app')
        .factory('MessageService', MessageService);
 
    MessageService.$inject = ['$q','$filter', '$timeout', '$rootScope'];
    function MessageService($q, $filter, $timeout, $rootScope) {
      var MessageService = {};

      MessageService.GetMessageById = GetMessageById;
      MessageService.DeleteMessage = DeleteMessage;

      return MessageService;

      function GetMessageById(messageID) {
        var deferred = $q.defer();
        var filtered = $filter('filter')(getMessage(), {id : messageID})
        var message = filtered.length ? filtered[0] : null;
        deferred.resolve(message);
        return deferred.promise;
      }

      function DeleteMessage(messageID) {
        console.log("delete" + messageID);
        var deferred = $q.defer();
        var messages = getMessage();
        for(var key in messages) {
          if(messages[key].id == messageID){
            messages.splice(key ,1);
            localStorage.messages = JSON.stringify(messages);
            break;
          }
        }
        deferred.resolve(messages);
        return deferred.promise;
      }

      function getMessage() {
        if(!localStorage.messages){
          localStorage.messages = JSON.stringify([]);
        }
        return JSON.parse(localStorage.messages);
      }


    }
})();