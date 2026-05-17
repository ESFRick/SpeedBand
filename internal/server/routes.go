package server

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	"speedband/internal/app"
	"speedband/internal/webui"
)

func (s *Server) registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/", s.handleIndex)
	mux.HandleFunc("/favicon.ico", s.handleFavicon)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(webui.StaticFS())))
	mux.HandleFunc("/api/info", s.handleInfo)
	mux.HandleFunc("/api/ping", s.handlePing)
	mux.HandleFunc("/api/download", s.handleDownload)
	mux.HandleFunc("/api/upload", s.handleUpload)
	mux.HandleFunc("/api/reports", s.handleReports)
	mux.HandleFunc("/api/ws", s.handleWebSocket)
}

func (s *Server) handleFavicon(w http.ResponseWriter, r *http.Request) {
	setNoCache(w)
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	index, err := webui.ReadStatic("index.html")
	if err != nil {
		http.Error(w, "web UI not embedded", http.StatusInternalServerError)
		return
	}
	setNoCache(w)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write(index)
}

func (s *Server) handleInfo(w http.ResponseWriter, r *http.Request) {
	hostname := ""
	if name, err := osHostname(); err == nil {
		hostname = name
	}
	value := map[string]any{
		"app": map[string]any{
			"name":        app.Name,
			"version":     app.Version,
			"description": app.Description,
		},
		"serverTime": time.Now().UTC().Format(time.RFC3339Nano),
		"hostname":   hostname,
		"access":     BuildAccessURLs(s.config.Host, s.config.Port),
		"protocols": map[string]any{
			"http":      true,
			"websocket": true,
		},
		"recommendedUrl": recommendedURL(s.config.Host, s.config.Port),
		"limits": map[string]any{
			"maxUploadBytes": maxUploadBytes,
			"maxDurationMs":  30000,
		},
	}
	data, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		http.Error(w, "could not encode info", http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, data)
}

func (s *Server) handlePing(w http.ResponseWriter, r *http.Request) {
	value := map[string]any{
		"serverTime": time.Now().UTC().Format(time.RFC3339Nano),
		"echo":       r.URL.Query().Get("echo"),
	}
	data, _ := json.Marshal(value)
	writeJSON(w, http.StatusOK, data)
}

func (s *Server) handleDownload(w http.ResponseWriter, r *http.Request) {
	duration := parseDurationMs(r, "durationMs", 3000, 250, 30000)
	chunkSize := parseIntQuery(r, "chunkSize", 64*1024, 4*1024, 1024*1024)

	setNoCache(w)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("X-Content-Type-Options", "nosniff")

	flusher, _ := w.(http.Flusher)
	start := time.Now()
	deadline := start.Add(duration)
	var written int64
	for time.Now().Before(deadline) {
		select {
		case <-r.Context().Done():
			return
		default:
		}
		chunk := s.randomChunk(written, chunkSize)
		n, err := w.Write(chunk)
		if err != nil {
			return
		}
		written += int64(n)
		if flusher != nil {
			flusher.Flush()
		}
	}
}

func (s *Server) handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "POST required", http.StatusMethodNotAllowed)
		return
	}
	start := time.Now()
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadBytes)
	bytesRead, err := io.CopyBuffer(io.Discard, r.Body, make([]byte, 64*1024))
	if err != nil {
		value := map[string]any{
			"ok":    false,
			"error": "upload failed or exceeded size limit",
		}
		data, _ := json.Marshal(value)
		writeJSON(w, http.StatusRequestEntityTooLarge, data)
		return
	}
	elapsed := time.Since(start)
	value := map[string]any{
		"ok":         true,
		"bytes":      bytesRead,
		"durationMs": elapsed.Milliseconds(),
		"mbps":       mbps(bytesRead, elapsed),
		"serverTime": time.Now().UTC().Format(time.RFC3339Nano),
	}
	data, _ := json.Marshal(value)
	writeJSON(w, http.StatusOK, data)
}

func (s *Server) randomChunk(offset int64, size int) []byte {
	if size >= len(s.randomBlock) {
		return s.randomBlock
	}
	maxStart := len(s.randomBlock) - size
	start := 0
	if maxStart > 0 {
		start = int((offset / 4096) % int64(maxStart))
	}
	return s.randomBlock[start : start+size]
}

func parseDurationMs(r *http.Request, name string, def, min, max int) time.Duration {
	return time.Duration(parseIntQuery(r, name, def, min, max)) * time.Millisecond
}

func parseIntQuery(r *http.Request, name string, def, min, max int) int {
	raw := r.URL.Query().Get(name)
	if raw == "" {
		return def
	}
	value, err := strconv.Atoi(raw)
	if err != nil {
		return def
	}
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func mbps(bytes int64, duration time.Duration) float64 {
	if duration <= 0 {
		return 0
	}
	return float64(bytes) * 8 / duration.Seconds() / 1_000_000
}
