/**
 * To whom it may concern: DO NOT use $location or $anchorScroll, or else all "normal" html anchors get kidnapped.
 * We use normal $window.location.hash in many places.
 */

var app = angular.module('cryptomator', ['ngCookies']);

app.factory('googleAnalytics', ['$window', function($window) {
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

app.controller('CallToActionCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.isOSiOS = navigator.appVersion.indexOf('iPhone') != -1;
  $scope.isOSAndroid = navigator.appVersion.indexOf('Android') != -1;

  $scope.pwyw = 5;
  $scope.currencyEUR = {code: 'EUR', symbol: '€', glyphicon: 'glyphicon-eur'};
  $scope.currencyGBP = {code: 'GBP', symbol: '£', glyphicon: 'glyphicon-gbp'};
  $scope.currencyUSD = {code: 'USD', symbol: '$', glyphicon: 'glyphicon-usd'};
  $scope.currency = $scope.currencyEUR;

  $scope.isAcceptableAmount = function(amount) {
    return _.isNumber(amount) && amount >= 1;
  };

  $scope.gotoDownloads = function(shouldGoToDownloads) {
    if (shouldGoToDownloads) {
      $window.location.href='/downloads/';
    }
  };

}]);

app.controller('DonateCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.copyBitcoinAddress = function() {
    $window.prompt('Copy Bitcoin Address', '1NeRKGXG5ZJ6CBVVbxaFrwq5kWG34vT8wh');
  };

}]);

app.controller('DownloadCtrl', ['$scope', '$window', 'googleAnalytics', function($scope, $window, googleAnalytics) {

  $scope.isOSWindows = navigator.appVersion.indexOf('Win') != -1;
  $scope.isOSMac = navigator.appVersion.indexOf('Mac') != -1 && navigator.appVersion.indexOf('iPhone') == -1;
  $scope.isOSLinux = (navigator.appVersion.indexOf('Linux') != -1 || navigator.appVersion.indexOf('X11') != -1) && navigator.appVersion.indexOf('Android') == -1;
  $scope.isOSiOS = navigator.appVersion.indexOf('iPhone') != -1;
  $scope.isOSAndroid = navigator.appVersion.indexOf('Android') != -1;
  $scope.initialized = false;

  $scope.init = function() {
    $scope.initialized = true;
    if (!_.isEmpty($window.location.hash)) {
      // no-op
    } else if ($scope.isOSWindows) {
      $window.location.hash = 'winDownload';
    } else if ($scope.isOSMac) {
      $window.location.hash = 'osxDownload';
    } else if ($scope.isOSLinux) {
      $window.location.hash = 'debianDownload';
    } else {
      $window.location.hash = 'jarDownload';
    }
  };

  $scope.logDownload = function(fileName) {
    googleAnalytics.sendBtnClick(fileName);
  };

}]);

app.controller('DonateCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.copyBitcoinAddress = function() {
    $window.prompt('Copy Bitcoin Address', '1NeRKGXG5ZJ6CBVVbxaFrwq5kWG34vT8wh');
  };

}]);

app.controller('CookiesCtrl', ['$http', '$scope', '$cookies', 'googleAnalytics', function($http, $scope, $cookies, googleAnalytics) {

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

/**
 * Triggers a bootstrap modal dialog, if the condition evaluates to true.
 *
 * <button conditional-modal="{'#modalDialog1': foo == 1, '#modalDialog2': foo == 2}">click</button>
 */
app.directive('conditionalModal', [function() {
  return {
    restrict: 'A',
    scope: {
      modalSelectors: '=conditionalModal'
    },
    link: function(scope, elem, attrs) {
      $(elem).on('click', function() {
        var firstMatchingSelector = _.findKey(scope.modalSelectors, function(condition) {
          return condition;
        });
        if (firstMatchingSelector) {
          $(firstMatchingSelector).modal();
        }
      });
    }
  };
}]);

/**
 * Scrolls to the target specified by the given selector smoothly.
 *
 * <button scroll-to="#someDiv" scroll-offset="-80" scroll-duration="1000">click</button>
 */
app.directive('scrollTo', [function() {
  return {
    restrict: 'A',
    scope: {
      target: '@scrollTo',
      offset: '=scrollOffset',
      duration: '=scrollDuration'
    },
    link: function(scope, elem, attrs) {
      $(elem).on('click', function() {
        $('html, body').animate({
          scrollTop: $(scope.target).offset().top + scope.offset
        }, scope.duration);
      });
    }
  };
}]);

/**
 * If active on any element, the document will scroll by the full viewport height.
 */
app.directive('pagewiseScrolling', ['$window', '$document', function($window, $document) {
  var doc = $(document);

  var scrollHandler = function(e) {
    var delta = -e.deltaY || e.wheelDelta || -e.detail || e.originalEvent.wheelDelta || -e.originalEvent.detail;
    var winHeight = $($window).height();
    if (_.isNumber(delta)) {
      e.preventDefault();
    }
    var oldTop = doc.scrollTop();
    var newTop;
    if (delta > 0) {
      newTop = Math.ceil((oldTop - winHeight) / winHeight) * winHeight;
    } else if (delta < 0) {
      newTop = Math.ceil((oldTop + winHeight) / winHeight) * winHeight;
    }
    doc.scrollTop(newTop);
  };

  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      if (_.isFunction(doc.scrollTop)) {
        $document.on('mousewheel DOMMouseScroll', scrollHandler);

        elem.on('$destroy', function() {
          $document.off('mousewheel DOMMouseScroll', scrollHandler);
        });
      }
    }
  };
}]);

/**
 * Toggles a class depending on whether an element is in sight.
 * A threshold determines if the class should be toggled instantaneously when the first pixel becomes visible (threshold=0)
 * or when the element reaches the top of the window (threshold=1).
 *
 * <div scroll-toggle-class="{'state1': -100, 'state2': 0, 'state3': +100}">
 *   This gets styled with state1 when 100px between upper viewport bound and element top, state2 when scrolled to element top, state3 when element is already 100px covered
 * </div>
 */
app.directive('scrollToggleClass', ['$window', function($window) {

  var findHighest = function(styleClasses, position) {
    return _.findLastKey(styleClasses, function(threshold) {
      return threshold <= position;
    });
  };

  return {
    restrict: 'A',
    scope: {
      styleClasses: '=scrollToggleClass'
    },
    link: function(scope, elem, attrs) {
      var lastScrollTop = 0;
      $($window).on('scroll', function() {
        var elemTop = $(elem).offset().top;
        var scrollTop = $(this).scrollTop();

        var delta = scrollTop - elemTop;
        var activeStyleClass = findHighest(scope.styleClasses, delta);

        _.forEach(_.keys(scope.styleClasses), function(styleClass) {
          $(elem).toggleClass(styleClass, styleClass == activeStyleClass);
        });
      });
    }
  };
}]);
