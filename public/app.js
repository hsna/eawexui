'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ui.router',
    'rzModule',
    'ui.bootstrap',
    'ngSanitize',
    'ngLocale',
    'ui.select'
]).config(['$routeProvider', '$stateProvider','$urlRouterProvider', function ($routeProvider, $stateProvider,$urlRouterProvider) {
// ]).config(['$routeProvider', '$stateProvider','$urlRouterProvider', '$locationProvider', function ($routeProvider, $stateProvider,$urlRouterProvider,$locationProvider) {
    $stateProvider
    .state('top', {
        url: '/top',
        templateUrl: 'views/top.html',
        controller: 'topCtrl'
      })
    // watson STATES AND NESTED VIEWS ========================================
    .state('top.watson', {
        url: '/watson?uid&clienttype&topic&ownedcar',
        templateUrl: 'views/watson.html',
        controller: 'watsonCtrl'
    })


    //$locationProvider.html5Mode(true);
    
    $urlRouterProvider.otherwise('/top');
    //$urlRouterProvider.when('/', '/top');
	//$urlRouterProvider.when('', '/top');
}]);
