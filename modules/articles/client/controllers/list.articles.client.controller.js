'use strict';

angular.module('articles').controller('ArticlesListController', [
  'Authentication',
  'ArticlesService',

  '_',
  'moment',

  '$http',
  '$rootScope',
  '$scope',
  '$stateParams',
  '$location',
  '$modal',

  function(
    Authentication,
    ArticlesService,

    _,
    moment,

    $http,
    $rootScope,
    $scope,
    $stateParams,
    $location,
    $modal
  ) {
    
    $scope.authentication = Authentication;
    
    $scope.item = {};
    $scope.search = {};
    $scope.order = ['createdAt', 'DESC'];
    
    $scope.pane = 'article';
    $scope.editing = false;

    $scope.pageSizes = [5, 10, 15];
    $scope.pageSize = $scope.pageSizes[0];
    $scope.currentPage = 1;

    // Authentication check
    if (!$scope.authentication.user) {
      $location.path('/authentication/signin');
    } else {
      var roles = $scope.authentication.user.roles;

      if (_.includes(roles, 'admin') || _.includes(roles, 'guest')) {
        $scope.authenticated = true;
      } else {
        $location.path('/');
      }
    }

    /**
     * Clear
     * [clear description]
     * @param  {[type]} form [description]
     * @return {[type]}      [description]
     */
    $scope.clear = function(form) {
      console.log('* article.client.controller - clear *');

      if (form === 'article') {
        $scope.editing = false;
        $scope.submitted = false;
        $scope.item = {};
        $scope.order = ['createdAt', 'DESC'];
        $scope.articleForm.$setPristine();
      } else if (form === 'search') {
        $scope.search = {};
        $scope.read();
        $scope.searchForm.$setPristine();
      }
    };

    /**
     * Edit
     * [edit description]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    $scope.edit = function(id) {
      console.log('* article.client.controller - edit *');

      $scope.editing = true;

      _.each($scope.articles[id], function(value, key) {
        $scope.item[key] = value;
      });
    };

    /**
     * Find
     * [find description]
     * @return {[type]} [description]
     */
    $scope.find = function() {
      console.log('* article.client.controller - find *');

      $scope.currentPage = 1;
      $scope.read();
      $scope.articleForm.$setPristine();
    };

    /**
     * Sort
     * [sort description]
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    $scope.sort = function(column) {
      console.log('* article.client.controller - sort *');

      var direction = 'DESC';

      if ($scope.order[0] === column) {
        direction = ($scope.order[1] === 'ASC') ? $scope.order[1] = 'DESC' : $scope.order[1] = 'ASC';
      }

      $scope.order = [column, direction];
      $scope.read();
    };

    /**
     * Submit
     * [submit description]
     * @return {[type]} [description]
     */
    $scope.submit = function() {
      console.log('* article.client.controller - submit *');

      $scope.submitted = true;

      if ($scope.articleForm.$valid) {
        if ($scope.editing) {
          $scope.update($scope.item.id);
          $scope.clear('article');
        } else {
          $scope.currentPage = 1;
          $scope.create();
          $scope.clear('article');
        }
      }
    };

    /**
     * Tab
     * [clickTab description]
     * @param  {[type]} tab [description]
     * @return {[type]}     [description]
     */
    $scope.tab = function(tab) {
      console.log('* article.client.controller - tab *');

      $scope.pane = tab;

      $scope.read();

      if (tab === 'article') {
        $scope.search = {};
        $scope.searchForm.$setPristine();
      }
    };

    /**
     * CRUD
     */

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
            $scope.read();
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
            $scope.read();
          }
        }, function(err) {
          $scope.error = err.data.message;
        });
    };

    /**
     * Read
     * [read description]
     * @return {[type]} [description]
     */
    $scope.read = function() {
      console.log('* article.client.controller - read *');

      var params = {
        limit: $scope.pageSize,
        offset: ($scope.currentPage - 1) * $scope.pageSize,
        order: $scope.order,
        search: $scope.search
      };

      $http({
        url: 'api/articles',
        method: 'GET',
        params: params
      })
        .then(function(results) {
          $scope.articles = results.data.rows;
          console.log($scope.articles);

          $scope.totalItems = results.data.count;
          $scope.numberOfPages = Math.ceil($scope.totalItems / $scope.pageSize);

          if ($scope.numberOfPages !== 0 && $scope.currentPage > $scope.numberOfPages) {
            $scope.currentPage = $scope.numberOfPages;
          }

          var beginning = $scope.pageSize * $scope.currentPage - $scope.pageSize;
          var end = (($scope.pageSize * $scope.currentPage) > $scope.totalItems) ? $scope.totalItems : ($scope.pageSize * $scope.currentPage);

          $scope.pageRange = beginning + ' ~ ' + end;
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
      console.log('* article.client.controller - update *');

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
            $scope.read();
          }
        }, function(err) {
          $scope.error = err.data.message;
        });
    };

    /**
     * Pagination
     */

    /**
     * Change page
     * [changePage description]
     * @return {[type]} [description]
     */
    $scope.changePage = function() {
      // console.log('* general.client.controller - changePage *');

      if (!angular.isNumber($scope.currentPage)) {
        $scope.currentPage = 1;
      }

      if ($scope.currentPage === '') {
        $scope.currentPage = 1;
      } else if ($scope.currentPage > $scope.numberOfPages) {
        $scope.currentPage = $scope.numberOfPages;
      }

      $scope.paginationForm.$setPristine();
      $scope.read();
    };

    /**
     * Change size
     * [changeSize description]
     * @return {[type]} [description]
     */
    $scope.changeSize = function() {
      // console.log('* general.client.controller - changeSize *');

      $scope.paginationForm.$setPristine();

      $scope.currentPage = 1;

      $scope.read();
    };

    /**
     * Click fast backward
     * [clickFastBackward description]
     * @return {[type]} [description]
     */
    $scope.clickFastBackward = function() {
      // console.log('* general.client.controller - clickFastBackward *');

      if ($scope.currentPage !== 1) {
        $scope.currentPage = 1;
        $scope.read();
      }
    };

    /**
     * Click backward
     * [clickBackward description]
     * @return {[type]} [description]
     */
    $scope.clickBackward = function() {
      // console.log('* general.client.controller - clickBackward *');

      if ($scope.currentPage !== 1) {
        $scope.currentPage--;
        $scope.read();
      }
    };

    /**
     * Click forward
     * [clickForward description]
     * @return {[type]} [description]
     */
    $scope.clickForward = function() {
      // console.log('* general.client.controller - clickForward *');

      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage++;
        $scope.read();
      }
    };

    /**
     * Click fast foward
     * [clickFastForward description]
     * @return {[type]} [description]
     */
    $scope.clickFastForward = function() {
      // console.log('* general.client.controller - clickFastForward *');

      if ($scope.currentPage !== $scope.numberOfPages && $scope.numberOfPages !== 0) {
        $scope.currentPage = $scope.numberOfPages;
        $scope.read();
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
        $scope.read();
      }
    };
  }
]);
