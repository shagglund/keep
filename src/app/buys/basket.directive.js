'use strict';

angular.module('kassa')
.directive('basket', function($state, Account, Basket, Message){

  var basketCtrl = function(){
    this.accounts = Account.accounts;
    this.saving = false;
  };

  basketCtrl.prototype.basket = Basket;

  basketCtrl.prototype.buy = function(){
    var self = this;
    this.saving = true;
    Basket.buy().then(function(){
      Message.success('Buy success');
      Basket.reset();
      $state.go('root.buy');
    }, function(error){
      Message.error('Buy failed: ' + error);
    }).finally(function(){
      self.saving = false;
    });
  };

  return {
    scope: {},
    templateUrl: '/app/buys/basket.html',
    controller: basketCtrl,
    controllerAs: 'ctrl'
  };
});
