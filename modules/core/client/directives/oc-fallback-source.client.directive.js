'use strict';

angular.module('core').directive('fallbackSource', function() {
  return {
    link: function(scope, element, attributes) {

      var sourceIsEmpty = function() {
        var originalSource = element.attr('src');
        return originalSource ? false : true;
      };

      var useFallbackSource = function() {
        element.attr('src', attributes.fallbackSource);
      };

      var listenForSourceLoadingError = function() {
        element.bind('error', function() {
          useFallbackSource();
        });
      };
      
      if (sourceIsEmpty()) {
        useFallbackSource();
      } else {
        listenForSourceLoadingError();
      }
    }
  };
});
