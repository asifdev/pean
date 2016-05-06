'use strict';

angular.module('core').directive('ocFullHeight', function($rootScope, $window) {

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      $rootScope.$on('$viewContentLoaded', function(event) {
        var topOffest = 50;
        var height = $window.innerHeight - topOffest - 1;
        element.css('min-height', height + 'px');
      });
    }
  };

});
