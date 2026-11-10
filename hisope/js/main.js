/* HISOPE — vanilla JS. No framework, no build step. */
(function () {
  'use strict';

  var EMAIL = 'hello@hisope.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
  var MARK = '<svg class="logo__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1.5 22.5 12 12 22.5 1.5 12Z" stroke="#d9a441" stroke-width="1.4"/><path d="M12 7l5 5-5 5-5-5Z" fill="#c2492b"/></svg>';

  var PAGES = [
    ['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'],
    ['portfolio.html', 'Portfolio'], ['gallery.html', 'Gallery'],
    ['testimonials.html', 'Testimonials'], ['contact.html', 'Contact']
  ];
  var here = location.pathname.split('/').pop() || 'index.html';
  function cur(href) { return href === here ? ' aria-current="page"' : ''; }

  /* ---------- Shared chrome: header, menu, CTA, footer ---------- */
  function buildChrome() {
    var nav = PAGES.map(function (p) { return '<a href="' + p[0] + '"' + cur(p[0]) + '>' + p[1] + '</a>'; }).join('');
    var menuLinks = PAGES.concat([['event-request.html', 'Event Request']]).map(function (p, i) {
      return '<a href="' + p[0] + '"' + cur(p[0]) + '><small>0' + (i + 1) + '</small>' + p[1] + '</a>';
    }).join('');

    var header = document.createElement('div');
    header.innerHTML =
      '<div class="progress" aria-hidden="true"></div>' +
      '<header class="header"><div class="wrap header__inner">' +
        '<a class="logo" href="index.html" aria-label="HISOPE home">' + MARK + 'HISOPE</a>' +
        '<nav class="nav" aria-label="Primary">' + nav + '</nav>' +
        '<a class="btn btn--gold" href="event-request.html">Event Request</a>' +
        '<button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>' +
      '</div></header>' +
      '<div class="menu" id="menu" aria-hidden="true">' +
        '<nav class="menu__links" aria-label="Mobile">' + menuLinks + '</nav>' +
        '<div class="menu__foot"><div class="tilet"></div><a class="mail" href="mailto:' + EMAIL + '">' + EMAIL + '</a><span class="muted">Addis Ababa, Ethiopia</span></div>' +
      '</div>';
    while (header.firstChild) document.body.insertBefore(header.firstChild, document.body.firstChild);

    var foot = $('#site-footer');
    if (!foot) return;
    var cta = foot.hasAttribute('data-no-cta') ? '' :
      '<section class="cta"><svg class="cta__rings" viewBox="0 0 400 400" fill="none" stroke="#f5efe4" aria-hidden="true">' +
        '<circle cx="200" cy="200" r="198"/><circle cx="200" cy="200" r="150" stroke-dasharray="4 10"/><circle cx="200" cy="200" r="100"/><path d="M200 60 340 200 200 340 60 200Z"/><path d="M200 110l90 90-90 90-90-90Z" stroke-dasharray="3 8"/></svg>' +
        '<div class="wrap cta__inner"><div class="reveal"><span class="eyebrow">Let’s create</span>' +
        '<h2 class="display h2">Let’s create something <em>extraordinary</em> together.</h2></div>' +
        '<div class="reveal" style="--d:.12s"><p>Looking to connect with our experienced team for expert advice and personalized service?</p>' +
        '<div class="cta__actions"><a class="btn btn--dark" href="event-request.html">Book Now ' + ARROW + '</a>' +
        '<a class="btn btn--ghost" href="contact.html">Contact Us</a></div></div></div></section>';

    foot.innerHTML = cta +
      '<div class="tilet" aria-hidden="true"></div>' +
      '<footer class="footer"><div class="wrap">' +
        '<div class="footer__top">' +
          '<div class="footer__brand"><a class="logo" href="index.html">' + MARK + 'HISOPE</a>' +
            '<p>Feel Alive. Modern life can become repetitive. The best experiences awaken us.</p></div>' +
          '<div><h4>Company</h4><ul><li><a href="about.html">About Us</a></li><li><a href="services.html">Services</a></li><li><a href="portfolio.html">Portfolio</a></li><li><a href="services.html#philosophy">Philosophy</a></li></ul></div>' +
          '<div><h4>Explore</h4><ul><li><a href="gallery.html">Gallery</a></li><li><a href="testimonials.html">Testimonials</a></li><li><a href="contact.html">Contact</a></li><li><a href="event-request.html">Event Request</a></li></ul></div>' +
          '<div><h4>Let’s Connect</h4><a class="footer__mail" href="mailto:' + EMAIL + '">' + EMAIL +
            ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>' +
            '<p class="footer__loc">Addis Ababa, Ethiopia</p></div>' +
        '</div>' +
        '<div class="footer__word" aria-hidden="true">HISOPE</div>' +
        '<div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' HISOPE. All rights reserved.</span><span>Feel Alive.</span></div>' +
      '</div></footer>' +
      '<button class="round to-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4M6 10l6-6 6 6"/></svg></button>';
  }

  /* ---------- Preloader (first visit per session only) ---------- */
  function preloader() {
    var el = $('.preloader');
    if (!el) return;
    var seen = false;
    try { seen = sessionStorage.getItem('hisope-seen') === '1'; sessionStorage.setItem('hisope-seen', '1'); } catch (e) {}
    if (seen || reduce) { el.remove(); return; }
    setTimeout(function () { el.classList.add('done'); setTimeout(function () { el.remove(); }, 700); }, 1300);
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

  /* ---------- Hero slideshow ---------- */
  function hero() {
    var root = $('.hero');
    if (!root) return;
    var slides = $$('.hero__slide', root), tabs = $$('.hero__tab', root);
    var MS = 6500, i = 0, timer;
    root.style.setProperty('--slide-ms', MS + 'ms');
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
      tabs.forEach(function (t, k) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', String(k === i));
      });
      void root.offsetWidth; // restart the progress animation
      tabs[i].classList.add('active');
      clearTimeout(timer);
      if (!reduce) timer = setTimeout(function () { go(i + 1); }, MS);
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    var prev = $('[data-hero-prev]', root), next = $('[data-hero-next]', root);
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else go(i); });
    go(0);
  }

  /* ---------- Experiences: list drives the image ---------- */
  function experiences() {
    var root = $('.xp');
    if (!root) return;
    var items = $$('.xp__item', root), imgs = $$('.xp__media img', root);
    function set(n) {
      items.forEach(function (it, k) {
        it.classList.toggle('active', k === n);
        $('.xp__btn', it).setAttribute('aria-expanded', String(k === n));
      });
      imgs.forEach(function (im, k) { im.classList.toggle('active', k === n); });
    }
    items.forEach(function (it, k) {
      var b = $('.xp__btn', it);
      b.addEventListener('click', function () { set(k); });
      b.addEventListener('focus', function () { set(k); });
      if (matchMedia('(hover: hover)').matches) it.addEventListener('mouseenter', function () { set(k); });
    });
    set(0);
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
          var card = r.firstElementChild, w = card ? card.getBoundingClientRect().width + 20 : 320;
          r.scrollBy({ left: (b.dataset.dir === 'prev' ? -1 : 1) * w, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  function quotes() {
    var root = $('.quotes');
    if (!root) return;
    var qs = $$('.quote', root), dots = $$('.dot', root), i = 0, timer;
    function go(n, user) {
      i = (n + qs.length) % qs.length;
      qs.forEach(function (q, k) { q.classList.toggle('active', k === i); q.setAttribute('aria-hidden', String(k !== i)); });
      dots.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
      clearInterval(timer);
      if (!user && !reduce) timer = setInterval(function () { go(i + 1); }, 7000);
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k, true); }); });
    var p = $('[data-q-prev]', root), n = $('[data-q-next]', root);
    if (p) p.addEventListener('click', function () { go(i - 1, true); });
    if (n) n.addEventListener('click', function () { go(i + 1, true); });
    go(0);
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
      '<button class="round" data-lb-next aria-label="Next image">' + ARROW + '</button></span></div>';
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

  /* ---------- Boot ---------- */
  buildChrome();
  preloader();
  scrolling();
  menu();
  hero();
  experiences();
  rail();
  quotes();
  filters();
  lightbox();
  contactForm();
  requestForm();
  reveal();
})();
