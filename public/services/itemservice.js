'use strict';

angular.module('myApp')

    .factory('Item', function () {
    	   var selectedItem = {};

    	    return {
    	        setValue: function (product) {
    	        	selectedItem = product;
    	        },
    	        getValue: function () {
    	            return selectedItem;
    	        }
    	    }
    });
