$('a').each(function() {
  const $a = $(this);
  if ($a[0].host !== window.location.host && !$a.attr('data-umami-event')) {
    $a.attr('data-umami-event', 'outbound-link-click');
    $a.attr('data-umami-event-url', $a.attr('href'));
  }
});

(function removeUTMParams() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  let modified = false;
  utmParams.forEach(param => {
    if (params.has(param)) {
      params.delete(param);
      modified = true;
    }
  });
  if (modified) {
    const newQuery = params.toString() ? '?' + params.toString() : '';
    const newUrl = url.pathname + newQuery + url.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
})();

function determineGlobalData(locale, globalData) {
  determineGitHubStargazersCount(locale, globalData);
  determineMastodonFollowersCount(locale, globalData);
}

function determineGitHubStargazersCount(locale, globalData) {
  $.getJSON(`${API_BASE_URL}/connect/social/github`, data => {
    globalData.githubStargazers = formatNumber(data.stargazers_count, locale);
  }).fail(() => {
    console.error('Error fetching repository data.');
  });
}

function determineMastodonFollowersCount(locale, globalData) {
  $.getJSON(`${API_BASE_URL}/connect/social/mastodon`, data => {
    globalData.mastodonFollowers = formatNumber(data.followers_count, locale);
  }).fail(() => {
    console.error('Error fetching Mastodon data.');
  });
}

function formatNumber(num, locale) {
  let formatted = num;
  if (num >= 1000 && num < 1000000) {
    formatted = (num / 1000).toFixed(1);
    formatted = formatted.endsWith('.0') ? formatted.slice(0, -2) + 'k' : formatted + 'k';
  } else if (num >= 1000000) {
    formatted = (num / 1000000).toFixed(1);
    formatted = formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
  }
  if (locale === 'de') {
    return formatted.replace('.', ',');
  } else {
    return formatted;
  }
}

class StartupPopupConfetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animationFrameId = null;
    this.confettiPieces = [];
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.confettiColors = ['#ef4444', '#dc2626', '#f97316', '#f59e0b', '#fde047', '#3b82f6', '#2563eb', '#60a5fa'];
    this.confettiCount = Math.min(Math.max(Math.floor(this.viewportWidth / 6), 80), 220);
    this.handleResize = this.resizeCanvas.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  createConfettiPiece(withinViewport) {
    return {
      x: this.randomBetween(0, this.viewportWidth),
      y: withinViewport ? this.randomBetween(-this.viewportHeight, this.viewportHeight) : this.randomBetween(-this.viewportHeight * 0.3, -20),
      size: this.randomBetween(6, 13),
      speedY: this.randomBetween(1.2, 3.6),
      drift: this.randomBetween(-1.2, 1.2),
      rotation: this.randomBetween(0, Math.PI * 2),
      rotationSpeed: this.randomBetween(-0.08, 0.08),
      color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
    };
  }

  resizeCanvas() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(this.viewportWidth * dpr);
    this.canvas.height = Math.floor(this.viewportHeight * dpr);
    this.canvas.style.width = `${this.viewportWidth}px`;
    this.canvas.style.height = `${this.viewportHeight}px`;
    if (this.context) {
      this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  renderFrame() {
    if (!this.context) {
      return;
    }
    this.context.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

    for (let i = 0; i < this.confettiPieces.length; i += 1) {
      const piece = this.confettiPieces[i];
      piece.y += piece.speedY;
      piece.x += piece.drift + Math.sin((piece.y + piece.rotation) * 0.01) * 0.7;
      piece.rotation += piece.rotationSpeed;

      if (piece.y > this.viewportHeight + 24 || piece.x < -24 || piece.x > this.viewportWidth + 24) {
        this.confettiPieces[i] = this.createConfettiPiece(false);
      }
    }

    for (const piece of this.confettiPieces) {
      this.context.save();
      this.context.translate(piece.x, piece.y);
      this.context.rotate(piece.rotation);
      this.context.fillStyle = piece.color;
      this.context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.6);
      this.context.restore();
    }

    this.animationFrameId = window.requestAnimationFrame(this.renderFrame);
  }

  start() {
    if (!this.context) {
      return;
    }
    this.resizeCanvas();
    this.confettiPieces = Array.from({ length: this.confettiCount }, () => this.createConfettiPiece(true));
    if (!this.prefersReducedMotion) {
      this.renderFrame();
    }
    window.addEventListener('resize', this.handleResize);
  }

  stop() {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

const STARTUP_POPUP_CONFIG = {
  enabled: true,
  showOnlyOnce: false,
  seenStorageKey: 'cryptomator-startup-popup-seen',
};

(function setupStartupPopup() {
  const popup = document.getElementById('startup-popup');
  if (!popup || !STARTUP_POPUP_CONFIG.enabled) {
    return;
  }

  if (STARTUP_POPUP_CONFIG.showOnlyOnce) {
    try {
      const hasSeenPopup = window.localStorage.getItem(STARTUP_POPUP_CONFIG.seenStorageKey) === 'true';
      if (hasSeenPopup) {
        return;
      }
      window.localStorage.setItem(STARTUP_POPUP_CONFIG.seenStorageKey, 'true');
    } catch {
      // localStorage can be unavailable in private browsing modes
    }
  }

  popup.classList.remove('hidden');
  popup.removeAttribute('aria-hidden');
  document.body.classList.add('popup-open');

  const closeButton = document.getElementById('startup-popup-close');
  const canvas = document.getElementById('startup-popup-confetti');
  const countdown = document.getElementById('startup-popup-countdown');

  if (countdown) {
    const targetTime = new Date(2026, 2, 9, 0, 0, 0, 0).getTime();
    let countdownIntervalId = null;
    const daysElement = countdown.querySelector('[data-unit="days"]');
    const hoursElement = countdown.querySelector('[data-unit="hours"]');
    const minutesElement = countdown.querySelector('[data-unit="minutes"]');
    const secondsElement = countdown.querySelector('[data-unit="seconds"]');

    function formatTime(value) {
      return String(value).padStart(2, '0');
    }

    function setCountdownValue(days, hours, minutes, seconds) {
      if (daysElement && hoursElement && minutesElement && secondsElement) {
        daysElement.textContent = formatTime(days);
        hoursElement.textContent = formatTime(hours);
        minutesElement.textContent = formatTime(minutes);
        secondsElement.textContent = formatTime(seconds);
        return;
      }

      countdown.textContent = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }

    function updateCountdown() {
      const remaining = targetTime - Date.now();
      if (remaining <= 0) {
        setCountdownValue(0, 0, 0, 0);
        if (countdownIntervalId) {
          window.clearInterval(countdownIntervalId);
        }
        return;
      }

      const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      setCountdownValue(days, hours, minutes, seconds);
    }

    updateCountdown();
    countdownIntervalId = window.setInterval(updateCountdown, 1000);
    popup.addEventListener('popup:close', () => {
      if (countdownIntervalId) {
        window.clearInterval(countdownIntervalId);
      }
    }, { once: true });
  }

  if (canvas) {
    const confetti = new StartupPopupConfetti(canvas);
    confetti.start();

    popup.addEventListener('popup:close', () => {
      confetti.stop();
    }, { once: true });
  }

  if (!closeButton) {
    return;
  }

  closeButton.addEventListener('click', () => {
    popup.classList.add('hidden');
    popup.setAttribute('aria-hidden', 'true');
    popup.dispatchEvent(new CustomEvent('popup:close'));
    document.body.classList.remove('popup-open');
  }, { once: true });
})();
