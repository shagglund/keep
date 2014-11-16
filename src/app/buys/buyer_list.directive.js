'use strict';

angular.module('kassa')
.directive('buyerList', function($state, Account, Basket){

  var buyerListCtrl = function(){
    this.buyers = Account.accounts;
  };

  buyerListCtrl.prototype.selectBuyer = function(buyer){
    Basket.buyerId = buyer.$id;
    $state.go('root.buy.products');
  };

  return {
    scope: {},
    templateUrl: '/app/buys/buyer_list.html',
    controller: buyerListCtrl,
    controllerAs: 'ctrl'
  };
});
