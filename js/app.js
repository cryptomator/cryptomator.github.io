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

app.run(['$rootScope', '$cookies', function($rootScope, $cookies) {

  $rootScope.isOSWindows = navigator.appVersion.indexOf('Win') !== -1;
  $rootScope.isOSMac = navigator.appVersion.indexOf('Mac') !== -1 && navigator.appVersion.indexOf('iPhone') === -1;
  $rootScope.isOSLinux = (navigator.appVersion.indexOf('Linux') !== -1 || navigator.appVersion.indexOf('X11') !== -1) && navigator.appVersion.indexOf('Android') === -1;
  $rootScope.isOSiOS = navigator.appVersion.indexOf('iPhone') !== -1;
  $rootScope.isOSAndroid = navigator.appVersion.indexOf('Android') !== -1;

  $rootScope.currencies = {
    EUR: {code: 'EUR', symbol: '€', glyphicon: 'glyphicon-eur'},
    USD: {code: 'USD', symbol: '$', glyphicon: 'glyphicon-usd'},
    GBP: {code: 'GBP', symbol: '£', glyphicon: 'glyphicon-gbp'}
  };
  $rootScope.donation = {
    amount: 25,
    currency: $rootScope.currencies.EUR,
    frequency: 'once'
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

app.factory('scriptLoader', ['$window', function($window){
  return {
    load: function(url, callback) {
      var script = $window.document.createElement('script');
      script.src = url;
      script.type = "text/javascript";
      script.onload = callback;
      $window.document.body.appendChild(script);
    }
  };
}]);

app.factory('recaptchaLoader', ['$window', 'scriptLoader', function($window, scriptLoader) {
  var recaptcha = null;
  return {
    load: function(callback) {
      if (recaptcha) {
        callback(recaptcha);
      } else {
        $window.grecaptchaCallback = function() {
          recaptcha = $window.grecaptcha;
          callback(recaptcha);
        };
        scriptLoader.load("https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&render=explicit");
      }
    }
  };
}]);

// <google-recaptcha widget-id="widgetId" on-finished="callback(responseToken)" response-token="token" />
app.directive('googleRecaptcha', ['recaptchaLoader', function(recaptchaLoader) {
  return {
    restrict: 'E',
    scope: {
      widgetId: '=',
      onFinished: '&',
      responseToken: '='
    },
    link: function(scope, element, attrs) {
      var captchaWrapper = document.createElement('div');
      captchaWrapper.classList.add('captcha-wrapper');
      var captchaLoadBtn = document.createElement('button');
      captchaLoadBtn.classList.add('btn');
      captchaLoadBtn.classList.add('btn-default');
      captchaLoadBtn.textContent = 'Load reCAPTCHA';
      
      captchaWrapper.append(captchaLoadBtn);
      element.append(captchaWrapper);
      
      var recaptchaCallback = function(result) {
        scope.$apply(function() {
          scope.responseToken = result;
        });
        console.log('recaptchaCallback', result, scope.onFinished);
        scope.onFinished(result);
      };
      
      captchaLoadBtn.onclick = function() {
        recaptchaLoader.load(function(recaptcha) {
          captchaLoadBtn.remove();
          var widgetId = recaptcha.render(captchaWrapper, {
            'sitekey': '6LfbD3sUAAAAAMEH2DZWFtyDOS5TXB38fj85coqv',
            'data-size': 'compact',
            'callback' : recaptchaCallback
          });
          scope.$apply(function() {
            scope.widgetId = widgetId;
          });
        });
      };
    }
  };
}]);

app.factory('stripeLoader', ['$window', 'scriptLoader', function($window, scriptLoader) {
  var stripe = null;
  return {
    load: function(callback) {
      if (stripe) {
        callback(stripe);
      } else {
        scriptLoader.load("https://js.stripe.com/v3/", function() {
          stripe = $window.Stripe('pk_live_eSasX216vGvC26GdbVwA011V');
          callback(stripe);
        });
      }
    }
  };
}]);

// <stripe-credit-card-field loaded="creditCardLoaded()" loading-text="Stripe is loading..." valid="creditCardValid" validation-error="creditCardValidationError"/>
app.directive('stripeCreditCardField', ['stripeLoader', function(stripeLoader) {
  return {
    restrict: 'E',
    scope: {
      loaded: '&',
      loadingText: '@',
      valid: '=',
      validationError: '='
    },
    link: function(scope, element, attrs) {
      var cardElement = document.createElement('div');
      cardElement.style.display = 'none';
      var placeholder = document.createElement('input');
      placeholder.setAttribute('type', 'text');
      placeholder.classList.add('form-control');

      element.append(placeholder);
      element.append(cardElement);

      placeholder.onfocus = function() {
        placeholder.setAttribute('disabled', 'disabled');
        placeholder.setAttribute('placeholder', scope.loadingText);
        stripeLoader.load(function(stripe) {
          var elements = stripe.elements();
          var card = elements.create('card');
          card.mount(cardElement);
          card.on('ready', function() {
            placeholder.remove();
            cardElement.style.display = 'block';
            card.focus();
            scope.loaded({stripe: stripe, card: card});
          });
          card.addEventListener('change', function(event) {
            scope.$apply(function() {
              scope.valid = event.complete;
              if (event.error) {
                scope.validationError = event.error.message;
              } else {
                scope.validationError = '';
              }
            });
          });
        });
      };
    }
  };
}]);

app.controller('CallToActionCtrl', ['$scope', '$window', function($scope, $window) {

  $scope.donationContinuePressed = function(amount) {
    if (amount == 0) {
      angular.element('#please-donate-modal').modal('show');
    }
  };

  $scope.donateNowPressed = function() {
    $scope.donation.amount = 15;
    angular.element('#please-donate-modal').modal('hide');
    angular.element('#payment-modal').modal('show');
  };

  $scope.gotoDownloads = function(shouldGoToDownloads) {
    if (shouldGoToDownloads) {
      $window.location.href = '/downloads/';
    }
  };

}]);

app.controller('PaymentCtrl', ['$scope', '$window', '$http', 'paypal', 'stripeLoader', 'recaptchaLoader', function($scope, $window, $http, paypal, stripeLoader, recaptchaLoader) {

  function showModalIfSuggestedByUrl() {
    if ($window.location.hash == '#donate') {
      angular.element('#payment-modal').modal('show');
    }
  }

  $scope.paymentType = 'paypal';
  
  $scope.captcha = {};
  $scope.captcha.widgetId = null;
  $scope.captcha.token = null;
  $scope.captcha.finished = function(token) {
    // todo: not yet invoked...
    console.log('captcha responseToken: ', token);
  };

  $scope.paypal = {};
  $scope.paypal.pay = function(locale) {
    $scope.paypal.paymentError = null;
    $scope.paypal.paymentInProgress = true;
    paypal.preparePayment($scope.donation.currency.code, $scope.donation.amount, $scope.donation.message, locale)
    .then(function(approvalLink) {
      $window.location.href = approvalLink;
    }, function(errorResponse) {
      console.warn('Payment failed.', errorResponse.data);
      $scope.paypal.paymentError = 'Payment failed.';
      $scope.paypal.paymentInProgress = false;
    });
  };

  $scope.creditCard = {};
  $scope.creditCard.isValid = function() {
    return $scope.creditCard.creditCardValid && ($scope.donation.frequency == 'once' || $scope.creditCard.name && $scope.creditCard.email);
  };
  $scope.creditCard.loaded = function(stripe, card) {
    $scope.creditCard.pay = function() {
      $scope.creditCard.paymentError = null;
      $scope.creditCard.paymentInProgress = true;
      stripe.createPaymentMethod('card', card).then(function(result) {
        if (result.error) {
          $scope.$apply(function() {
            $scope.creditCard.paymentError = result.error.message;
            $scope.creditCard.paymentInProgress = false;
          });
        } else {
          $http.post('https://api.cryptomator.org/stripe/charge_creditcard.php', $.param({
            payment_method_id: result.paymentMethod.id,
            currency: $scope.donation.currency.code,
            amount: $scope.donation.amount,
            frequency: $scope.donation.frequency,
            name: $scope.creditCard.name,
            email: $scope.creditCard.email,
            message: $scope.donation.message,
            captcha: $scope.captcha.token
          }), {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(successResponse) {
            if (successResponse.data.status == 'ok') {
              $scope.creditCard.paymentError = null;
              $scope.creditCard.paymentSuccessful = true;
              $scope.creditCard.paymentInProgress = false;
            } else if (successResponse.data.status == 'requires_action' && successResponse.data.confirmation_method == 'manual') {
              stripe.handleCardAction(successResponse.data.payment_intent_client_secret).then(function(result) {
                if (result.error) {
                  $scope.$apply(function() {
                    $scope.creditCard.paymentError = result.error.message;
                    $scope.creditCard.paymentInProgress = false;
                  });
                } else {
                  $http.post('https://api.cryptomator.org/stripe/charge_creditcard.php', $.param({
                    payment_intent_id: result.paymentIntent.id,
                    message: $scope.donation.message
                  }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                  }).then(function(successResponse) {
                    if (successResponse.data.status == 'ok') {
                      $scope.creditCard.paymentError = null;
                      $scope.creditCard.paymentSuccessful = true;
                    } else {
                      $scope.creditCard.paymentError = successResponse.data.error;
                    }
                    $scope.creditCard.paymentInProgress = false;
                  });
                }
              });
            } else if (successResponse.data.status == 'requires_action' && successResponse.data.confirmation_method == 'automatic') {
              stripe.handleCardPayment(successResponse.data.payment_intent_client_secret, { payment_method: successResponse.data.payment_method }).then(function(result) {
                if (result.error) {
                  $scope.$apply(function() {
                    $scope.creditCard.paymentError = result.error.message;
                    $scope.creditCard.paymentInProgress = false;
                  });
                } else {
                  $http.post('https://api.cryptomator.org/stripe/charge_creditcard.php', $.param({
                    payment_intent_id: result.paymentIntent.id,
                    message: $scope.donation.message
                  }), {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                  }).then(function(successResponse) {
                    if (successResponse.data.status == 'ok') {
                      $scope.creditCard.paymentError = null;
                      $scope.creditCard.paymentSuccessful = true;
                    } else {
                      $scope.creditCard.paymentError = successResponse.data.error;
                    }
                    $scope.creditCard.paymentInProgress = false;
                  });
                }
              });
            } else {
              $scope.creditCard.paymentError = successResponse.data.error;
              $scope.creditCard.paymentInProgress = false;
            }
          }, function(errorResponse) {
            console.warn('Payment failed.', errorResponse.data);
            $scope.creditCard.paymentError = 'Payment failed.';
            $scope.creditCard.paymentInProgress = false;
          });
          recaptchaLoader.load(function(recaptcha) {
            $scope.captcha.token = null;
            recaptcha.reset($scope.captcha.widgetId);
          });
        }
      });
    };
  };

  $scope.crypto = {};
  $scope.crypto.pay = function(locale) {
    $scope.crypto.paymentInProgress = true;
    $window.location.href = 'https://www.coinpayments.net/index.php?cmd=_pay&reset=1&merchant=963d3aa90995dc5542113e7801e31e2a&currency=' + $scope.donation.currency.code + '&amountf=' + $scope.donation.amount + '&item_name=Cryptomator+Donation&want_shipping=0&success_url=https%3A%2F%2Fcryptomator.org%2Fdownloads%2F%3Fpayment%3Dsuccess&allow_extra=1&lang=' + locale;
  };

  $scope.isAcceptableAmount = function(amount) {
    return _.isNumber(amount) && amount >= 1;
  };

  showModalIfSuggestedByUrl();

}]);

app.controller('CancelRecurringDonationCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.cancelRecurringDonationSuccessful = false;
  $scope.cancelRecurringDonationInProgress = false;

  $scope.recurringDonation = {};
  $scope.cancelRecurringDonation = function() {
    $scope.cancelRecurringDonationInProgress = true;
    $http.post('https://api.cryptomator.org/stripe/find_subscription.php', $.param({
      email: $scope.recurringDonation.email
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(successPostResponse) {
      $scope.cancelRecurringDonationSuccessful = true;
      $scope.cancelRecurringDonationError = null;
      $scope.cancelRecurringDonationInProgress = false;
    }, function(errorPostResponse) {
      console.warn('Recurring donation cancellation request failed.', errorPostResponse.data);
      $scope.cancelRecurringDonationError = 'Unable to request cancellation of recurring donation.';
      $scope.cancelRecurringDonationInProgress = false;
    });
  };

}]);

app.controller('NewsletterCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.subscribeSuccessful = false;
  $scope.subscribeInProgress = false;

  $scope.subscribe = function() {
    $scope.subscribeInProgress = true;
    $http.get('https://api.cryptomator.org/mailtrain/subscribe.php')
    .then(function(successGetResponse) {
      $http.post('https://api.cryptomator.org/mailtrain/subscribe.php', $.param({
        listid: 'ryCzTHl2',
        email: $scope.email
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

app.directive('delayedIframeSrc', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      var trigger = angular.element(element[0].querySelector('.delayed-iframe-trigger'));
      var delayed = angular.element(element[0].querySelector('.delayed-iframe-delayed'));
      var iframe = element.find('iframe');

      trigger.css("cursor","pointer");
      delayed.css("display", "none");
      trigger.on('click', function(event) {
        trigger.css("display", "none");
        iframe.attr("src", attr.delayedIframeSrc);
        delayed.css("display", "");
      });
    }
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
      $scope.showDownloadNav(false, $window.location.hash.split('#')[1]);
    } else {
      $scope.showDownloadNav(false);
    }
  };

  $scope.knownDownloadNav = ['winDownload', 'macDownload', 'linuxDownload', 'androidDownload', 'iosDownload', 'jarDownload'];
  $scope.knownUrlHashes = ['#allVersions'];
  $scope.showDownloadNav = function(forceUpdateUrl, nav) {
    if (_.includes($scope.knownDownloadNav, nav)) {
      // no-op
    } else if ($scope.isOSWindows) {
      nav = 'winDownload';
    } else if ($scope.isOSMac) {
      nav = 'macDownload';
    } else if ($scope.isOSLinux) {
      nav = 'linuxDownload';
    } else if ($scope.isOSAndroid) {
      nav = 'androidDownload';
    } else if ($scope.isOSiOS) {
      nav = 'iosDownload';
    } else {
      nav = 'jarDownload';
    }
    if (forceUpdateUrl || !_.includes($scope.knownUrlHashes, $window.location.hash)) {
      $window.location.hash = nav;
    }
    $scope.downloadNav = nav;
  };

  $scope.showOldBetaReleases = false;

  showModalIfSuggestedByUrl();

}]);

app.factory('paddleLoader', ['$window', 'scriptLoader', function($window, scriptLoader) {
  var paddle = null;
  return {
    load: function(callback) {
      if (paddle) {
        callback(paddle);
      } else {
        scriptLoader.load("https://cdn.paddle.com/paddle/paddle.js", function() {
          paddle = $window.Paddle;
          paddle.Setup({ vendor: 39223 });
          callback(paddle);
        });
      }
    }
  };
}]);

app.controller('StoreCtrl', ['$scope', '$window', '$http', 'paddleLoader', function($scope, $window, $http, paddleLoader) {

  $scope.desktopLicense = {
    amount: 15,
    currency: $scope.currencies.EUR
  };
  $scope.desktopLicense.isAcceptableAmount = function(amount) {
    return _.isNumber(amount) && amount >= 15;
  };
  $scope.desktopLicense.checkout = function() {
    $scope.desktopLicense.checkoutError = null;
    $scope.desktopLicense.checkoutInProgress = true;
    $http.post('https://store.cryptomator.org/paddle/desktop/generate-pay-link.php', $.param({
      currency: $scope.desktopLicense.currency.code,
      amount: $scope.desktopLicense.amount
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(successResponse) {
      paddleLoader.load(function(paddle) {
        paddle.Checkout.open({
          override: successResponse.data.pay_link,
          email: $scope.desktopLicense.email,
          allowQuantity: false,
          successCallback: function(data) {
            paddle.Order.details(data.checkout.id, function(data) {
              $scope.$apply(function() {
                $scope.desktopLicense.checkoutInProgress = false;
                $scope.desktopLicense.checkoutSuccessful = true;
                if (data.lockers[0].license_code) {
                  $scope.desktopLicense.key = data.lockers[0].license_code;
                }
              });
            });
          },
          closeCallback: function(data) {
            $scope.$apply(function() {
              $scope.desktopLicense.checkoutInProgress = false;
            });
          }
        });
      });
    }, function(errorResponse) {
      console.warn('Generating pay link failed.', errorResponse.data);
      if (errorResponse.data.message) {
        $scope.desktopLicense.checkoutError = errorResponse.data.message;
      } else {
        $scope.desktopLicense.checkoutError = 'Checkout failed.';
      }
      $scope.desktopLicense.checkoutInProgress = false;
    });
  };

  $scope.androidLicense = {
    productId: 578277
  };
  $scope.androidLicense.loadPrice = function() {
    paddleLoader.load(function(paddle) {
      paddle.Product.Prices($scope.androidLicense.productId, 1, function(prices) {
        $scope.$apply(function() {
          $scope.androidLicense.price = prices.price.gross;
        });
      });
    });
  };
  $scope.androidLicense.checkout = function() {
    $scope.androidLicense.checkoutError = null;
    $scope.androidLicense.checkoutInProgress = true;
    paddleLoader.load(function(paddle) {
      paddle.Checkout.open({
        product: $scope.androidLicense.productId,
        email: $scope.androidLicense.email,
        allowQuantity: false,
        successCallback: function(data) {
          paddle.Order.details(data.checkout.id, function(data) {
            $scope.$apply(function() {
              $scope.androidLicense.checkoutInProgress = false;
              $scope.androidLicense.checkoutSuccessful = true;
              if (data.lockers[0].license_code) {
                $scope.androidLicense.key = data.lockers[0].license_code;
              }
            });
          });
        },
        closeCallback: function(data) {
          $scope.$apply(function() {
            $scope.androidLicense.checkoutInProgress = false;
          });
        }
      });
    });
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

  var blacklistedContributors = ['overheadhunter', 'markuskreusch', 'tobihagemann', 'marcjulian', 'SailReal', 'infeo', 'gitter-badger'];

  $scope.contributors = [];

  $http.jsonp('https://api.github.com/repos/cryptomator/cryptomator/contributors?callback=JSON_CALLBACK')
  .then(function(successResponse) {
    if (_.isObject(successResponse.data) && _.isArray(successResponse.data.data)) {
      $scope.contributors = _.reject(successResponse.data.data, function(c) { return _.includes(blacklistedContributors, c.login); });
    } else {
      $scope.contributors = [];
    }
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
