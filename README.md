# SpeedBand

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows-blue)](https://github.com/ESFRick/SpeedBand/releases)

SpeedBand is a local bandwidth and stability calibrator, not an internet speed test.

It runs a small local HTTP server on your Windows PC and lets another device in the same LAN open a browser page. The browser runs latency, jitter, HTTP download, HTTP upload and WebSocket realtime bitrate tests, then estimates a stable bitrate range.

This measures local network performance, not internet speed.

Results estimate a stable bitrate range. Real streaming apps may still behave differently depending on codec, device decoding, CPU/GPU load and Wi-Fi conditions.

Use the full stability test before choosing a high bitrate.

Peak speed is not a safe streaming bitrate.

## What is SpeedBand?

SpeedBand measures local network bandwidth, stability, latency, jitter and bitrate headroom between two devices on the same local network.

The test traffic stays inside your LAN:

- the main PC runs `speedband.exe` or `go run ./cmd/speedband`;
- the second device opens the SpeedBand page in a browser;
- no internet speedtest server is used;
- no telemetry or report upload is performed.

## What it is useful for

SpeedBand is useful for:

- realtime streaming bitrate checks;
- game streaming;
- VR streaming;
- Moonlight/Sunshine, Steam Link, Air Link, Virtual Desktop and ALVR diagnostics;
- NAS and media transfer checks;
- Wi-Fi diagnostics;
- LAN testing between a PC, phone, tablet, laptop, headset or Steam Deck;
- finding whether peak throughput is hiding jitter, stalls or unstable low-percentile throughput.

It is not a VR-only tool. VR is only one use case.

## How to run

From the project root:

```powershell
go run ./cmd/speedband
```

Build a Windows-friendly executable:

```powershell
go build -o speedband.exe ./cmd/speedband
```

Command-line options:

```text
--host 0.0.0.0
--port 8080
--open false
--debug false
```

Defaults:

- host: `0.0.0.0`
- port: `8080`
- debug: `false`

## How to open from another device

1. Make sure both devices are connected to the same local network.
2. Start SpeedBand on the PC.
3. Use the LAN URL printed in the console, for example `http://192.168.1.25:8080`.
4. If a `.local` hostname is shown but does not work, use the IP address.
5. On Meta Quest, open the LAN URL in the headset browser.
6. Press `Start calibration`, `Quick test` or `Full stability test`.

The console prints all LAN IP candidates it can find and marks one as a primary guess. Docker, VM and VPN adapters are filtered or marked when possible, but use the address that belongs to your real LAN adapter.

## Windows Firewall

When Windows Firewall asks, allow access on Private networks.

If the page does not open from your phone, Quest or laptop:

- check that the PC and the second device are on the same Wi-Fi/LAN;
- allow `speedband.exe` or `go.exe` on Private networks;
- try the numeric LAN IP instead of `.local`;
- do not allow Public network access unless you understand the risk.

SpeedBand listens on `0.0.0.0` by default so other devices in the LAN can open the page. Run it only in a trusted local network.

## Why not use internet speedtest?

An internet speedtest measures the path from your device to an external server. Local streaming usually travels between two devices inside your LAN. A fast internet result does not prove that your router, Wi-Fi band, client device or local link can sustain a realtime bitrate without jitter, stalls or queue growth.

SpeedBand is closer to local streaming because the test traffic stays between your PC and the browser device.

## Accuracy notes

SpeedBand is more useful than a normal internet speedtest for local streaming scenarios, but it is still an estimate.

Real streaming apps may behave differently because results also depend on:

- codec and encoder settings;
- device decoder performance;
- CPU/GPU load;
- Wi-Fi interference;
- router behavior;
- buffering strategy;
- packet loss;
- jitter;
- the transport used by Virtual Desktop, Steam Link, Air Link, ALVR, Moonlight or another app.

For lab-style network measurement, `iperf3` can be a stronger reference, but it requires installing a client on both devices. SpeedBand only requires a browser on the second device.

## How to interpret results

SpeedBand reports ranges instead of exact values:

- Very safe: conservative level with extra headroom.
- Recommended: practical stable bitrate range.
- Risky upper: may work, but showed reduced headroom or spikes.
- Avoid: levels above this are not recommended without real-app validation.

Quality labels:

- Excellent: strong low-percentile throughput and low jitter/spikes.
- Good: likely suitable for many realtime tasks.
- Acceptable: usable, but leave headroom.
- Risky: unstable enough to require caution.
- Unstable: not suitable for high bitrate realtime use.

Do not choose a bitrate from peak speed. Use the recommendation panel and the ladder details.

## Saving reports on the server

The report panel has two report options:

- `Download JSON report` saves the report on the client device or browser that opened SpeedBand.
- `Save report to server` sends the report data back to the PC running SpeedBand and saves a readable `.log` file in `reports/` under the server working directory.

The server-side log includes the measured results, recommendation and bitrate ladder in a readable text format.

The UI language switch supports English and Russian. English is the default; reports saved to the server use the language selected in the browser at the time of saving.

This works only inside your local network. Reports are not uploaded to the internet.

## Recommended testing conditions

- Connect the PC to the router with Ethernet when possible.
- Avoid 2.4 GHz for high bitrate streaming.
- Use 5 GHz or 6 GHz Wi-Fi for the second device.
- Keep the headset/phone/laptop near the router for the first test.
- Close active downloads, cloud sync and game updates.
- Run 2-3 tests at different times.
- Use the Full stability test before choosing a high bitrate.

## Troubleshooting

Page does not open from phone/Quest:

- confirm both devices are in the same subnet;
- check Windows Firewall Private network access;
- try each LAN IP printed by SpeedBand;
- disable VPN temporarily.

`.local` does not work:

- use the numeric IP address;
- some routers and Windows setups do not provide reliable mDNS/hostname resolution.

Speed is good but streaming still stutters:

- lower bitrate and test the real app;
- check device decoder load, GPU load, codec settings and Wi-Fi interference;
- try a stricter preset such as Game streaming or VR streaming.

Results change between runs:

- Wi-Fi airtime and interference vary;
- repeat tests and trust the more conservative result.

2.4 GHz vs 5 GHz/6 GHz:

- 2.4 GHz often has lower throughput and higher interference;
- 5 GHz/6 GHz is usually better for high bitrate realtime streaming.

PC connected over Wi-Fi:

- a Wi-Fi PC plus Wi-Fi client can double airtime pressure;
- use Ethernet for the PC if possible.

Wrong IP shown:

- Docker, VM, VPN and WSL adapters can expose private IPs;
- use the address belonging to your physical LAN adapter.

## Limitations

- The second device is browser-only; raw UDP sockets are not available.
- One-way latency is not exact without clock synchronization.
- WebSocket runs over TCP, so packet loss is inferred from sequence gaps and stalls rather than raw UDP loss.
- The result is a bitrate range, not exact truth.
- Real apps can still behave differently.

## Implemented tests

- HTTP latency and jitter via `/api/ping`.
- HTTP download throughput via `/api/download`.
- HTTP upload throughput via `/api/upload`.
- WebSocket binary realtime bitrate ladder via `/api/ws`.
- JSON and human-readable reports in the UI.

No external CDN, web font, telemetry, cloud backend, database or Electron runtime is used.
