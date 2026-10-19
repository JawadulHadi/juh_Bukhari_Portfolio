(function () {
  if (window.JUHTheme) return;
  var KEY = "juh-dc-theme";
  var DEFAULT = "glass";
  var THEMES = {
    glass: {
      label: "Glass",
      desc: "Glass: frosted gold-on-night panels over a live system-design backdrop",
      scheme: "dark",
      glass: true,
      vars: {
        "--color-bg": "#060a13",
        "--color-surface": "rgba(255,255,255,.055)",
        "--color-text": "#eef2f8",
        "--color-accent": "#e5b376",
        "--ink-accent": "#f0c58c",
        "--muted": "#9aa6b8",
        "--color-divider": "rgba(255,255,255,.12)",
        "--page-grid": "none",
        "--g-body":
          "radial-gradient(1200px 800px at 15% -10%,#14233f 0%,transparent 60%),radial-gradient(900px 700px at 110% 30%,#2a1c10 0%,transparent 55%),#060a13",
        "--g-header": "rgba(10,16,28,.55)",
        "--g-panel": "rgba(255,255,255,.045)",
        "--g-panel-line": "rgba(255,255,255,.13)",
        "--g-shadow":
          "inset 0 1px 0 rgba(255,255,255,.09),0 12px 32px rgba(0,0,0,.28)",
        "--g-glow": "rgba(229,179,118,.22)",
        "--g-b1": "#2b5fd9",
        "--g-b2": "#e5b376",
        "--g-b3": "#7c3aed",
        "--g-edge": "rgba(150,180,230,.22)",
        "--g-node": "rgba(255,255,255,.05)",
        "--g-node-line": "rgba(190,210,245,.35)",
        "--g-sheen": "rgba(255,255,255,.09)",
      },
    },
    frost: {
      label: "Frost",
      desc: "Frost: light frosted glass over a pastel system-design backdrop",
      scheme: "light",
      glass: true,
      vars: {
        "--color-bg": "#eef2f8",
        "--color-surface": "rgba(255,255,255,.55)",
        "--color-text": "#122033",
        "--color-accent": "#a8691f",
        "--ink-accent": "#8a5414",
        "--muted": "#4f5d73",
        "--color-divider": "rgba(18,32,51,.14)",
        "--page-grid": "none",
        "--g-body":
          "radial-gradient(1100px 760px at 10% -10%,#d6e4ff 0%,transparent 60%),radial-gradient(900px 700px at 110% 25%,#ffe6cc 0%,transparent 55%),radial-gradient(900px 700px at 40% 120%,#efe3ff 0%,transparent 60%),#eef2f8",
        "--g-header": "rgba(244,247,252,.62)",
        "--g-panel": "rgba(255,255,255,.46)",
        "--g-panel-line": "rgba(255,255,255,.75)",
        "--g-shadow":
          "inset 0 1px 0 rgba(255,255,255,.8),0 12px 32px rgba(30,50,90,.12)",
        "--g-glow": "rgba(168,105,31,.2)",
        "--g-b1": "#7aa2ff",
        "--g-b2": "#ffbf7a",
        "--g-b3": "#c3a6ff",
        "--g-edge": "rgba(40,70,120,.18)",
        "--g-node": "rgba(255,255,255,.55)",
        "--g-node-line": "rgba(40,70,120,.28)",
        "--g-sheen": "rgba(255,255,255,.55)",
      },
    },
    nebula: {
      label: "Nebula",
      desc: "Nebula: violet and teal glass over a live system-design backdrop",
      scheme: "dark",
      glass: true,
      vars: {
        "--color-bg": "#07081a",
        "--color-surface": "rgba(255,255,255,.055)",
        "--color-text": "#eef0fb",
        "--color-accent": "#5eead4",
        "--ink-accent": "#8ff3e3",
        "--muted": "#a0a6c4",
        "--color-divider": "rgba(255,255,255,.12)",
        "--page-grid": "none",
        "--g-body":
          "radial-gradient(1200px 800px at 10% -10%,#22185e 0%,transparent 60%),radial-gradient(900px 700px at 110% 35%,#0b3d47 0%,transparent 55%),#07081a",
        "--g-header": "rgba(12,12,34,.55)",
        "--g-panel": "rgba(255,255,255,.045)",
        "--g-panel-line": "rgba(200,190,255,.16)",
        "--g-shadow":
          "inset 0 1px 0 rgba(255,255,255,.09),0 12px 32px rgba(0,0,0,.32)",
        "--g-glow": "rgba(94,234,212,.22)",
        "--g-b1": "#7c3aed",
        "--g-b2": "#14b8a6",
        "--g-b3": "#db2777",
        "--g-edge": "rgba(170,160,255,.22)",
        "--g-node": "rgba(255,255,255,.05)",
        "--g-node-line": "rgba(190,180,255,.35)",
        "--g-sheen": "rgba(255,255,255,.09)",
      },
    },
    mono: {
      label: "Mono",
      desc: "Monochrome: black, white & editorial",
      scheme: "dark",
      vars: {
        "--color-bg": "#070707",
        "--color-surface": "#141414",
        "--color-text": "#ededed",
        "--color-accent": "#f2f2f2",
        "--ink-accent": "#ffffff",
        "--muted": "#8f8f8f",
        "--color-divider": "#262626",
        "--page-grid": "none",
      },
    },
  };
  var VARS = [
    "--color-bg",
    "--color-surface",
    "--color-text",
    "--color-accent",
    "--color-divider",
    "--ink-accent",
    "--muted",
    "--page-grid",
    "--g-body",
    "--g-header",
    "--g-panel",
    "--g-panel-line",
    "--g-shadow",
    "--g-glow",
    "--g-b1",
    "--g-b2",
    "--g-b3",
    "--g-edge",
    "--g-node",
    "--g-node-line",
    "--g-sheen",
  ];
  var current = null;

  function saved() {
    try {
      var s = localStorage.getItem(KEY);
      return THEMES[s] ? s : null;
    } catch (e) {
      return null;
    }
  }
  function apply(k) {
    if (!THEMES[k]) k = DEFAULT;
    current = k;
    var t = THEMES[k],
      s = document.documentElement.style;
    VARS.forEach(function (v) {
      s.removeProperty(v);
    });
    Object.keys(t.vars).forEach(function (v) {
      s.setProperty(v, t.vars[v]);
    });
    s.colorScheme = t.scheme;
    document.documentElement.setAttribute("data-theme", k);
    glassFx(!!t.glass);
    window.dispatchEvent(new CustomEvent("juh-theme", { detail: k }));
    broadcast();
  }
  // Embedded diagrams are separate documents, so they can't see this page's
  // theme. Push the scheme to every iframe on each change, and answer the
  // "juh-theme-ready" handshake each diagram sends once it has loaded.
  function post(win) {
    if (!current || !win) return;
    try {
      win.postMessage(
        { type: "juh-theme", scheme: THEMES[current].scheme },
        "*",
      );
    } catch (e) {}
  }
  function broadcast() {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) post(frames[i].contentWindow);
  }
  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "juh-theme-ready") return;
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++)
      if (frames[i].contentWindow === e.source) return post(e.source);
  });
  // Glass theme: frosted panels plus a fixed, animated backdrop drawn like the
  // profile's system-design SVGs (aurora glow, service nodes, traffic flowing
  // along the edges). Built on first use and removed when another theme is picked.
  var G = "html[data-glass] ";
  var GLASS_CSS = [
    G + "body{background:var(--g-body)}",
    G +
      "header{background:var(--g-header)!important;backdrop-filter:blur(18px) saturate(160%)!important;-webkit-backdrop-filter:blur(18px) saturate(160%)!important;border-bottom-color:var(--g-panel-line)!important}",
    G +
      "[data-glow]," +
      G +
      "#stack [data-reveal] > div > div{position:relative;background-color:var(--g-panel);backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);border-color:var(--g-panel-line)!important;border-radius:var(--radius-md);box-shadow:var(--g-shadow)}",
    G + "[data-glow]{overflow:hidden}",
    G +
      '[data-glow]::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,var(--g-sheen) 48%,var(--g-glow) 52%,transparent 65%);background-size:250% 100%;background-position:120% 0;animation:juh-glass-sheen 7s ease-in-out infinite}',
    G + "[data-glow]:hover::after{animation-duration:2.2s}",
    G +
      ".plate{box-shadow:0 0 0 1px var(--g-panel-line),0 20px 60px var(--g-glow)}",
    G + ".btn-primary{animation:juh-glass-pulse 3.6s ease-in-out infinite}",
    "@keyframes juh-glass-sheen{0%,55%{background-position:120% 0}100%{background-position:-120% 0}}",
    "@keyframes juh-glass-pulse{0%,100%{box-shadow:0 0 0 1px var(--g-glow),0 8px 22px var(--g-glow)}50%{box-shadow:0 0 0 1px var(--color-accent),0 8px 32px var(--g-glow)}}",
    "@keyframes juh-glass-drift{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(6vw,-4vh,0) scale(1.15)}100%{transform:translate3d(0,0,0) scale(1)}}",
    "@keyframes juh-glass-flow{to{stroke-dashoffset:-48}}",
    "@keyframes juh-glass-node{0%,100%{opacity:.55}50%{opacity:1}}",
    "#juh-glass-bg{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}",
    "#juh-glass-bg .blob{position:absolute;width:46vmax;height:46vmax;border-radius:50%;filter:blur(70px);opacity:.38;animation:juh-glass-drift 26s ease-in-out infinite}",
    "#juh-glass-bg .b1{left:-12vmax;top:-14vmax;background:var(--g-b1)}",
    "#juh-glass-bg .b2{right:-14vmax;top:18vh;background:var(--g-b2);opacity:.24;animation-duration:32s;animation-delay:-8s}",
    "#juh-glass-bg .b3{left:22vw;bottom:-22vmax;background:var(--g-b3);opacity:.26;animation-duration:38s;animation-delay:-15s}",
    "#juh-glass-bg svg{position:absolute;inset:0;width:100%;height:100%;opacity:.5}",
    "#juh-glass-bg .edge{fill:none;stroke:var(--g-edge);stroke-width:1.2}",
    "#juh-glass-bg .flow{fill:none;stroke:var(--color-accent);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:6 42;opacity:.75;animation:juh-glass-flow 2.4s linear infinite}",
    "#juh-glass-bg .node{fill:var(--g-node);stroke:var(--g-node-line);stroke-width:1.2;animation:juh-glass-node 4s ease-in-out infinite}",
    "#juh-glass-bg .core,#juh-glass-bg .pkt{fill:var(--color-accent)}",
    "@media (prefers-reduced-motion: reduce){#juh-glass-bg *," +
      G +
      "[data-glow]::after," +
      G +
      ".btn-primary{animation:none!important}#juh-glass-bg .pkt{display:none}}",
  ].join("\n");
  // A small service graph: gateway, queue, workers, stores and LLM providers.
  var GLASS_NODES = [
    [180, 200],
    [430, 140],
    [430, 330],
    [700, 230],
    [960, 120],
    [960, 360],
    [1220, 220],
    [300, 620],
    [620, 560],
    [900, 700],
    [1200, 580],
    [1340, 820],
    [120, 820],
  ];
  var GLASS_EDGES = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
    [2, 7],
    [7, 8],
    [8, 3],
    [8, 9],
    [9, 10],
    [10, 6],
    [10, 11],
    [7, 12],
    [5, 10],
  ];
  function glassSvg() {
    var ns = "http://www.w3.org/2000/svg",
      edges = "",
      flows = "",
      pkts = "",
      nodes = "";
    GLASS_EDGES.forEach(function (e, i) {
      var a = GLASS_NODES[e[0]],
        b = GLASS_NODES[e[1]];
      var mx = (a[0] + b[0]) / 2,
        my = (a[1] + b[1]) / 2 - 40;
      var d =
        "M" +
        a[0] +
        " " +
        a[1] +
        " Q" +
        mx +
        " " +
        my +
        " " +
        b[0] +
        " " +
        b[1];
      edges += '<path class="edge" d="' + d + '"/>';
      flows +=
        '<path class="flow" d="' +
        d +
        '" style="animation-delay:-' +
        (i * 0.37).toFixed(2) +
        's"/>';
      if (i % 2 === 0)
        pkts +=
          '<circle class="pkt" r="3"><animateMotion dur="' +
          (3 + (i % 5) * 0.7) +
          's" repeatCount="indefinite" begin="-' +
          i * 0.5 +
          's" path="' +
          d +
          '"/></circle>';
    });
    GLASS_NODES.forEach(function (n, i) {
      nodes +=
        '<g style="animation-delay:-' +
        i * 0.6 +
        's"><rect class="node" x="' +
        (n[0] - 34) +
        '" y="' +
        (n[1] - 18) +
        '" width="68" height="36" rx="10" style="animation-delay:-' +
        i * 0.6 +
        's"/><circle class="core" cx="' +
        n[0] +
        '" cy="' +
        n[1] +
        '" r="3.5"/></g>';
    });
    return (
      '<svg xmlns="' +
      ns +
      '" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      edges +
      flows +
      pkts +
      nodes +
      "</svg>"
    );
  }
  function glassFx(on) {
    var st = document.getElementById("juh-glass-css"),
      bg = document.getElementById("juh-glass-bg");
    if (on) document.documentElement.setAttribute("data-glass", "");
    else document.documentElement.removeAttribute("data-glass");
    if (!on) {
      if (bg) bg.remove();
      return;
    }
    if (!st) {
      st = document.createElement("style");
      st.id = "juh-glass-css";
      st.textContent = GLASS_CSS;
      document.head.appendChild(st);
    }
    if (bg) return;
    bg = document.createElement("div");
    bg.id = "juh-glass-bg";
    bg.setAttribute("aria-hidden", "true");
    bg.innerHTML =
      '<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>' +
      glassSvg();
    (function mount() {
      if (document.body)
        document.body.insertBefore(bg, document.body.firstChild);
      else document.addEventListener("DOMContentLoaded", mount, { once: true });
    })();
  }
  function set(k) {
    try {
      localStorage.setItem(KEY, k);
    } catch (e) {}
    apply(k);
  }
  function get() {
    return current;
  }
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && THEMES[e.newValue]) apply(e.newValue);
  });

  var io = null;
  function reveal() {
    if (
      window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    if (!io)
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target;
            io.unobserve(el);
            setTimeout(
              function () {
                el.style.opacity = el._rv.o;
                el.style.transform = el._rv.t;
                setTimeout(function () {
                  el.style.transition = el._rv.tr;
                }, 900);
              },
              +el.getAttribute("data-reveal") || 0,
            );
          });
        },
        { rootMargin: "0px 0px -6% 0px" },
      );
    document
      .querySelectorAll("[data-reveal]:not([data-rv])")
      .forEach(function (el) {
        el.setAttribute("data-rv", "1");
        el._rv = {
          o: el.style.opacity,
          t: el.style.transform,
          tr: el.style.transition,
        };
        el.style.transition =
          "opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)";
        el.style.opacity = "0";
        el.style.transform = "translateY(16px)";
        io.observe(el);
      });
  }

  function pointerFx() {
    if (
      !window.matchMedia ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    var spot = document.createElement("div");
    spot.setAttribute("aria-hidden", "true");
    spot.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:15;opacity:0;transition:opacity .5s ease;background:radial-gradient(520px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 62%);";
    var ring = document.createElement("div");
    ring.setAttribute("aria-hidden", "true");
    ring.style.cssText =
      "position:fixed;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;border:1px solid var(--color-accent);border-radius:50%;pointer-events:none;z-index:70;opacity:0;transition:opacity .3s ease, width .25s ease, height .25s ease, margin .25s ease, background-color .25s ease;";
    function mount() {
      if (document.body && !spot.parentNode) {
        document.body.appendChild(spot);
        document.body.appendChild(ring);
      }
    }
    var x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      lastGlow = null,
      lastTilt = null;
    function loop() {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      raf =
        Math.abs(x - rx) + Math.abs(y - ry) > 0.3
          ? requestAnimationFrame(loop)
          : 0;
    }
    document.addEventListener(
      "pointermove",
      function (e) {
        if (e.pointerType !== "mouse") return;
        mount();
        x = e.clientX;
        y = e.clientY;
        spot.style.opacity = "1";
        ring.style.opacity = ".55";
        spot.style.setProperty("--mx", x + "px");
        spot.style.setProperty("--my", y + "px");
        if (!raf) raf = requestAnimationFrame(loop);
        var t = e.target && e.target.closest ? e.target : null;
        var interactive =
          t && t.closest("a,button,[role=tab],[role=radio],input");
        var big = !!interactive;
        ring.style.width = ring.style.height = big ? "46px" : "30px";
        ring.style.margin = big ? "-23px 0 0 -23px" : "-15px 0 0 -15px";
        ring.style.backgroundColor = big
          ? "color-mix(in srgb, var(--color-accent) 10%, transparent)"
          : "transparent";
        var g = t && t.closest("[data-glow]");
        if (lastGlow && lastGlow !== g) {
          lastGlow.style.setProperty("--gx", "-50%");
          lastGlow.style.setProperty("--gy", "-50%");
        }
        if (g) {
          var r = g.getBoundingClientRect();
          g.style.setProperty("--gx", x - r.left + "px");
          g.style.setProperty("--gy", y - r.top + "px");
        }
        lastGlow = g;
        var tl = t && t.closest("[data-tilt]");
        if (lastTilt && lastTilt !== tl) lastTilt.style.transform = "";
        if (tl) {
          var b = tl.getBoundingClientRect();
          var px = (x - b.left) / b.width - 0.5,
            py = (y - b.top) / b.height - 0.5;
          tl.style.transform =
            "perspective(900px) rotateY(" +
            (px * 8).toFixed(2) +
            "deg) rotateX(" +
            (-py * 8).toFixed(2) +
            "deg) scale(1.015)";
        }
        lastTilt = tl;
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", function () {
      spot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.documentElement.addEventListener("mouseleave", function () {
      spot.style.opacity = "0";
      ring.style.opacity = "0";
    });
  }

  apply(saved() || DEFAULT);
  pointerFx();
  window.JUHTheme = {
    THEMES: THEMES,
    KEY: KEY,
    DEFAULT: DEFAULT,
    get: get,
    set: set,
    apply: apply,
    saved: saved,
    reveal: reveal,
  };
})();
