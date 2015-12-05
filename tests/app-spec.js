describe('cryptomatorWebTest', function() {
  'use strict';

  var $scope, ctrl;


  beforeEach(function() {
    module('cryptomator');

    inject(function($controller, $rootScope, $q) {
      $scope = $rootScope.$new();
      ctrl = $controller('DownloadCtrl', {$scope: $scope, deployJava: deployJava});
    });
  });

  it('should not crash', function() {
    expect(ctrl).not.toBeNull();
  });

});
