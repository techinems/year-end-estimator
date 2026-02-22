// Client-side logic for Year-end Estimator

(function () {
  const $ = id => document.getElementById(id);

  const countedEl = $('counted');
  const asOfEl = $('as-of');
  const estimateBtn = $('estimate');
  const clearBtn = $('clear');
  const themeLightBtn = $('theme-light');
  const themeDarkBtn = $('theme-dark');
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
    if (pref === 'system' || !pref) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', pref);
    }
  }

  function highlightButton(pref) {
    if (themeLightBtn) {
      const on = pref === 'light';
      themeLightBtn.classList.toggle('active', on);
      themeLightBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (themeDarkBtn) {
      const on = pref === 'dark';
      themeDarkBtn.classList.toggle('active', on);
      themeDarkBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
      highlightButton(saved);
    } else {
      // default to system (no attribute)
      applyTheme('system');
      // set active button according to current system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      highlightButton(prefersDark ? 'dark' : 'light');
    }
  }

  if (themeLightBtn) {
    themeLightBtn.addEventListener('click', () => {
      localStorage.setItem(THEME_KEY, 'light');
      applyTheme('light');
      highlightButton('light');
    });
  }

  if (themeDarkBtn) {
    themeDarkBtn.addEventListener('click', () => {
      localStorage.setItem(THEME_KEY, 'dark');
      applyTheme('dark');
      highlightButton('dark');
    });
  }

  // Initialize theme on load
  loadTheme();

  function computeEstimate() {
    if (!countedEl) return;
    const counted = parseFloat(countedEl.value);
    if (!Number.isFinite(counted) || counted < 0) {
      alert('Please enter a non-negative counted number.');
      return;
    }

    const now = asOfEl && asOfEl.value ? new Date(asOfEl.value) : new Date();
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

    if (elapsedHoursEl) elapsedHoursEl.textContent = formatNumber(elapsedHours);
    if (rateEl) rateEl.textContent = formatNumber(rate);
    // Round estimated total to nearest integer for display
    const estimateRounded = Math.round(estimate);
    if (estimateValueEl) estimateValueEl.textContent = estimateRounded.toLocaleString();
    if (resultsSection) resultsSection.removeAttribute('hidden');

    // auto-scroll to bottom so results are visible
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  if (estimateBtn) estimateBtn.addEventListener('click', computeEstimate);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (countedEl) countedEl.value = '';
    if (asOfEl) asOfEl.value = '';
    if (resultsSection) resultsSection.setAttribute('hidden', '');
  });

})();
