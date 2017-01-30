(function () {
    'use strict';
 
    angular
        .module('myapp', ['ui.router'])
        .config(config);
 
    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('login', {
          url:'/login',
          templateUrl:'login/login.html',
          controller:'login'  
      })
        .state('home', {
          url:'/home',
          templateUrl:'home/home.html',
          contorller:'home'
      })
        .state('home.profile', {
          url:'/profile',
          templateUrl:'profile/profile.html',
          contorller:'profile'
      })
        .state('home.message', {
          url:'/message',
          contorller:'message',
          templateUrl:'message/message.html',
      })
        .state('home.messageDetail', {
          url:'/message_detail/:id',
          contorller:'messageDetail',
          templateUrl:'messageDetail/messageDetail.html',
      })
        .state('register', {
          url:'/register',
          templateUrl:'register.html',
          controller:'register'
      });
      $urlRouterProvider.otherwise("/login");
    }
})();
