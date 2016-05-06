'use strict';

angular.module('core').directive('ocFileModel', ['$parse', function($parse) {
  console.log('* oc-file-model.client.directive *');

  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {

      var model = $parse(attrs.ocFileModel);
      var modelSetter = model.assign;

      elem.bind('change', function() {
        scope.$apply(function() {
          modelSetter(scope, elem[0].files[0]);
        });
      });
    }
  };
}]);
