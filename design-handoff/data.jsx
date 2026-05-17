// Shared mock data + helpers for all SpeedBand redesign concepts.
// Each concept reads from window.SB.* and is fully static (no test runs).

window.SB = (function () {
  const COMPLETE = {
    state: 'complete',
    statusLabel: 'Calibration complete',
    headline: '238',
    headlineUnit: 'Mbps',
    headlineSub: 'Stable downlink — VR-streaming preset',
    eyebrow: 'LAN · 2.4 ms RTT',
    progress: 1,
    metrics: {
      download:   { value: '238',  unit: 'Mbps', status: 'excellent', tone: 'good',  note: 'Excellent · p95 231' },
      upload:     { value: '112',  unit: 'Mbps', status: 'good',      tone: 'good',  note: 'Good · 0.5 % loss'  },
      latency:    { value: '3.2',  unit: 'ms',   status: 'excellent', tone: 'good',  note: 'Excellent · p99 4.1' },
      jitter:     { value: '0.8',  unit: 'ms',   status: 'excellent', tone: 'good',  note: 'Excellent' },
      loss:       { value: '0.05', unit: '%',    status: 'excellent', tone: 'good',  note: 'Negligible' },
      stability:  { value: '98',   unit: '/100', status: 'excellent', tone: 'good',  note: 'A · Realtime-safe' },
    },
    ladder: [
      { target: 25,  ok: 'pass',  actual: '25.0', loss: '0.00', jitter: '0.4', p5: '24.9', spike: '2.1', queue: '—' },
      { target: 50,  ok: 'pass',  actual: '50.0', loss: '0.00', jitter: '0.5', p5: '49.8', spike: '2.6', queue: '—' },
      { target: 75,  ok: 'pass',  actual: '75.0', loss: '0.00', jitter: '0.6', p5: '74.7', spike: '3.0', queue: '—' },
      { target: 100, ok: 'pass',  actual: '99.9', loss: '0.01', jitter: '0.6', p5: '99.1', spike: '3.4', queue: '—' },
      { target: 120, ok: 'pass',  actual: '119.7', loss: '0.02', jitter: '0.7', p5: '118.5', spike: '3.6', queue: '—' },
      { target: 150, ok: 'pass',  actual: '149.6', loss: '0.04', jitter: '0.7', p5: '147.0', spike: '4.0', queue: '—' },
      { target: 180, ok: 'pass',  actual: '179.2', loss: '0.07', jitter: '0.8', p5: '174.6', spike: '4.5', queue: '—' },
      { target: 200, ok: 'watch', actual: '199.1', loss: '0.18', jitter: '0.9', p5: '188.7', spike: '6.2', queue: 'mild' },
      { target: 250, ok: 'watch', actual: '246.4', loss: '0.42', jitter: '1.4', p5: '218.3', spike: '11.7', queue: 'mild' },
      { target: 300, ok: 'fail',  actual: '281.3', loss: '1.21', jitter: '2.1', p5: '241.0', spike: '24.8', queue: 'severe' },
      { target: 350, ok: 'fail',  actual: '301.0', loss: '2.40', jitter: '3.0', p5: '244.1', spike: '36.4', queue: 'severe' },
      { target: 400, ok: 'fail',  actual: '312.7', loss: '4.10', jitter: '4.1', p5: '252.4', spike: '44.0', queue: 'severe' },
    ],
    recommendation: {
      verySafe:    { value: '150', unit: 'Mbps', note: 'P99 stable, 0 losses' },
      recommended: { value: '180', unit: 'Mbps', note: 'P95 stable, < 0.1 % loss' },
      risky:       { value: '220', unit: 'Mbps', note: 'occasional spikes' },
      avoid:       { value: '260+', unit: 'Mbps', note: 'queue + heavy loss' },
    },
  };

  const IDLE = {
    state: 'idle',
    statusLabel: 'Ready',
    headline: 'Ready',
    headlineUnit: '',
    headlineSub: 'Start a calibration to measure your local network.',
    eyebrow: 'LAN only',
    progress: 0,
    metrics: {
      download:  { value: '—', unit: 'Mbps', status: 'idle', tone: 'idle', note: 'Not measured' },
      upload:    { value: '—', unit: 'Mbps', status: 'idle', tone: 'idle', note: 'Not measured' },
      latency:   { value: '—', unit: 'ms',   status: 'idle', tone: 'idle', note: 'Not measured' },
      jitter:    { value: '—', unit: 'ms',   status: 'idle', tone: 'idle', note: 'Not measured' },
      loss:      { value: '—', unit: '%',    status: 'idle', tone: 'idle', note: 'Not measured' },
      stability: { value: '—', unit: '/100', status: 'idle', tone: 'idle', note: 'Not measured' },
    },
    ladder: COMPLETE.ladder.map(r => ({ ...r, ok: 'idle', actual: '—', loss: '—', jitter: '—', p5: '—', spike: '—', queue: '—' })),
    recommendation: {
      verySafe: { value: '—', unit: '', note: 'Run a test to see' },
      recommended: { value: '—', unit: '', note: '' },
      risky: { value: '—', unit: '', note: '' },
      avoid: { value: '—', unit: '', note: '' },
    },
  };

  const TESTING = {
    ...COMPLETE,
    state: 'testing',
    statusLabel: 'Calibrating · ladder step 8/12',
    headline: '199',
    headlineUnit: 'Mbps',
    headlineSub: 'Probing 200 Mbps target · 6 s remaining',
    eyebrow: 'In progress',
    progress: 0.66,
    metrics: {
      ...COMPLETE.metrics,
      stability: { value: '—', unit: '/100', status: 'pending', tone: 'idle', note: 'Computing…' },
    },
    ladder: COMPLETE.ladder.map((r, i) => {
      if (i < 7) return r;
      if (i === 7) return { ...r, ok: 'live' };
      return { ...r, ok: 'idle', actual: '—', loss: '—', jitter: '—', p5: '—', spike: '—', queue: '—' };
    }),
  };

  const WARNING = {
    ...COMPLETE,
    state: 'warning',
    statusLabel: 'Stability warning',
    headline: '142',
    headlineUnit: 'Mbps',
    headlineSub: 'Frequent spikes detected — Wi-Fi may be congested.',
    eyebrow: 'Warning · review jitter',
    metrics: {
      ...COMPLETE.metrics,
      download:  { value: '142', unit: 'Mbps', status: 'acceptable', tone: 'warn', note: 'OK · drops to 88 Mbps' },
      jitter:    { value: '6.4', unit: 'ms', status: 'acceptable', tone: 'warn', note: 'High' },
      loss:      { value: '1.20', unit: '%', status: 'risky', tone: 'warn', note: 'Above safe' },
      stability: { value: '74', unit: '/100', status: 'risky', tone: 'warn', note: 'B · watch peaks' },
    },
  };

  // Sample chart series for the throughput timeline.
  // 60 points across two series (download / upload) for the complete state.
  const t = Array.from({ length: 60 }, (_, i) => i);
  const downloadSeries = t.map(i => {
    const phase = i / 60;
    const ramp = phase < 0.25 ? phase / 0.25 : 1;
    const base = 60 + 180 * ramp;
    const wave = Math.sin(i * 0.55) * 8 + Math.cos(i * 0.31) * 4;
    return Math.max(0, base + wave);
  });
  const uploadSeries = t.map(i => {
    const phase = i / 60;
    const ramp = phase < 0.4 ? phase / 0.4 : 1;
    const base = 30 + 90 * ramp;
    return Math.max(0, base + Math.sin(i * 0.42) * 6);
  });
  const targetSeries = t.map(i => {
    const step = Math.min(11, Math.floor(i / 5));
    return [25, 50, 75, 100, 120, 150, 180, 200, 250, 300, 350, 400][step];
  });

  return {
    presets: [
      'General realtime streaming',
      'VR streaming',
      'Game streaming',
      'NAS / media transfer',
      'Custom',
    ],
    chart: { t, downloadSeries, uploadSeries, targetSeries },
    states: { idle: IDLE, testing: TESTING, complete: COMPLETE, warning: WARNING },
  };
})();
