# SpeedBand Agent Notes

- The project is named SpeedBand.
- Do not rename it back to a VR-specific name.
- Do not use names like LAN VR Bitrate Calibrator, VR Bitrate Calibrator, VRec-style tool or VR-only speed test.
- Do not make the UI VRec-style, gamer/RGB, sci-fi, Windows settings-like, Bootstrap default or random admin dashboard.
- Keep the UI as a clean technical network diagnostics dashboard with large speedtest-style metrics.
- Do not add cloud services, telemetry, CDN assets, external web fonts, account systems, authorization or a database.
- Do not break local-only behavior. Test traffic must stay between the local server and browser clients in the LAN.
- Do not calculate recommendations from peak speed. Use stability, low-percentile throughput, stalls, jitter, latency spikes and ladder results.
- Core functionality must remain HTTP plus WebSocket even if WebRTC changes later.
- WebRTC is optional/experimental unless it is proven stable.
- Do not require installing an app on the second device. The second device must only need a modern browser.
- Do not write upload or generated test data to disk.
- Do not add an automatic git commit, GitHub remote or public publishing step.
