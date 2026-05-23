;(function () {
  'use strict';

  var getTheme = function () {
    return localStorage.getItem('theme') || 'dark';
  };

  var setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
  };

  var toggleTheme = function () {
    var current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
    setTimeout(function () { redrawCharts(); }, 100);
  };

  var handleThemeToggle = function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', toggleTheme);
  };

  var loader = function () {
    var el = document.querySelector('.gk-loader');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function () { el.style.display = 'none'; }, 400);
  };

  var backToTop = function () {
    var btn = document.querySelector('.gk-back-top');
    var link = document.querySelector('.js-gotop');
    if (!btn || !link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', function () {
      btn.classList.toggle('active', window.scrollY > 200);
    });
  };

  var scrollReveal = function () {
    var els = document.querySelectorAll(
      '.gk-section, .gk-project-card, .gk-skill-box, .gk-progress-item, .gk-about-card, .gk-timeline-item, .gk-skill-category'
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gk-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { observer.observe(el); });
  };

  var storedCanvases = [];

  var drawChart = function (canvas, percent, theme) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2;
    var r = Math.min(cx, cy) - 5;
    var isLight = theme === 'light';

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 3;
    ctx.stroke();

    var startAngle = -Math.PI / 2;
    var endAngle = startAngle + (Math.PI * 2 * percent / 100);
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#a855f7');
    grad.addColorStop(1, '#22d3ee');

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  var initCharts = function () {
    var items = document.querySelectorAll('.gk-skill-box');
    items.forEach(function (item) {
      var pct = parseInt(item.getAttribute('data-percent'), 10) || 0;
      var iconClass = item.getAttribute('data-icon') || '';

      var iconEl = document.createElement('i');
      iconEl.className = iconClass + ' skill-icon';

      var canvas = document.createElement('canvas');
      canvas.width = 70;
      canvas.height = 70;
      canvas.style.cssText = 'display:block;margin:0 auto 0.25rem;';

      var nameEl = item.querySelector('.skill-name');
      if (nameEl) {
        item.insertBefore(canvas, nameEl);
        item.insertBefore(iconEl, nameEl);
      } else {
        item.appendChild(canvas);
        item.appendChild(iconEl);
      }

      storedCanvases.push({ canvas: canvas, percent: pct });

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { drawChart(canvas, pct, getTheme()); }, 200);
            observer.unobserve(item);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(item);
    });
  };

  var redrawCharts = function () {
    var theme = getTheme();
    storedCanvases.forEach(function (item) {
      drawChart(item.canvas, item.percent, theme);
    });
  };

  var animateProgressBars = function () {
    var bars = document.querySelectorAll('.gk-progress-bar');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var w = bar.getAttribute('data-width') || 0;
          setTimeout(function () { bar.style.width = w + '%'; }, 300);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (bar) { observer.observe(bar); });
  };

  setTheme(getTheme());

  document.addEventListener('DOMContentLoaded', function () {
    loader();
    handleThemeToggle();
    backToTop();
    scrollReveal();
    initCharts();
    animateProgressBars();
  });
})();
