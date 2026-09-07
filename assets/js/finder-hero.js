"use strict";

/* One interval drives both halves of the effect: the per-element split-flap
   text here, and the `.is-locked` icon and panel swap done in CSS. */

class FinderFlap {
  constructor(el) {
    this.el = el;
    this.lockedText = el.dataset.locked;
    this.unlockedText = el.dataset.unlocked;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.raf = null;
  }

  show(locked) {
    const newText = locked ? this.lockedText : this.unlockedText;
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(i * 0.8);
      const end = start + 8 + Math.floor(Math.random() * 8);
      this.queue.push({ from, to, start, end, char: null });
    }
    cancelAnimationFrame(this.raf);
    this.frame = 0;
    this.update();
  }

  update() {
    let output = '';
    let complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.35) {
          item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += item.char;
      } else {
        output += item.from;
      }
    }
    this.el.textContent = output;
    if (complete < this.queue.length) {
      this.frame++;
      this.raf = requestAnimationFrame(() => this.update());
    }
  }
}

function initFinderHero() {
  const root = document.querySelector('.finder-hero');
  if (!root) {
    return;
  }
  const flapElements = root.querySelectorAll('.finder-flap');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('is-locked');
    flapElements.forEach((el) => {
      el.textContent = el.dataset.unlocked;
    });
    return;
  }
  const flaps = Array.from(flapElements, (el) => new FinderFlap(el));
  const providers = [
    { name: 'Google Drive', src: '/img/clouds/google-drive.svg' },
    { name: 'iCloud Drive', src: '/img/clouds/icloud.svg' },
    { name: 'OneDrive', src: '/img/clouds/onedrive.svg' },
    { name: 'Dropbox', src: '/img/clouds/dropbox.svg' },
  ];
  const providerName = root.querySelector('[data-finder-provider-name]');
  const providerIcon = root.querySelector('[data-finder-provider-icon]');
  let providerIndex = 0;
  let locked = true;
  setInterval(() => {
    locked = !locked;
    if (locked) {
      providerIndex = (providerIndex + 1) % providers.length;
      providerName.textContent = providers[providerIndex].name;
      providerIcon.src = providers[providerIndex].src;
    }
    root.classList.toggle('is-locked', locked);
    flaps.forEach((flap, index) => {
      setTimeout(() => flap.show(locked), index * 140);
    });
  }, 5000);
}

initFinderHero();
