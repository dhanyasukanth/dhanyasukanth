/* Dhanya Sukanth B.K. — portfolio interactions.
   No dependencies, no network calls, no storage. CSP-safe: no inline script/style injection. */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var LOADER_MS = 3000; // keep in sync with --t0 in style.css

  // Always start at the top (the intro plays over the hero).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  /* ---------- LOADER ---------- */
  // The timeline itself is pure CSS (so it can never get stuck). JS only pins the
  // astronaut's vanishing line to the terminal's top edge, then removes the node.
  var loader = $('#loader');
  var onReady = [];
  (function () {
    if (!loader) { setTimeout(ready, 0); return; }
    var term = $('.term', loader);
    function fit() { if (term) loader.style.setProperty('--clip-h', Math.max(0, Math.round(term.getBoundingClientRect().top)) + 'px'); }
    fit();
    window.addEventListener('resize', fit);
    setTimeout(ready, LOADER_MS);
    setTimeout(function () {
      window.removeEventListener('resize', fit);
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      loader = null;
    }, LOADER_MS + 700);
  })();
  function ready() {
    root.classList.add('ready');
    onReady.forEach(function (fn) { try { fn(); } catch (e) { /* one feature failing must not block the rest */ } });
  }

  /* ---------- THEME (starts in the device's own light/dark setting) ---------- */
  var themeBtn = $('#theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');
  var flowApi = null;
  function setTheme(light) {
    root.classList.toggle('light', light);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(!light));
      themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    }
    if (themeMeta) themeMeta.setAttribute('content', light ? '#e6edf9' : '#05070f');
    if (flowApi) flowApi.clear();
  }
  // While the class is on, CSS transitions are switched off, so every colour lands in the
  // same frame (otherwise each element fades on its own timer and the switch looks laggy).
  function swapTheme(light) {
    root.classList.add('theme-swap');
    setTheme(light);
    void root.offsetWidth; // apply the new colours now, with transitions off
  }
  function endSwap() { requestAnimationFrame(function () { root.classList.remove('theme-swap'); }); }
  // Follow the device: dark if the OS/browser is set to dark, light otherwise. Until the
  // visitor uses the toggle, the page also follows the device if it changes (e.g. at sunset).
  var sysDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var userPicked = false;
  setTheme(!(sysDark && sysDark.matches));
  function onSysChange(e) { if (!userPicked) { swapTheme(!e.matches); endSwap(); } }
  if (sysDark) {
    if (sysDark.addEventListener) sysDark.addEventListener('change', onSysChange);
    else if (sysDark.addListener) sysDark.addListener(onSysChange);
  }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    userPicked = true;
    var next = !root.classList.contains('light');
    if (!document.startViewTransition || reduced) { swapTheme(next); endSwap(); return; }
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(function () { swapTheme(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 460, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
    vt.finished.then(endSwap, endSwap);
  });

  /* ---------- SCROLL: nav state + progress bar (one rAF-throttled handler) ---------- */
  var nav = $('#nav'), bar = $('#progress-bar'), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    var max = root.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } });
  onScroll();

  /* ---------- SMOOTH SCROLLING ---------- */
  // Native smooth scrolling runs fast over long jumps and slow over short ones, and a
  // mouse wheel moves in hard steps. Here every anchor jump uses the same eased curve,
  // and wheel steps glide to their target. Touch scrolling stays fully native.
  (function () {
    var cur = 0, target = 0, raf = 0, last = 0, tween = null;
    function maxY() { return Math.max(0, root.scrollHeight - window.innerHeight); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; tween = null; last = 0; }
    function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
    function step(t) {
      raf = 0;
      if (tween) {
        if (tween.t0 === null) tween.t0 = t;
        var p = Math.min(1, (t - tween.t0) / tween.dur);
        window.scrollTo(0, tween.from + (tween.to - tween.from) * ease(p));
        if (p < 1) raf = requestAnimationFrame(step); else tween = null;
        return;
      }
      // frame-rate independent glide towards the wheel target
      var dt = last ? Math.min(64, t - last) : 16.7;
      last = t;
      cur += (target - cur) * (1 - Math.pow(0.86, dt / 16.7));
      if (Math.abs(target - cur) < 0.5) cur = target;
      window.scrollTo(0, cur);
      if (cur !== target) raf = requestAnimationFrame(step); else last = 0;
    }
    function goTo(y) {
      stop();
      var from = window.scrollY || 0;
      y = Math.max(0, Math.min(maxY(), y));
      var dist = Math.abs(y - from);
      if (dist < 2) return;
      tween = { from: from, to: y, t0: null, dur: Math.min(900, 520 + dist * 0.06) };
      raf = requestAnimationFrame(step);
    }

    // in-page links: nav, tab bar, hero buttons, stats, footer, chatbot answers
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.classList.contains('skip')) return;
      var id = a.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var y = id === 'top' ? 0 : el.getBoundingClientRect().top + (window.scrollY || 0) - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      goTo(y);
      if (history.pushState && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    });

    // mouse wheel (desktop only)
    if (finePointer) window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.target.closest && e.target.closest('#chatwin')) return; // the chat log scrolls itself
      e.preventDefault();
      if (!raf || tween) { stop(); cur = target = window.scrollY || 0; }
      var d = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      target = Math.max(0, Math.min(maxY(), target + d));
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: false });

    // any other way of scrolling takes over immediately
    window.addEventListener('keydown', stop);
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' && e.target === root) stop(); }, { passive: true });
  })();

  var hasIO = 'IntersectionObserver' in window;
  window.addEventListener('resize', function () { requestAnimationFrame(measureNav); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureNav);
  measureNav();

  /* ---------- ACTIVE NAV LINK ---------- */
  // top nav links (desktop) and bottom tab bar (phones) share the same active state
  var navLinks = $$('.nav-links [data-sec], .tabbar [data-sec]');
  var tabbar = $('.tabbar'), tabs = $$('.tabbar [data-sec]');
  // desktop: a glass highlight that slides between the nav links as sections change
  // Link positions are measured once (and on resize), never while scrolling, so a
  // section change costs no layout work: it only updates two CSS variables.
  var navBox = $('.nav-links'), navInd = $('.nav-ind'), curId = '', navGeo = {};
  function measureNav() {
    navGeo = {};
    if (navBox) $$('[data-sec]', navBox).forEach(function (l) { if (l.offsetWidth) navGeo[l.dataset.sec] = [l.offsetLeft, l.offsetWidth]; });
    placeInd();
  }
  function placeInd() {
    if (!navBox || !navInd) return;
    var g = navGeo[curId];
    navBox.classList.toggle('has-act', !!g);
    if (!g) return;
    navInd.style.setProperty('--x', g[0] + 'px');
    navInd.style.setProperty('--w', g[1] + 'px');
  }
  function setTab(id) {
    curId = id || '';
    placeInd();
    if (!tabbar) return;
    var i = -1;
    tabs.forEach(function (t, n) { if (t.dataset.sec === id) i = n; });
    tabbar.classList.toggle('has-act', i > -1);
    if (i > -1) tabbar.style.setProperty('--i', i); // slides the glass indicator
  }
  if (hasIO && navLinks.length) {
    var ioNav = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        setTab(e.target.id);
        navLinks.forEach(function (l) {
          var on = l.dataset.sec === e.target.id;
          l.classList.toggle('act', on);
          if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = document.getElementById(l.dataset.sec); if (s) ioNav.observe(s); });
    var hero = $('#hero');
    if (hero) new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      setTab('');
      navLinks.forEach(function (l) { l.classList.remove('act'); l.removeAttribute('aria-current'); });
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ---------- SCROLL REVEAL (plays once, then the helper classes are removed) ---------- */
  var revealEls = $$('.rv');
  function finishReveal(el) { el.classList.remove('rv', 'on', 'd1', 'd2', 'd3', 'd4'); }
  if (hasIO && !reduced) {
    var ioRv = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioRv.unobserve(e.target);
        e.target.classList.add('on');
        setTimeout(finishReveal, 1100, e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { ioRv.observe(el); });
  } else {
    revealEls.forEach(finishReveal);
  }

  /* ---------- STAT COUNTERS (count up once) ---------- */
  var stats = $$('.stat-n[data-target]');
  if (hasIO && !reduced) {
    var ioSt = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioSt.unobserve(e.target);
        var el = e.target, target = +el.dataset.target || 0, suf = el.dataset.suffix || '';
        var dur = 1100, t0 = null;
        el.textContent = '0' + suf;
        requestAnimationFrame(function step(t) {
          if (t0 === null) t0 = t;
          var p = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.6 });
    stats.forEach(function (el) { ioSt.observe(el); });
  }

  /* ---------- TYPING EFFECT ---------- */
  var typed = $('#typed');
  if (typed && !reduced) onReady.push(function () {
    var phrases = ['Cloud Infrastructure', 'Application Security', 'WAF Operations', 'Monitoring & Alerting', 'Production Support'];
    var pi = 0, ci = phrases[0].length, del = true;
    (function tick() {
      var p = phrases[pi], wait;
      if (document.hidden) { setTimeout(tick, 600); return; }
      if (del) {
        typed.textContent = p.slice(0, --ci);
        wait = 34;
        if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 380; }
      } else {
        typed.textContent = p.slice(0, ++ci);
        wait = 62;
        if (ci === p.length) { del = true; wait = 2100; }
      }
      setTimeout(tick, wait);
    })();
    // first phrase is already on screen: hold it, then start deleting
  });

  /* ---------- MARQUEES: clone the group until it covers the viewport twice ---------- */
  var tracks = $$('.marquee-track');
  function buildMarquee(track) {
    var group = track.firstElementChild;
    if (!group) return;
    $$('.marquee-group', track).slice(1).forEach(function (c) { track.removeChild(c); });
    var w = group.getBoundingClientRect().width;
    if (!w) return;
    var copies = Math.ceil(window.innerWidth / w) + 1;
    for (var i = 0; i < copies; i++) {
      var c = group.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      $$('a', c).forEach(function (a) { a.tabIndex = -1; });
      track.appendChild(c);
    }
    track.style.setProperty('--mq-w', w + 'px');
    track.style.setProperty('--mq-dur', (w / (+track.dataset.speed || 50)) + 's');
    track.classList.add('run');
  }
  function buildMarquees() { tracks.forEach(buildMarquee); }
  if (!reduced) {
    buildMarquees();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildMarquees);
    var mqW = window.innerWidth, mqTimer;
    window.addEventListener('resize', function () {
      if (window.innerWidth === mqW) return; // ignore mobile URL-bar height changes
      mqW = window.innerWidth;
      clearTimeout(mqTimer);
      mqTimer = setTimeout(buildMarquees, 200);
    });
  }

  /* ---------- NAV BAR DIP ---------- */
  // The link pill (desktop) and the tab bar (phones) dip like one pressed button when one
  // of their own links is pressed. The theme toggle and the name pill never trigger it.
  [['.nav-links', '.nav-in'], ['.tabbar', '.tabbar']].forEach(function (pair) {
    var zone = $(pair[0]), bar = $(pair[1]), t = 0;
    if (!zone || !bar) return;
    function up() { clearTimeout(t); t = setTimeout(function () { bar.classList.remove('press'); }, 120); }
    zone.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || !e.target.closest('a')) return;
      clearTimeout(t);
      bar.classList.add('press');
    }, { passive: true });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { zone.addEventListener(ev, up, { passive: true }); });
  });

  /* ---------- PRESS FEEDBACK (every device, every control, one at a time) ---------- */
  // Only the control under the finger/cursor sinks, then springs back. It animates the
  // independent `scale` property, so it stacks on top of hover lifts and tilts instead of
  // fighting them, and it works for elements the chatbot adds later (delegated listener).
  (function () {
    if (!Element.prototype.animate || !(window.CSS && CSS.supports && CSS.supports('scale', '1'))) return;
    var SEL = 'a[href], button, .pills li, [role="button"]';
    var state = new WeakMap(), held = null;
    function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
    function curScale(el) { var s = parseFloat(getComputedStyle(el).scale); return isNaN(s) ? 1 : s; }
    function press(el) {
      var st = state.get(el) || {};
      clearTimeout(st.t);
      var r = el.getBoundingClientRect();
      // small controls sink more, big cards less, so every press feels about the same
      var depth = Math.max(0.025, Math.min(0.08, 3.4 / (Math.min(r.width, r.height) || 40)));
      var from = curScale(el);
      if (st.a) st.a.cancel();
      st.a = el.animate([{ scale: String(from) }, { scale: String(1 - depth) }], { duration: 130, easing: 'cubic-bezier(.2,0,.2,1)', fill: 'forwards' });
      st.at = now();
      state.set(el, st);
    }
    function release(el) {
      var st = state.get(el);
      if (!st || !st.a) return;
      clearTimeout(st.t);
      // a quick tap still shows the full dip before the spring back
      st.t = setTimeout(function () {
        var from = curScale(el);
        st.a.cancel();
        st.a = el.animate([{ scale: String(from) }, { scale: '1' }], { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' });
      }, Math.max(0, 110 - (now() - st.at)));
    }
    function up() { if (held) { release(held); held = null; } }
    document.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      var el = e.target.closest && e.target.closest(SEL);
      if (!el || el.classList.contains('skip')) return;
      up();
      held = el;
      press(el);
    }, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('pointercancel', up, { passive: true });
    window.addEventListener('blur', up);
    // keyboard users get the same feedback on Enter / Space
    document.addEventListener('keydown', function (e) {
      if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return;
      var el = document.activeElement;
      if (el && el.matches && el.matches(SEL) && held !== el) { up(); held = el; press(el); }
    });
    document.addEventListener('keyup', up);
  })();
  // Touch screens: a press lifts the element and the glow appears where the finger lands.
  $$('.tilt, .btn, .chip, .stat-grid, .skills').forEach(function (el) {
    var t = 0;
    function release() { clearTimeout(t); t = setTimeout(function () { el.classList.remove('pressed'); }, 260); }
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { el.addEventListener(ev, release, { passive: true }); });
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      clearTimeout(t);
      el.classList.add('pressed');
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }, { passive: true });
  });
  document.addEventListener('touchstart', function () {}, { passive: true }); // lets :active styles show on iOS

  /* ---------- POINTER EXTRAS: spotlight (cards, buttons, panels), card tilt, cursor ring (mouse only) ---------- */
  if (finePointer && !reduced) {
    $$('.tilt, .btn, .chip, .stat-grid, .skills, .hv-stage').forEach(function (card) {
      var raf = 0, ev = null;
      // small pills lean more, the wide stats strip leans less, so the motion feels the same
      var max = card.matches('.btn, .chip') ? 14 : card.matches('.hv-stage') ? 13 : card.matches('.stat-grid') ? 3.5 : card.matches('.skills') ? 5 : 7;
      function apply() {
        raf = 0;
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
      }
      card.addEventListener('pointermove', function (e) { ev = e; card.classList.add('tilting'); if (!raf) raf = requestAnimationFrame(apply); });
      card.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        card.classList.remove('tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    var tx = 0, ty = 0, cx = 0, cy = 0, moving = false, seen = false;
    function follow() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      ring.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) requestAnimationFrame(follow); else moving = false;
    }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; cx = tx; cy = ty; ring.classList.add('on'); }
      ring.classList.toggle('hover', !!e.target.closest('a,button,.card,.pills li,input'));
      if (!moving) { moving = true; requestAnimationFrame(follow); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { ring.classList.remove('on'); seen = false; });
  }

  /* ---------- HERO FLOW FIELD (canvas) ---------- */
  // Runs only while the hero is on screen and the tab is visible; starts after the loader.
  (function () {
    var cvs = $('#flow'), hero = $('#hero');
    if (!cvs || !hero || reduced) return;
    var ctx = cvs.getContext('2d', { alpha: true });
    if (!ctx) return;
    var W = 0, H = 0, particles = [], raf = 0, visible = true, started = false;
    var mouse = { x: -9999, y: -9999 };

    function light() { return root.classList.contains('light'); }
    function count() { return Math.round(Math.max(90, Math.min(520, (W * H) / 3600))); }
    function spawn(p) {
      p.x = Math.random() * W; p.y = Math.random() * H; p.vx = 0; p.vy = 0;
      p.age = 0; p.life = Math.random() * 200 + 100;
      return p;
    }
    function size() {
      var r = hero.getBoundingClientRect();
      var w = Math.round(r.width), h = Math.round(r.height);
      if (w === W && h === H) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = w; H = h;
      cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = count();
      while (particles.length > n) particles.pop();
      while (particles.length < n) particles.push(spawn({}));
    }
    function frame() {
      raf = 0;
      if (!visible || document.hidden) return;
      // fade the previous frame toward transparent so trails decay, whatever the theme
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = light() ? 'rgb(48,84,214)' : 'rgb(138,160,255)';
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var a = (Math.cos(p.x * 0.005) + Math.sin(p.y * 0.005)) * Math.PI;
        p.vx += Math.cos(a) * 0.2; p.vy += Math.sin(a) * 0.2;
        var dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
        if (d2 < 22500) { var f = (150 - Math.sqrt(d2)) / 150; p.vx -= dx * f * 0.05; p.vy -= dy * f * 0.05; }
        p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95;
        if (++p.age > p.life) spawn(p);
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
        ctx.globalAlpha = Math.max(0, 1 - Math.abs(p.age / p.life - 0.5) * 2) * 0.6;
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (started && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }

    flowApi = { clear: function () { ctx.clearRect(0, 0, W, H); } };
    onReady.push(function () { started = true; size(); kick(); });

    if (hasIO) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; kick(); }).observe(hero);
    document.addEventListener('visibilitychange', kick);
    if ('ResizeObserver' in window) new ResizeObserver(function () { if (started) size(); }).observe(hero);
    else window.addEventListener('resize', function () { if (started) size(); });
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
      hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    }
  })();
})();
