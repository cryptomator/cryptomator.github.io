/**
 * To whom it may concern: DO NOT use $location or $anchorScroll, or else all "normal" html anchors get kidnapped.
 * We use normal $window.location.hash in many places.
 */

var app = angular.module('cryptomator', ['ngCookies']);

function parseQueryString(queryStr) {
  // Remove the '?' at the start of the string and split out each assignment
  return _.chain(queryStr.slice(1).split('&'))
    // Split each array item into [key, value]; ignore empty string if search is empty
    .map(function(item) {
      if (item) {
        return item.split('=');
      }
    })
    // Remove undefined in the case the search is empty
    .compact()
    // Turn [key, value] arrays into object parameters
    .fromPairs()
    // Return the value of the chain operation
    .value();
}

app.config(['$interpolateProvider', '$httpProvider', function($interpolateProvider, $httpProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
  $httpProvider.defaults.withCredentials = true;
}]);

app.run(['$rootScope', '$cookies', 'googleAnalytics', function($rootScope, $cookies, googleAnalytics) {

  $rootScope.isOSWindows = navigator.appVersion.indexOf('Win') !== -1;
  $rootScope.isOSMac = navigator.appVersion.indexOf('Mac') !== -1 && navigator.appVersion.indexOf('iPhone') === -1;
  $rootScope.isOSLinux = (navigator.appVersion.indexOf('Linux') !== -1 || navigator.appVersion.indexOf('X11') !== -1) && navigator.appVersion.indexOf('Android') === -1;
  $rootScope.isOSiOS = navigator.appVersion.indexOf('iPhone') !== -1;
  $rootScope.isOSAndroid = navigator.appVersion.indexOf('Android') !== -1;

  $rootScope.donation = {
    amount: 25,
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

  $rootScope.disableGaIssued = !_.isEmpty($cookies.get('disableGa'));

  $rootScope.disableGa = function() {
    googleAnalytics.disable();
    $rootScope.disableGaIssued = true;
  };

}]);

app.factory('paypal', ['$q', '$http', function($q, $http) {
  return {
    preparePayment: function(currency, total, message, locale) {
      var deferred = $q.defer();
      $http.post('https://api.cryptomator.org/paypal/preparePayment.php', $.param({
        currency: currency,
        total: total,
        message: message,
        locale: locale
      }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(successResponse) {
        var approvalLink = _.find(successResponse.data.links, {'rel': 'approval_url'}).href;
        deferred.resolve(approvalLink);
      }, function(errorResponse) {
        deferred.reject(errorResponse.data);
      });
      return deferred.promise;
    }
  };
}]);

app.factory('stripe', ['$window', function($window) {
  var Stripe = $window.Stripe;
  Stripe.setPublishableKey('pk_live_eSasX216vGvC26GdbVwA011V');

  return {
    card: Stripe.card
  };
}]);

app.factory('googleAnalytics', ['$window', '$cookies', function($window, $cookies) {

  window['ga-disable-UA-57664706-1'] = !_.isEmpty($cookies.get('disableGa'));

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
    },

    disable: function() {
      var expireDate = new Date();
      expireDate.setFullYear(expireDate.getFullYear() + 1);
      $cookies.put('disableGa', 'issued_' + new Date().toISOString(), {expires: expireDate});
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

app.controller('PaymentCtrl', ['$scope', '$window', '$http', 'paypal', 'stripe', function($scope, $window, $http, paypal, stripe) {

  function showModalIfSuggestedByUrl() {
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

  $scope.payWithPaypal = function(locale) {
    $scope.paymentInProgress = true;
    paypal.preparePayment($scope.donation.currency.code, $scope.donation.amount, $scope.donation.message, locale)
    .then(function(approvalLink) {
      $window.location.href = approvalLink;
    }, function(errorResponse) {
      console.warn('Payment failed.', errorResponse);
      $scope.paymentError = 'Payment failed.';
      $scope.paymentInProgress = false;
    });
  };

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
        $http.post('https://api.cryptomator.org/stripe/pay.php', $.param({
          stripeToken: response.id,
          currency: $scope.donation.currency.code,
          amount: $scope.donation.amount,
          message: $scope.donation.message
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

  showModalIfSuggestedByUrl();

}]);

app.controller('NewsletterCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.subscribeSuccessful = false;
  $scope.subscribeInProgress = false;

  $scope.subscribe = function() {
    $scope.subscribeInProgress = true;
    $http.get('https://api.cryptomator.org/mailtrain/subscribe.php')
    .then(function(successGetResponse) {
      $http.post('https://api.cryptomator.org/mailtrain/subscribe.php', $.param({
        email: $scope.email,
        android: $scope.android
      }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(successPostResponse) {
        $scope.subscribeSuccessful = true;
        $scope.subscribeError = null;
        $scope.subscribeInProgress = false;
      }, function(errorPostResponse) {
        console.warn('Newsletter subscription failed.', errorPostResponse.data);
        $scope.subscribeError = 'Unable to subscribe to newsletter.';
        $scope.subscribeInProgress = false;
      });
    }, function(errorGetResponse) {
      console.warn('Newsletter subscription failed.', errorGetResponse.data);
      $scope.subscribeError = 'Unable to subscribe to newsletter.';
      $scope.subscribeInProgress = false;
    });
  };

}]);

app.controller('DownloadCtrl', ['$scope', '$window', function($scope, $window) {

  function showModalIfSuggestedByUrl() {
    var queryParams = parseQueryString($window.location.search);
    if (_.has(queryParams, 'payment')) {
      if (queryParams.payment == 'success') {
        angular.element('#payment-success-modal').modal('show');
      } else if (queryParams.payment == 'error') {
        angular.element('#payment-failed-modal').modal('show');
      }
    }
  }

  $scope.initialized = false;

  $scope.init = function() {
    $scope.initialized = true;
    if (!_.isEmpty($window.location.hash)) {
      // no-op
    } else if ($scope.isOSWindows) {
      $window.location.hash = 'winDownload';
    } else if ($scope.isOSMac) {
      $window.location.hash = 'macDownload';
    } else if ($scope.isOSLinux) {
      $window.location.hash = 'linuxDownload';
    } else {
      $window.location.hash = 'jarDownload';
    }
  };

  $scope.showOldBetaReleases = false;

  showModalIfSuggestedByUrl();

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

  var blacklistedContributors = ['overheadhunter', 'markuskreusch', 'tobihagemann', 'marcjulian', 'SailReal', 'infeo', 'gitter-badger'];

  $scope.contributors = [];

  $http.jsonp('https://api.github.com/repos/cryptomator/cryptomator/contributors?callback=JSON_CALLBACK')
  .then(function(successResponse) {
    if (_.isObject(successResponse.data) && _.isArray(successResponse.data.data)) {
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
