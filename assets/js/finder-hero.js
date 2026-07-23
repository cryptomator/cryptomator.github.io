/* Split-flap animation for the for-individuals finder hero: every element with
   a `finder-flap` class cycles between its data-locked and data-unlocked text
   like an airport departure board, while `.is-locked` on the `.finder-hero`
   root swaps the accompanying icons and flips the title-bar path panel (see
   finder-hero.css). */

class FinderFlap {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.raf = null;
  }

  setText(newText) {
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

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.finder-hero');
  if (!root) {
    return;
  }
  const flaps = Array.from(root.querySelectorAll('.finder-flap')).map((el) => ({ el, flap: new FinderFlap(el) }));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const providers = [
    { name: 'Google Drive', icon: 'fa-brands fa-google-drive' },
    { name: 'iCloud Drive', icon: 'fa-kit fa-icloud' },
    { name: 'OneDrive', icon: 'fa-kit fa-onedrive' },
    { name: 'Dropbox', icon: 'fa-brands fa-dropbox' },
  ];
  const providerName = root.querySelector('[data-finder-provider-name]');
  const providerIcon = root.querySelector('[data-finder-provider-icon]');
  let providerIndex = 0;
  let locked = true;
  setInterval(() => {
    locked = !locked;
    if (locked && providerName && providerIcon) {
      providerIndex = (providerIndex + 1) % providers.length;
      providerName.textContent = providers[providerIndex].name;
      providerIcon.className = providers[providerIndex].icon + ' finder-when-locked';
    }
    root.classList.toggle('is-locked', locked);
    flaps.forEach(({ el, flap }, index) => {
      const text = locked ? el.dataset.locked : el.dataset.unlocked;
      if (reducedMotion) {
        el.textContent = text;
      } else {
        setTimeout(() => flap.setText(text), index * 140);
      }
    });
  }, 5000);
});
