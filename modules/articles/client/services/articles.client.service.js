'use strict';

angular.module('articles').factory('ArticlesService', ['$resource',
  function($resource) {
    return $resource('api/Articles/:id', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);