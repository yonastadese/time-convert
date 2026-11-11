/* HISOPE — vanilla JS. No framework, no build step. */
(function () {
  'use strict';

  var EMAIL = 'hello@hisope.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var PAGES = [
    ['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'],
    ['portfolio.html', 'Portfolio'], ['gallery.html', 'Gallery'],
    ['testimonials.html', 'Testimonials'], ['contact.html', 'Contact']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  function cur(href) { return href === here ? ' aria-current="page"' : ''; }

  /* ---------- Shared chrome: side nav, mobile bar + menu, CTA, footer ---------- */
  var GO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  var UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>';
  function buildChrome() {
    var all = PAGES.concat([['event-request.html', 'Event Request']]);
    var nav = PAGES.map(function (p, i) { return '<a href="' + p[0] + '"' + cur(p[0]) + '><small>0' + (i + 1) + '</small>' + p[1] + '</a>'; }).join('');
    var menuLinks = all.map(function (p, i) { return '<a href="' + p[0] + '"' + cur(p[0]) + '><small>0' + (i + 1) + '</small>' + p[1] + GO + '</a>'; }).join('');

    var chrome = document.createElement('div');
    chrome.innerHTML =
      '<div class="progress" aria-hidden="true"></div>' +
      '<aside class="side">' +
        '<a class="side__logo" href="index.html" aria-label="HISOPE home"><b>HISOPE</b><span class="mono">Feel Alive.</span></a>' +
        '<nav class="side__nav" aria-label="Primary">' + nav + '</nav>' +
        '<div class="side__foot">' +
          '<div class="side__meta"><span class="mono mute">Addis Ababa, now</span><span class="clock" data-clock>--:--</span>' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a></div>' +
          '<a class="btn btn--blue" href="event-request.html">Event Request ' + GO + '</a>' +
        '</div>' +
      '</aside>' +
      '<header class="header">' +
        '<a class="header__logo" href="index.html" aria-label="HISOPE home">HISOPE</a>' +
        '<div class="header__right"><a class="mono" href="event-request.html">Request</a>' +
        '<button class="burger mono" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i>Menu</button></div>' +
      '</header>' +
      '<div class="menu" id="menu" aria-hidden="true">' +
        '<nav class="menu__links" aria-label="Mobile">' + menuLinks + '</nav>' +
        '<div class="menu__foot"><span class="mono mute">Addis Ababa, now <span data-clock>--:--</span></span><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></div>' +
      '</div>';
    while (chrome.firstChild) document.body.insertBefore(chrome.firstChild, document.body.firstChild);

    var foot = $('#site-footer');
    if (!foot) return;
    var cta = foot.hasAttribute('data-no-cta') ? '' :
      '<section class="cta">' +
        '<div class="cta__text"><span class="mono">( Let’s create )</span>' +
          '<div><h2 class="display h2">Let’s create something <em>extraordinary</em> together.</h2>' +
          '<p class="lead" style="margin-top:1.4rem">Looking to connect with our experienced team for expert advice and personalized service?</p></div></div>' +
        '<div class="cta__links">' +
          '<a class="cta__big" href="event-request.html">' + UP + '<span class="mono">Start an event request</span><span>Book<br>Now</span></a>' +
          '<a class="cta__small mono" href="contact.html">Or contact us ' + GO + '</a>' +
        '</div></section>';

    foot.innerHTML = cta +
      '<footer class="footer">' +
        '<a class="footer__mail" href="mailto:' + EMAIL + '"><div><span class="mono">( Let’s connect )</span><b>' + EMAIL + '</b></div>' + UP + '</a>' +
        '<div class="footer__grid">' +
          '<div><span class="mono">HISOPE</span><p>Feel Alive. Modern life can become repetitive. The best experiences awaken us.</p></div>' +
          '<div><span class="mono">Company</span><ul><li><a href="about.html">About Us</a></li><li><a href="services.html">Services</a></li><li><a href="portfolio.html">Portfolio</a></li><li><a href="index.html#philosophy">Philosophy</a></li></ul></div>' +
          '<div><span class="mono">Explore</span><ul><li><a href="gallery.html">Gallery</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="contact.html">Contact</a></li><li><a href="event-request.html">Event Request</a></li></ul></div>' +
          '<div><span class="mono">Addis Ababa, Ethiopia</span><span class="clock" data-clock>--:--</span><span class="mono">Local time (EAT)</span></div>' +
        '</div>' +
        '<div class="footer__bottom"><span class="mono">© ' + new Date().getFullYear() + ' HISOPE. All rights reserved.</span>' +
          '<button class="to-top mono">Back to top <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button></div>' +
      '</footer>';
  }

  /* ---------- Header behaviour, scroll progress, parallax ---------- */
  function scrolling() {
    var header = $('.header'), bar = $('.progress'), top = $('.to-top');
    var par = reduce ? [] : $$('[data-parallax]');
    var last = 0, ticking = false;
    function run() {
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      header.classList.toggle('scrolled', y > 30);
      header.classList.toggle('hidden', y > 500 && y > last && !$('.menu').classList.contains('open'));
      bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (top) top.classList.toggle('show', y > 900);
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = 'translate3d(0,' + (p * -(parseFloat(el.dataset.parallax) || 40)).toFixed(1) + 'px,0)';
      });
      last = y; ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    addEventListener('resize', run);
    run();
    if (top) top.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------- Mobile menu ---------- */
  function menu() {
    var btn = $('.burger'), m = $('.menu');
    function set(open) {
      m.classList.toggle('open', open);
      m.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('locked', open);
    }
    btn.addEventListener('click', function () { set(!m.classList.contains('open')); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && m.classList.contains('open')) { set(false); btn.focus(); } });
    addEventListener('resize', function () { if (innerWidth > 1080) set(false); });
  }

  /* ---------- Reveal + counters ---------- */
  function reveal() {
    var els = $$('.reveal, .reveal-img, [data-count]');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); if (e.dataset.count) e.textContent = e.dataset.count; }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        el.classList.add('in');
        if (el.dataset.count) count(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function count(el) {
    var end = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = end; return; }
    var t0 = performance.now(), dur = 1800;
    (function step(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- Horizontal rail: drag + arrows ---------- */
  function rail() {
    $$('.rail').forEach(function (r) {
      var down = false, sx = 0, sl = 0, moved = false;
      r.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; });
      addEventListener('pointermove', function (e) {
        if (!down) return;
        var dx = e.clientX - sx;
        if (Math.abs(dx) > 5) { moved = true; r.classList.add('dragging'); }
        r.scrollLeft = sl - dx;
      });
      addEventListener('pointerup', function () { down = false; setTimeout(function () { r.classList.remove('dragging'); }, 0); });
      r.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
      var id = r.id;
      $$('[data-rail="' + id + '"]').forEach(function (b) {
        b.addEventListener('click', function () {
          var card = r.firstElementChild, w = card ? card.getBoundingClientRect().width : 320;
          r.scrollBy({ left: (b.dataset.dir === 'prev' ? -1 : 1) * w, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    });
  }

  /* ---------- Filters (portfolio + gallery) ---------- */
  function filters() {
    $$('[data-filters]').forEach(function (bar) {
      var items = $$(bar.dataset.filters + ' [data-cat]');
      var btns = $$('.filter', bar);
      btns.forEach(function (b) {
        var f = b.dataset.filter;
        var n = f === 'all' ? items.length : items.filter(function (it) { return it.dataset.cat === f; }).length;
        b.insertAdjacentHTML('beforeend', '<sup>' + n + '</sup>');
        b.addEventListener('click', function () {
          btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
          items.forEach(function (it) {
            var show = f === 'all' || it.dataset.cat === f;
            it.classList.toggle('is-hidden', !show);
            if (show) { it.classList.remove('in'); requestAnimationFrame(function () { requestAnimationFrame(function () { it.classList.add('in'); }); }); }
          });
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function lightbox() {
    var shots = $$('.shot');
    if (!shots.length) return;
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML =
      '<div class="lightbox__top"><span class="lightbox__count"></span>' +
      '<button class="round" data-lb-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="lightbox__stage"><img alt=""></div>' +
      '<div class="lightbox__bottom"><span class="lightbox__cap"></span><span style="display:flex;gap:.5rem">' +
      '<button class="round" data-lb-prev aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"/></svg></button>' +
      '<button class="round" data-lb-next aria-label="Next image">' + GO + '</button></span></div>';
    document.body.appendChild(lb);
    var img = $('img', lb), cap = $('.lightbox__cap', lb), cnt = $('.lightbox__count', lb);
    var list = [], i = 0, opener = null;
    function show(n) {
      i = (n + list.length) % list.length;
      var s = list[i], src = $('img', s);
      img.src = src.currentSrc || src.src; img.alt = src.alt;
      cap.textContent = src.alt;
      cnt.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    }
    function open(s) {
      list = shots.filter(function (x) { return !x.classList.contains('is-hidden'); });
      opener = s; show(list.indexOf(s));
      lb.classList.add('open'); document.body.classList.add('locked');
      $('[data-lb-close]', lb).focus();
    }
    function close() { lb.classList.remove('open'); document.body.classList.remove('locked'); if (opener) opener.focus(); }
    shots.forEach(function (s) { s.addEventListener('click', function () { open(s); }); });
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', function () { show(i - 1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { show(i + 1); });
    $('.lightbox__stage', lb).addEventListener('click', function (e) { if (e.target !== img) close(); });
    addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'ArrowRight') show(i + 1);
      else if (e.key === 'Tab') {
        var f = $$('button', lb), a = document.activeElement, k = f.indexOf(a);
        e.preventDefault();
        f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    var tx = null;
    lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- Forms ----------
     There is no server behind this static site, so a valid submission opens
     the visitor's email app with the message addressed to HISOPE. To post to
     a form service instead, replace send() with a fetch() call. */
  function validate(field) {
    var input = $('input, select, textarea', field);
    if (!input || input.type === 'radio') return true;
    var v = input.value.trim(), msg = '';
    if (input.required && !v) msg = 'This field is required.';
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address, like name@example.com.';
    else if (v && input.type === 'tel' && !/^[+()\d\s.-]{7,}$/.test(v)) msg = 'Enter a valid phone number, including country code if outside Ethiopia.';
    else if (v && input.type === 'number' && (isNaN(+v) || +v < 1)) msg = 'Enter a number greater than zero.';
    else if (v && input.type === 'date' && input.min && v < input.min) msg = 'Choose a date in the future.';
    var err = $('.field__err', field);
    field.classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', String(!!msg));
    if (err) err.textContent = msg;
    return !msg;
  }
  function validateAll(scope) {
    var ok = true, first = null;
    $$('.field', scope).forEach(function (f) { if (!validate(f)) { ok = false; first = first || $('input, select, textarea', f); } });
    if (first) first.focus();
    return ok;
  }
  function send(subject, lines) {
    location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }
  function wire(form) {
    $$('.field', form).forEach(function (f) {
      var input = $('input, select, textarea', f);
      if (!input) return;
      input.addEventListener('blur', function () { validate(f); });
      input.addEventListener('input', function () { if (f.classList.contains('invalid')) validate(f); });
    });
  }
  function done(form) {
    $$('.form__body', form).forEach(function (b) { b.hidden = true; });
    var s = $('.sent', form); s.classList.add('show'); s.setAttribute('tabindex', '-1'); s.focus();
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  function contactForm() {
    var form = $('#contact-form');
    if (!form) return;
    wire(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(form)) return;
      var d = new FormData(form);
      send('Enquiry from ' + d.get('first') + ' ' + d.get('last'), [
        'Name: ' + d.get('first') + ' ' + d.get('last'),
        'Email: ' + d.get('email'),
        'Phone: ' + (d.get('phone') || '-'),
        '', d.get('message')
      ]);
      done(form);
    });
  }

  /* ---------- Live Addis Ababa time ---------- */
  function clock() {
    var els = $$('[data-clock]');
    if (!els.length) return;
    var fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Africa/Addis_Ababa' }); } catch (e) { return; }
    function tick() { var t = fmt.format(new Date()); els.forEach(function (el) { el.textContent = t; }); }
    tick(); setInterval(tick, 15000);
  }

  /* ---------- Hero image wipe ---------- */
  function heroSlides() {
    var root = $('.hs');
    if (!root) return;
    var imgs = $$('img', root), caps = (root.dataset.caps || '').split('|');
    var num = $('[data-hs-num]'), cap = $('[data-hs-cap]');
    var i = 0, timer;
    function pad(n) { return String(n).padStart(2, '0'); }
    function go(n, user) {
      var prev = i; i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('prev', k === prev && prev !== i); im.classList.remove('active'); });
      void root.offsetWidth;
      imgs[i].classList.add('active');
      if (num) num.textContent = pad(i + 1) + ' / ' + pad(imgs.length);
      if (cap) cap.textContent = caps[i] || '';
      clearInterval(timer);
      if (!user && !reduce) timer = setInterval(function () { go(i + 1); }, 5500);
    }
    var p = $('[data-hs-prev]'), nx = $('[data-hs-next]');
    if (p) p.addEventListener('click', function () { go(i - 1, true); });
    if (nx) nx.addEventListener('click', function () { go(i + 1, true); });
    imgs[0].classList.add('active');
    go(0);
  }

  /* ---------- Tabs (ARIA tabs with arrow keys) ---------- */
  function tabs() {
    $$('[role="tablist"]').forEach(function (list) {
      var ts = $$('[role="tab"]', list);
      function pick(t, focus) {
        ts.forEach(function (x) {
          var on = x === t;
          x.setAttribute('aria-selected', String(on));
          x.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(x.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
        if (focus) t.focus();
      }
      ts.forEach(function (t, k) {
        t.addEventListener('click', function () { pick(t); });
        t.addEventListener('keydown', function (e) {
          var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
          if (d) { e.preventDefault(); pick(ts[(k + d + ts.length) % ts.length], true); }
          else if (e.key === 'Home') { e.preventDefault(); pick(ts[0], true); }
          else if (e.key === 'End') { e.preventDefault(); pick(ts[ts.length - 1], true); }
        });
      });
      pick(ts[0]);
    });
  }

  /* ---------- Services page: highlight the section in view ---------- */
  function spy() {
    var links = $$('.spy a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(function (l) { var s = document.getElementById(l.getAttribute('href').slice(1)); if (s) io.observe(s); });
  }

  /* ---------- Event request: one page, with a live summary ---------- */
  function requestForm() {
    var form = $('#request-form');
    if (!form) return;
    wire(form);
    var date = $('[name="date"]', form);
    if (date) date.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    var type = new URLSearchParams(location.search).get('type');
    if (type) $$('[name="type"]', form).forEach(function (r) { if (r.value === type) r.checked = true; });

    var FIELDS = [['name', 'Full name'], ['email', 'Email'], ['company', 'Company / organization'], ['phone', 'Phone'], ['type', 'Event type'], ['date', 'Estimated date'], ['guests', 'Estimated guests'], ['location', 'Preferred location'], ['details', 'Details & vision']];
    var REQUIRED = ['name', 'email', 'phone', 'type', 'date', 'guests', 'location', 'details'];
    function values() {
      var d = new FormData(form);
      return FIELDS.map(function (f) { return [f[1], (d.get(f[0]) || '').toString().trim(), f[0]]; });
    }
    function summary() {
      var v = values(), filled = 0;
      v.forEach(function (x) {
        var dd = $('[data-sum="' + x[2] + '"]');
        if (dd) { dd.textContent = x[1] || 'Not yet filled in'; dd.classList.toggle('empty', !x[1]); }
        if (x[1] && REQUIRED.indexOf(x[2]) > -1) filled++;
      });
      var bar = $('.summary__bar i'), count = $('[data-sum-count]');
      if (bar) bar.style.width = (filled / REQUIRED.length * 100) + '%';
      if (count) count.textContent = filled + ' of ' + REQUIRED.length + ' required details';
    }
    form.addEventListener('input', summary);
    form.addEventListener('change', summary);
    summary();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(form)) return;
      var v = values();
      send('Event request: ' + v[4][1] + ' — ' + v[0][1], v.map(function (x) { return x[0] + ': ' + (x[1] || '-'); }));
      done(form);
    });
  }

  /* ---------- Boot ---------- */
  buildChrome();
  clock();
  scrolling();
  menu();
  heroSlides();
  tabs();
  rail();
  spy();
  filters();
  lightbox();
  contactForm();
  requestForm();
  reveal();
})();
