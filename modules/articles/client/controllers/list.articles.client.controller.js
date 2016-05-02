// (function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', [
      'ArticlesService',
      '$http',
      '_',
      '$scope',
      'Authentication',
      '$stateParams',
      '$state',
      // 'articleResolve',

      function (
        ArticlesService,
        $http,
        _,
        $scope,
        article,
        Authentication,
        $stateParams,
        $state
      ) {
        var vm = this;
        $scope.item = {};
        $scope.editing = false;
        $scope.pane = 'create';
        $scope.articles = ArticlesService.query();
        console.log('* list.srticles.client.controller - ArticlesListController *');

        /**
         * Tab
         * [clickTab description]
         * @param  {[type]} tab [description]
         * @return {[type]}     [description]
         */
        $scope.tab = function(tab) {
          console.log('* general.client.controller - tab *');

          $scope.pane = tab;

          // $scope.read();

          if (tab === 'create') {
            $scope.search = {};
            $scope.searchForm.$setPristine();
          }
        };

        /**
         * Clear
         * [clear description]
         * @param  {[type]} form [description]
         * @return {[type]}      [description]
         */
        $scope.clear = function(form) {
          console.log('* list.srticles.client.controller - clear *' + form);

          if (form === 'article') {
            $scope.editing = false;
            $scope.submitted = false;
            $scope.item = {};
            // $scope.order = ['createdAt', 'DESC'];
            $scope.articleForm.$setPristine();
          } else if (form === 'search') {
            $scope.search = {};
            // $scope.read();
            $scope.searchForm.$setPristine();
          }
        };

        console.log('* articles.client.controller - ArticlesController *');


        vm.article = article;
        vm.authentication = Authentication;
        vm.error = null;
        vm.form = {};
        // vm.remove = remove;
        // vm.save = save;

        // Remove existing Article
        // $scope.remove = function() {
        //   if (confirm('Are you sure you want to delete?')) {
        //     vm.article.$remove($state.go('articles.list'));
        //   }
        // };

        // Save Article
        // $scope.save = function (isValid) {
        //   if (!isValid) {
        //     $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        //     return false;
        //   }

        //   // TODO: move create/update logic to service
        //   if (vm.article.id) {
        //     vm.article.$update(successCallback, errorCallback);
        //   } else {
        //     vm.article.$save(successCallback, errorCallback);
        //   }

        //   function successCallback(res) {
        //     $state.go('articles.view', {
        //       articleId: res.id
        //     });
        //   }

        //   function errorCallback(res) {
        //     vm.error = res.data.message;
        //   }
        // };

        /**
         * Read
         * [read description]
         * @return {[type]} [description]
         */
        $scope.read = function() {
          console.log('* article.client.controller - read *');

          var params = {
            // limit: $scope.pageSize,
            // offset: ($scope.currentPage - 1) * $scope.pageSize,
            // order: $scope.order,
            search: $scope.search
          };

          $http({
            url: 'api/Articles',
            method: 'GET',
            params: params
          })
            .then(function(results) {
              $scope.srcArticle = results.data;
              console.log($scope.srcArticle);

              // $scope.totalItems = result.data.count;
              // $scope.numberOfPages = Math.ceil($scope.totalItems / $scope.pageSize);

              // if ($scope.numberOfPages !== 0 && $scope.currentPage > $scope.numberOfPages) {
              //   $scope.currentPage = $scope.numberOfPages;
              // }

              // var beginning = $scope.pageSize * $scope.currentPage - $scope.pageSize;
              // var end = (($scope.pageSize * $scope.currentPage) > $scope.totalItems) ? $scope.totalItems : ($scope.pageSize * $scope.currentPage);

              // $scope.pageRange = beginning + ' ~ ' + end;
            }, function(err) {
              $scope.error = err.data.message;
            });
        };

        /**
         * Create
         * [create description]
         * @return {[type]} [description]
         */
        $scope.create = function() {
          console.log('* article.client.controller - create *');

          var data = $scope.item;

          $http({
            url: 'api/Articles',
            method: 'POST',
            data: data
          })
            .then(function(result) {
              if (result) {
                // $scope.read();
                console.log('Article successfully created');
                $scope.item = {};
                $scope.editing = false;
                $scope.articleForm.$setPristine();
              }
            }, function(err) {
              $scope.error = err.data.message;
            });
        };

        /**
         * Delete
         * [delete description]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.delete = function(id) {
          var params = {
            id: id
          };

          $http({
            url: 'api/Articles/' + id,
            method: 'DELETE'
          })
            .then(function(result) {
              if (result) {
                $scope.list();
                console.log('Article successfully deleted');
              }
            }, function(err) {
              $scope.error = err.data.message;
            });
        };
        
        $scope.list = function() {
          console.log('* general.client.controller - read *');

          // var params = {
          //   limit: $scope.pageSize,
          //   offset: ($scope.currentPage - 1) * $scope.pageSize,
          //   search: $scope.search,
          //   order: $scope.order
          // };

          $http({
            url: 'api/Articles',
            method: 'GET'
            // params: params,
          })
            .then(function(result) {
              $scope.general = result.data.rows;
              console.log($scope.general);

              // $scope.totalItems = result.data.count;
              // $scope.numberOfPages = Math.ceil($scope.totalItems / $scope.pageSize);

              // if ($scope.numberOfPages !== 0 && $scope.currentPage > $scope.numberOfPages) {
              //   $scope.currentPage = $scope.numberOfPages;
              // }

              // var beginning = $scope.pageSize * $scope.currentPage - $scope.pageSize;
              // var end = (($scope.pageSize * $scope.currentPage) > $scope.totalItems) ? $scope.totalItems : ($scope.pageSize * $scope.currentPage);

              // $scope.pageRange = beginning + ' ~ ' + end;
            }, function(err) {
              $scope.error = err.data.message;
            });
        };

        /**
         * Update
         * [update description]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.update = function(id) {
          console.log('* general.client.controller - update *');

          var data = $scope.item;

          var params = {
            id: id
          };

          $http({
            url: 'api/Articles/' + id,
            method: 'PUT',
            data: data
          })
            .then(function(result) {
              if (result) {
                $scope.item = {};
                $scope.editing = false;
                $scope.articleForm.$setPristine();
              }
            }, function(err) {
              $scope.error = err.data.message;
            });
        };

        /**
         * Find
         * [find description]
         * @return {[type]} [description]
         */
        $scope.find = function() {
          console.log('* general.client.controller - find *');

          // $scope.currentPage = 1;
          $scope.read();
          $scope.articleForm.$setPristine();
        };

        /**
         * Edit
         * [edit description]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        // $scope.edit = function(id) {
        //   console.log('* general.client.controller - edit *');

        //   $scope.editing = true;

        //   var params = {
        //     id: id
        //   };

        //   $http({
        //     url: 'api/Articles/' + id,
        //     method: 'GET',
        //     // data: data
        //   })
        //   .then(function(result) {
        //     if (result) {
        //       $scope.editing = true;
        //       $scope.general = result.data;
        //       console.log($scope.general);
        //       $scope.item.title = $scope.general.title;
        //       $scope.item.content = $scope.general.content;
        //       $scope.item.id = $scope.general.id;
        //       // $scope.item = {};
        //       // $scope.editing = false;
        //       // $scope.articleForm.$setPristine();
        //       // $scope.read();
        //     }
        //   }, function(err) {
        //     $scope.error = err.data.message;
        //   });

        // // _.each($scope.general[id], function(value, key) {
        // //   $scope.item[key] = value;
        // // });
        // };

        /**
         * Edit
         * [edit description]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        $scope.edit = function(id) {
          console.log('* general.client.controller - edit *');

          $scope.editing = true;

          _.each($scope.articles, function(value, key) {
            console.log($scope.articles[key]);
            if($scope.articles[key].id === id) {
              _.each($scope.articles[key], function(value, key) {
                $scope.item[key] = value;
              });
            }
          });

          // _.each($scope.articles[id], function(value, key) {
          //   $scope.item[key] = value;
          // });
        };

        // $scope.backLinkClick = function () {
        //   // $route.reload();
        // };

        /**
         * Submit
         * [submit description]
         * @return {[type]} [description]
         */
        $scope.submit = function() {
          console.log('* general.client.controller - submit *');

          $scope.submitted = true;

          if ($scope.articleForm.$valid) {
            if ($scope.editing) {
              $scope.update($scope.item.id);
              $scope.list();
              // $scope.clear('item');
            } else {
              // $scope.currentPage = 1;
              $scope.create();
              $scope.list();
              // $scope.clear('item');
            }
          }
        };
        /**
         * Init
         * [init description]
         * @return {[type]} [description]
         */
        $scope.init = function() {
          console.log('* article.client.controller - init *');
          if ($scope.authenticated) {
            // $scope.read();
            $scope.list();
            $scope.pane = 'article';
          }
        };
      }
    ]);
// })();
