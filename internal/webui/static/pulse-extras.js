"use strict";
// pulse-extras.js — SVG gauge + sparklines + stop button
// Runs after app.js. Reads heroValue DOM; never calls app.js internals.

(function () {

  /* ── helpers ── */
  const $ = (id) => document.getElementById(id);

  /* ════════════════════════════════════════
     1. SVG GAUGE
     Injects <svg> as first child of #gaugeWrap.
     Observes #heroValue textContent changes.
  ════════════════════════════════════════ */
  function initGauge() {
    const wrap = $("gaugeWrap");
    if (!wrap) return;

    const SIZE     = 280;
    const STROKE   = 14;
    const R        = SIZE / 2 - STROKE - 14;
    const CX = SIZE / 2, CY = SIZE / 2;
    const START_A  = 135;            // degrees
    const SWEEP    = 270;            // total arc degrees

    const NS = "http://www.w3.org/2000/svg";

    function degToXY(a) {
      const rad = (a * Math.PI) / 180;
      return [CX + Math.cos(rad) * R, CY + Math.sin(rad) * R];
    }
    function arcPath(a1, a2) {
      const [x1, y1] = degToXY(a1);
      const [x2, y2] = degToXY(a2);
      const large = (a2 - a1 > 180) ? 1 : 0;
      return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
    }

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width",  SIZE);
    svg.setAttribute("height", SIZE);
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    svg.style.cssText = "position:absolute;inset:0;pointer-events:none;";

    // defs
    const defs = document.createElementNS(NS, "defs");
    const grad = document.createElementNS(NS, "linearGradient");
    grad.id = "gaugeGrad";
    grad.setAttribute("x1","0"); grad.setAttribute("x2","1");
    grad.setAttribute("y1","0"); grad.setAttribute("y2","1");
    [["0%","#7ad6ff"],["50%","#a77fff"],["100%","#ff7ab8"]].forEach(([off,col]) => {
      const s = document.createElementNS(NS, "stop");
      s.setAttribute("offset", off);
      s.setAttribute("stop-color", col);
      grad.appendChild(s);
    });
    const glowFilt = document.createElementNS(NS, "filter");
    glowFilt.id = "gaugeGlow";
    glowFilt.setAttribute("x","-40%"); glowFilt.setAttribute("y","-40%");
    glowFilt.setAttribute("width","180%"); glowFilt.setAttribute("height","180%");
    const blur = document.createElementNS(NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation","8");
    glowFilt.appendChild(blur);
    defs.appendChild(grad);
    defs.appendChild(glowFilt);
    svg.appendChild(defs);

    // track (background arc)
    const track = document.createElementNS(NS, "path");
    track.setAttribute("d", arcPath(START_A, START_A + SWEEP));
    track.setAttribute("stroke", "rgba(255,255,255,0.06)");
    track.setAttribute("stroke-width", STROKE);
    track.setAttribute("fill", "none");
    track.setAttribute("stroke-linecap", "round");
    svg.appendChild(track);

    // glow arc
    const glowArc = document.createElementNS(NS, "path");
    glowArc.setAttribute("stroke", "url(#gaugeGrad)");
    glowArc.setAttribute("stroke-width", STROKE);
    glowArc.setAttribute("fill", "none");
    glowArc.setAttribute("stroke-linecap", "round");
    glowArc.setAttribute("filter", "url(#gaugeGlow)");
    glowArc.setAttribute("opacity", "0.5");
    svg.appendChild(glowArc);

    // main arc
    const fillArc = document.createElementNS(NS, "path");
    fillArc.setAttribute("stroke", "url(#gaugeGrad)");
    fillArc.setAttribute("stroke-width", STROKE);
    fillArc.setAttribute("fill", "none");
    fillArc.setAttribute("stroke-linecap", "round");
    svg.appendChild(fillArc);

    // tick marks
    for (let i = 0; i <= 20; i++) {
      const a   = START_A + (SWEEP / 20) * i;
      const major = (i % 5 === 0);
      const r1  = R - STROKE / 2 - 1;
      const r2  = R + STROKE / 2 + (major ? 8 : 4);
      const rad = (a * Math.PI) / 180;
      const line = document.createElementNS(NS, "line");
      line.setAttribute("x1", CX + Math.cos(rad) * r1);
      line.setAttribute("y1", CY + Math.sin(rad) * r1);
      line.setAttribute("x2", CX + Math.cos(rad) * r2);
      line.setAttribute("y2", CY + Math.sin(rad) * r2);
      line.setAttribute("stroke", major ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)");
      line.setAttribute("stroke-width", major ? "1.5" : "1");
      svg.appendChild(line);
    }

    wrap.insertBefore(svg, wrap.firstChild);

    let currentFrac = 0;
    let rafId = null;

    function setArc(frac) {
      frac = Math.max(0, Math.min(1, frac));
      if (frac < 0.001) {
        glowArc.setAttribute("d", "");
        fillArc.setAttribute("d", "");
        return;
      }
      const endA = START_A + SWEEP * frac;
      const d = arcPath(START_A, endA);
      glowArc.setAttribute("d", d);
      fillArc.setAttribute("d", d);
    }

    function animateTo(target) {
      if (rafId) cancelAnimationFrame(rafId);
      const start = currentFrac;
      const delta = target - start;
      const FRAMES = 24;
      let frame = 0;
      function step() {
        frame++;
        const t = frame / FRAMES;
        const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
        currentFrac = start + delta * ease;
        setArc(currentFrac);
        if (frame < FRAMES) rafId = requestAnimationFrame(step);
        else { currentFrac = target; rafId = null; }
      }
      rafId = requestAnimationFrame(step);
    }

    // observe heroValue
    const heroEl  = $("heroValue");
    const unitEl  = $("gaugeUnit");
    if (!heroEl) return;

    function update() {
      const max = parseFloat(wrap.dataset.max) || 500;
      const text = heroEl.textContent.trim();
      // Pure number only — "238", "45.2". Recommendation strings like
      // "350-500 Mbps within tested range" are NOT pure numeric.
      const pureNum = /^\d+\.?\d*$/.test(text);
      const num = parseFloat(text); // works for both "238" and "350-500 Mbps…"

      if (pureNum) {
        heroEl.classList.remove("is-text");
        if (unitEl) unitEl.classList.remove("hidden-unit");
        animateTo(num / max);
      } else {
        heroEl.classList.add("is-text");
        // hide standalone "Mbps" label when text already contains it
        if (unitEl) unitEl.classList.add("hidden-unit");
        // still draw arc at best-guess value (first number in string, or 0)
        animateTo(Number.isFinite(num) ? num / max : 0);
      }
    }

    const obs = new MutationObserver(update);
    obs.observe(heroEl, { childList: true, characterData: true, subtree: true });
    update();
  }

  /* ════════════════════════════════════════
     2. SPARKLINES
     Maintains per-metric rolling history.
     Observes metric value DOM nodes.
  ════════════════════════════════════════ */
  function initSparklines() {
    const HISTORY = 30; // data points kept

    const metrics = [
      { numId: "downloadValue", sparkId: "sparkDownload", color: "#4fb8ff" },
      { numId: "uploadValue",   sparkId: "sparkUpload",   color: "#4ad8a3" },
      { numId: "latencyValue",  sparkId: "sparkLatency",  color: "#a77fff" },
      { numId: "jitterValue",   sparkId: "sparkJitter",   color: "#ffb84a" },
      { numId: "lossValue",     sparkId: "sparkLoss",     color: "#ff7ab8" },
    ];

    const histories = {};
    metrics.forEach(m => { histories[m.numId] = []; });

    function drawSpark(container, series, color) {
      if (series.length < 2) { container.innerHTML = ""; return; }
      const W = 120, H = 24, pad = 2;
      const ymin = Math.min(...series);
      const ymax = Math.max(...series);
      const span = Math.max(1, ymax - ymin);
      const pts = series.map((v, i) => {
        const x = pad + (i / (series.length - 1)) * (W - pad * 2);
        const y = H - pad - ((v - ymin) / span) * (H - pad * 2);
        return [x, y];
      });
      const line = pts.reduce((s, [x, y], i) =>
        s + (i === 0 ? `M${x} ${y}` : ` L${x} ${y}`), "");
      const area = line + ` L${pts[pts.length-1][0]} ${H-pad} L${pts[0][0]} ${H-pad} Z`;
      const gid  = `sp-${color.replace("#","")}-${container.id}`;
      container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}">
        <defs><linearGradient id="${gid}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.40"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient></defs>
        <path d="${area}" fill="url(#${gid})"/>
        <path d="${line}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>`;
    }

    metrics.forEach(({ numId, sparkId, color }) => {
      const numEl  = $(numId);
      const spark  = $(sparkId);
      if (!numEl || !spark) return;

      const obs = new MutationObserver(() => {
        const v = parseFloat(numEl.textContent);
        if (!Number.isFinite(v)) return;
        const hist = histories[numId];
        hist.push(v);
        if (hist.length > HISTORY) hist.shift();
        drawSpark(spark, hist, color);
      });
      obs.observe(numEl, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ════════════════════════════════════════
     3. STOP BUTTON
     Shows/hides #stopButton by watching startButton disabled state.
     Click dispatches abort via window.speedbandStop if available,
     or falls back to app.js exposed abort (set by app.js itself).
  ════════════════════════════════════════ */
  function initStopButton() {
    const stopBtn  = $("stopButton");
    const startBtn = $("startButton");
    if (!stopBtn || !startBtn) return;

    // Watch startButton.disabled via MutationObserver (app.js sets it)
    const obs = new MutationObserver(() => {
      const running = startBtn.disabled;
      stopBtn.classList.toggle("hidden", !running);
    });
    obs.observe(startBtn, { attributes: true, attributeFilter: ["disabled"] });

    // Click: use the exposed abort hook set by app.js
    stopBtn.addEventListener("click", () => {
      if (typeof window._speedbandAbort === "function") {
        window._speedbandAbort();
      }
    });
  }

  /* ── init ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  function run() {
    initGauge();
    initSparklines();
    initStopButton();
  }

})();
