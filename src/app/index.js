'use strict';

angular.module('kassa', ['ngAnimate', 'ngTouch', 'ui.router', 'firebase', 'smart-table'])
.constant('FirebaseRootUrl', 'https://aky-kassa.firebaseio.com')
.constant('Firebase', Firebase)
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('root', {
      url: '',
      templateUrl: 'app/main/main.html',
    })
    .state('root.default', {
      url: '/'
    })
    .state('root.products', {
      url: '/products'
    })
    .state('root.products.new', {
      url: '/new'
    })
    .state('root.products.edit', {
      url: '/:id'
    })
    .state('root.accounts', {
      url: '/accounts'
    })
    .state('root.accounts.new', {
      url: '/new'
    })
    .state('root.accounts.edit', {
      url: '/:id'
    });

  $urlRouterProvider.otherwise('/');
})
.run(function($rootScope, $state){
  $rootScope.$state = $state;
});
