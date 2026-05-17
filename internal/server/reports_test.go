package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestReportFilenameSanitizesUseCase(t *testing.T) {
	got := reportFilename(time.Date(2026, 5, 17, 14, 30, 9, 0, time.UTC), "VR streaming ../ weird:name")
	want := "speedband-20260517-143009-vr-streaming-weird-name.log"
	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestHandleReportsSavesReadableLogUnderReportsDirectory(t *testing.T) {
	oldWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	tmp := t.TempDir()
	if err := os.Chdir(tmp); err != nil {
		t.Fatal(err)
	}
	defer func() {
		if err := os.Chdir(oldWd); err != nil {
			t.Fatal(err)
		}
	}()

	body := `{"timestamp":"2026-05-17T14:30:09Z","appVersion":"0.1.0","browserUserAgent":"Test Browser","testMode":"quick","selectedUseCasePreset":"General realtime streaming","metrics":{"latency":{"averageMs":2,"p95Ms":3},"download":{"averageMbps":100,"p5Mbps":90},"upload":{"averageMbps":80,"p5Mbps":70}},"bitrateLadder":[{"targetMbps":100,"status":"Passed","actualReceiveMbps":99,"p5ThroughputMbps":90}],"recommendation":{"result":"Good","recommended":"75-100 Mbps","protocol":"WebSocket fallback","why":["100 Mbps passed"]},"warnings":["Peak speed is not a safe streaming bitrate."],"limitations":["Browser clients cannot open raw UDP sockets."]}`
	req := httptest.NewRequest(http.MethodPost, "/api/reports", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()

	New(Config{}).Handler().ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}

	var value struct {
		OK       bool   `json:"ok"`
		Filename string `json:"filename"`
		Path     string `json:"path"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &value); err != nil {
		t.Fatal(err)
	}
	if !value.OK {
		t.Fatalf("expected ok response: %+v", value)
	}
	if strings.Contains(value.Filename, "..") || filepath.IsAbs(value.Filename) {
		t.Fatalf("unsafe filename returned: %q", value.Filename)
	}
	if !strings.HasPrefix(value.Path, "reports/speedband-") || !strings.HasSuffix(value.Path, "-general-realtime-streaming.log") {
		t.Fatalf("unexpected report path: %q", value.Path)
	}

	saved, err := os.ReadFile(filepath.FromSlash(value.Path))
	if err != nil {
		t.Fatal(err)
	}
	text := string(saved)
	if !strings.Contains(text, "SpeedBand Report") || !strings.Contains(text, "Metrics") || !strings.Contains(text, "Realtime bitrate ladder") {
		t.Fatalf("saved report is not readable log: %q", text)
	}
	for _, unwanted := range []string{
		"Client network and browser",
		"SSID",
		"Warnings",
		"Limitations",
		"Reports are saved locally by the SpeedBand server",
		"not uploaded to the internet",
	} {
		if strings.Contains(text, unwanted) {
			t.Fatalf("saved report should not include %q: %q", unwanted, text)
		}
	}
	if strings.Contains(text, body) {
		t.Fatalf("saved report should not be raw JSON: %q", text)
	}
}

func TestHandleReportsRejectsInvalidContentTypeAndJSON(t *testing.T) {
	tests := []struct {
		name        string
		contentType string
		body        string
		status      int
	}{
		{name: "content type", contentType: "text/plain", body: `{}`, status: http.StatusUnsupportedMediaType},
		{name: "bad json", contentType: "application/json", body: `{`, status: http.StatusBadRequest},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/reports", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", tt.contentType)
			rec := httptest.NewRecorder()
			New(Config{}).Handler().ServeHTTP(rec, req)
			if rec.Code != tt.status {
				t.Fatalf("expected %d, got %d: %s", tt.status, rec.Code, rec.Body.String())
			}
		})
	}
}

func TestFormatReportLogUsesRussianLabels(t *testing.T) {
	report := reportEnvelope{
		Language:              "ru",
		Timestamp:             "2026-05-17T14:30:09Z",
		AppVersion:            "0.1.0",
		TestMode:              "full",
		SelectedUseCasePreset: "VR-стриминг",
		Metrics: reportMetrics{
			Latency:  reportLatency{AverageMs: 2, P95Ms: 3},
			Download: reportThroughput{AverageMbps: 100, PeakMbps: 120},
			Upload:   reportThroughput{AverageMbps: 80, PeakMbps: 90},
		},
		BitrateLadder: []reportLadderResult{
			{TargetMbps: 100, Status: "Passed", ActualReceiveMbps: 99, P5ThroughputMbps: 90},
		},
		Recommendation: reportRecommendation{
			Result:      "Хорошо",
			Recommended: "75-100 Mbps",
			Protocol:    "WebSocket fallback",
			Why:         []string{"100 Mbps пройдено."},
		},
	}
	text := formatReportLog(report, time.Date(2026, 5, 17, 14, 31, 0, 0, time.UTC))
	for _, want := range []string{"Отчёт SpeedBand", "Рекомендация", "Метрики", "Realtime лестница битрейтов", "Пройдено"} {
		if !strings.Contains(text, want) {
			t.Fatalf("expected Russian log to contain %q: %q", want, text)
		}
	}
	for _, unwanted := range []string{"Client network and browser", "Warnings", "Limitations"} {
		if strings.Contains(text, unwanted) {
			t.Fatalf("Russian log should not include %q: %q", unwanted, text)
		}
	}
}
