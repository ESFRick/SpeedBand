# Measurement notes

SpeedBand is designed for practical local bitrate decisions, not for claiming a perfect physical-layer measurement.

## HTTP throughput vs realtime bitrate

HTTP download and upload tests show how quickly a browser and the local server can move bytes through the LAN. This is useful, but realtime streaming is stricter. A video stream can stutter even when average HTTP Mbps looks high, because realtime traffic needs consistent delivery with low jitter and limited queue growth.

## Average Mbps is not enough

Average throughput hides dips. A link can average 500 Mbps while dropping below 150 Mbps for several short windows. Those short dips are what a realtime app often feels as stutter, buffering or visible quality drops.

## Peak speed is dangerous

Peak speed is the best moment of the test. It is not a safe streaming bitrate. SpeedBand never treats peak Mbps as the recommended bitrate.

## Why p5 and p10 matter

p5 and p10 throughput describe the weaker parts of the run. If p5 is much lower than average, the connection has poor headroom. For bitrate recommendations, low-percentile throughput is more important than peak speed.

## Why jitter and spikes matter

Latency and jitter affect realtime input, frame delivery and buffer behavior. Game streaming and VR streaming are especially sensitive, but any realtime stream can suffer if RTT spikes are frequent.

SpeedBand computes jitter as the average absolute difference between adjacent RTT samples or adjacent receive intervals, depending on the test path.

## Why packet loss matters

Browsers do not expose raw UDP for normal pages. WebSocket fallback uses TCP, so true network packet loss is usually hidden by retransmission. SpeedBand still tracks sequence gaps in the WebSocket binary stream and reports stalls/spikes as practical symptoms.

## Why queue growth matters

If the sender can enqueue data faster than the receiver can process it, buffers grow. That may look fine for average throughput, but it increases latency and can make realtime applications feel unstable. SpeedBand treats server write delay, receive stalls and low actual receive rate as queue/backpressure warnings.

## Why recommendation is a range

Real streaming apps differ by codec, decoder, CPU/GPU load, Wi-Fi conditions, router behavior, buffering and transport. SpeedBand reports:

- Very safe;
- Recommended;
- Risky upper;
- Avoid.

It does not say "set exactly X Mbps".

## WebRTC DataChannel

WebRTC DataChannel can be closer to realtime browser traffic than HTTP throughput or WebSocket. It is still not identical to Virtual Desktop, Steam Link, Air Link, ALVR or Moonlight because those apps may use different codecs, buffers, pacing and transports.

In this build, WebRTC is intentionally marked experimental/unavailable and the working realtime path is WebSocket fallback.

## Why WebTransport is not in the main version

WebTransport support depends on browser, TLS and server setup details that complicate a simple local Windows executable. It is not implemented in the main version so the core local tool remains easy to run.

## iperf3 as a reference

`iperf3` can be a strong lab reference for network throughput and UDP behavior, but it requires installing software on both devices. SpeedBand is designed for browser-only clients, including phones, tablets and headsets.
