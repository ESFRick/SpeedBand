# SpeedBand

[![Go](https://img.shields.io/badge/Go-1.22+-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows | Linux | macOS](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)](https://github.com/ESFRick/SpeedBand/releases)
[![Download](https://img.shields.io/github/v/release/ESFRick/SpeedBand?label=Download&color=brightgreen)](https://github.com/ESFRick/SpeedBand/releases/latest)

Diagnose whether your LAN is stable enough for realtime streaming. Measures latency, jitter and low-percentile throughput via browser - no install on the second device, no telemetry.

![SpeedBand demo](docs/demo.gif)

---

## Table of contents

- [What SpeedBand does](#what-speedband-does)
- [Why not iperf3?](#why-not-iperf3)
- [Use cases](#use-cases)
- [Results](#results)
- [Quick start](#quick-start)
- [Connecting from another device](#connecting-from-another-device)
- [Firewall](#firewall)
- [Reading results](#reading-results)
- [Reports](#reports)
- [Recommended test conditions](#recommended-test-conditions)
- [License](#license)

---

## What SpeedBand does

Runs a small HTTP server on your machine. Another device opens the page in a browser and runs a full test sequence:

1. Latency and jitter (`/api/ping`)
2. HTTP download throughput (`/api/download`)
3. HTTP upload throughput (`/api/upload`)
4. WebSocket realtime bitrate ladder (`/api/ws`)

All traffic stays inside the LAN. Results include a stable bitrate range with headroom levels, a quality label and a bitrate ladder breakdown.

**Peak speed is not a safe streaming bitrate.** SpeedBand uses low-percentile throughput, jitter and stall detection to estimate a safe operating range.

---

## Why not iperf3?

iperf3 requires installation on both devices and reports raw TCP throughput - not what matters for streaming.

SpeedBand runs as a single binary or `go run`. The second device only needs a browser. It measures what streaming actually uses: low-percentile throughput, jitter, stall detection and realtime bitrate stability across a stepped ladder. The output is a safe bitrate range with headroom levels, not just a peak number.

---

## Use cases

- Game and VR streaming (Moonlight/Sunshine, Steam Link, Air Link, Virtual Desktop, ALVR)
- NAS and media transfer checks
- Wi-Fi diagnostics
- LAN testing between PC, phone, tablet, laptop, headset or Steam Deck
- Finding whether peak throughput hides jitter, stalls or unstable low-percentile results

---

## Results

<img src="docs/screenshot.jpg" width="800" alt="SpeedBand results">

<img src="docs/screenshot2.jpg" width="800" alt="SpeedBand results detail">

---

## Quick start

Download the binary for your platform from the [Releases page](https://github.com/ESFRick/SpeedBand/releases/latest) and run it.

**Linux:**

```bash
chmod +x speedband-linux-amd64
./speedband-linux-amd64
```

**macOS:**

```bash
chmod +x speedband-macos-arm64   # Apple Silicon
./speedband-macos-arm64

chmod +x speedband-macos-amd64 # Intel Macs:
./speedband-macos-amd64
```

Open the LAN URL printed in the terminal on any device in the same network.

### Build from source

**Windows:**

```powershell
go build -o speedband.exe ./cmd/speedband
```

**Linux / macOS:**

```bash
go build -o speedband ./cmd/speedband
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--host` | `0.0.0.0` | Listen address |
| `--port` | `8080` | Listen port |
| `--open` | `false` | Auto-open browser on start |
| `--debug` | `false` | Verbose logging |

## Firewall

If the page does not open from another device:

- Confirm both devices are on the same subnet.
- **Windows:** when prompted, allow access on **Private networks**. If not prompted, allow `speedband.exe` or `go.exe` in Windows Firewall for Private networks.
- **Linux:** ensure the port is open (`sudo ufw allow 8080/tcp` for UFW-based distros).
- **macOS:** allow incoming connections when prompted by the OS firewall dialog.
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

- **Download JSON** - saves report on the client device.
- **Save to server** - sends report to the machine; saves a `.log` file in `reports/` under the server working directory.

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
