'use strict';

angular.module('kassa', ['ngAnimate', 'ngTouch', 'ui.router', 'firebase', 'smart-table', 'kassaConfig'])
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
      url: '/products',
      views: {
        '@root' : {
          template: '<product-list><product-list>'
        }
      }
    })
    .state('root.products.new', {
      url: '/new',
      views: {
        '@root' : {
          template: '<product><product>'
        }
      }
    })
    .state('root.products.edit', {
      url: '/:id',
      views: {
        '@root' : {
          template: '<product><product>'
        }
      }
    })
    .state('root.accounts', {
      url: '/accounts',
      views: {
        '@root' : {
          template: '<account-list><account-list>'
        }
      }
    })
    .state('root.accounts.new', {
      url: '/new',
      views: {
        '@root' : {
          template: '<account><account>'
        }
      }
    })
    .state('root.accounts.edit', {
      url: '/:id',
      views: {
        '@root' : {
          template: '<account><account>'
        }
      }
    })
    .state('root.buy', {
      url: '/buy',
      views: {
        '@root' : {
          templateUrl: '/app/buys/content.html'
        },
        '@root.buy' : {
          template: '<buyer-list></buyer-list>'
        },
        'sidelist@root.buy': {
          template: '<buy-list></buy-list>'
        }
      }
    })
    .state('root.buy.products', {
      url: '/products',
      views: {
        '@root.buy' : {
          template: '<buy-product-list></buy-product-list>'
        },
        'sidelist@root.buy': {
          template: '<basket></basket>'
        }
      }
    });

  $urlRouterProvider.otherwise('/');
});
