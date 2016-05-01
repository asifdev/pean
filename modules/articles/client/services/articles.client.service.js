// (function() {
//   'use strict';

//   angular
//     .module('articles.services')
//     .factory('ArticlesService', ArticlesService);

//   ArticlesService.$inject = ['$resource'];

//   function ArticlesService($resource) {
//     return $resource('api/articles/:articleId', {
//       articleId: '@id'
//     }, {
//       update: {
//         method: 'PUT'
//       }
//     });
//   }
// })();

'use strict';

angular.module('articles').factory('ArticlesService', ['$resource',
  function($resource) {
    return $resource('api/articles/:articleId', {
      id: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);