package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os/exec"
	"runtime"
	"strconv"
	"time"

	"speedband/internal/server"
)

func main() {
	host := flag.String("host", "0.0.0.0", "host/interface to listen on")
	port := flag.Int("port", 8080, "port to listen on")
	openBrowserFlag := flag.Bool("open", false, "open the local browser on startup")
	debug := flag.Bool("debug", false, "enable debug logging")
	flag.Parse()

	cfg := server.Config{
		Host:  *host,
		Port:  *port,
		Debug: *debug,
	}
	app := server.New(cfg)
	access := server.BuildAccessURLs(*host, *port)

	printBanner(*host, *port, access)

	if *openBrowserFlag {
		openBrowser(access.LocalhostURL)
	}

	addr := net.JoinHostPort(*host, strconv.Itoa(*port))
	httpServer := &http.Server{
		Addr:              addr,
		Handler:           app.Handler(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}

func printBanner(host string, port int, access server.AccessURLs) {
	fmt.Println("SpeedBand")
	fmt.Println("Local bandwidth & stability calibrator")
	fmt.Println()
	fmt.Printf("Listening on %s:%d\n", host, port)
	fmt.Println()
	fmt.Println("Open on another device in the same LAN:")
	if len(access.LAN) == 0 {
		fmt.Println("  No LAN IPv4 address detected. Check your network adapter and firewall settings.")
	} else {
		for _, item := range access.LAN {
			suffix := ""
			if item.PrimaryGuess {
				suffix = " (primary guess)"
			}
			if item.Warning != "" {
				suffix += " - " + item.Warning
			}
			fmt.Printf("  %s%s\n", item.URL, suffix)
		}
	}
	if access.HostnameLocalURL != "" {
		fmt.Printf("  %s (may work on some networks; use the IP address if it does not)\n", access.HostnameLocalURL)
	}
	fmt.Println()
	fmt.Println("On this machine:")
	fmt.Printf("  %s\n", access.LocalhostURL)
	fmt.Println()
	fmt.Println("This measures local network performance, not internet speed.")
	if runtime.GOOS == "windows" {
		fmt.Println("If Windows Firewall asks, allow access on Private networks.")
	}
}

func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	if err := cmd.Start(); err != nil {
		log.Printf("could not open browser: %v", err)
	}
}
