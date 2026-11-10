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

  /* ---------- Shared chrome: header, menu, CTA, footer ---------- */
  var GO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function buildChrome() {
    var nav = PAGES.map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('');
    var menuLinks = PAGES.concat([['event-request.html', 'Event Request']]).map(function (p, i) {
      return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '<small>0' + (i + 1) + '</small></a>';
    }).join('');
    var LOGO = '<i aria-hidden="true"></i>HISOPE';

    var header = document.createElement('div');
    header.innerHTML =
      '<div class="progress" aria-hidden="true"></div>' +
      '<header class="header"><div class="header__inner">' +
        '<a class="logo" href="index.html" aria-label="HISOPE home">' + LOGO + '</a>' +
        '<nav class="nav" aria-label="Primary">' + nav + '</nav>' +
        '<a class="btn btn--green" href="event-request.html">Event Request ' + GO + '</a>' +
        '<button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>' +
      '</div></header>' +
      '<div class="menu" id="menu" aria-hidden="true">' +
        '<nav class="menu__links" aria-label="Mobile">' + menuLinks + '</nav>' +
        '<div class="menu__foot"><a href="mailto:' + EMAIL + '">' + EMAIL + '</a><span>Addis Ababa, Ethiopia</span></div>' +
      '</div>';
    while (header.firstChild) document.body.insertBefore(header.firstChild, document.body.firstChild);

    var foot = $('#site-footer');
    if (!foot) return;
    var cta = foot.hasAttribute('data-no-cta') ? '' :
      '<section class="cta"><div class="cta__sun" aria-hidden="true"></div><div class="wrap cta__inner">' +
        '<div class="reveal"><span class="chip">Let’s create</span>' +
        '<h2 class="display h2">Let’s create something <em>extraordinary</em> together.</h2></div>' +
        '<div class="reveal" style="--d:.1s"><p>Looking to connect with our experienced team for expert advice and personalized service?</p>' +
        '<div class="cta__actions"><a class="btn btn--dark" href="event-request.html">Book Now ' + GO + '</a>' +
        '<a class="btn btn--line" href="contact.html">Contact Us</a></div></div></div></section>';

    foot.innerHTML = cta +
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer__top">' +
          '<div class="footer__brand"><a class="logo" href="index.html">' + LOGO + '</a>' +
            '<p>Feel Alive. Modern life can become repetitive. The best experiences awaken us.</p></div>' +
          '<div><h4>Company</h4><ul><li><a href="about.html">About Us</a></li><li><a href="services.html">Services</a></li><li><a href="portfolio.html">Portfolio</a></li><li><a href="services.html#philosophy">Philosophy</a></li></ul></div>' +
          '<div><h4>Explore</h4><ul><li><a href="gallery.html">Gallery</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="contact.html">Contact</a></li><li><a href="event-request.html">Event Request</a></li></ul></div>' +
          '<div><h4>Let’s Connect</h4><a class="footer__mail" href="mailto:' + EMAIL + '">' + EMAIL + '</a>' +
            '<p class="footer__loc">Addis Ababa, Ethiopia</p></div>' +
        '</div></div>' +
        '<div class="footer__word" aria-hidden="true">HISOPE</div>' +
        '<div class="wrap"><div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' HISOPE. All rights reserved.</span><span>Feel Alive.</span></div></div>' +
      '</footer>' +
      '<button class="round to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>';
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

  function requestForm() {
    var form = $('#request-form');
    if (!form) return;
    wire(form);
    var steps = $$('.fstep', form), pills = $$('.stepper li', form), i = 0;
    var date = $('[name="date"]', form);
    if (date) date.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10);

    var type = new URLSearchParams(location.search).get('type');
    if (type) $$('[name="type"]', form).forEach(function (r) { if (r.value === type) r.checked = true; });

    function go(n) {
      i = n;
      steps.forEach(function (s, k) { s.classList.toggle('current', k === i); });
      pills.forEach(function (p, k) {
        p.classList.toggle('current', k === i); p.classList.toggle('done', k < i);
        if (k === i) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
      });
      if (i === steps.length - 1) review();
      var h = $('h2', steps[i]); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      var top = form.getBoundingClientRect().top + scrollY - 100;
      if (scrollY > top) scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
    function values() {
      var d = new FormData(form);
      return [
        ['Full name', d.get('name')], ['Email', d.get('email')],
        ['Company / organization', d.get('company')], ['Phone', d.get('phone')],
        ['Event type', d.get('type')], ['Estimated date', d.get('date')],
        ['Estimated guests', d.get('guests')], ['Preferred location', d.get('location')],
        ['Details & vision', d.get('details')]
      ];
    }
    function review() {
      var dl = $('.review', form); dl.innerHTML = '';
      values().forEach(function (v) {
        var row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = v[0]; dd.textContent = (v[1] || '').toString().trim() || '—';
        row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
      });
    }
    $$('[data-next]', form).forEach(function (b) { b.addEventListener('click', function () { if (validateAll(steps[i])) go(i + 1); }); });
    $$('[data-back]', form).forEach(function (b) { b.addEventListener('click', function () { go(i - 1); }); });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON' && i < steps.length - 1) {
        e.preventDefault(); if (validateAll(steps[i])) go(i + 1);
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (i < steps.length - 1) return;
      var v = values();
      send('Event request: ' + v[4][1] + ' — ' + v[0][1], v.map(function (x) { return x[0] + ': ' + ((x[1] || '').toString().trim() || '-'); }));
      done(form);
    });
    go(0);
  }

  /* ---------- Hero arches: one expands at a time ---------- */
  function arches() {
    var list = $$('.arch');
    if (!list.length) return;
    var i = 0, timer, touched = false;
    function set(n) { i = n; list.forEach(function (a, k) { a.classList.toggle('active', k === n); }); }
    list.forEach(function (a, k) {
      a.addEventListener('mouseenter', function () { touched = true; clearInterval(timer); set(k); });
      a.addEventListener('focus', function () { touched = true; clearInterval(timer); set(k); });
    });
    set(0);
    if (!reduce) timer = setInterval(function () { if (!touched) set((i + 1) % list.length); }, 3600);
  }

  /* ---------- Statement: words light up as you scroll ---------- */
  function statement() {
    $$('.statement').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', words.join(' '));
      el.setAttribute('role', 'paragraph');
      el.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
      var spans = $$('.w', el);
      if (reduce) { spans.forEach(function (s) { s.classList.add('on'); }); return; }
      function run() {
        var r = el.getBoundingClientRect();
        var p = (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35);
        var n = Math.round(Math.max(0, Math.min(1, p)) * spans.length);
        spans.forEach(function (s, k) { s.classList.toggle('on', k < n); });
      }
      addEventListener('scroll', run, { passive: true }); addEventListener('resize', run); run();
    });
  }

  /* ---------- Service list: preview image follows the pointer ---------- */
  function floatPreview() {
    var list = $('.svc'), fl = $('.svc-float');
    if (!list || !fl || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var rows = $$('.svc__row', list), imgs = $$('img', fl);
    var x = 0, y = 0, tx = 0, ty = 0, raf = null;
    function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      fl.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + ((tx - x) * 0.04).toFixed(2) + 'deg)';
      raf = fl.classList.contains('show') || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    list.addEventListener('mousemove', function (e) {
      tx = Math.min(e.clientX + 28, innerWidth - 290); ty = Math.max(12, Math.min(e.clientY - 170, innerHeight - 360));
      if (!fl.classList.contains('show')) { x = tx; y = ty; fl.classList.add('show'); }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener('mouseleave', function () { fl.classList.remove('show'); });
    rows.forEach(function (r, k) { r.addEventListener('mouseenter', function () { imgs.forEach(function (im, j) { im.classList.toggle('active', j === k); }); }); });
  }

  /* ---------- Boot ---------- */
  buildChrome();
  scrolling();
  menu();
  filters();
  lightbox();
  contactForm();
  requestForm();
  arches();
  statement();
  floatPreview();
  reveal();
})();
