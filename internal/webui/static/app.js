"use strict";

const ladderLevels = [25, 50, 75, 100, 120, 150, 180, 200, 250, 300, 350, 400, 500];
const qs = (id) => document.getElementById(id);

const i18n = {
  en: {
    "brand.subtitle": "Local bandwidth & stability test",
    "status.serverChecking": "Local server: checking",
    "status.serverOnline": "Local server: online",
    "status.serverUnavailable": "Local server: unavailable",
    "status.clientBrowser": "Client: browser",
    "status.clientQuest": "Client: Quest browser",
    "status.notTested": "Not tested",
    "status.testing": "Testing",
    "status.skipped": "Skipped",
    "status.passed": "Passed",
    "status.risky": "Risky",
    "status.failed": "Failed",
    "status.yes": "Yes",
    "status.no": "No",
    "button.copyUrl": "Copy server URL",
    "button.copied": "Copied",
    "button.start": "Start calibration",
    "button.quick": "Quick test",
    "button.full": "Full stability test",
    "button.advanced": "Advanced",
    "button.stop": "Stop",
    "button.copyReport": "Copy report",
    "button.downloadJson": "Download JSON report",
    "button.saveServer": "Save report to server",
    "button.showDetails": "Show technical details",
    "button.hideDetails": "Hide technical details",
    "hero.eyebrow": "LAN only",
    "hero.ready": "Ready",
    "stage.initial": "This measures local network performance, not internet speed.",
    "stage.latency": "Latency",
    "stage.latencyText": "Measuring HTTP RTT baseline and jitter...",
    "stage.download": "Download",
    "stage.downloadText": "Measuring local HTTP download throughput...",
    "stage.upload": "Upload",
    "stage.uploadText": "Measuring local HTTP upload throughput...",
    "stage.realtime": "Realtime",
    "stage.realtimeText": "Testing bitrate ladder over WebSocket...",
    "stage.complete": "Complete",
    "stage.completeText": "Recommended streaming bitrate range is ready.",
    "stage.stopped": "Stopped",
    "stage.stoppedText": "Calibration was stopped because a new test started.",
    "stage.failed": "Failed",
    "label.useCase": "Use case",
    "preset.general": "General realtime streaming",
    "preset.vr": "VR streaming",
    "preset.game": "Game streaming",
    "preset.nas": "NAS / media transfer",
    "preset.custom": "Custom",
    "advanced.latencySamples": "Latency samples",
    "advanced.downloadMs": "Download ms",
    "advanced.uploadMib": "Upload MiB",
    "advanced.ladderMs": "Ladder ms per level",
    "metric.download": "Download",
    "metric.upload": "Upload",
    "metric.latency": "Latency",
    "metric.jitter": "Jitter",
    "metric.loss": "Packet loss",
    "metric.stability": "Stability",
    "quality.excellent": "Excellent",
    "quality.good": "Good",
    "quality.acceptable": "Acceptable",
    "quality.risky": "Risky",
    "quality.unstable": "Unstable",
    "chart.title": "Throughput over time",
    "chart.subtitleAll": "HTTP throughput and realtime ladder use separate scales.",
    "chart.subtitleHttp": "HTTP download and upload throughput use their own scale.",
    "chart.subtitleRealtime": "Realtime target and receive rate use a ladder-sized scale.",
    "chart.modeAll": "All",
    "chart.modeRealtime": "Realtime",
    "chart.httpTitle": "HTTP throughput",
    "chart.realtimeTitle": "Realtime bitrate ladder",
    "legend.download": "Download",
    "legend.upload": "Upload",
    "legend.target": "Target",
    "legend.receive": "Receive",
    "ladder.title": "Bitrate ladder",
    "ladder.subtitle": "Realtime-safe bitrate is estimated from low percentile throughput, stalls and latency spikes.",
    "protocol.note": "Realtime mode: WebSocket",
    "protocol.websocket": "WebSocket",
    "protocol.websocketReport": "Estimated from a fixed-bitrate WebSocket stream. Real streaming apps may use different transports and still behave differently.",
    "table.status": "Status",
    "table.target": "Target",
    "table.actual": "Actual receive",
    "table.loss": "Packet loss",
    "table.jitter": "Jitter",
    "table.p5": "p5 throughput",
    "table.spike": "Max spike",
    "table.queue": "Queue warning",
    "recommendation.title": "Recommendation",
    "recommendation.subtitle": "Results estimate a stable bitrate range. Real streaming apps may still behave differently depending on codec, device decoding, CPU/GPU load and Wi-Fi conditions.",
    "recommendation.verySafe": "Very safe",
    "recommendation.recommended": "Recommended",
    "recommendation.risky": "Risky upper",
    "recommendation.avoid": "Avoid",
    "recommendation.notEstablished": "Not established",
    "recommendation.runFull": "Run full stability test",
    "recommendation.unknown": "Unknown",
    "recommendation.higherNotTested": "Higher levels not tested",
    "recommendation.withinRange": "within tested range",
    "why.full": "Use the full stability test before choosing a high bitrate.",
    "why.peak": "Peak speed is not a safe streaming bitrate.",
    "why.noPass": "No bitrate level passed with enough stability.",
    "why.bestPassed": "{value} Mbps passed with stable receive rate.",
    "why.riskyUpper": "{value} Mbps is the risky upper level.",
    "why.avoid": "{value}+ Mbps should be avoided unless real apps prove stable.",
    "why.allPassed": "All tested ladder levels up to {value} Mbps passed.",
    "why.notMax": "This does not mean the network max is {value} Mbps; higher levels were not tested.",
    "why.basis": "Recommendation is based on low-percentile throughput, stalls and latency spikes, not peak speed.",
    "risk.upperNotFound": "{value} Mbps passed. Upper limit was not found within the tested range.",
    "report.title": "Report",
    "report.subtitle": "Copy a readable summary or download a local JSON report. Save report to server stores a readable log on the PC running SpeedBand.",
    "report.saveHint": "Save report to server stores a readable log on the PC running SpeedBand.",
    "report.empty": "No test has been run yet.",
    "report.running": "Calibration is running...",
    "report.failed": "Calibration failed: {message}",
    "report.saved": "Report saved on server: {path}",
    "report.saveFailed": "Failed to save report on server: {message}",
    "report.saving": "Saving report to server...",
    "report.result": "Result",
    "report.stableEstimate": "Stable bitrate estimate",
    "report.why": "Why",
    "report.avg": "avg",
    "report.p95": "p95",
    "report.p99": "p99",
    "report.max": "max",
    "report.p10": "p10",
    "report.p5": "p5",
    "report.min1s": "min 1s",
    "report.realtime": "Realtime",
    "notes.local": "This measures local network performance, not internet speed.",
    "notes.full": "Use the full stability test before choosing a high bitrate. Peak speed is not a safe streaming bitrate.",
    "notes.transport": "Realtime tests use a binary WebSocket stream with paced sender, sequence numbers and backpressure tracking. WebSocket runs over TCP, so packet loss is inferred from sequence gaps, stalls and write delays rather than raw UDP loss.",
    "warning.samePc": "You are testing on the same PC. This measures loopback/browser/server performance, not real LAN/Wi-Fi performance. Open the LAN URL from another device for meaningful results.",
    "warning.local": "This measures local network performance, not internet speed.",
    "warning.behavior": "Results estimate a stable bitrate range. Real streaming apps may still behave differently depending on codec, device decoding, CPU/GPU load and Wi-Fi conditions.",
    "warning.full": "Use the full stability test before choosing a high bitrate.",
    "warning.peak": "Peak speed is not a safe streaming bitrate.",
    "limit.udp": "Browser clients cannot open raw UDP sockets.",
    "limit.clock": "One-way latency is not exact without synchronized clocks.",
    "limit.tcp": "WebSocket runs over TCP, so packet loss appears as retransmits, stalls and write delays.",
    "limit.truth": "The result is a stable bitrate range, not an exact truth.",
    "error.info": "Could not read /api/info. Refresh the page after the local server starts.",
    "error.downloadHttp": "Download endpoint returned HTTP {status}",
    "error.uploadHttp": "Upload endpoint returned HTTP {status}",
    "error.uploadUnavailable": "Upload endpoint is unavailable",
    "error.websocketUnavailable": "WebSocket endpoint is unavailable",
    "error.websocketFailed": "WebSocket test failed",
    "error.serverReturned": "server returned HTTP {status}",
    "error.calibrationFailed": "Calibration failed.",
    "aria.metrics": "Current metrics",
    "aria.chartMode": "Chart mode"
  },
  ru: {
    "brand.subtitle": "Локальный тест скорости и стабильности",
    "status.serverChecking": "Локальный сервер: проверка",
    "status.serverOnline": "Локальный сервер: онлайн",
    "status.serverUnavailable": "Локальный сервер: недоступен",
    "status.clientBrowser": "Клиент: браузер",
    "status.clientQuest": "Клиент: браузер Quest",
    "status.notTested": "Не проверено",
    "status.testing": "Проверяется",
    "status.skipped": "Пропущено",
    "status.passed": "Пройдено",
    "status.risky": "Рискованно",
    "status.failed": "Провалено",
    "status.yes": "Да",
    "status.no": "Нет",
    "button.copyUrl": "Скопировать URL сервера",
    "button.copied": "Скопировано",
    "button.start": "Запустить калибровку",
    "button.quick": "Быстрый тест",
    "button.full": "Полный тест стабильности",
    "button.advanced": "Настройки",
    "button.stop": "Остановить",
    "button.copyReport": "Скопировать отчёт",
    "button.downloadJson": "Скачать JSON-отчёт",
    "button.saveServer": "Сохранить отчёт на сервере",
    "button.showDetails": "Показать технические детали",
    "button.hideDetails": "Скрыть технические детали",
    "hero.eyebrow": "Только LAN",
    "hero.ready": "Готово",
    "stage.initial": "Измеряется локальная сеть, а не скорость интернета.",
    "stage.latency": "Задержка",
    "stage.latencyText": "Измеряем базовый HTTP RTT и джиттер...",
    "stage.download": "Загрузка",
    "stage.downloadText": "Измеряем локальную HTTP-скорость загрузки...",
    "stage.upload": "Отдача",
    "stage.uploadText": "Измеряем локальную HTTP-скорость отдачи...",
    "stage.realtime": "Реалтайм",
    "stage.realtimeText": "Проверяем лестницу битрейтов через WebSocket...",
    "stage.complete": "Готово",
    "stage.completeText": "Рекомендованный диапазон битрейта готов.",
    "stage.stopped": "Остановлено",
    "stage.stoppedText": "Калибровка остановлена, потому что запущен новый тест.",
    "stage.failed": "Ошибка",
    "label.useCase": "Сценарий",
    "preset.general": "Общий realtime-стриминг",
    "preset.vr": "VR-стриминг",
    "preset.game": "Игровой стриминг",
    "preset.nas": "NAS / медиапередача",
    "preset.custom": "Вручную",
    "advanced.latencySamples": "Сэмплы задержки",
    "advanced.downloadMs": "Загрузка, мс",
    "advanced.uploadMib": "Отдача, МиБ",
    "advanced.ladderMs": "мс на уровень",
    "metric.download": "Загрузка",
    "metric.upload": "Отдача",
    "metric.latency": "Задержка",
    "metric.jitter": "Джиттер",
    "metric.loss": "Потери пакетов",
    "metric.stability": "Стабильность",
    "quality.excellent": "Отлично",
    "quality.good": "Хорошо",
    "quality.acceptable": "Приемлемо",
    "quality.risky": "Рискованно",
    "quality.unstable": "Нестабильно",
    "chart.title": "Пропускная способность во времени",
    "chart.subtitleAll": "HTTP-скорость и realtime-лестница используют разные шкалы.",
    "chart.subtitleHttp": "HTTP загрузка и отдача используют свою шкалу.",
    "chart.subtitleRealtime": "Realtime цель и приём используют шкалу под ladder.",
    "chart.modeAll": "Все",
    "chart.modeRealtime": "Реалтайм",
    "chart.httpTitle": "HTTP throughput",
    "chart.realtimeTitle": "Realtime-лестница битрейтов",
    "legend.download": "Загрузка",
    "legend.upload": "Отдача",
    "legend.target": "Цель",
    "legend.receive": "Приём",
    "ladder.title": "Лестница битрейтов",
    "ladder.subtitle": "Безопасный realtime-битрейт оценивается по низким процентилям, просадкам и пикам задержки.",
    "protocol.note": "Реалтайм: WebSocket",
    "protocol.websocket": "WebSocket",
    "protocol.websocketReport": "Оценка сделана через бинарный WebSocket-поток с фиксированным битрейтом. Реальные стриминговые приложения могут использовать другие транспорты и вести себя иначе.",
    "table.status": "Статус",
    "table.target": "Цель",
    "table.actual": "Факт приёма",
    "table.loss": "Потери",
    "table.jitter": "Джиттер",
    "table.p5": "p5 скорость",
    "table.spike": "Макс. пик",
    "table.queue": "Очередь",
    "recommendation.title": "Рекомендация",
    "recommendation.subtitle": "Результаты оценивают стабильный диапазон битрейта. Реальные приложения могут вести себя иначе из-за кодека, декодирования, CPU/GPU и Wi-Fi условий.",
    "recommendation.verySafe": "Очень безопасно",
    "recommendation.recommended": "Рекомендуется",
    "recommendation.risky": "Верхняя зона риска",
    "recommendation.avoid": "Избегать",
    "recommendation.notEstablished": "Не определено",
    "recommendation.runFull": "Запустите полный тест стабильности",
    "recommendation.unknown": "Неизвестно",
    "recommendation.higherNotTested": "Более высокие уровни не проверялись",
    "recommendation.withinRange": "в пределах проверенного диапазона",
    "why.full": "Перед выбором высокого битрейта используйте полный тест стабильности.",
    "why.peak": "Пиковая скорость не является безопасным битрейтом.",
    "why.noPass": "Ни один уровень битрейта не прошёл с достаточной стабильностью.",
    "why.bestPassed": "{value} Mbps пройдено со стабильной скоростью приёма.",
    "why.riskyUpper": "{value} Mbps — верхний рискованный уровень.",
    "why.avoid": "{value}+ Mbps стоит избегать, пока реальные приложения не подтвердят стабильность.",
    "why.allPassed": "Все проверенные уровни до {value} Mbps пройдены.",
    "why.notMax": "Это не значит, что максимум сети равен {value} Mbps; более высокие уровни не проверялись.",
    "why.basis": "Рекомендация основана на низких процентилях throughput, просадках и пиках задержки, а не на пиковой скорости.",
    "risk.upperNotFound": "{value} Mbps пройдено. Верхний предел не найден в проверенном диапазоне.",
    "report.title": "Отчёт",
    "report.subtitle": "Скопируйте сводку, скачайте локальный JSON или сохраните читаемый лог на ПК, где запущен SpeedBand.",
    "report.saveHint": "Сохранение на сервере создаёт читаемый лог на ПК, где запущен SpeedBand.",
    "report.empty": "Тест ещё не запускался.",
    "report.running": "Калибровка выполняется...",
    "report.failed": "Калибровка завершилась ошибкой: {message}",
    "report.saved": "Отчёт сохранён на сервере: {path}",
    "report.saveFailed": "Не удалось сохранить отчёт на сервере: {message}",
    "report.saving": "Сохраняем отчёт на сервере...",
    "report.result": "Результат",
    "report.stableEstimate": "Оценка стабильного битрейта",
    "report.why": "Почему",
    "report.avg": "средн.",
    "report.p95": "p95",
    "report.p99": "p99",
    "report.max": "макс.",
    "report.p10": "p10",
    "report.p5": "p5",
    "report.min1s": "мин. 1с",
    "report.realtime": "Реалтайм",
    "notes.local": "Измеряется локальная сеть, а не скорость интернета.",
    "notes.full": "Перед выбором высокого битрейта используйте полный тест стабильности. Пиковая скорость не является безопасным битрейтом.",
    "notes.transport": "Realtime-тесты идут по бинарному WebSocket-потоку с paced sender, sequence-номерами и трекингом backpressure. WebSocket работает поверх TCP, поэтому потери пакетов проявляются как ретрансмиты, просадки и задержки записи, а не как сырое UDP-loss.",
    "warning.samePc": "Вы тестируете на том же ПК. Это измеряет loopback/browser/server, а не реальную LAN/Wi‑Fi сеть. Откройте LAN URL с другого устройства для осмысленных результатов.",
    "warning.local": "Измеряется локальная сеть, а не скорость интернета.",
    "warning.behavior": "Результаты оценивают стабильный диапазон битрейта. Реальные приложения могут вести себя иначе из-за кодека, декодирования, CPU/GPU и Wi‑Fi условий.",
    "warning.full": "Перед выбором высокого битрейта используйте полный тест стабильности.",
    "warning.peak": "Пиковая скорость не является безопасным битрейтом.",
    "limit.udp": "Браузерные клиенты не могут открывать raw UDP sockets.",
    "limit.clock": "Односторонняя задержка неточна без синхронизации часов.",
    "limit.tcp": "WebSocket работает поверх TCP — потери пакетов проявляются как ретрансмиты, просадки и задержки записи.",
    "limit.truth": "Результат — диапазон стабильного битрейта, а не абсолютная истина.",
    "error.info": "Не удалось прочитать /api/info. Обновите страницу после запуска локального сервера.",
    "error.downloadHttp": "Download endpoint вернул HTTP {status}",
    "error.uploadHttp": "Upload endpoint вернул HTTP {status}",
    "error.uploadUnavailable": "Upload endpoint недоступен",
    "error.websocketUnavailable": "WebSocket endpoint недоступен",
    "error.websocketFailed": "WebSocket тест завершился ошибкой",
    "error.serverReturned": "сервер вернул HTTP {status}",
    "error.calibrationFailed": "Калибровка завершилась ошибкой.",
    "aria.metrics": "Текущие метрики",
    "aria.chartMode": "Режим графика"
  }
};

const state = {
  info: null,
  running: false,
  abort: null,
  chart: {
    download: [],
    upload: [],
    target: [],
    realtime: []
  },
  chartMode: "all",
  language: "en",
  metrics: {},
  ladder: [],
  report: null
};

const el = {
  serverStatus: qs("serverStatus"),
  clientStatus: qs("clientStatus"),
  copyUrlButton: qs("copyUrlButton"),
  samePcWarning: qs("samePcWarning"),
  heroValue: qs("heroValue"),
  stageText: qs("stageText"),
  presetSelect: qs("presetSelect"),
  startButton: qs("startButton"),
  quickButton: qs("quickButton"),
  fullButton: qs("fullButton"),
  advancedButton: qs("advancedButton"),
  stopButton: qs("stopButton"),
  advancedPanel: qs("advancedPanel"),
  latencySamplesInput: qs("latencySamplesInput"),
  downloadDurationInput: qs("downloadDurationInput"),
  uploadSizeInput: qs("uploadSizeInput"),
  ladderDurationInput: qs("ladderDurationInput"),
  downloadValue: qs("downloadValue"),
  uploadValue: qs("uploadValue"),
  latencyValue: qs("latencyValue"),
  jitterValue: qs("jitterValue"),
  lossValue: qs("lossValue"),
  stabilityValue: qs("stabilityValue"),
  downloadStatus: qs("downloadStatus"),
  uploadStatus: qs("uploadStatus"),
  latencyStatus: qs("latencyStatus"),
  jitterStatus: qs("jitterStatus"),
  lossStatus: qs("lossStatus"),
  stabilityStatus: qs("stabilityStatus"),
  protocolNote: qs("protocolNote"),
  ladderBody: qs("ladderBody"),
  verySafeValue: qs("verySafeValue"),
  recommendedValue: qs("recommendedValue"),
  riskyValue: qs("riskyValue"),
  avoidValue: qs("avoidValue"),
  whyList: qs("whyList"),
  copyReportButton: qs("copyReportButton"),
  downloadJsonButton: qs("downloadJsonButton"),
  saveReportButton: qs("saveReportButton"),
  reportSaveStatus: qs("reportSaveStatus"),
  detailsButton: qs("detailsButton"),
  reportText: qs("reportText"),
  technicalDetails: qs("technicalDetails"),
  chartSubtitle: qs("chartSubtitle"),
  chartCanvas: qs("throughputChart")
};

// Expose abort hook for pulse-extras.js stop button
window._speedbandAbort = function () { if (state.abort) state.abort.abort(); };

document.addEventListener("DOMContentLoaded", init);

async function init() {
  state.language = localStorage.getItem("speedband-language") === "ru" ? "ru" : "en";
  initLadder();
  bindEvents();
  applyLanguage();
  updateSamePcWarning();
  drawChart();
  await loadInfo();
}

function bindEvents() {
  el.startButton.addEventListener("click", () => runCalibration("full"));
  el.quickButton.addEventListener("click", () => runCalibration("quick"));
  el.fullButton.addEventListener("click", () => runCalibration("full"));
  el.advancedButton.addEventListener("click", () => el.advancedPanel.classList.toggle("hidden"));
  el.copyUrlButton.addEventListener("click", copyServerURL);
  el.copyReportButton.addEventListener("click", copyReport);
  el.downloadJsonButton.addEventListener("click", downloadJSONReport);
  el.saveReportButton.addEventListener("click", saveReportToServer);
  el.detailsButton.addEventListener("click", () => {
    el.technicalDetails.classList.toggle("hidden");
    el.detailsButton.textContent = t(el.technicalDetails.classList.contains("hidden") ? "button.showDetails" : "button.hideDetails");
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  document.querySelectorAll("[data-chart-mode]").forEach((button) => {
    button.addEventListener("click", () => setChartMode(button.dataset.chartMode));
  });
  window.addEventListener("resize", drawChart);
}

function t(key, vars = {}) {
  const dict = i18n[state.language] || i18n.en;
  let value = dict[key] || i18n.en[key] || key;
  Object.entries(vars).forEach(([name, item]) => {
    value = value.replaceAll("{" + name + "}", String(item));
  });
  return value;
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    node.dataset.i18nAttr.split(";").forEach((binding) => {
      const parts = binding.split(":");
      if (parts.length === 2) {
        node.setAttribute(parts[0], t(parts[1]));
      }
    });
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === state.language);
  });
  el.detailsButton.textContent = t(el.technicalDetails.classList.contains("hidden") ? "button.showDetails" : "button.hideDetails");
  localizePresetOptions();
  updateStatusText();
  if (state.metrics.latency) updateLatencyCards(state.metrics.latency);
  if (state.metrics.download) updateThroughputCard("download", state.metrics.download);
  if (state.metrics.upload) updateThroughputCard("upload", state.metrics.upload);
  if (state.report) updateStabilityCard(state.report.recommendation);
  if (!state.report) {
    el.heroValue.textContent = t("hero.ready");
    el.reportText.textContent = state.running ? t("report.running") : t("report.empty");
    setReportSaveStatus(t("report.saveHint"), "");
  } else {
    el.heroValue.textContent = state.report.recommendation.recommended;
    el.reportText.textContent = humanReport(state.report);
    el.technicalDetails.textContent = JSON.stringify(state.report, null, 2);
    setReportSaveStatus(el.reportSaveStatus.textContent, el.reportSaveStatus.classList.contains("ok") ? "ok" : el.reportSaveStatus.classList.contains("error") ? "error" : "");
  }
  setChartMode(state.chartMode);
  renderLadder();
  drawChart();
}

function setLanguage(language) {
  state.language = language === "ru" ? "ru" : "en";
  localStorage.setItem("speedband-language", state.language);
  if (state.report) {
    const recommendation = buildRecommendation(state.ladder, el.presetSelect.value);
    state.report = buildReport(state.report.testMode, el.presetSelect.value, recommendation, buildWarnings());
    setRecommendation(recommendation);
    updateStabilityCard(recommendation);
  }
  applyLanguage();
}

function localizePresetOptions() {
  Array.from(el.presetSelect.options).forEach((option) => {
    if (option.dataset.i18n) {
      option.textContent = t(option.dataset.i18n);
    }
  });
}

function updateStatusText() {
  if (!state.metrics.download) setStatus(el.downloadStatus, t("status.notTested"), "not-tested");
  if (!state.metrics.upload) setStatus(el.uploadStatus, t("status.notTested"), "not-tested");
  if (!state.metrics.latency) {
    setStatus(el.latencyStatus, t("status.notTested"), "not-tested");
    setStatus(el.jitterStatus, t("status.notTested"), "not-tested");
  }
  if (!state.report) {
    setStatus(el.lossStatus, t("status.notTested"), "not-tested");
    setStatus(el.stabilityStatus, t("status.notTested"), "not-tested");
  }
  if (state.info) {
    el.serverStatus.textContent = t("status.serverOnline");
    el.clientStatus.textContent = navigator.userAgent.includes("Quest") ? t("status.clientQuest") : t("status.clientBrowser");
  }
  el.protocolNote.textContent = t("protocol.note");
}

function setChartMode(mode) {
  state.chartMode = ["all", "http", "realtime"].includes(mode) ? mode : "all";
  document.querySelectorAll("[data-chart-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.chartMode === state.chartMode);
  });
  if (state.chartMode === "http") {
    el.chartSubtitle.textContent = t("chart.subtitleHttp");
  } else if (state.chartMode === "realtime") {
    el.chartSubtitle.textContent = t("chart.subtitleRealtime");
  } else {
    el.chartSubtitle.textContent = t("chart.subtitleAll");
  }
  drawChart();
}

function updateSamePcWarning() {
  el.samePcWarning.classList.toggle("hidden", !isLoopbackHost(location.hostname));
}

function isLoopbackHost(host) {
  const value = String(host || "").toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
  return value === "localhost" || value === "::1" || value === "0:0:0:0:0:0:0:1" || /^127(?:\.\d{1,3}){3}$/.test(value);
}

async function loadInfo() {
  try {
    const res = await fetch("/api/info", { cache: "no-store" });
    state.info = await res.json();
    el.serverStatus.textContent = t("status.serverOnline");
    el.clientStatus.textContent = navigator.userAgent.includes("Quest") ? t("status.clientQuest") : t("status.clientBrowser");
    updateSamePcWarning();
  } catch (err) {
    el.serverStatus.textContent = t("status.serverUnavailable");
    el.stageText.textContent = t("error.info");
  }
}

function initLadder() {
  state.ladder = ladderLevels.map((level) => ({
    targetMbps: level,
    status: "Not tested",
    actualReceiveMbps: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    p5ThroughputMbps: 0,
    maxLatencySpikeMs: 0,
    backpressureWarning: false
  }));
  renderLadder();
}

function resetRun() {
  if (state.abort) {
    state.abort.abort();
  }
  state.abort = new AbortController();
  state.chart = { download: [], upload: [], target: [], realtime: [] };
  state.metrics = {};
  state.report = null;
  initLadder();
  setRecommendation(null);
  setReportReady(false);
  el.reportText.textContent = t("report.running");
  el.technicalDetails.textContent = "{}";
  drawChart();
}

async function runCalibration(mode) {
  if (state.running) {
    resetRun();
  }
  state.running = true;
  setButtons(true);
  resetRun();

  const preset = el.presetSelect.value;
  const config = calibrationConfig(mode, preset);
  const warnings = buildWarnings();

  try {
    setStage("stage.latency", "stage.latencyText");
    const latency = await runLatency(config.latencySamples);
    state.metrics.latency = latency;
    updateLatencyCards(latency);

    setStage("stage.download", "stage.downloadText");
    const download = await runDownload(config.downloadDurationMs);
    state.metrics.download = download;
    updateThroughputCard("download", download);

    setStage("stage.upload", "stage.uploadText");
    const upload = await runUpload(config.uploadBytes);
    state.metrics.upload = upload;
    updateThroughputCard("upload", upload);

    setStage("stage.realtime", "stage.realtimeText");
    const ladder = await runBitrateLadder(config, latency);
    state.ladder = ladder;
    renderLadder();

    const recommendation = buildRecommendation(ladder, preset);
    setRecommendation(recommendation);
    updateStabilityCard(recommendation);
    setStage("stage.complete", "stage.completeText");
    el.heroValue.textContent = recommendation.recommended;

    const report = buildReport(mode, preset, recommendation, warnings);
    state.report = report;
    el.reportText.textContent = humanReport(report);
    el.technicalDetails.textContent = JSON.stringify(report, null, 2);
    setReportReady(true);
  } catch (err) {
    if (err.name === "AbortError") {
      setStage("stage.stopped", "stage.stoppedText");
    } else {
      setStage("stage.failed", err.message || t("error.calibrationFailed"), true);
      el.reportText.textContent = t("report.failed", { message: err.message || err });
    }
  } finally {
    state.running = false;
    setButtons(false);
  }
}

function calibrationConfig(mode, preset) {
  if (preset === "custom") {
    return {
      mode,
      latencySamples: clamp(numberFrom(el.latencySamplesInput.value, 20), 4, 60),
      downloadDurationMs: clamp(numberFrom(el.downloadDurationInput.value, 6000), 1000, 30000),
      uploadBytes: clamp(numberFrom(el.uploadSizeInput.value, 96), 4, 256) * 1024 * 1024,
      ladderDurationMs: clamp(numberFrom(el.ladderDurationInput.value, 3000), 1000, 10000),
      ladderLevels: ladderLevels
    };
  }
  if (mode === "quick") {
    return {
      mode,
      latencySamples: 8,
      downloadDurationMs: 2500,
      uploadBytes: 24 * 1024 * 1024,
      ladderDurationMs: 1400,
      ladderLevels: [25, 50, 75, 100, 120, 150]
    };
  }
  return {
    mode,
    latencySamples: 20,
    downloadDurationMs: 6000,
    uploadBytes: 96 * 1024 * 1024,
    ladderDurationMs: 3000,
    ladderLevels
  };
}

function buildWarnings() {
  return [
    t("warning.local"),
    t("warning.behavior"),
    t("warning.full"),
    t("warning.peak")
  ];
}

async function runLatency(samples) {
  const rtts = [];
  for (let i = 0; i < samples; i++) {
    const started = performance.now();
    const url = "/api/ping?echo=" + encodeURIComponent(String(started)) + "&n=" + i;
    const res = await fetch(url, { cache: "no-store", signal: state.abort.signal });
    await res.json();
    rtts.push(performance.now() - started);
    await sleep(80);
  }
  return summarizeLatency(rtts);
}

async function runDownload(durationMs) {
  const url = "/api/download?durationMs=" + durationMs + "&chunkSize=65536&seed=" + Date.now();
  const started = performance.now();
  const buckets = [];
  const rate = makeRateTracker(started);
  let bytes = 0;
  let lastPaint = 0;
  const res = await fetch(url, { cache: "no-store", signal: state.abort.signal });
  if (!res.ok) {
    throw new Error(t("error.downloadHttp", { status: res.status }));
  }
  if (!res.body || !res.body.getReader) {
    const data = await res.arrayBuffer();
    bytes = data.byteLength;
    const elapsed = (performance.now() - started) / 1000;
    return summarizeThroughput(bytes, elapsed, [bytes * 8 / elapsed / 1000000]);
  }
  const reader = res.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const now = performance.now();
    const len = value.byteLength;
    bytes += len;
    const index = Math.floor((now - started) / 1000);
    buckets[index] = (buckets[index] || 0) + len;
    if (now - lastPaint > 130) {
      const mbps = sampleRateMbps(rate, bytes, now);
      pushSeries("download", mbps);
      el.heroValue.textContent = fmt(mbps) + " Mbps";
      drawChart();
      lastPaint = now;
    }
  }
  const elapsed = (performance.now() - started) / 1000;
  return summarizeThroughput(bytes, elapsed, bucketMbps(buckets, elapsed, bytes));
}

async function runUpload(totalBytes) {
	const chunkSize = 64 * 1024;
	const chunk = new Uint8Array(chunkSize);
	for (let i = 0; i < chunk.length; i++) {
		chunk[i] = i & 255;
	}
	const blob = makeUploadBlob(totalBytes, chunk);
	const started = performance.now();
	const buckets = [];
	const rate = makeRateTracker(started);
	let lastPaint = 0;
	let lastLoaded = 0;

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const abortHandler = () => {
			xhr.abort();
			reject(new DOMException("aborted", "AbortError"));
		};
		state.abort.signal.addEventListener("abort", abortHandler, { once: true });

		xhr.upload.onprogress = (event) => {
			const now = performance.now();
			const loaded = event.loaded || 0;
			const delta = Math.max(0, loaded - lastLoaded);
			lastLoaded = loaded;
			const index = Math.floor((now - started) / 1000);
			buckets[index] = (buckets[index] || 0) + delta;
			if (now - lastPaint > 130) {
				const mbps = sampleRateMbps(rate, loaded, now);
				pushSeries("upload", mbps);
				el.heroValue.textContent = fmt(mbps) + " Mbps";
				drawChart();
				lastPaint = now;
			}
		};

		xhr.onload = () => {
			state.abort.signal.removeEventListener("abort", abortHandler);
			if (xhr.status < 200 || xhr.status >= 300) {
				reject(new Error(t("error.uploadHttp", { status: xhr.status })));
				return;
			}
			const elapsed = (performance.now() - started) / 1000;
			let server = {};
			try {
				server = JSON.parse(xhr.responseText || "{}");
			} catch (err) {
				server = {};
			}
			const bytes = server.bytes || lastLoaded || totalBytes;
			resolve(summarizeThroughput(bytes, elapsed, bucketMbps(buckets, elapsed, bytes)));
		};

		xhr.onerror = () => {
			state.abort.signal.removeEventListener("abort", abortHandler);
			reject(new Error(t("error.uploadUnavailable")));
		};

		xhr.open("POST", "/api/upload");
		xhr.setRequestHeader("Content-Type", "application/octet-stream");
		xhr.send(blob);
	});
}

async function runBitrateLadder(config, latency) {
  const result = ladderLevels.map((level) => ({
    targetMbps: level,
    status: config.ladderLevels.includes(level) ? "Not tested" : "Skipped",
    actualReceiveMbps: 0,
    packetLossPercent: 0,
    jitterMs: 0,
    p5ThroughputMbps: 0,
    maxLatencySpikeMs: 0,
    backpressureWarning: false
  }));

  let failures = 0;
  for (const target of config.ladderLevels) {
    const row = result.find((item) => item.targetMbps === target);
    row.status = "Testing";
    renderLadder(result);
    const test = await runWebSocketLevel(target, config.ladderDurationMs);
    Object.assign(row, scoreLadderLevel(target, test, latency));
    renderLadder(result);
    if (row.status === "Failed") {
      failures++;
    } else if (row.status === "Passed") {
      failures = 0;
    }
    if (failures >= 2) {
      for (const item of result) {
        if (item.status === "Not tested" && item.targetMbps > target) {
          item.status = "Skipped";
        }
      }
      break;
    }
  }
  return result;
}

function runWebSocketLevel(targetMbps, durationMs) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const buckets = [];
    const intervals = [];
    const rate = makeRateTracker(started);
    let bytes = 0;
    let packets = 0;
    let missing = 0;
    let expected = null;
    let lastArrival = 0;
    let lastPaint = 0;
    let maxGap = 0;
    let doneMessage = null;
    const url = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/api/ws";
    const ws = new WebSocket(url);
    ws.binaryType = "arraybuffer";

    const abortHandler = () => {
      try {
        ws.close();
      } catch (_) {}
      reject(new DOMException("aborted", "AbortError"));
    };
    state.abort.signal.addEventListener("abort", abortHandler, { once: true });

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "start",
        targetMbps,
        durationMs,
        chunkSize: 0
      }));
      pushSeries("target", targetMbps);
      drawChart();
    };

    ws.onerror = () => {
      state.abort.signal.removeEventListener("abort", abortHandler);
      reject(new Error(t("error.websocketUnavailable")));
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        const msg = JSON.parse(event.data);
        if (msg.type === "error") {
          ws.close();
          state.abort.signal.removeEventListener("abort", abortHandler);
          reject(new Error(msg.error || t("error.websocketFailed")));
        }
        if (msg.type === "done") {
          doneMessage = msg;
          ws.close();
        }
        return;
      }

      const now = performance.now();
      const data = event.data;
      const len = data.byteLength || 0;
      bytes += len;
      packets++;
      const index = Math.floor((now - started) / 1000);
      buckets[index] = (buckets[index] || 0) + len;
      if (data.byteLength >= 4) {
        const seq = new DataView(data).getUint32(0);
        if (expected !== null && seq > expected) {
          missing += seq - expected;
        }
        expected = seq + 1;
      }
      if (lastArrival > 0) {
        const gap = now - lastArrival;
        intervals.push(gap);
        if (gap > maxGap) {
          maxGap = gap;
        }
      }
      lastArrival = now;
      if (now - lastPaint > 130) {
        const mbps = sampleRateMbps(rate, bytes, now);
        pushSeries("realtime", mbps);
        el.heroValue.textContent = fmt(mbps) + " Mbps";
        drawChart();
        lastPaint = now;
      }
    };

	ws.onclose = () => {
		state.abort.signal.removeEventListener("abort", abortHandler);
		const elapsed = (performance.now() - started) / 1000;
		const rates = bucketMbps(buckets, elapsed, bytes);
		const actualMbps = bytes * 8 / elapsed / 1000000;
		const steadyRates = rates.length > 3 ? rates.slice(1, -1) : [actualMbps];
		resolve({
			targetMbps,
			bytes,
			packets,
			missing,
			elapsed,
			p5: percentile(steadyRates, 5),
			actualMbps,
			jitterMs: jitter(intervals),
			maxGapMs: maxGap,
			server: doneMessage || {}
      });
    };
  });
}

function scoreLadderLevel(targetMbps, test, latency) {
  const expectedPackets = test.packets + test.missing;
  const packetLossPercent = expectedPackets > 0 ? test.missing / expectedPackets * 100 : 0;
  const actual = test.actualMbps || 0;
  const p5 = test.p5 || actual;
  const ratio = targetMbps > 0 ? actual / targetMbps : 0;
  const spike = Math.max(test.maxGapMs || 0, latency.p99Ms || 0);
  const backpressure = Boolean((test.server && test.server.slowWrites > 0) || ratio < 0.9 || spike > 450);
  let status = "Failed";
  if (ratio >= 0.94 && p5 >= targetMbps * 0.82 && spike < 260 && packetLossPercent < 1 && !backpressure) {
    status = "Passed";
  } else if (ratio >= 0.78 && p5 >= targetMbps * 0.55 && spike < 700 && packetLossPercent < 5) {
    status = "Risky";
  }
  return {
    targetMbps,
    status,
    actualReceiveMbps: actual,
    packetLossPercent,
    jitterMs: Math.max(test.jitterMs || 0, latency.jitterMs || 0),
    p5ThroughputMbps: p5,
    maxLatencySpikeMs: spike,
    backpressureWarning: backpressure
  };
}

function buildRecommendation(ladder, preset) {
  const tested = ladder.filter((item) => item.status === "Passed" || item.status === "Risky" || item.status === "Failed");
  const passed = ladder.filter((item) => item.status === "Passed").map((item) => item.targetMbps);
  const risky = ladder.filter((item) => item.status === "Risky").map((item) => item.targetMbps);
  const failed = ladder.filter((item) => item.status === "Failed").map((item) => item.targetMbps);
  const protocol = t("protocol.websocket");

  if (!tested.length || !passed.length) {
    return {
      result: qualityText("Unstable"),
      resultClass: "Unstable",
      verySafe: t("recommendation.notEstablished"),
      recommended: t("recommendation.runFull"),
      riskyUpper: risky.length ? risky[0] + " Mbps" : t("recommendation.notEstablished"),
      avoid: failed.length ? failed[0] + "+ Mbps" : t("recommendation.unknown"),
      protocol,
      why: [
        t("why.noPass"),
        t("protocol.websocketReport"),
        t("why.peak")
      ]
    };
  }

  const best = passed[passed.length - 1];
	const safeMargin = preset === "vr" || preset === "game" ? 0.65 : preset === "nas" ? 0.8 : 0.7;
	const lowMargin = preset === "vr" || preset === "game" ? 0.78 : preset === "nas" ? 0.88 : 0.82;
	const verySafe = nearestLevel(best * safeMargin);
	const low = Math.min(best, nearestLevel(best * lowMargin));
	let recommendedText = low === best ? best + " Mbps" : low + "-" + best + " Mbps";
	const aboveRisk = firstAbove(best, risky.concat(failed));
	let riskyUpperText = "";
	let avoidText = "";
	const why = [t("why.bestPassed", { value: best })];
	if (aboveRisk) {
		const avoid = firstAbove(aboveRisk, failed) || nextLevel(aboveRisk) || aboveRisk;
		riskyUpperText = aboveRisk + " Mbps";
		avoidText = avoid + "+ Mbps";
		why.push(t("why.riskyUpper", { value: aboveRisk }));
		why.push(t("why.avoid", { value: avoid }));
	} else {
		recommendedText += " " + t("recommendation.withinRange");
		riskyUpperText = t("risk.upperNotFound", { value: best });
		avoidText = t("recommendation.higherNotTested");
		why.push(t("why.allPassed", { value: best }));
		why.push(t("why.notMax", { value: best }));
	}
	why.push(t("why.basis"));
	why.push(t("protocol.websocketReport"));

	const resultClass = best >= 200 ? "Excellent" : best >= 100 ? "Good" : "Acceptable";
	return {
		result: qualityText(resultClass),
		resultClass,
		verySafe: verySafe + " Mbps",
		recommended: recommendedText,
		riskyUpper: riskyUpperText,
		avoid: avoidText,
		protocol,
		why
	};
}

function buildReport(mode, preset, recommendation, warnings) {
  return {
    timestamp: new Date().toISOString(),
    language: state.language,
    appVersion: state.info && state.info.app ? state.info.app.version : "unknown",
    browserUserAgent: navigator.userAgent,
    serverHostname: state.info ? state.info.hostname : "",
    testMode: mode,
    selectedUseCasePreset: presetName(preset),
    selectedUseCasePresetKey: preset,
    protocolAvailability: state.info ? state.info.protocols : { http: true, websocket: true },
    metrics: state.metrics,
    bitrateLadder: state.ladder,
    recommendation,
    warnings,
    errors: [],
    limitations: [
      t("limit.udp"),
      t("limit.clock"),
      t("limit.tcp"),
      t("limit.truth")
    ]
  };
}

function humanReport(report) {
  const m = report.metrics;
  const rec = report.recommendation;
  const lines = [
    t("report.result") + ": " + rec.result,
    "",
    t("report.stableEstimate") + ":",
    t("recommendation.recommended") + ": " + rec.recommended,
    t("recommendation.verySafe") + ": " + rec.verySafe,
    t("recommendation.risky") + ": " + rec.riskyUpper,
    t("recommendation.avoid") + ": " + rec.avoid,
    "",
    t("report.why") + ":"
  ];
  rec.why.forEach((item) => lines.push("- " + item));
  lines.push("");
  lines.push(t("metric.latency") + ":");
  lines.push("- " + t("report.avg") + ": " + fmt(m.latency.averageMs) + " ms");
  lines.push("- " + t("report.p95") + ": " + fmt(m.latency.p95Ms) + " ms");
  lines.push("- " + t("report.p99") + ": " + fmt(m.latency.p99Ms) + " ms");
  lines.push("- " + t("report.max") + ": " + fmt(m.latency.maxMs) + " ms");
  lines.push("- " + t("metric.jitter").toLowerCase() + ": " + fmt(m.latency.jitterMs) + " ms");
  lines.push("");
  lines.push(t("metric.download") + ":");
  lines.push("- " + t("report.avg") + ": " + fmt(m.download.averageMbps) + " Mbps");
  lines.push("- " + t("report.p10") + ": " + fmt(m.download.p10Mbps) + " Mbps");
  lines.push("- " + t("report.p5") + ": " + fmt(m.download.p5Mbps) + " Mbps");
  lines.push("- " + t("report.min1s") + ": " + fmt(m.download.min1sMbps) + " Mbps");
  lines.push("");
  lines.push(t("metric.upload") + ":");
  lines.push("- " + t("report.avg") + ": " + fmt(m.upload.averageMbps) + " Mbps");
  lines.push("- " + t("report.p10") + ": " + fmt(m.upload.p10Mbps) + " Mbps");
  lines.push("- " + t("report.p5") + ": " + fmt(m.upload.p5Mbps) + " Mbps");
  lines.push("");
  lines.push(t("report.realtime") + ":");
  report.bitrateLadder
    .filter((item) => item.status !== "Not tested" && item.status !== "Skipped")
    .forEach((item) => lines.push("- " + item.targetMbps + " Mbps: " + statusText(item.status).toLowerCase()));
  lines.push("");
  lines.push(t("warning.local"));
  lines.push(t("warning.full"));
  lines.push(t("warning.peak"));
  return lines.join("\n");
}

function summarizeLatency(samples) {
  return {
    samples,
    averageMs: average(samples),
    medianMs: percentile(samples, 50),
    p95Ms: percentile(samples, 95),
    p99Ms: percentile(samples, 99),
    maxMs: max(samples),
    jitterMs: jitter(samples)
  };
}

function summarizeThroughput(bytes, elapsed, samples) {
  const clean = samples.filter((value) => Number.isFinite(value) && value >= 0);
  return {
    bytes,
    durationSeconds: elapsed,
    averageMbps: bytes * 8 / elapsed / 1000000,
    peakMbps: max(clean),
    p50Mbps: percentile(clean, 50),
    p10Mbps: percentile(clean, 10),
    p5Mbps: percentile(clean, 5),
    min1sMbps: min(clean),
    worst5sMbps: worstWindow(clean, 5),
    stalls: countStalls(clean, percentile(clean, 50) * 0.45)
  };
}

function updateLatencyCards(latency) {
  el.latencyValue.textContent = fmt(latency.medianMs);
  el.jitterValue.textContent = fmt(latency.jitterMs);
  const latencyClass = latencyLabel(latency.p95Ms);
  const jitterClass = jitterLabel(latency.jitterMs);
  setStatus(el.latencyStatus, qualityText(latencyClass), latencyClass);
  setStatus(el.jitterStatus, qualityText(jitterClass), jitterClass);
}

function updateThroughputCard(type, summary) {
  const value = type === "download" ? el.downloadValue : el.uploadValue;
  const status = type === "download" ? el.downloadStatus : el.uploadStatus;
  const label = throughputLabel(summary.p5Mbps, summary.averageMbps);
  value.textContent = fmt(summary.averageMbps);
  setStatus(status, qualityText(label), label);
}

function updateStabilityCard(recommendation) {
  el.stabilityValue.textContent = recommendation.result;
  setStatus(el.stabilityStatus, recommendation.protocol, recommendation.resultClass || recommendation.result);
  const tested = state.ladder.filter((item) => item.status !== "Not tested" && item.status !== "Skipped");
  const maxLoss = tested.length ? max(tested.map((item) => item.packetLossPercent)) : 0;
  const lossClass = lossLabel(maxLoss);
  el.lossValue.textContent = fmt(maxLoss);
  setStatus(el.lossStatus, qualityText(lossClass), lossClass);
}

function setRecommendation(recommendation) {
  if (!recommendation) {
    el.verySafeValue.textContent = "--";
    el.recommendedValue.textContent = "--";
    el.riskyValue.textContent = "--";
    el.avoidValue.textContent = "--";
    el.whyList.innerHTML = "";
    [t("why.full"), t("why.peak")].forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      el.whyList.appendChild(li);
    });
    return;
  }
  el.verySafeValue.textContent = recommendation.verySafe;
  el.recommendedValue.textContent = recommendation.recommended;
  el.riskyValue.textContent = recommendation.riskyUpper;
  el.avoidValue.textContent = recommendation.avoid;
  el.whyList.innerHTML = "";
  recommendation.why.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.whyList.appendChild(li);
  });
}

function renderLadder(rows = state.ladder) {
  el.ladderBody.innerHTML = "";
  rows.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = [
      statusCell(item.status),
      item.targetMbps + " Mbps",
      fmtOrDash(item.actualReceiveMbps) + " Mbps",
      fmtOrDash(item.packetLossPercent) + "%",
      fmtOrDash(item.jitterMs) + " ms",
      fmtOrDash(item.p5ThroughputMbps) + " Mbps",
      fmtOrDash(item.maxLatencySpikeMs) + " ms",
      item.backpressureWarning ? t("status.yes") : item.status === "Not tested" || item.status === "Skipped" ? "--" : t("status.no")
    ].map((value) => "<td>" + value + "</td>").join("");
    el.ladderBody.appendChild(tr);
  });
}

function statusCell(status) {
  const cls = status === "Passed" ? "status-passed" : status === "Risky" ? "status-risky" : status === "Failed" ? "status-failed" : "";
  return '<span class="' + cls + '">' + statusText(status) + "</span>";
}

function setStage(stage, text, rawText = false) {
  const stageText = t(stage);
  el.stageText.textContent = stageText + ": " + (rawText ? text : t(text));
  if (stage !== "stage.complete") {
    el.heroValue.textContent = stageText;
  }
}

function setButtons(disabled) {
  [el.startButton, el.quickButton, el.fullButton].forEach((button) => {
    button.disabled = disabled;
  });
  if (el.stopButton) el.stopButton.classList.toggle("hidden", !disabled);
}

function setStatus(node, text, className) {
  node.textContent = text;
  node.className = "metric-status " + String(className).toLowerCase().replaceAll(" ", "-");
}

function pushSeries(name, value) {
  const list = state.chart[name];
  list.push({ t: performance.now(), value: Number.isFinite(value) ? value : 0 });
  while (list.length > 240) {
    list.shift();
  }
}

function drawChart() {
  const canvas = el.chartCanvas;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  const width = Math.max(320, Math.floor(rect.width * scale));
  const height = Math.max(220, Math.floor(rect.height * scale));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0d141d";
  ctx.fillRect(0, 0, width, height);

  const padding = 42 * scale;
  const now = performance.now();
  const minTime = now - 45000;
  const fullArea = {
    x: padding,
    y: padding,
    w: width - padding * 2,
    h: height - padding * 2
  };

  if (state.chartMode === "http") {
    drawChartPanel(ctx, t("chart.httpTitle"), [
      { points: state.chart.download, color: "#44c7e8" },
      { points: state.chart.upload, color: "#48d597" }
    ], minTime, now, fullArea, scale);
    return;
  }
  if (state.chartMode === "realtime") {
    drawChartPanel(ctx, t("chart.realtimeTitle"), [
      { points: state.chart.target, color: "#f2b84b" },
      { points: state.chart.realtime, color: "#5b8cff" }
    ], minTime, now, fullArea, scale);
    return;
  }

  const gap = 24 * scale;
  const halfHeight = (fullArea.h - gap) / 2;
  drawChartPanel(ctx, t("chart.httpTitle"), [
    { points: state.chart.download, color: "#44c7e8" },
    { points: state.chart.upload, color: "#48d597" }
  ], minTime, now, { x: fullArea.x, y: fullArea.y, w: fullArea.w, h: halfHeight }, scale);
  drawChartPanel(ctx, t("chart.realtimeTitle"), [
    { points: state.chart.target, color: "#f2b84b" },
    { points: state.chart.realtime, color: "#5b8cff" }
  ], minTime, now, { x: fullArea.x, y: fullArea.y + halfHeight + gap, w: fullArea.w, h: halfHeight }, scale);
}

function drawChartPanel(ctx, title, series, minTime, maxTime, area, scale) {
  const maxValue = chartMax(series.flatMap((item) => item.points.map((point) => point.value)));
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1 * scale;
  ctx.fillStyle = "rgba(196,208,222,0.72)";
  ctx.font = 12 * scale + "px system-ui";
  ctx.fillText(title, area.x, area.y - 14 * scale);
  for (let i = 0; i <= 4; i++) {
    const y = area.y + area.h * i / 4;
    ctx.beginPath();
    ctx.moveTo(area.x, y);
    ctx.lineTo(area.x + area.w, y);
    ctx.stroke();
    const label = fmt(maxValue * (1 - i / 4)) + " Mbps";
    ctx.fillText(label, 8 * scale, y + 4 * scale);
  }
  series.forEach((item) => {
    drawLine(ctx, item.points, item.color, minTime, maxTime, maxValue, area, scale);
  });
}

function chartMax(values) {
  const raw = Math.max(50, max(values) * 1.18);
  const steps = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
  return steps.find((step) => step >= raw) || Math.ceil(raw / 5000) * 5000;
}

function drawLine(ctx, points, color, minTime, maxTime, maxValue, area, scale) {
  const visible = points.filter((point) => point.t >= minTime);
  if (visible.length < 1) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * scale;
  ctx.beginPath();
  visible.forEach((point, index) => {
    const x = area.x + (point.t - minTime) / (maxTime - minTime) * area.w;
    const y = area.y + area.h - point.value / maxValue * area.h;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

function copyServerURL() {
  const url = state.info && state.info.recommendedUrl ? state.info.recommendedUrl : location.origin;
  navigator.clipboard.writeText(url).then(() => {
    el.copyUrlButton.textContent = t("button.copied");
    setTimeout(() => {
      el.copyUrlButton.textContent = t("button.copyUrl");
    }, 1200);
  });
}

function copyReport() {
  const text = el.reportText.textContent || "";
  navigator.clipboard.writeText(text);
}

function downloadJSONReport() {
  if (!state.report) {
    return;
  }
  const blob = new Blob([JSON.stringify(state.report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "speedband-report.json";
  a.click();
  URL.revokeObjectURL(url);
}

async function saveReportToServer() {
  if (!state.report) {
    return;
  }
  el.saveReportButton.disabled = true;
  setReportSaveStatus(t("report.saving"), "");
  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(state.report, null, 2)
    });
    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      data = {};
    }
    if (!res.ok || !data.ok) {
      throw new Error(data.error || t("error.serverReturned", { status: res.status }));
    }
    setReportSaveStatus(t("report.saved", { path: data.path }), "ok");
  } catch (err) {
    setReportSaveStatus(t("report.saveFailed", { message: err.message || err }), "error");
  } finally {
    el.saveReportButton.disabled = !state.report;
  }
}

function setReportReady(ready) {
  el.saveReportButton.disabled = !ready;
  setReportSaveStatus(t("report.saveHint"), "");
}

function setReportSaveStatus(text, kind) {
  el.reportSaveStatus.textContent = text;
  el.reportSaveStatus.className = "report-save-status" + (kind ? " " + kind : "");
}

function makeUploadBlob(totalBytes, chunk) {
  const parts = [];
  let remaining = totalBytes;
  while (remaining > 0) {
    const size = Math.min(remaining, chunk.length);
    parts.push(chunk.slice(0, size));
    remaining -= size;
  }
  return new Blob(parts, { type: "application/octet-stream" });
}

function bucketMbps(buckets, elapsedSeconds, totalBytes = 0) {
  const rates = [];
  buckets.forEach((bytes, index) => {
    const duration = Math.min(1, Math.max(0, elapsedSeconds - index));
    if (!bytes || duration <= 0) {
      return;
    }
    const completeEnough = duration >= 0.98 || index < Math.floor(elapsedSeconds);
    const usablePartial = index === buckets.length - 1 && duration >= 0.75;
    if (completeEnough || usablePartial) {
      rates.push(bytes * 8 / duration / 1000000);
    }
  });
  if (!rates.length && totalBytes > 0 && elapsedSeconds > 0) {
    rates.push(totalBytes * 8 / elapsedSeconds / 1000000);
  }
  return rates.filter((value) => Number.isFinite(value));
}

function makeRateTracker(started) {
  return {
    bytes: 0,
    time: started,
    rate: 0
  };
}

function sampleRateMbps(rate, totalBytes, now) {
  const deltaBytes = Math.max(0, totalBytes - rate.bytes);
  const deltaSeconds = Math.max(0, (now - rate.time) / 1000);
  if (deltaSeconds > 0) {
    rate.rate = deltaBytes * 8 / deltaSeconds / 1000000;
    rate.bytes = totalBytes;
    rate.time = now;
  }
  return rate.rate;
}

function percentile(values, p) {
  const clean = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!clean.length) {
    return 0;
  }
  if (clean.length === 1) {
    return clean[0];
  }
  const pos = p / 100 * (clean.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  const weight = pos - lo;
  return clean[lo] * (1 - weight) + clean[hi] * weight;
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function min(values) {
  return values.length ? Math.min(...values) : 0;
}

function max(values) {
  return values.length ? Math.max(...values) : 0;
}

function jitter(values) {
  if (values.length < 2) {
    return 0;
  }
  let sum = 0;
  for (let i = 1; i < values.length; i++) {
    sum += Math.abs(values[i] - values[i - 1]);
  }
  return sum / (values.length - 1);
}

function worstWindow(values, size) {
  if (!values.length) {
    return 0;
  }
  if (values.length < size) {
    return min(values);
  }
  let worst = Infinity;
  for (let i = 0; i <= values.length - size; i++) {
    worst = Math.min(worst, average(values.slice(i, i + size)));
  }
  return worst;
}

function countStalls(values, threshold) {
  let count = 0;
  let active = false;
  values.forEach((value) => {
    if (value < threshold) {
      if (!active) {
        count++;
        active = true;
      }
    } else {
      active = false;
    }
  });
  return count;
}

function latencyLabel(p95) {
  if (p95 <= 12) return "Excellent";
  if (p95 <= 25) return "Good";
  if (p95 <= 45) return "Acceptable";
  if (p95 <= 80) return "Risky";
  return "Unstable";
}

function jitterLabel(value) {
  if (value <= 3) return "Excellent";
  if (value <= 7) return "Good";
  if (value <= 14) return "Acceptable";
  if (value <= 25) return "Risky";
  return "Unstable";
}

function lossLabel(value) {
  if (value <= 0.1) return "Excellent";
  if (value <= 0.5) return "Good";
  if (value <= 1.5) return "Acceptable";
  if (value <= 4) return "Risky";
  return "Unstable";
}

function throughputLabel(p5, avg) {
  const ratio = avg > 0 ? p5 / avg : 0;
  if (ratio >= 0.85) return "Excellent";
  if (ratio >= 0.72) return "Good";
  if (ratio >= 0.58) return "Acceptable";
  if (ratio >= 0.45) return "Risky";
  return "Unstable";
}

function nearestLevel(value) {
  let best = ladderLevels[0];
  ladderLevels.forEach((level) => {
    if (level <= value) {
      best = level;
    }
  });
  return best;
}

function nextLevel(value) {
  return ladderLevels.find((level) => level > value) || null;
}

function firstAbove(base, list) {
  return list.find((value) => value > base) || null;
}

function presetName(value) {
  return t("preset." + ({ general: "general", vr: "vr", game: "game", nas: "nas", custom: "custom" }[value] || "general"));
}

function statusText(status) {
  const key = {
    "Not tested": "status.notTested",
    Testing: "status.testing",
    Skipped: "status.skipped",
    Passed: "status.passed",
    Risky: "status.risky",
    Failed: "status.failed"
  }[status];
  return key ? t(key) : status;
}

function qualityText(label) {
  const key = {
    Excellent: "quality.excellent",
    Good: "quality.good",
    Acceptable: "quality.acceptable",
    Risky: "quality.risky",
    Unstable: "quality.unstable"
  }[label];
  return key ? t(key) : label;
}

function fmt(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  if (value >= 100) {
    return String(Math.round(value));
  }
  if (value >= 10) {
    return value.toFixed(1);
  }
  return value.toFixed(2);
}

function fmtOrDash(value) {
  if (!value) {
    return "--";
  }
  return fmt(value);
}

function numberFrom(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, value));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
