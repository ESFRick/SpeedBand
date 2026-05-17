/* global React */
// Concept B · "Pulse" — vibrant, color-coded, gauge-led product dashboard.
// v2: gauge moved into the hero, label overlap fixed, layout tightened.

(function () {
  const D = window.SB;

  /* ---------- accent palettes ---------- */
  const ACCENTS = {
    spectrum: { a: '#7ad6ff', b: '#a77fff', c: '#ff7ab8', live: '#a77fff', soft: 'rgba(167,127,255,0.10)', strong: 'rgba(167,127,255,0.45)' },
    ocean:    { a: '#7ad6ff', b: '#5fb1f0', c: '#6f6fff', live: '#5fb1f0', soft: 'rgba(95,177,240,0.10)',  strong: 'rgba(95,177,240,0.45)'  },
    forest:   { a: '#9fe5b8', b: '#4ad8a3', c: '#2e9f86', live: '#4ad8a3', soft: 'rgba(74,216,163,0.10)',  strong: 'rgba(74,216,163,0.45)'  },
    ember:    { a: '#ffd58a', b: '#ff9a64', c: '#ff6b78', live: '#ff9a64', soft: 'rgba(255,154,100,0.10)', strong: 'rgba(255,154,100,0.45)' },
  };

  /* ---------- i18n ---------- */
  const TX = {
    en: {
      tagline:'Local bandwidth & stability', server:'Server', client:'Client', copyUrl:'Copy URL',
      headline_idle:'Ready to calibrate.',
      headline_testing:'Calibrating your link\u2026',
      headline_complete_pre:'Realtime-safe to ',
      headline_warning:'Stability is borderline.',
      scenario:'Scenario', scenarioNote:'VR streaming \u00B7 200 Mbps target',
      start:'Start calibration', stop:'Stop calibration', quick:'Quick test', full:'Full stability', advanced:'Advanced',
      probing:'Probing 200 Mbps \u00B7 step 8 of 12',
      warnTitle:"You're testing on the same PC.",
      warnBody:'This measures loopback, not your real LAN/Wi-Fi. Open',
      warnBodyTail:'from another device for meaningful numbers.',
      gotIt:'Got it',
      m_upload:'Upload', m_latency:'Latency', m_jitter:'Jitter', m_loss:'Packet loss', m_stability:'Stability',
      chartTitle:'Throughput timeline', chartSub:'HTTP throughput & realtime ladder \u00B7 last 60 s',
      lg_download:'Download', lg_upload:'Upload', lg_target:'Target', lg_receive:'Receive',
      tab_all:'All', tab_http:'HTTP', tab_rt:'Realtime',
      ladderTitle:'Bitrate ladder', ladderSub:'Each step probes a target bitrate and measures stability.',
      rtNote:'Realtime \u00B7 WebSocket fallback',
      th_status:'Status', th_target:'Target', th_actual:'Actual', th_loss:'Loss', th_jitter:'Jitter', th_p5:'p5', th_spike:'Spike', th_queue:'Queue',
      st_pass:'Stable', st_watch:'Watch', st_fail:'Unstable', st_live:'Probing', st_idle:'Pending',
      recTitle:'Stable bitrate range', recSub:'Streaming apps may behave differently depending on codec, decoding, CPU/GPU load and Wi\u2011Fi conditions.',
      r_safe:'Very safe', r_rec:'Recommended', r_risky:'Risky upper', r_avoid:'Avoid', r_pick:'Pick',
      reportTitle:'Report', reportSub:'Copy a summary, download the full JSON, or save a readable log on the host.',
      btn_copy:'Copy summary', btn_json:'Download JSON', btn_save:'Save to server', btn_tech:'Technical details',
      verdictReady:'Ready', verdictPass:'Calibration complete', verdictRun:'Calibrating \u00B7 ladder step 8/12', verdictWarn:'Stability warning',
    },
    ru: {
      tagline:'Локальный тест скорости и стабильности', server:'Сервер', client:'Клиент', copyUrl:'Копировать URL',
      headline_idle:'Готов к калибровке.',
      headline_testing:'Калибруем соединение\u2026',
      headline_complete_pre:'Realtime-стабильно до ',
      headline_warning:'Стабильность на грани.',
      scenario:'Сценарий', scenarioNote:'VR-стриминг \u00B7 цель 200 Мбит/с',
      start:'Запустить калибровку', stop:'Остановить', quick:'Быстрый тест', full:'Полный тест', advanced:'Параметры',
      probing:'Зондирование 200 Мбит/с \u00B7 шаг 8 из 12',
      warnTitle:'Вы тестируете на том же ПК.',
      warnBody:'Измеряется loopback, а не реальный LAN/Wi-Fi. Откройте',
      warnBodyTail:'с другого устройства для осмысленных результатов.',
      gotIt:'Понятно',
      m_upload:'Отдача', m_latency:'Задержка', m_jitter:'Джиттер', m_loss:'Потери пакетов', m_stability:'Стабильность',
      chartTitle:'Пропускная способность во времени', chartSub:'HTTP и realtime \u00B7 последние 60 с',
      lg_download:'Загрузка', lg_upload:'Отдача', lg_target:'Цель', lg_receive:'Приём',
      tab_all:'Все', tab_http:'HTTP', tab_rt:'Реалтайм',
      ladderTitle:'Лестница битрейтов', ladderSub:'Каждый шаг проверяет целевой битрейт и измеряет стабильность.',
      rtNote:'Реалтайм \u00B7 WebSocket fallback',
      th_status:'Статус', th_target:'Цель', th_actual:'Факт', th_loss:'Потери', th_jitter:'Джиттер', th_p5:'p5', th_spike:'Пик', th_queue:'Очередь',
      st_pass:'Стабильно', st_watch:'Внимание', st_fail:'Нестабильно', st_live:'Проверка', st_idle:'Ожидание',
      recTitle:'Стабильный диапазон битрейта', recSub:'Стриминг-приложения могут вести себя иначе в зависимости от кодека, декодера, нагрузки на CPU/GPU и Wi-Fi.',
      r_safe:'Очень безопасно', r_rec:'Рекомендуется', r_risky:'Зона риска', r_avoid:'Избегать', r_pick:'Выбор',
      reportTitle:'Отчёт', reportSub:'Скопируйте сводку, скачайте JSON или сохраните читаемый лог на хосте.',
      btn_copy:'Скопировать сводку', btn_json:'Скачать JSON', btn_save:'Сохранить на сервере', btn_tech:'Тех. детали',
      verdictReady:'Готов', verdictPass:'Калибровка завершена', verdictRun:'Калибровка \u00B7 шаг 8/12', verdictWarn:'Предупреждение стабильности',
    },
  };

  /* ---------- inline timeline chart ---------- */
  const PulseChart = ({ state }) => {
    const W = 1180, H = 300, padL = 56, padR = 24, padT = 18, padB = 30;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const ymax = 400;
    const xs = D.chart.t;
    const empty = state === 'idle';

    const linePath = (series, mode = 'smooth') => {
      const pts = series.map((v, i) => [padL + (i / (xs.length - 1)) * innerW, padT + innerH - (v / ymax) * innerH]);
      if (mode === 'step') {
        let s = `M ${pts[0][0]} ${pts[0][1]}`;
        for (let i = 1; i < pts.length; i++) s += ` H ${pts[i][0]} V ${pts[i][1]}`;
        return s;
      }
      let s = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
        const cx = (x1 + x2) / 2;
        s += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
      }
      return s;
    };
    const areaPath = (series) => `${linePath(series)} L ${padL + innerW} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 300, display: 'block' }}>
        <defs>
          <linearGradient id="puDl" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4fb8ff" stopOpacity="0.50" />
            <stop offset="100%" stopColor="#4fb8ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="puUp" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4ad8a3" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#4ad8a3" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="puDlLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#4fb8ff" />
            <stop offset="100%" stopColor="#a77fff" />
          </linearGradient>
        </defs>

        {[0, 100, 200, 300, 400].map(v => {
          const y = padT + innerH - (v / ymax) * innerH;
          return (
            <g key={v}>
              <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
              <text x={padL - 10} y={y + 4} fill="#6b7488" fontSize="11" textAnchor="end" fontFamily="ui-monospace, JetBrains Mono, monospace">{v}</text>
            </g>
          );
        })}
        {[0, 15, 30, 45, 60].map(s => {
          const x = padL + (s / 60) * innerW;
          return <text key={s} x={x} y={H - 8} fill="#6b7488" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{s}s</text>;
        })}

        {!empty && (
          <g>
            <path d={areaPath(D.chart.downloadSeries)} fill="url(#puDl)" />
            <path d={areaPath(D.chart.uploadSeries)} fill="url(#puUp)" />
            <path d={linePath(D.chart.targetSeries, 'step')} fill="none" stroke="#ffb84a" strokeWidth="1.5" strokeDasharray="6 4" />
            <path d={linePath(D.chart.uploadSeries)} fill="none" stroke="#4ad8a3" strokeWidth="2" />
            <path d={linePath(D.chart.downloadSeries)} fill="none" stroke="url(#puDlLine)" strokeWidth="2.5" />
            {state === 'testing' && (() => {
              const i = Math.floor(xs.length * 0.7);
              const v = D.chart.downloadSeries[i];
              const x = padL + (i / (xs.length - 1)) * innerW;
              const y = padT + innerH - (v / ymax) * innerH;
              return (<g><circle cx={x} cy={y} r="12" fill="#a77fff" opacity="0.18" /><circle cx={x} cy={y} r="4.5" fill="#a77fff" /></g>);
            })()}
          </g>
        )}
        {empty && <text x={W / 2} y={H / 2} fill="#6b7488" fontSize="13" textAnchor="middle">Awaiting first measurement…</text>}
      </svg>
    );
  };

  /* ---------- mini sparkline ---------- */
  const Sparkline = ({ series, color = '#4fb8ff', height = 26, width = '100%' }) => {
    const W = 120, H = height, pad = 2;
    const ymax = Math.max(...series), ymin = Math.min(...series);
    const span = Math.max(1, ymax - ymin);
    const pts = series.map((v, i) => [pad + (i / (series.length - 1)) * (W - pad * 2), H - pad - ((v - ymin) / span) * (H - pad * 2)]);
    const d = pts.reduce((s, [x, y], i) => s + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`), '');
    const area = d + ` L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`;
    const gid = `sp-${color.replace('#', '')}-${height}`;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width, height, display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid})`} />
        <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  };

  /* ---------- circular gauge (SVG arc + HTML readout overlay) ---------- */
  const Gauge = ({ value, max = 400, state = 'complete', size = 300, accent = 'spectrum', label = 'DOWNLOAD' }) => {
    const pal = ACCENTS[accent] || ACCENTS.spectrum;
    const stroke = 16, r = size / 2 - stroke - 10;
    const cx = size / 2, cy = size / 2;
    const startA = 135, endA = 405;
    const range = endA - startA;
    const numeric = typeof value === 'number' ? value : parseFloat(value) || 0;
    const frac = state === 'idle' ? 0 : Math.min(1, numeric / max);
    const toXY = (a) => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r];
    const arc = (a1, a2) => {
      const [x1, y1] = toXY(a1), [x2, y2] = toXY(a2);
      const large = a2 - a1 > 180 ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    };
    const valueA = startA + range * frac;

    const ticks = [];
    const labelTicks = [0, 100, 200, 300, 400];
    for (let i = 0; i <= 16; i++) {
      const a = startA + (range / 16) * i;
      const major = i % 4 === 0;
      const [x1, y1] = toXY(a);
      const [x2, y2] = [cx + Math.cos((a * Math.PI) / 180) * (r + (major ? 12 : 7)), cy + Math.sin((a * Math.PI) / 180) * (r + (major ? 12 : 7))];
      ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.10)'} strokeWidth={major ? 1.5 : 1} />);
    }
    const tickLabels = labelTicks.map((v, idx) => {
      const a = startA + (range / 4) * idx;
      const [tx, ty] = [cx + Math.cos((a * Math.PI) / 180) * (r + 26), cy + Math.sin((a * Math.PI) / 180) * (r + 26)];
      return <text key={v} x={tx} y={ty + 4} fill="#6b7488" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em">{v}</text>;
    });

    const displayValue = state === 'idle' ? '—' : (typeof value === 'number' ? value : value);

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={`gaugeStroke-${accent}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={pal.a} />
              <stop offset="55%" stopColor={pal.b} />
              <stop offset="100%" stopColor={pal.c} />
            </linearGradient>
            <filter id="gaugeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path d={arc(startA, endA)} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" strokeLinecap="round" />
          {state !== 'idle' && (
            <>
              <path d={arc(startA, valueA)} stroke={`url(#gaugeStroke-${accent})`} strokeWidth={stroke} fill="none" strokeLinecap="round" filter="url(#gaugeGlow)" opacity="0.55" />
              <path d={arc(startA, valueA)} stroke={`url(#gaugeStroke-${accent})`} strokeWidth={stroke} fill="none" strokeLinecap="round" />
            </>
          )}
          {ticks}
          {tickLabels}
        </svg>
        {/* HTML readout overlay — no SVG text collisions */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
          paddingBottom: 14,
        }}>
          <div style={{ fontSize: 10, color: '#7d8a9e', letterSpacing: '0.22em', fontWeight: 700, marginBottom: 8 }}>{label}</div>
          <div style={{
            fontSize: 72, lineHeight: 0.95, fontWeight: 700, letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums', color: '#ffffff',
            textShadow: state !== 'idle' ? '0 0 32px rgba(167,127,255,0.35)' : 'none',
          }}>{displayValue}</div>
          <div style={{ fontSize: 13, color: '#7d8a9e', marginTop: 6, letterSpacing: '0.08em' }}>Mbps</div>
        </div>
      </div>
    );
  };

  /* ===================== main screen ===================== */
  window.PulseScreen = function PulseScreen(props) {
    const stateKey = props.stateKey || 'complete';
    const onStateChange = props.onStateChange; // optional, prototype only
    const interactive = !!onStateChange;
    const language = props.language || 'en';
    const showWarning = props.showWarning !== false;
    const accent = props.accent || 'spectrum';
    const T = TX[language] || TX.en;
    const pal = ACCENTS[accent] || ACCENTS.spectrum;
    const heroGrad = `linear-gradient(135deg, ${pal.a} 0%, ${pal.b} 55%, ${pal.c} 100%)`;
    const data = D.states[stateKey];
    const m = data.metrics;

    const colors = {
      upload: '#4ad8a3',
      latency: '#a77fff',
      jitter: '#ffb84a',
      loss: '#ff7ab8',
      stability: '#5be0ad',
    };
    const toneBg = {
      good: 'rgba(74,216,163,0.13)', warn: 'rgba(255,184,74,0.13)',
      bad: 'rgba(255,107,120,0.13)', idle: 'rgba(255,255,255,0.05)',
    };
    const toneColor = { good: '#5be0ad', warn: '#ffb84a', bad: '#ff7a85', idle: '#7d8a9e', live: '#a77fff' };
    const stateColor = data.state === 'complete' ? '#5be0ad'
      : data.state === 'testing' ? pal.live
        : data.state === 'warning' ? '#ffb84a' : '#7d8a9e';

    return (
      <div style={{
        fontFamily: '"Plus Jakarta Sans", Inter, system-ui, -apple-system, sans-serif',
        color: '#e7edf5', minHeight: 2300, background: '#0b0d12', letterSpacing: 0,
      }}>
        <style>{`
          @keyframes pupulse { 0%,100%{opacity:1} 50%{opacity:.45} }
          @keyframes pubreathe { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.06);opacity:.85} }
          .pu-card{ background:#13161f; border:1px solid rgba(255,255,255,0.06); border-radius:20px; position:relative; overflow:hidden; }
          .pu-card::before{content:'';position:absolute;inset:0 0 auto 0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent);}
          .pu-btn{ height:44px; padding:0 18px; border-radius:12px; font-weight:600; font-size:14px; color:#e7edf5; background:#1a1f2c; border:1px solid rgba(255,255,255,0.07); cursor:pointer; transition: all .15s; display:inline-flex; align-items:center; gap:8px; font-family:inherit; letter-spacing:0;}
          .pu-btn:hover{ background:#212737; border-color:rgba(255,255,255,0.12);}
          .pu-btn.primary{ height:52px; padding:0 24px; font-size:15px; font-weight:700; color:#0a0c14; background:linear-gradient(135deg,#7ad6ff 0%, #a77fff 55%, #ff7ab8 100%); border:0; box-shadow:0 12px 32px rgba(167,127,255,0.28);}
          .pu-btn.primary:hover{ box-shadow:0 18px 40px rgba(167,127,255,0.40); transform:translateY(-1px);}
          .pu-btn.ghost{ background:transparent; border:1px solid rgba(255,255,255,0.07);}
          .pu-tab{ height:36px; padding:0 14px; border-radius:9px; color:#9aa6b8; background:transparent; border:0; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit;}
          .pu-tab:hover{ color:#e7edf5;}
          .pu-tab.active{ background:#212737; color:#fff;}
          .pu-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;}
          .pu-tnum{font-variant-numeric: tabular-nums;}
          .pu-bg{
            background:
              radial-gradient(900px 480px at 80% -120px, rgba(167,127,255,0.16), transparent 60%),
              radial-gradient(700px 400px at 12% 8%, rgba(79,184,255,0.12), transparent 60%),
              #0b0d12;
          }
          .pu-chip{display:flex;align-items:center;justify-content:space-between;padding:0 14px;height:46px;border-radius:11px;background:#1a1f2c;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all .15s;}
          .pu-chip:hover{background:#212737;border-color:rgba(255,255,255,0.10);}
          .pu-chip.selected{background:linear-gradient(135deg, rgba(79,184,255,0.10), rgba(167,127,255,0.10));border-color:rgba(167,127,255,0.45);box-shadow:0 0 0 1px rgba(167,127,255,0.20), 0 8px 24px rgba(167,127,255,0.12);}
          .pu-chip.selected .pu-chip-dot{background:#a77fff; box-shadow:0 0 10px #a77fff88;}
          .pu-chip-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.18);}
        `}</style>

        <div className="pu-bg">
          {/* ==================== TOPBAR ==================== */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(11,13,18,0.72)', backdropFilter: 'blur(14px)',
            position: 'sticky', top: 0, zIndex: 5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: heroGrad,
                display: 'grid', placeItems: 'center', boxShadow: `0 10px 28px ${pal.strong}`,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12c4 0 4-6 8-6s4 12 8 12 4-6 4-6" stroke="#0a0c14" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>SpeedBand</div>
                <div style={{ fontSize: 12, color: '#7d8a9e', marginTop: 2 }}>{T.tagline}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'inline-flex', padding: 3, borderRadius: 12, background: '#13161f', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button className="pu-tab" style={{ height: 32, padding: '0 14px' }}>EN</button>
                <button className="pu-tab active" style={{ height: 32, padding: '0 14px' }}>RU</button>
              </div>
              <div className="pu-pill" style={{ background: '#13161f', border: '1px solid rgba(255,255,255,0.06)', color: '#c4cdda', height: 38 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: '#5be0ad', boxShadow: '0 0 10px #5be0ad88' }} />
                {T.server} · <span className="pu-tnum">192.168.1.42:3489</span>
              </div>
              <div className="pu-pill" style={{ background: '#13161f', border: '1px solid rgba(255,255,255,0.06)', color: '#9aa6b8', height: 38 }}>
                {T.client} · Chrome 137
              </div>
              <button className="pu-btn" style={{ height: 38 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 4h9v9M15 9 4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {T.copyUrl}
              </button>
            </div>
          </div>

          <div style={{ padding: '28px 48px 64px', maxWidth: 1320, margin: '0 auto' }}>
            {/* ==================== HERO ==================== */}
            <div className="pu-card" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 0, alignItems: 'stretch' }}>
              {/* LEFT — gauge column */}
              <div style={{
                padding: '32px 28px', borderRight: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                background: 'radial-gradient(420px 320px at 50% 30%, rgba(167,127,255,0.10), transparent 70%)',
                position: 'relative',
              }}>
                {data.state === 'testing' && (
                  <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: pal.live, letterSpacing: '0.18em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: pal.live, animation: 'pupulse 1.2s infinite' }} /> LIVE
                  </div>
                )}
                <Gauge value={data.state === 'idle' ? '—' : Number(data.headline)} state={data.state} size={300} accent={accent} label={T.lg_download.toUpperCase()} />
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4,auto)', gap: 18, justifyContent: 'center' }}>
                  {[
                    ['peak', data.state === 'idle' ? '—' : '247'],
                    ['p95',  data.state === 'idle' ? '—' : '231'],
                    ['p5',   data.state === 'idle' ? '—' : '188'],
                    ['avg',  data.state === 'idle' ? '—' : '218'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#6b7488', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700 }}>{l}</div>
                      <div className="pu-tnum" style={{ marginTop: 4, fontSize: 16, color: '#e7edf5', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — controls column */}
              <div style={{ padding: '30px 36px', display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span className="pu-pill" style={{
                      background: `${stateColor}1f`, color: stateColor, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 11,
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: stateColor, boxShadow: `0 0 10px ${stateColor}88`, animation: data.state === 'testing' ? 'pupulse 1.4s infinite' : 'none' }} />
                      {data.state === 'testing' ? T.verdictRun
                        : data.state === 'complete' ? T.verdictPass
                        : data.state === 'warning' ? T.verdictWarn
                        : T.verdictReady}
                    </span>
                    <span style={{ fontSize: 12, color: '#7d8a9e', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
                      RUN <span style={{ color: '#c4cdda' }}>0x4B81F0</span>
                      <span style={{ margin: '0 10px' }}>·</span>
                      T+ <span style={{ color: '#c4cdda' }} className="pu-tnum">{data.state === 'idle' ? '00:00.0' : data.state === 'testing' ? '00:38.4' : '00:58.2'}</span>
                    </span>
                  </div>
                  <h1 style={{
                    margin: '18px 0 8px', fontSize: 40, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05,
                    background: 'linear-gradient(180deg, #ffffff, #b8c3d4 95%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  }}>{data.state === 'complete' ? T.headline_complete_pre :
                    data.state === 'warning' ? T.headline_warning :
                      data.state === 'testing' ? T.headline_testing :
                        T.headline_idle}
                    {data.state === 'complete' && <span className="pu-tnum" style={{
                      background: heroGrad,
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                    }}>180 Mbps</span>}
                  </h1>
                  <p style={{ color: '#a8b3c2', fontSize: 15, margin: 0, lineHeight: 1.55, maxWidth: 620 }}>{data.headlineSub}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: '#7d8a9e', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700 }}>{T.scenario}</span>
                    <span style={{ fontSize: 12, color: pal.live, fontWeight: 600 }}>{T.scenarioNote}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      { l: 'General', i: 'M5 12h14M12 5v14' },
                      { l: 'VR', i: 'M3 7h18v10H3z M7 12h10', selected: true },
                      { l: 'Game', i: 'M6 11h4m-2-2v4M16 12h.01M14 14h.01M2 12c0-3.5 1.7-5 5-5h10c3.3 0 5 1.5 5 5v0c0 3.5-1.7 5-5 5H7c-3.3 0-5-1.5-5-5Z' },
                      { l: 'NAS', i: 'M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01' },
                    ].map((c, i) => (
                      <div key={c.l} className={c.selected ? 'pu-chip selected' : 'pu-chip'}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: c.selected ? '#c1adff' : '#7d8a9e' }}>
                            <path d={c.i} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span style={{ fontSize: 13, fontWeight: c.selected ? 700 : 500, color: c.selected ? '#fff' : '#c4cdda' }}>{c.l}</span>
                        </span>
                        <span className="pu-chip-dot" />
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {data.state === 'testing' ? (
                    <button className="pu-btn primary" onClick={interactive ? () => onStateChange('complete') : undefined}
                      style={{ background: 'linear-gradient(135deg,#ff7ab8,#ff6b78)', color: '#fff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                      {T.stop}
                    </button>
                  ) : (
                    <button className="pu-btn primary" onClick={interactive ? () => onStateChange('testing') : undefined} style={{ background: heroGrad }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      {T.start}
                    </button>
                  )}
                  <button className="pu-btn" onClick={interactive ? () => onStateChange('complete') : undefined}>{T.quick}</button>
                  <button className="pu-btn">{T.full}</button>
                  <button className="pu-btn ghost" style={{ marginLeft: 'auto' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    {T.advanced}
                  </button>
                </div>

                {data.state === 'testing' && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 12, background: pal.soft,
                    border: `1px solid ${pal.strong}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: pal.live, fontWeight: 600 }}>{T.probing}</span>
                      <span className="pu-tnum" style={{ fontSize: 12, color: pal.live, fontWeight: 700 }}>{Math.round(data.progress * 100)}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ width: `${data.progress * 100}%`, height: '100%', background: heroGrad, borderRadius: 999 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ==================== WARNING ==================== */}
            {showWarning && (data.state === 'idle' || data.state === 'warning') && (
              <div style={{
                marginTop: 16, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center',
                border: '1px solid rgba(255,184,74,0.30)',
                background: 'linear-gradient(90deg, rgba(255,184,74,0.10), rgba(255,184,74,0.02))', borderRadius: 14,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,184,74,0.20)', display: 'grid', placeItems: 'center', color: '#ffb84a', flex: '0 0 auto' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" /></svg>
                </div>
                <div style={{ fontSize: 14, color: '#e7c894', lineHeight: 1.55, flex: 1 }}>
                  <strong style={{ color: '#ffd699', fontWeight: 700 }}>{T.warnTitle}</strong>{' '}
                  {T.warnBody}{' '}
                  <code style={{ background: 'rgba(0,0,0,0.30)', padding: '2px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#ffd699' }}>http://192.168.1.42:3489</code>{' '}
                  {T.warnBodyTail}
                </div>
                <button className="pu-btn" style={{ height: 36, background: 'rgba(255,184,74,0.16)', borderColor: 'rgba(255,184,74,0.32)', color: '#ffd699' }}>{T.gotIt}</button>
              </div>
            )}

            {/* ==================== METRICS (5 cards, no download — gauge handles it) ==================== */}
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {[
                [T.m_upload,    m.upload,    colors.upload,    'M12 19V5m0 0-6 6m6-6 6 6'],
                [T.m_latency,   m.latency,   colors.latency,   'M3 12h4l3-8 4 16 3-8h4'],
                [T.m_jitter,    m.jitter,    colors.jitter,    'M3 6h4l2 12 2-18 2 12 2-6h5'],
                [T.m_loss,      m.loss,      colors.loss,      'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'],
                [T.m_stability, m.stability, colors.stability, 'M22 12 18 8v3H6V8L2 12l4 4v-3h12v3l4-4Z'],
              ].map(([label, mt, color, icon]) => (
                <div key={label} className="pu-card" style={{ padding: 18, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: `linear-gradient(90deg, ${color}, transparent)`, opacity: 0.85 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}1f`, display: 'grid', placeItems: 'center', color }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d={icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontSize: 12.5, color: '#a8b3c2', fontWeight: 600 }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 9.5, color: toneColor[mt.tone], background: toneBg[mt.tone], padding: '3px 8px', borderRadius: 999, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{mt.status}</span>
                  </div>
                  <div className="pu-tnum" style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>{mt.value}</span>
                    <span style={{ color: '#7d8a9e', fontSize: 14 }}>{mt.unit}</span>
                  </div>
                  <div style={{ marginTop: 12, height: 22 }}>
                    {data.state !== 'idle' && (
                      label === 'Upload'
                        ? <Sparkline series={D.chart.uploadSeries} color={color} height={22} />
                        : <Sparkline series={D.chart.downloadSeries.map(v => v * (0.6 + 0.3 * Math.random()))} color={color} height={22} />
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11, color: '#7d8a9e' }}>{mt.note}</div>
                </div>
              ))}
            </div>

            {/* ==================== CHART ==================== */}
            <div className="pu-card" style={{ marginTop: 16, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{T.chartTitle}</h2>
                  <p style={{ margin: '4px 0 0', color: '#7d8a9e', fontSize: 13 }}>{T.chartSub}</p>
                </div>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    {[[T.lg_download, '#4fb8ff'], [T.lg_upload, '#4ad8a3'], [T.lg_target, '#ffb84a'], [T.lg_receive, pal.live]].map(([l, c]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#a8b3c2' }}>
                        <span style={{ width: 10, height: 10, background: c, borderRadius: 3 }} />{l}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'inline-flex', padding: 3, borderRadius: 12, background: '#1a1f2c', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button className="pu-tab active">{T.tab_all}</button>
                    <button className="pu-tab">{T.tab_http}</button>
                    <button className="pu-tab">{T.tab_rt}</button>
                  </div>
                </div>
              </div>
              <PulseChart state={data.state} />
            </div>

            {/* ==================== LADDER ==================== */}
            <div className="pu-card" style={{ marginTop: 16, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{T.ladderTitle}</h2>
                  <p style={{ margin: '4px 0 0', color: '#7d8a9e', fontSize: 13 }}>{T.ladderSub}</p>
                </div>
                <div className="pu-pill" style={{ background: '#1a1f2c', border: '1px solid rgba(255,255,255,0.06)', color: '#c4cdda', height: 36 }}>
                  {T.rtNote}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, marginBottom: 22 }}>
                {data.ladder.map((r, i) => {
                  const tone = r.ok === 'pass' ? '#4ad8a3' : r.ok === 'watch' ? '#ffb84a' : r.ok === 'fail' ? '#ff6b78' : r.ok === 'live' ? '#a77fff' : 'rgba(255,255,255,0.08)';
                  const h = data.state === 'idle' ? 22 : (Math.min(r.target, 400) / 400) * 110 + 14;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{
                          width: '100%', height: h, borderRadius: 7,
                          background: r.ok === 'idle' ? 'rgba(255,255,255,0.04)' : `linear-gradient(180deg, ${tone}, ${tone}55)`,
                          border: `1px solid ${r.ok === 'idle' ? 'rgba(255,255,255,0.06)' : `${tone}66`}`,
                          boxShadow: r.ok === 'live' ? `0 0 0 2px ${tone}55, 0 0 24px ${tone}88` : 'none',
                          animation: r.ok === 'live' ? 'pupulse 1.4s infinite' : 'none',
                        }} />
                      </div>
                      <div className="pu-tnum" style={{ fontSize: 11, color: '#7d8a9e', fontWeight: 600 }}>{r.target}</div>
                    </div>
                  );
                })}
              </div>

              <table className="pu-tnum" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ color: '#7d8a9e', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {[T.th_status, T.th_target, T.th_actual, T.th_loss, T.th_jitter, T.th_p5, T.th_spike, T.th_queue].map(h => (
                      <th key={h} style={{ textAlign: h === T.th_status || h === T.th_target ? 'left' : 'right', padding: '12px 14px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.ladder.slice(0, 10).map((r, i) => {
                    const tone = r.ok === 'pass' ? '#4ad8a3' : r.ok === 'watch' ? '#ffb84a' : r.ok === 'fail' ? '#ff6b78' : r.ok === 'live' ? pal.live : '#7d8a9e';
                    const label = { pass: T.st_pass, watch: T.st_watch, fail: T.st_fail, live: T.st_live, idle: T.st_idle }[r.ok];
                    return (
                      <tr key={i} style={{ background: i % 2 ? 'rgba(255,255,255,0.012)' : 'transparent', color: '#c4cdda' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="pu-pill" style={{ background: `${tone}1a`, color: tone, fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: tone, animation: r.ok === 'live' ? 'pupulse 1.2s infinite' : 'none' }} />
                            {label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{r.target} <span style={{ color: '#7d8a9e' }}>Mbps</span></td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>{r.actual}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>{r.loss}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>{r.jitter}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>{r.p5}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>{r.spike}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', color: r.queue === 'severe' ? '#ff6b78' : r.queue === 'mild' ? '#ffb84a' : '#7d8a9e' }}>{r.queue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ==================== RECOMMENDATION ==================== */}
            <div className="pu-card" style={{ marginTop: 16, padding: 26 }}>
              <div style={{ marginBottom: 18 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{T.recTitle}</h2>
                <p style={{ margin: '4px 0 0', color: '#7d8a9e', fontSize: 13 }}>{T.recSub}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  [T.r_safe,   data.recommendation.verySafe,    '#4ad8a3', 'M5 13l4 4L19 7'],
                  [T.r_rec,    data.recommendation.recommended, pal.b,     'M12 2 14.39 8.25H21l-5.3 4 2 6.5L12 14.77 6.3 18.75l2-6.5L3 8.25h6.61L12 2Z'],
                  [T.r_risky,  data.recommendation.risky,       '#ffb84a', 'M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z'],
                  [T.r_avoid,  data.recommendation.avoid,       '#ff6b78', 'M18 6 6 18M6 6l12 12'],
                ].map(([label, r, color, icon], i) => (
                  <div key={label} style={{
                    padding: 22, borderRadius: 16,
                    background: i === 1 ? `linear-gradient(180deg, ${color}1f, ${color}06)` : '#1a1f2c',
                    border: i === 1 ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.05)',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: i === 1 ? `0 12px 36px ${color}1f` : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}1f`, color, display: 'grid', placeItems: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d={icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#c4cdda' }}>{label}</span>
                      {i === 1 && <span style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 8px', borderRadius: 999, background: color, color: '#0a0c14', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{T.r_pick}</span>}
                    </div>
                    <div className="pu-tnum" style={{ marginTop: 18, fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {r.value}{r.unit && <span style={{ color: '#7d8a9e', fontSize: 16, fontWeight: 500, marginLeft: 6 }}>{r.unit}</span>}
                    </div>
                    <div style={{ marginTop: 6, color: '#7d8a9e', fontSize: 12 }}>{r.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== REPORT ==================== */}
            <div className="pu-card" style={{ marginTop: 16, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{T.reportTitle}</h2>
                  <p style={{ margin: '4px 0 0', color: '#7d8a9e', fontSize: 13 }}>{T.reportSub}</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="pu-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 4h10v14M4 8h10v12H4z" stroke="currentColor" strokeWidth="1.7" /></svg>
                    {T.btn_copy}
                  </button>
                  <button className="pu-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                    {T.btn_json}
                  </button>
                  <button className="pu-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9Zm6 3h6" stroke="currentColor" strokeWidth="1.7" /></svg>
                    {T.btn_save}
                  </button>
                  <button className="pu-btn ghost">{T.btn_tech}</button>
                </div>
              </div>
              <pre style={{
                marginTop: 18, padding: 18, borderRadius: 12,
                background: '#0d0f15', border: '1px solid rgba(255,255,255,0.05)',
                color: '#9aa6b8', fontSize: 12.5, lineHeight: 1.7, fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                overflow: 'hidden',
              }}>{data.state === 'idle'
                ? '// No test has been run yet — start a calibration to populate this report.'
                : `SpeedBand · v0.9.4 · run 2026-05-17T18:42:11Z
preset:      vr-streaming        duration:  58.2 s
download:    238 Mbps (p95 231)  upload:    112 Mbps
latency:     3.2 ms  (p99 4.1)   jitter:    0.8 ms
loss:        0.05 %              stability: 98 / 100
recommended: 180 Mbps            verdict:   realtime-safe ✓`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };
})();
