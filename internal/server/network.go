package server

import (
	"fmt"
	"net"
	"os"
	"sort"
	"strconv"
	"strings"
)

type LANAddress struct {
	Address      string `json:"address"`
	Interface    string `json:"interface"`
	URL          string `json:"url"`
	PrimaryGuess bool   `json:"primaryGuess"`
	Warning      string `json:"warning,omitempty"`
}

type AccessURLs struct {
	LocalhostURL     string       `json:"localhostUrl"`
	HostnameLocalURL string       `json:"hostnameLocalUrl,omitempty"`
	LAN              []LANAddress `json:"lan"`
}

func BuildAccessURLs(host string, port int) AccessURLs {
	portText := strconv.Itoa(port)
	info := AccessURLs{
		LocalhostURL: "http://localhost:" + portText,
		LAN:          findLANAddresses(port),
	}
	if hostname, err := os.Hostname(); err == nil && hostname != "" {
		info.HostnameLocalURL = fmt.Sprintf("http://%s.local:%d", sanitizeHostname(hostname), port)
	}
	return info
}

func findLANAddresses(port int) []LANAddress {
	ifaces, err := net.Interfaces()
	if err != nil {
		return nil
	}

	var addresses []LANAddress
	for _, iface := range ifaces {
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}
		for _, addr := range addrs {
			ip := ipFromAddr(addr)
			if ip == nil {
				continue
			}
			warning := adapterWarning(iface.Name)
			if isWeakCandidate(ip, iface.Name) && warning == "" {
				warning = "adapter may be virtual/VPN"
			}
			addresses = append(addresses, LANAddress{
				Address:   ip.String(),
				Interface: iface.Name,
				URL:       fmt.Sprintf("http://%s:%d", ip.String(), port),
				Warning:   warning,
			})
		}
	}

	sort.SliceStable(addresses, func(i, j int) bool {
		return scoreAddress(addresses[i]) > scoreAddress(addresses[j])
	})
	if len(addresses) > 0 {
		addresses[0].PrimaryGuess = true
	}
	return addresses
}

func ipFromAddr(addr net.Addr) net.IP {
	var ip net.IP
	switch v := addr.(type) {
	case *net.IPNet:
		ip = v.IP
	case *net.IPAddr:
		ip = v.IP
	default:
		return nil
	}
	ip = ip.To4()
	if ip == nil || ip.IsLoopback() || ip.IsMulticast() || ip.IsUnspecified() || ip.IsLinkLocalUnicast() {
		return nil
	}
	if !isPrivateIPv4(ip) {
		return nil
	}
	return ip
}

func isPrivateIPv4(ip net.IP) bool {
	return ip[0] == 10 ||
		(ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31) ||
		(ip[0] == 192 && ip[1] == 168)
}

func adapterWarning(name string) string {
	low := strings.ToLower(name)
	virtualWords := []string{
		"docker", "wsl", "hyper-v", "vmware", "virtualbox", "vethernet", "vpn",
		"wireguard", "tailscale", "zerotier", "loopback", "tap", "tunnel",
	}
	for _, word := range virtualWords {
		if strings.Contains(low, word) {
			return "adapter may be virtual/VPN"
		}
	}
	return ""
}

func isWeakCandidate(ip net.IP, iface string) bool {
	low := strings.ToLower(iface)
	if strings.Contains(low, "bluetooth") {
		return true
	}
	return ip[0] == 172
}

func scoreAddress(addr LANAddress) int {
	score := 100
	if addr.Warning != "" {
		score -= 60
	}
	if strings.HasPrefix(addr.Address, "192.168.") {
		score += 20
	}
	if strings.HasPrefix(addr.Address, "10.") {
		score += 10
	}
	return score
}

func sanitizeHostname(hostname string) string {
	host := strings.TrimSpace(hostname)
	host = strings.ReplaceAll(host, " ", "-")
	return host
}
