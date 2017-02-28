'use strict';

// Dependencies
angular.module('myApp')
    .controller('itemCtrl', function ($rootScope,$scope, $log,Item) {
        //モデル
        $scope.selectedProduct = {};

        $scope.$on('event:requestChangeMode', function(event, mode) {
            if(mode === "showItemView"){
                $scope.selectedProduct = Item.getValue();
            }
        });

        $scope.addCart = function() {
        	 var selectedProduct = Item.getValue();

        	$rootScope.$broadcast("event:addCartBox",parseInt(selectedProduct.price) * 4 + 4320);
            $rootScope.$broadcast("event:addCart", selectedProduct);
        }

        $scope.cancel = function() {
        	$rootScope.$broadcast('event:requestChangeMode', "backProductsView");
        	var empty = {};
        	Item.setValue(empty);
        }


    })