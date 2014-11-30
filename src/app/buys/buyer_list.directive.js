'use strict';

angular.module('keep')
.directive('buyerList', function($state, Account, Basket){

  var buyerListCtrl = function(){
    var self = this;
    Account.onAccounts(function(accounts){
      self.buyers = accounts;
    });
  };

  buyerListCtrl.prototype.selectBuyer = function(buyer){
    Basket.buyerId = buyer.$id;
    $state.go('root.buy.products');
  };

  return {
    scope: {},
    templateUrl: 'app/buys/buyer_list.html',
    controller: buyerListCtrl,
    controllerAs: 'ctrl'
  };
});
