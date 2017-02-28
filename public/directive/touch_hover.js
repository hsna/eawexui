
'use strict';

// Dependencies
angular.module('myApp').
directive('touchClass', function() {
    return {
        restrict: 'A',
        scope: {
            touchClass: '@'
        },
        link: function(scope, element) {
            element.on('touchstart', function() {
                //element.$addClass(scope.touchClass);
                console.log("touchstart");
                scope.touchStart= true;
                element.addClass("touch");
                scope.$apply();

            });

            element.on('touchend', function() {
                //element.$removeClass(scope.touchClass);
                console.log("touchend");
                scope.touchStart= false;
                element.removeClass("touch");
                scope.$apply();


            });
        }
    };
});