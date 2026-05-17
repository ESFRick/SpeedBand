package server

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"errors"
	"math"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  64 * 1024,
	WriteBufferSize: 64 * 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type wsRequest struct {
	Type       string  `json:"type"`
	DurationMs int     `json:"durationMs"`
	TargetMbps float64 `json:"targetMbps"`
	ChunkSize  int     `json:"chunkSize"`
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	conn.SetReadLimit(1024 * 1024)
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	var writeMu sync.Mutex
	var testCancel context.CancelFunc
	defer func() {
		if testCancel != nil {
			testCancel()
		}
	}()

	_ = s.writeWSJSON(conn, &writeMu, map[string]any{
		"type":      "hello",
		"protocol":  "websocket",
		"serverNow": time.Now().UTC().Format(time.RFC3339Nano),
	})

	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			cancel()
			return
		}
		var req wsRequest
		if err := json.Unmarshal(data, &req); err != nil {
			_ = s.writeWSJSON(conn, &writeMu, map[string]any{"type": "error", "error": "invalid JSON command"})
			continue
		}
		switch req.Type {
		case "start":
			if testCancel != nil {
				testCancel()
			}
			var runCtx context.Context
			runCtx, testCancel = context.WithCancel(ctx)
			go s.runWSTest(runCtx, conn, &writeMu, req)
		case "abort", "reset", "stop":
			if testCancel != nil {
				testCancel()
				testCancel = nil
			}
			_ = s.writeWSJSON(conn, &writeMu, map[string]any{"type": "aborted"})
		default:
			_ = s.writeWSJSON(conn, &writeMu, map[string]any{"type": "error", "error": "unknown command"})
		}
	}
}

func (s *Server) runWSTest(ctx context.Context, conn *websocket.Conn, writeMu *sync.Mutex, req wsRequest) {
	select {
	case s.activeTests <- struct{}{}:
		defer func() { <-s.activeTests }()
	default:
		_ = s.writeWSJSON(conn, writeMu, map[string]any{
			"type":  "error",
			"error": "too many active tests; wait for the current calibration to finish",
		})
		return
	}

	duration := clampDuration(req.DurationMs, 1000, 30000, 3000)
	chunkSize := clampInt(req.ChunkSize, 4096, 262144, recommendedWSChunkSize(req.TargetMbps))
	targetMbps := math.Max(0, req.TargetMbps)

	_ = s.writeWSJSON(conn, writeMu, map[string]any{
		"type":       "started",
		"targetMbps": targetMbps,
		"durationMs": duration.Milliseconds(),
		"chunkSize":  chunkSize,
		"protocol":   "websocket",
	})

	start := time.Now()
	deadline := start.Add(duration)
	packet := make([]byte, chunkSize)
	copy(packet, s.randomBlock[:minInt(len(packet), len(s.randomBlock))])

	var sent int64
	var seq uint32
	var maxWriteDelay time.Duration
	var slowWrites int

	for time.Now().Before(deadline) {
		select {
		case <-ctx.Done():
			_ = s.writeWSJSON(conn, writeMu, map[string]any{"type": "aborted"})
			return
		default:
		}

		if targetMbps > 0 {
			bytesPerSecond := targetMbps * 1_000_000 / 8
			nextBytes := float64(sent + int64(chunkSize))
			nextAt := start.Add(time.Duration(nextBytes / bytesPerSecond * float64(time.Second)))
			if sleep := time.Until(nextAt); sleep > 0 {
				timer := time.NewTimer(sleep)
				select {
				case <-ctx.Done():
					timer.Stop()
					_ = s.writeWSJSON(conn, writeMu, map[string]any{"type": "aborted"})
					return
				case <-timer.C:
				}
			}
		}

		binary.BigEndian.PutUint32(packet[0:4], seq)
		binary.BigEndian.PutUint64(packet[4:12], uint64(time.Now().UnixNano()))
		seq++

		writeMu.Lock()
		_ = conn.SetWriteDeadline(time.Now().Add(3 * time.Second))
		writeStart := time.Now()
		err := conn.WriteMessage(websocket.BinaryMessage, packet)
		writeDelay := time.Since(writeStart)
		writeMu.Unlock()
		if err != nil {
			if !errors.Is(err, context.Canceled) {
				_ = s.writeWSJSON(conn, writeMu, map[string]any{"type": "error", "error": "websocket write failed"})
			}
			return
		}
		if writeDelay > maxWriteDelay {
			maxWriteDelay = writeDelay
		}
		if writeDelay > 100*time.Millisecond {
			slowWrites++
		}
		sent += int64(chunkSize)
	}

	elapsed := time.Since(start)
	_ = s.writeWSJSON(conn, writeMu, map[string]any{
		"type":            "done",
		"bytes":           sent,
		"durationMs":      elapsed.Milliseconds(),
		"targetMbps":      targetMbps,
		"actualMbps":      mbps(sent, elapsed),
		"packets":         seq,
		"maxWriteDelayMs": float64(maxWriteDelay.Microseconds()) / 1000,
		"slowWrites":      slowWrites,
		"protocol":        "websocket",
	})
}

func (s *Server) writeWSJSON(conn *websocket.Conn, writeMu *sync.Mutex, value map[string]any) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	writeMu.Lock()
	defer writeMu.Unlock()
	_ = conn.SetWriteDeadline(time.Now().Add(3 * time.Second))
	return conn.WriteMessage(websocket.TextMessage, data)
}

func recommendedWSChunkSize(targetMbps float64) int {
	if targetMbps <= 0 {
		return 128 * 1024
	}
	bytesPerSecond := targetMbps * 1_000_000 / 8
	size := int(bytesPerSecond / 60)
	return clampInt(size, 8*1024, 256*1024, 32*1024)
}

func clampDuration(ms, min, max, def int) time.Duration {
	if ms <= 0 {
		ms = def
	}
	return time.Duration(clampInt(ms, min, max, def)) * time.Millisecond
}

func clampInt(value, min, max, def int) int {
	if value <= 0 {
		value = def
	}
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}
