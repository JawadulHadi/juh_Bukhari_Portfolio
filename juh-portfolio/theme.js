(function () {
  if (window.JUHTheme) return;
  var KEY = 'juh-dc-theme';
  var THEMES = {
    horizon: { label: 'Horizon', desc: 'Neon Horizon: night grid & ember glow', scheme: 'dark', vars: {
      '--color-bg': '#0b0a08', '--color-surface': '#15130f', '--color-text': '#e8e2d4',
      '--color-accent': '#e8784a', '--ink-accent': '#f28e5e', '--muted': '#9d9686',
      '--color-divider': '#2c2820',
      '--page-grid': 'linear-gradient(rgba(232,120,74,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,120,74,.035) 1px, transparent 1px)'
    } },
    classical: { label: 'Paper', desc: 'Classical: paper, ink & gold', scheme: 'light', vars: {
      '--ink-accent': 'var(--color-accent-700)', '--muted': 'color-mix(in srgb, var(--color-text) 62%, transparent)', '--page-grid': 'none'
    } },
    mono: { label: 'Mono', desc: 'Monochrome: black, white & editorial', scheme: 'dark', vars: {
      '--color-bg': '#070707', '--color-surface': '#141414', '--color-text': '#ededed',
      '--color-accent': '#f2f2f2', '--ink-accent': '#ffffff', '--muted': '#8f8f8f',
      '--color-divider': '#262626', '--page-grid': 'none'
    } }
  };
  var VARS = ['--color-bg', '--color-surface', '--color-text', '--color-accent', '--color-divider', '--ink-accent', '--muted', '--page-grid'];
  var current = null;

  function saved() { try { var s = localStorage.getItem(KEY); return THEMES[s] ? s : null; } catch (e) { return null; } }
  function apply(k) {
    if (!THEMES[k]) k = 'horizon';
    current = k;
    var t = THEMES[k], s = document.documentElement.style;
    VARS.forEach(function (v) { s.removeProperty(v); });
    Object.keys(t.vars).forEach(function (v) { s.setProperty(v, t.vars[v]); });
    s.colorScheme = t.scheme;
    document.documentElement.setAttribute('data-theme', k);
    window.dispatchEvent(new CustomEvent('juh-theme', { detail: k }));
  }
  function set(k) { try { localStorage.setItem(KEY, k); } catch (e) {} apply(k); }
  function get() { return current; }
  window.addEventListener('storage', function (e) { if (e.key === KEY && THEMES[e.newValue]) apply(e.newValue); });

  var io = null;
  function reveal() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target; io.unobserve(el);
        setTimeout(function () {
          el.style.opacity = el._rv.o; el.style.transform = el._rv.t;
          setTimeout(function () { el.style.transition = el._rv.tr; }, 900);
        }, +el.getAttribute('data-reveal') || 0);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-reveal]:not([data-rv])').forEach(function (el) {
      el.setAttribute('data-rv', '1');
      el._rv = { o: el.style.opacity, t: el.style.transform, tr: el.style.transition };
      el.style.transition = 'opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)';
      el.style.opacity = '0'; el.style.transform = 'translateY(16px)';
      io.observe(el);
    });
  }

  function pointerFx() {
    if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return;
    var spot = document.createElement('div');
    spot.setAttribute('aria-hidden', 'true');
    spot.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:15;opacity:0;transition:opacity .5s ease;background:radial-gradient(520px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 62%);';
    var ring = document.createElement('div');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = 'position:fixed;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;border:1px solid var(--color-accent);border-radius:50%;pointer-events:none;z-index:70;opacity:0;transition:opacity .3s ease, width .25s ease, height .25s ease, margin .25s ease, background-color .25s ease;';
    function mount() { if (document.body && !spot.parentNode) { document.body.appendChild(spot); document.body.appendChild(ring); } }
    var x = -100, y = -100, rx = -100, ry = -100, raf = 0, lastGlow = null, lastTilt = null;
    function loop() {
      rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      raf = (Math.abs(x - rx) + Math.abs(y - ry) > 0.3) ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mount();
      x = e.clientX; y = e.clientY;
      spot.style.opacity = '1'; ring.style.opacity = '.55';
      spot.style.setProperty('--mx', x + 'px'); spot.style.setProperty('--my', y + 'px');
      if (!raf) raf = requestAnimationFrame(loop);
      var t = e.target && e.target.closest ? e.target : null;
      var interactive = t && t.closest('a,button,[role=tab],[role=radio],input');
      var big = !!interactive;
      ring.style.width = ring.style.height = big ? '46px' : '30px';
      ring.style.margin = big ? '-23px 0 0 -23px' : '-15px 0 0 -15px';
      ring.style.backgroundColor = big ? 'color-mix(in srgb, var(--color-accent) 10%, transparent)' : 'transparent';
      var g = t && t.closest('[data-glow]');
      if (lastGlow && lastGlow !== g) { lastGlow.style.setProperty('--gx', '-50%'); lastGlow.style.setProperty('--gy', '-50%'); }
      if (g) { var r = g.getBoundingClientRect(); g.style.setProperty('--gx', (x - r.left) + 'px'); g.style.setProperty('--gy', (y - r.top) + 'px'); }
      lastGlow = g;
      var tl = t && t.closest('[data-tilt]');
      if (lastTilt && lastTilt !== tl) lastTilt.style.transform = '';
      if (tl) { var b = tl.getBoundingClientRect(); var px = (x - b.left) / b.width - .5, py = (y - b.top) / b.height - .5; tl.style.transform = 'perspective(900px) rotateY(' + (px * 8).toFixed(2) + 'deg) rotateX(' + (-py * 8).toFixed(2) + 'deg) scale(1.015)'; }
      lastTilt = tl;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { spot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.documentElement.addEventListener('mouseleave', function () { spot.style.opacity = '0'; ring.style.opacity = '0'; });
  }

  apply(saved() || 'horizon');
  pointerFx();
  window.JUHTheme = { THEMES: THEMES, KEY: KEY, get: get, set: set, apply: apply, saved: saved, reveal: reveal };
})();
