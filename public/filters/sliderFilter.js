'use strict';

// Dependencies
angular.module('myApp').
filter('sliderFilter',function() {
    return function(products, sliders) {
        var filteredProducts = products;
        angular.forEach(sliders,function(slider,index){
            var axis = slider.axis;
            var compareVal = slider.value;
            var tempfilteredProducts = new Array();
            angular.forEach(filteredProducts,function(product,index){

                //タイプによって方向を変える
            	//価格は初期値最大
                if(axis == "price"){
                    if(eval("product." + axis) <= compareVal){
                        tempfilteredProducts.push(product);
                    }
                }else{
                //静粛性、乗り心地、耐久性は初期値最低
                    if(eval("product." + axis) >= compareVal){
                        tempfilteredProducts.push(product);
                    }
                }

            })
            filteredProducts = tempfilteredProducts;
        })
        return filteredProducts;
    }
});
