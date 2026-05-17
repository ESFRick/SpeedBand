package server

import "fmt"

func recommendedURL(host string, port int) string {
	access := BuildAccessURLs(host, port)
	for _, item := range access.LAN {
		if item.PrimaryGuess {
			return item.URL
		}
	}
	return fmt.Sprintf("http://localhost:%d", port)
}

const maxUploadBytes = int64(1024 * 1024 * 1024)
