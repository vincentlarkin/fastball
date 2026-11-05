/*
 * Fastball helpers: plain words, human time, popups that fit, hidden knobs.
 * No dependencies. Exposes window.Fastball (and module.exports for tests).
 */
(function (root) {
  'use strict';

  // Words that should stay upper case after plainCase(). Extend per project.
  const KEEP_UPPER = new Set(['EMS', 'ATM', 'ATV', 'DWI', 'DUI', 'US', 'I', 'II', 'III', 'IV',
    'N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW', 'TV', 'ID', 'USA']);

  /** "MEDICAL EMERGENCY" -> "Medical Emergency"; keeps known acronyms. */
  function plainCase(text, keepUpper = KEEP_UPPER) {
    return String(text ?? '').replace(/[A-Za-z][A-Za-z']*/g, (word) => {
      const upper = word.toUpperCase();
      if (keepUpper.has(upper)) return upper;
      return upper.charAt(0) + upper.slice(1).toLowerCase();
    });
  }

  function dayKey(date, timeZone) {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }

  /**
   * Human time: { short: "8:32 PM" | "Yesterday 11:50 PM" | "Nov 3, 8:32 PM",
   *               long:  "Today at 8:32 PM" | "Yesterday at 11:50 PM" | "Nov 3 at 8:32 PM" }
   */
  function friendlyTime(value, { now = new Date(), timeZone, locale = 'en-US' } = {}) {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return { short: '', long: '' };
    const clock = date.toLocaleTimeString(locale, { timeZone, hour: 'numeric', minute: '2-digit' });
    const key = dayKey(date, timeZone);
    if (key === dayKey(now, timeZone)) return { short: clock, long: `Today at ${clock}` };
    if (key === dayKey(new Date(now.getTime() - 86400000), timeZone)) {
      return { short: `Yesterday ${clock}`, long: `Yesterday at ${clock}` };
    }
    const sameYear = key.slice(0, 4) === dayKey(now, timeZone).slice(0, 4);
    const day = date.toLocaleDateString(locale, { timeZone, month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) });
    return { short: `${day}, ${clock}`, long: `${day} at ${clock}` };
  }

  /** 0.04 -> "Under 0.1 mi", 2.34 -> "2.3 mi", 12.6 -> "13 mi" */
  function miles(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    if (n < 0.1) return 'Under 0.1 mi';
    return `${n < 10 ? n.toFixed(1) : Math.round(n)} mi`;
  }

  /** Straight-line distance in miles between two [lat, lon] points. */
  function distanceMiles([lat1, lon1], [lat2, lon2]) {
    const rad = (v) => (Number(v) * Math.PI) / 180;
    const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
    return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /** "1 call" / "326 calls" */
  function count(n, one, many = `${one}s`) {
    return `${n} ${n === 1 ? one : many}`;
  }

  // ---------- Dialog: open/close, Escape, backdrop, focus return ----------

  function dialog(el) {
    let returnFocus = null;
    const close = () => {
      if (!el.hasAttribute('data-open')) return;
      el.removeAttribute('data-open');
      el.setAttribute('aria-hidden', 'true');
      document.removeEventListener('keydown', onKey);
      returnFocus?.focus?.();
    };
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    const open = () => {
      returnFocus = document.activeElement;
      el.setAttribute('data-open', '');
      el.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKey);
      el.querySelector('[data-fb-autofocus], .fb-dialog__actions .fb-btn--primary')?.focus();
    };
    el.addEventListener('click', (event) => {
      if (event.target.closest('.fb-dialog__backdrop, [data-fb-close]')) close();
    });
    return { open, close, get isOpen() { return el.hasAttribute('data-open'); } };
  }

  // ---------- Sheet: same idea, no backdrop (the page stays usable) ----------

  function sheet(el, { onOpen, onClose } = {}) {
    const close = () => {
      if (!el.hasAttribute('data-open')) return;
      el.removeAttribute('data-open');
      el.setAttribute('aria-hidden', 'true');
      onClose?.();
    };
    const open = () => {
      el.setAttribute('data-open', '');
      el.setAttribute('aria-hidden', 'false');
      onOpen?.();
    };
    el.addEventListener('click', (event) => { if (event.target.closest('[data-fb-close]')) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    return { open, close, toggle: () => (el.hasAttribute('data-open') ? close() : open()),
      get isOpen() { return el.hasAttribute('data-open'); } };
  }

  // ---------- Hidden knobs: one button that says when something is on ----------

  function knobs(button, panel, isOn = () => false, { label = 'Filter' } = {}) {
    const sync = () => {
      const on = Boolean(isOn());
      button.classList.toggle('fb-btn--on', on);
      button.textContent = on ? `${label} (on)` : label;
    };
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const open = !panel.hasAttribute('data-open');
      panel.toggleAttribute('data-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', () => setTimeout(sync, 0));
    panel.addEventListener('change', sync);
    sync();
    return { sync };
  }

  // ---------- Choices: a pressed-state button group (1 mi / 3 mi / 5 mi) ----------

  function choices(group, onChange) {
    const buttons = Array.from(group.querySelectorAll('button[data-value]'));
    const select = (value) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === String(value))));
    };
    group.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-value]');
      if (!button) return;
      select(button.dataset.value);
      onChange?.(button.dataset.value);
    });
    return { select };
  }

  const Fastball = { plainCase, friendlyTime, miles, distanceMiles, count, dialog, sheet, knobs, choices, KEEP_UPPER };
  if (typeof module === 'object' && module.exports) module.exports = Fastball;
  root.Fastball = Fastball;
})(typeof window !== 'undefined' ? window : globalThis);
