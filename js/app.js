/**
 * To whom it may concern: DO NOT use $location or $anchorScroll, or else all "normal" html anchors get kidnapped.
 * We use normal $window.location.hash in many places.
 */

var app = angular.module('cryptomator', ['ngCookies']);

app.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}]);

app.run(['$rootScope', 'googleAnalytics', function($rootScope, googleAnalytics) {

  $rootScope.isOSWindows = navigator.appVersion.indexOf('Win') !== -1;
  $rootScope.isOSMac = navigator.appVersion.indexOf('Mac') !== -1 && navigator.appVersion.indexOf('iPhone') === -1;
  $rootScope.isOSLinux = (navigator.appVersion.indexOf('Linux') !== -1 || navigator.appVersion.indexOf('X11') !== -1) && navigator.appVersion.indexOf('Android') === -1;
  $rootScope.isOSiOS = navigator.appVersion.indexOf('iPhone') !== -1;
  $rootScope.isOSAndroid = navigator.appVersion.indexOf('Android') !== -1;

  $rootScope.donation = {
    amount: 10,
    currencyEUR: {code: 'EUR', symbol: '€', glyphicon: 'glyphicon-eur'},
    currencyGBP: {code: 'GBP', symbol: '£', glyphicon: 'glyphicon-gbp'},
    currencyUSD: {code: 'USD', symbol: '$', glyphicon: 'glyphicon-usd'},
    currency: null
  };
  $rootScope.donation.currency = $rootScope.donation.currencyEUR;

  googleAnalytics.sendPageView();

  $rootScope.sendGaBtnClick = function(label) {
    googleAnalytics.sendBtnClick(label);
  };

}]);

app.factory('stripe', ['$window', function($window) {
  var Stripe = $window.Stripe;
  Stripe.setPublishableKey('pk_live_lZc9TmxyYgWO3rVIBluV4wLn');

  return {
    card: Stripe.card
  };
}]);

app.factory('googleAnalytics', ['$window', function($window) {
  /* jshint sub:true, asi:true, expr:true */
  var ga = window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date();
  /* jshint sub:false, asi:false, expr:false */

  ga('create', 'UA-57664706-1', 'auto');
  ga('set', 'anonymizeIp', true);
  ga('require', 'displayfeatures');

  return {
    sendPageView: function() {
      ga('send', 'pageview');
    },

    sendBtnClick: function(eventLabel) {
      ga('send', 'event', 'button', 'click', eventLabel);
    }
  };
}]);

app.controller('CallToActionCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.gotoDownloads = function(shouldGoToDownloads) {
    if (shouldGoToDownloads) {
      $window.location.href = '/downloads/';
    }
  };

}]);

app.controller('PaymentCtrl', ['$scope', '$window', '$http', 'stripe', function($scope, $window, $http, stripe) {

  function showPaymentModalIfDonateAnchorPresent() {
    if ($window.location.hash == '#donate') {
      angular.element('#payment-modal').modal('show');
    }
  }

  var currentYear = new Date().getFullYear();

  $scope.paymentType = 'paypal';
  $scope.creditCard = {
    num: '',
    holdername: '',
    cvc: '',
    expMonth: null,
    expMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    expYear: null,
    expYears: _.map(_.range(currentYear, currentYear + 10), _.toString),
    validateNum: function() {
      return stripe.card.validateCardNumber(this.num);
    },
    validateCvc: function() {
      return stripe.card.validateCVC(this.cvc);
    },
    validateExpiry: function() {
      return _.includes(this.expMonths, this.expMonth) && _.includes(this.expYears, this.expYear);
    },
    guessType: function() {
      return stripe.card.cardType(this.num);
    }
  };
  $scope.paymentInProgress = false;
  $scope.paymentSuccessful = false;

  $scope.payWithCreditCard = function() {
    $scope.paymentInProgress = true;
    stripe.card.createToken({
      number: $scope.creditCard.num,
      name: $scope.creditCard.holdername,
      cvc: $scope.creditCard.cvc,
      exp_month: $scope.creditCard.expMonth,
      exp_year: $scope.creditCard.expYear
    }, function(status, response) {
      if (response.error) {
        $scope.$apply(function() {
          $scope.paymentError = response.error.message;
          $scope.paymentInProgress = false;
        });
      } else {
        var amountInCents = $scope.donation.amount * 100;
        $http.post('https://api.cryptomator.org/stripe/pay.php', $.param({
          stripeToken: response.id,
          currency: $scope.donation.currency.code,
          amountInCents: amountInCents
        }), {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function(successResponse) {
          if (successResponse.data.status == 'ok') {
            $scope.paymentError = null;
            $scope.paymentSuccessful = true;
          } else {
            $scope.paymentError = successResponse.data.error;
          }
          $scope.paymentInProgress = false;
        }, function(errorResponse) {
          console.warn('Payment failed.', errorResponse.data);
          $scope.paymentError = 'Payment failed.';
          $scope.paymentInProgress = false;
        });
      }

    });
  };

  $scope.isAcceptableAmount = function(amount) {
    return _.isNumber(amount) && amount >= 1;
  };

  showPaymentModalIfDonateAnchorPresent();

}]);

app.controller('NewsletterCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.subscribeSuccessful = false;
  $scope.subscribeInProgress = false;

  $scope.subscribe = function() {
    $scope.subscribeInProgress = true;
    $http.post('https://api.cryptomator.org/mailtrain/subscribe.php', $.param({
      email: $scope.email,
      android: $scope.android
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(successResponse) {
      $scope.subscribeSuccessful = true;
      $scope.subscribeError = null;
      $scope.subscribeInProgress = false;
      console.log(successResponse.data);
    }, function(errorResponse) {
      console.warn('Newsletter subscription failed.', errorResponse.data);
      $scope.subscribeError = errorResponse.data.error || 'Unable to subscribe to newsletter.';
      $scope.subscribeInProgress = false;
    });
  };

}]);

app.controller('DownloadCtrl', ['$scope', '$window', function($scope, $window) {

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
      $window.location.hash = 'linuxDownload';
    } else {
      $window.location.hash = 'jarDownload';
    }
  };

}]);

app.controller('CookiesCtrl', ['$http', '$scope', '$cookies', function($http, $scope, $cookies) {

  $scope.consentGiven = !_.isEmpty($cookies.get('cookieConsent'));

  $scope.confirm = function() {
    var expireDate = new Date();
    expireDate.setFullYear(expireDate.getFullYear() + 1);
    $cookies.put('cookieConsent', 'given_' + new Date().toISOString(), {expires: expireDate});
    $scope.consentGiven = true;
  };

}]);

app.controller('ContributorsCtrl', ['$http', '$scope', function($http, $scope) {

  var blacklistedContributors = ['overheadhunter', 'markuskreusch', 'tobihagemann', 'marcjulian', 'gitter-badger'];

  $scope.contributors = [];

  $http.jsonp('https://api.github.com/repos/cryptomator/cryptomator/contributors?callback=JSON_CALLBACK')
  .then(function(successResponse) {
    if (_.isObject(successResponse.data) && _.isArray(successResponse.data.data)) {
      console.log(successResponse.data.data);
      $scope.contributors = _.reject(successResponse.data.data, function(c) { return _.includes(blacklistedContributors, c.login); });
    } else {
      $scope.contributors = [];
    }
    $scope.paymentInProgress = false;
  }, function(errorResponse) {
    console.warn('Getting GitHub contributors failed.', errorResponse.data);
    $scope.contributors = [];
  });

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

app.directive('popoverForUserlanguage', ['$cookies', '$timeout', function($cookies, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      if ($cookies.get('multiLanguageAware') === 'yes') {
        return;
      }
      var attrName = 'popover' + clientLanguage();
      if (typeof attrs[attrName] !== 'undefined') {
        $(elem).popover({
          container: '.navbar-fixed-top',
          content: attrs[attrName],
          placement: 'bottom',
          trigger: 'manual'
        })
        .click(function() {
          $(elem).popover('hide');
        });
        // raise awareness for other language after 1s:
        $timeout(function() {
          $(elem).popover('show');
          // do not show this popup again for 24 hours:
          $cookies.put('multiLanguageAware', 'yes', {
            expires: new Date(_.now() + 24 * 3600 * 1000)
          });
        }, 1000);
        // close popup automatically after another 10s:
        $timeout(function() {
          $(elem).popover('hide');
        }, 11000);
      }
    }
  };

  function clientLanguage() {
    var rawLanguage = window.navigator.userLanguage || window.navigator.language;
    var hyphenIndex = rawLanguage.indexOf('-');
    if (hyphenIndex !== -1) {
      return rawLanguage.substring(0, hyphenIndex);
    } else {
      return rawLanguage;
    }
  }
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

app.config(function(){
  angular.element('body').removeClass('noscript');
});

app.run(function(){
  angular.element('[data-toggle="popover"]').popover({html:true});
});
