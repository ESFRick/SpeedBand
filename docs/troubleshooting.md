# Troubleshooting

## Check the subnet

Make sure the PC and the browser device are on the same local network and subnet. Guest Wi-Fi networks often isolate clients from each other.

## Disable VPN temporarily

VPN, WSL, Docker and VM adapters can change routing or make SpeedBand print an IP that is not reachable from your phone, tablet or headset. Disable VPN temporarily and try the physical LAN adapter IP.

## Check Windows Firewall

Allow SpeedBand on Private networks. If the browser device cannot open the page, remove the old firewall prompt decision and allow it again for `speedband.exe` or `go.exe`.

## Try another LAN IP

SpeedBand prints all private IPv4 candidates it finds. If the primary guess does not work, try another address from the list. Use numeric IP addresses when `.local` does not resolve.

## Use Ethernet for the PC

For high bitrate tests, connect the PC to the router with Ethernet. If both the PC and client are on Wi-Fi, they compete for airtime.

## Prefer 5 GHz or 6 GHz

2.4 GHz is crowded and usually not a good choice for high bitrate realtime streaming. Use 5 GHz or 6 GHz when available.

## Move closer to the router

Run the first test near the router. If results improve, the issue is likely signal quality, interference or distance.

## Stop downloads and updates

Pause cloud sync, game updates, OS updates and large downloads on all devices sharing the network.

## Restart the router

If results are inconsistent or suddenly poor, restart the router and repeat the test.

## Check guest Wi-Fi and client isolation

Some routers isolate guest Wi-Fi clients so they cannot reach devices on the LAN. Disable guest/client isolation or connect both devices to the main network.

## Check AP isolation

Access point isolation prevents wireless clients from talking to each other or to wired LAN clients. Turn it off for the network used by SpeedBand.

## Make several runs

Wi-Fi changes over time. Run 2-3 tests and choose the conservative result, especially before setting a high bitrate.

## WebRTC unavailable

This build keeps WebRTC DataChannel experimental/unavailable. WebSocket fallback is the core realtime path and should still work.

## Speed looks good but streaming stutters

Try a lower bitrate in the real app and check codec, decoder load, CPU/GPU load, router load and Wi-Fi interference. SpeedBand estimates network headroom, but the real application can still be limited elsewhere.
