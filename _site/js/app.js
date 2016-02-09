angular.module('cryptomator', ['ngCookies']);

angular.module('cryptomator').factory('googleAnalytics', ['$window', function($window) {
  var initialized = false;

  return {
    initialize: function() {
      /* jshint sub:true, asi:true, expr:true */
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })($window, $window.document, 'script','//www.google-analytics.com/analytics.js','ga');
      /* jshint sub:false, asi:false, expr:false */

      $window.ga('create', 'UA-57664706-1', 'auto');
      $window.ga('require', 'displayfeatures');
      initialized = true;
    },

    sendPageView: function() {
      if (initialized) {
        $window.ga('send', 'pageview');
      }
    },

    sendBtnClick: function(eventLabel) {
      if (initialized) {
        $window.ga('send', 'event', 'button', 'click', eventLabel);
      }
    }
  };
}]);

angular.module('cryptomator').controller('DownloadCtrl', ['$scope', 'googleAnalytics', function($scope, googleAnalytics) {

  $scope.isOSWindows = navigator.appVersion.indexOf('Win') != -1;
  $scope.isOSMac = navigator.appVersion.indexOf('Mac') != -1 && navigator.appVersion.indexOf('iPhone') == -1;
  $scope.isOSLinux = (navigator.appVersion.indexOf('Linux') != -1 || navigator.appVersion.indexOf('X11') != -1) && navigator.appVersion.indexOf('Android') == -1;
  $scope.isOSiOS = navigator.appVersion.indexOf('iPhone') == -1;
  $scope.isOSAndroid = navigator.appVersion.indexOf('Android') == -1;
  $scope.showAllDownloads = false;

  $scope.logDownload = function(fileName) {
    googleAnalytics.sendBtnClick(fileName);
  };

}]);

angular.module('cryptomator').controller('DonateCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.copyBitcoinAddress = function() {
    $window.prompt('Copy Bitcoin Address', '1NeRKGXG5ZJ6CBVVbxaFrwq5kWG34vT8wh');
  };

}]);

angular.module('cryptomator').controller('CookiesCtrl', ['$http', '$scope', '$cookies', 'googleAnalytics', function($http, $scope, $cookies, googleAnalytics) {

  var euIsoCountryCodes = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];

  $scope.consentRequired = false;
  $scope.consentDismissed = false;
  $scope.consentGiven = !_.isEmpty($cookies.get('cookieConsent'));

  if ($scope.consentGiven) {
    googleAnalytics.initialize();
    googleAnalytics.sendPageView();
  } else {
    $http.jsonp('http://freegeoip.net/json/?callback=JSON_CALLBACK', {timeout: 5000}).success(function(data) {
      $scope.consentRequired = _.includes(euIsoCountryCodes, data.country_code);
      if (!$scope.consentRequired) {
        googleAnalytics.initialize();
        googleAnalytics.sendPageView();
      }
    }).error(function() {
      $scope.consentRequired = true;
    });
  }

  $scope.agree = function() {
    var expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 1);
    $cookies.put('cookieConsent', 'given_' + new Date().toISOString(), {expires: expireDate});
    $scope.consentGiven = true;
    googleAnalytics.initialize();
    googleAnalytics.sendPageView();
  };

  $scope.dismiss = function() {
    $scope.consentDismissed = true;
  };

}]);
