# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Run (dev)
go run ./cmd/speedband

# Build
go build -o speedband.exe ./cmd/speedband
# or
.\scripts\build-windows.ps1

# Test
go test ./...

# Single package test
go test ./internal/metrics/...
```

Flags: `--host 0.0.0.0 --port 8080 --open false --debug false`

## Architecture

Single-binary Go server + embedded static web UI. No database, no external services, no CDN.

```
cmd/speedband/main.go          entry point, flags, banner, http.Server
internal/server/               HTTP server and all API handlers
  server.go                    Config, Server struct, randomBlock, activeTests semaphore
  routes.go                    mux registration + handleIndex/Ping/Download/Upload
  websocket.go                 /api/ws — binary bitrate ladder test with pacing
  reports.go                   /api/reports — saves .log files to reports/ dir
  middleware.go                 CORS / response headers
  network.go, urls.go, routes_os.go  LAN IP detection, URL construction, OS hostname
internal/metrics/              pure computation, no I/O
  metrics.go                   ThroughputSummary, LatencySummary, Mbps()
  percentiles.go               Percentile(), Average(), Max(), Min(), WorstWindowAverage()
  stability.go                 Jitter(), StabilityLabel() — thresholds for quality labels
  bitrate.go                   bitrate helpers
  windows.go                   WorstWindowAverage()
internal/tests/                client-side test logic descriptions (not server-side execution)
internal/webui/
  embed.go                     embeds static/ into binary via go:embed
  static/index.html            single-page app shell
  static/app.js                all UI logic, test orchestration, i18n (en + ru)
  static/styles.css            CSS
internal/app/version.go        Name, Version, Description constants
```

**Test flow:** Browser JS runs latency (`/api/ping`), HTTP download (`/api/download`), HTTP upload (`/api/upload`), then WebSocket bitrate ladder (`/api/ws`). Server is passive — it just serves data and records results. All analysis and recommendation logic lives in `app.js`.

**WebSocket protocol:** Client sends `{"type":"start","targetMbps":X,"durationMs":Y,"chunkSize":Z}`. Server streams binary frames (seq u32 + timestamp u64 at bytes 0–11, random fill). Ends with JSON `done` frame. Client measures receive-side throughput.

**Reports:** `POST /api/reports` receives JSON from browser, saves human-readable `.log` to `reports/`. Supports `language: "en"|"ru"` for bilingual log output.

**Concurrency:** `activeTests` is a buffered channel (cap 8) used as a semaphore — one per WebSocket test goroutine.

**randomBlock:** 1 MB pre-generated random bytes in `Server`, reused for all download/WS payloads. Avoids per-request allocation.

## Constraints (from AGENTS.md)

- No cloud, telemetry, CDN, database, auth, or external services.
- No writing upload or generated test data to disk.
- Recommendations must use stability/low-percentile/jitter/stalls — never peak speed alone.
- Core transport: HTTP + WebSocket. WebRTC is optional/experimental.
- Second device requires only a browser — no app install.
- UI: clean technical diagnostics dashboard, not gamer/RGB/sci-fi/Bootstrap-default.
- Do not rename the project.
