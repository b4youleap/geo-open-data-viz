'use strict';

angular.module('mapManager.source', [ 'mapManager.webapi' ])

  .service('sourcesService', function($route, sourceResource, $q, $timeout) {
    return {
      resolveSources: function() {
        //return sourceResource.query().$promise;
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve([
            { id: '1', name: 'test1', type: 'map', url: 'http://', originUrl: 'http://' },
            { id: '2', name: 'test2', type: 'data', url: 'http://', originUrl: 'http://' }
          ]);
        }, 500);
        return deferred.promise;
      },

      resolveSource: function() {
        return this.getCurrentSource().$promise;
      },

      getCurrentSource: function() {
        var sourceId = $route.current.params.sourceId;
        return sourceResource.get({ sourceId: sourceId });
      }
    };
  });