'use strict';

angular.module('keep')
.directive('product', function($state, $stateParams, Product, Message){
  var CREATE_SUCCESS_MSG = 'Product created successfully',
    UPDATE_SUCCESS_MSG = 'Product updated successfully',
    CREATE_FAIL_MSG = 'Product create failed: ',
    UPDATE_FAIL_MSG = 'Product update failed: ';

  function createOrUpdate(ctrl, product, create){
    var promise = null;

    if (create) {
      promise = Product.create(product);
    } else {
      promise = Product.update(product);
    }
    ctrl.saving = true;

    return promise.then(function(){
      Message.success(create ? CREATE_SUCCESS_MSG : UPDATE_SUCCESS_MSG);
    }, function(error){
      Message.error((create ? CREATE_FAIL_MSG : UPDATE_FAIL_MSG) +  error);
    }).finally(function(){
      ctrl.saving = false;
    });
  }

  var productCtrl = function(){
    var self = this;
    if (angular.isDefined($stateParams.productId)) {
      Product.onProducts(function(products){
        self.product = products.$getRecord($stateParams.productId);
      });
    } else {
      this.product = {};
    }
  };

  productCtrl.prototype.save = function(product){
    var isCreate = angular.isUndefined(product.$id);
    createOrUpdate(this, product, isCreate).then(function(){
      $state.go('root.products');
    });
  };

  productCtrl.prototype.cancel = function(){
    $state.go('root.products');
  };

  return {
    templateUrl: 'app/products/product.html',
    controller: productCtrl,
    controllerAs: 'ctrl'
  };
});
