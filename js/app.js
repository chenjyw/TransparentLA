'use strict';

angular.module('transparentLA', [
    'ngRoute',
    'transparentLA.controllers',
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/aging', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/airports', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/contr', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/fire', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/ita', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/lacc', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/police', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/streetservice', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/transportation', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.when('/zoo', {templateUrl:'partials/department.html', controller:'payrollCtrl'});
  $routeProvider.otherwise({redirectTo:'/aging'});
}]);
