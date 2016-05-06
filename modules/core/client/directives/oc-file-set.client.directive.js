'use strict';

angular.module('core').directive('ocFileSet', function() {
  console.log('* oc-file-set.client.directive *');

  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      ngModel.$render = function() {
        ngModel.$setViewValue(elem.val());
      };

      elem.bind('change', function() {
        scope.$apply(function() {
          ngModel.$render();
        });
      });
    }
  };
});
