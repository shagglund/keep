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
      templateUrl: 'app/main/main.html'
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
          templateUrl: '/app/main/two_column_content.html'
        },
        '@root.products.new' : {
          template: '<product><product>'
        },
        'sidelist@root.products.new' : {
          template: '<div></div>'
        },
        'top-content@root.products.new' : {
          template: '<product-breadcrumb><product-breadcrumb>'
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
        'sidelist@root.products.edit' : {
          template: '<div></div>' //override default template
        },
        'top-content@root.products.edit' : {
          template: '<product-breadcrumb><product-breadcrumb>'
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
          templateUrl: '/app/main/two_column_content.html'
        },
        '@root.accounts.new' : {
          template: '<account><account>'
        },
        'sidelist@root.accounts.new' : {
          template: '<div></div>'
        },
        'top-content@root.accounts.new' : {
          template: '<account-breadcrumb><account-breadcrumb>'
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
        'sidelist-content@root.accounts.edit': {
          template: '<buy-list></buy-list>'
        },
        'top-content@root.accounts.edit' : {
          template: '<account-breadcrumb><account-breadcrumb>'
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
        'sidelist-content@root.buy': {
          template: '<buy-list></buy-list>'
        },
        'top@root.buy': {
          template: '<div></div>'
        }
      }
    })
    .state('root.buy.products', {
      url: '/products',
      views: {
        '@root.buy' : {
          template: '<buy-product-list></buy-product-list>'
        },
        'sidelist-content@root.buy': {
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
