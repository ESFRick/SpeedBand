# SpeedBand

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue)](https://github.com/ESFRick/SpeedBand/releases)
[![Download](https://img.shields.io/github/v/release/ESFRick/SpeedBand?label=Download&color=brightgreen)](https://github.com/ESFRick/SpeedBand/releases/latest)

**[English](README.md) | [Русский](README.ru.md)**

Local network bandwidth and stability tester. Measures latency, jitter, throughput and realtime bitrate between two devices on the same LAN — no internet speedtest server, no telemetry, no install on the second device.

![SpeedBand demo](docs/demo.gif)

---

## Table of contents

- [What SpeedBand does](#what-speedband-does)
- [Use cases](#use-cases)
- [Quick start](#quick-start)
- [Connecting from another device](#connecting-from-another-device)
- [Windows Firewall](#windows-firewall)
- [Reading results](#reading-results)
- [Reports](#reports)
- [Recommended test conditions](#recommended-test-conditions)
- [License](#license)

---

## What SpeedBand does

Runs a small HTTP server on your Windows PC. Another device opens the page in a browser and runs a full test sequence:

1. Latency and jitter (`/api/ping`)
2. HTTP download throughput (`/api/download`)
3. HTTP upload throughput (`/api/upload`)
4. WebSocket realtime bitrate ladder (`/api/ws`)

All traffic stays inside the LAN. Results include a stable bitrate range with headroom levels, a quality label and a bitrate ladder breakdown.

**Peak speed is not a safe streaming bitrate.** SpeedBand uses low-percentile throughput, jitter and stall detection to estimate a safe operating range.

---

## Use cases

- Game and VR streaming (Moonlight/Sunshine, Steam Link, Air Link, Virtual Desktop, ALVR)
- NAS and media transfer checks
- Wi-Fi diagnostics
- LAN testing between PC, phone, tablet, laptop, headset or Steam Deck
- Finding whether peak throughput hides jitter, stalls or unstable low-percentile results

---

## Quick start

```powershell
go run ./cmd/speedband
```

Build a standalone executable:

```powershell
go build -o speedband.exe ./cmd/speedband
# or
.\scripts\build-windows.ps1
```

Open the LAN URL printed in the console on any device in the same network. No app install required on the second device — browser only.

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--host` | `0.0.0.0` | Listen address |
| `--port` | `8080` | Listen port |
| `--open` | `false` | Auto-open browser on start |
| `--debug` | `false` | Verbose logging |

---

## Connecting from another device

1. Start SpeedBand on the PC.
2. Use the LAN URL printed in the console, e.g. `http://192.168.1.25:8080`.
3. If `.local` hostname does not resolve, use the numeric IP.
4. On Meta Quest, open the URL in the headset browser.

The console prints all LAN IP candidates and marks the primary guess. Docker, VM and VPN adapters are filtered or flagged where possible.

---

## Windows Firewall

When prompted, allow access on **Private networks**.

If the page does not open from another device:

- Confirm both devices are on the same subnet.
- Allow `speedband.exe` or `go.exe` on Private networks in Windows Firewall.
- Try the numeric IP instead of `.local`.
- Disable VPN temporarily.

SpeedBand listens on `0.0.0.0` by default. Run it only on a trusted local network.

---

## Reading results

Bitrate range levels:

| Level | Meaning |
|-------|---------|
| Very safe | Conservative estimate with extra headroom |
| Recommended | Practical stable operating range |
| Risky upper | May work; showed reduced headroom or spikes |
| Avoid | Not recommended without real-app validation |

Quality labels:

| Label | Meaning |
|-------|---------|
| Excellent | Strong low-percentile throughput, low jitter |
| Good | Suitable for most realtime tasks |
| Acceptable | Usable; leave headroom |
| Risky | Unstable enough to require caution |
| Unstable | Not suitable for high bitrate realtime use |

---

## Reports

- **Download JSON** — saves report on the client device.
- **Save to server** — sends report to the PC; saves a `.log` file in `reports/` under the server working directory.

UI supports English and Russian. Reports use the language selected in the browser at save time.

---

## Recommended test conditions

- Connect the PC to the router with Ethernet.
- Use 5 GHz or 6 GHz Wi-Fi for the second device.
- Close active downloads, cloud sync and game updates.
- Run the Full stability test before choosing a high bitrate.
- Repeat 2–3 times; trust the more conservative result.

---

## License

MIT
