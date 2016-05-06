'use strict';

angular.module('articles').config(['$stateProvider','$locationProvider',
  function($stateProvider,$locationProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/articles.client.view.html'
      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
]);