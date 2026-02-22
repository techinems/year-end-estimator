// Client-side logic for Year-end Estimator

(function () {
  const YEAR_HOURS = 365 * 24 + 0; // will adjust for leap year dynamically

  const $ = id => document.getElementById(id);
  const countedEl = $('counted');
  const asOfEl = $('as-of');
  const estimateBtn = $('estimate');
  const clearBtn = $('clear');
  const themeSelect = $('theme-select');
  const resultsSection = $('results');
  const elapsedHoursEl = $('elapsed-hours');
  const rateEl = $('rate');
  const estimateValueEl = $('estimate-value');

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function hoursInYear(year) {
    return (isLeapYear(year) ? 366 : 365) * 24;
  }

  function hoursElapsedThisYear(now) {
    const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const diffMs = now - start;
    return diffMs / (1000 * 60 * 60);
  }

  function formatNumber(n) {
    if (Number.isFinite(n)) return n.toLocaleString(undefined, {maximumFractionDigits:2});
    return '-';
  }

  // Theme handling
  const THEME_KEY = 'year_estimator_theme';

  function applyTheme(pref) {
    const root = document.documentElement;
    if (pref === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', pref);
    }
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'system';
    themeSelect.value = saved;
    applyTheme(saved);
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      const v = themeSelect.value;
      localStorage.setItem(THEME_KEY, v);
      applyTheme(v);
    });

    // Initialize theme on load
    loadTheme();
  }

  function computeEstimate() {
    const counted = parseFloat(countedEl.value);
    if (!Number.isFinite(counted) || counted < 0) {
      alert('Please enter a non-negative counted number.');
      return;
    }

    const now = asOfEl.value ? new Date(asOfEl.value) : new Date();
    if (isNaN(now)) {
      alert('Invalid date in "As of" field.');
      return;
    }

    const elapsedHours = hoursElapsedThisYear(now);
    if (elapsedHours <= 0) {
      alert('Elapsed hours is zero or negative; cannot compute rate.');
      return;
    }

    const totalHours = hoursInYear(now.getFullYear());
    const rate = counted / elapsedHours;
    const estimate = rate * totalHours;

    elapsedHoursEl.textContent = formatNumber(elapsedHours);
    rateEl.textContent = formatNumber(rate);
    // Round estimated total to nearest integer for display
    const estimateRounded = Math.round(estimate);
    estimateValueEl.textContent = estimateRounded.toLocaleString();
    if (resultsSection) resultsSection.removeAttribute('hidden');
  }

  estimateBtn.addEventListener('click', computeEstimate);
  clearBtn.addEventListener('click', () => {
    countedEl.value = '';
    asOfEl.value = '';
    if (resultsSection) resultsSection.setAttribute('hidden', '');
  });

})();
