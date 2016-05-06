'use strict';

angular.module('core').directive('ocFileRead', function($q) {
  console.log('* oc-file-read.client.directive *');

  var x = true;

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {

      var reader = new FileReader();
      var image = new Image();

      var dimensions = JSON.parse(attrs.ocFileRead);

      ctrl.$asyncValidators.dimensions = function(modelValue, viewValue) {
        var def = $q.defer();

        if (typeof scope.itemForm.itemFile.$modelValue === 'string') {
          def.resolve();
        }

        reader.onload = function(event) {

          scope.ocFileRead.data = event.target.result;

          image.src = scope.ocFileRead.data;

          scope.changeFile();
          scope.$apply();

          image.onload = function() {

            scope.ocFileRead.width = this.width;
            scope.ocFileRead.height = this.height;

            if (scope.ocFileRead.height === dimensions[0] && scope.ocFileRead.width === dimensions[1]) {
              def.resolve();
            } else {
              def.reject();
            }
          };
        };

        return def.promise;
      };

      elem.on('change', function(event) {
        reader.readAsDataURL(elem[0].files[0]);

        scope.ocFileRead.type = elem[0].files[0].type;
        scope.ocFileRead.size = elem[0].files[0].size;

        scope.$apply();
      });

    }
  };
});
