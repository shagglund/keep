'use strict';

angular.module('kassa', [
  'ngAnimate',
  'ngTouch',
  'ui.router',
  'ui.gravatar',
  'firebase',
  'smart-table',
  'kassaConfig'
])
.constant('Firebase', Firebase)
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('auth', {
      url: '/auth',
      abstract: true,
      template: '<ui-view></ui-view>'
    })
    .state('auth.login', {
      url: '/login?next',
      template: '<login><login>'
    })
    .state('auth.reset', {
      url: '/reset',
      template: '<reset-password><reset-password>'
    })
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'app/main/main.html',
      resolve: {
        currentUser: function($rootScope, $firebaseSimpleLogin, Firebase, FirebaseRootUrl){
          $rootScope.currentUser = $firebaseSimpleLogin(new Firebase(FirebaseRootUrl)).$getCurrentUser();
          return $rootScope.currentUser;
        }
      }
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
      url: '/:productId',
      views: {
        '@root' : {
          templateUrl: '/app/main/two_column_content.html'
        },
        '@root.products.edit' : {
          template: '<product><product>'
        },
        '@sidelist.products.edit' : {
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
      url: '/:accountId',
      views: {
        '@root' : {
          templateUrl: '/app/main/two_column_content.html'
        },
        '@root.accounts.edit' : {
          template: '<account><account>'
        },
        'sidelist@root.accounts.edit': {
          template: '<buy-list></buy-list>'
        }
      }
    })
    .state('root.buy', {
      url: '/buy',
      views: {
        '@root' : {
          templateUrl: '/app/main/two_column_content.html'
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
})
.config(function(gravatarServiceProvider) {
  gravatarServiceProvider.defaults = {
    size     : 33,
    'default': 'mm'  // Mystery man as default for missing avatars
  };

  // Use https endpoint
  gravatarServiceProvider.secure = true;
})
.run(function($log){
  $log.info('Fork me on github: https://github.com/flipflops/keep');
});
