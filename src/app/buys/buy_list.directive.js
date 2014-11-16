'use strict';

angular.module('kassa')
.directive('buyList', function(Buy, Account, Product){
  var buyListCtrl = function(){
    this.buys = Buy.getLast(25);
    this.buyers = Account.accounts;
    this.products = Product.products;
  };

  buyListCtrl.prototype.canDelete = Buy.canDelete;

  buyListCtrl.prototype.remove = Buy.delete;
  buyListCtrl.prototype.buyAgain = function(buy){
    return Buy.create({ buyerId: buy.buyerId, products: buy.products });
  };

  return {
    scope: {},
    templateUrl: '/app/buys/buy_list.html',
    controller: buyListCtrl,
    controllerAs: 'ctrl'
  };
});
