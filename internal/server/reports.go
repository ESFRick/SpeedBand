package server

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const maxReportBytes = int64(2 * 1024 * 1024)

type reportEnvelope struct {
	Timestamp             string               `json:"timestamp"`
	Language              string               `json:"language"`
	AppVersion            string               `json:"appVersion"`
	BrowserUserAgent      string               `json:"browserUserAgent"`
	TestMode              string               `json:"testMode"`
	SelectedUseCasePreset string               `json:"selectedUseCasePreset"`
	SelectedUseCaseKey    string               `json:"selectedUseCasePresetKey"`
	Metrics               reportMetrics        `json:"metrics"`
	BitrateLadder         []reportLadderResult `json:"bitrateLadder"`
	Recommendation        reportRecommendation `json:"recommendation"`
}

type reportMetrics struct {
	Latency  reportLatency    `json:"latency"`
	Download reportThroughput `json:"download"`
	Upload   reportThroughput `json:"upload"`
}

type reportLatency struct {
	AverageMs float64 `json:"averageMs"`
	MedianMs  float64 `json:"medianMs"`
	P95Ms     float64 `json:"p95Ms"`
	P99Ms     float64 `json:"p99Ms"`
	MaxMs     float64 `json:"maxMs"`
	JitterMs  float64 `json:"jitterMs"`
}

type reportThroughput struct {
	AverageMbps float64 `json:"averageMbps"`
	PeakMbps    float64 `json:"peakMbps"`
	P50Mbps     float64 `json:"p50Mbps"`
	P10Mbps     float64 `json:"p10Mbps"`
	P5Mbps      float64 `json:"p5Mbps"`
	Min1sMbps   float64 `json:"min1sMbps"`
	Worst5sMbps float64 `json:"worst5sMbps"`
	Stalls      int     `json:"stalls"`
}

type reportLadderResult struct {
	TargetMbps          float64 `json:"targetMbps"`
	Status              string  `json:"status"`
	ActualReceiveMbps   float64 `json:"actualReceiveMbps"`
	PacketLossPercent   float64 `json:"packetLossPercent"`
	JitterMs            float64 `json:"jitterMs"`
	P5ThroughputMbps    float64 `json:"p5ThroughputMbps"`
	MaxLatencySpikeMs   float64 `json:"maxLatencySpikeMs"`
	BackpressureWarning bool    `json:"backpressureWarning"`
}

type reportRecommendation struct {
	Result      string   `json:"result"`
	VerySafe    string   `json:"verySafe"`
	Recommended string   `json:"recommended"`
	RiskyUpper  string   `json:"riskyUpper"`
	Avoid       string   `json:"avoid"`
	Protocol    string   `json:"protocol"`
	Why         []string `json:"why"`
}

func (s *Server) handleReports(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSONError(w, http.StatusMethodNotAllowed, "POST required")
		return
	}
	if !isJSONContentType(r.Header.Get("Content-Type")) {
		writeJSONError(w, http.StatusUnsupportedMediaType, "Content-Type must be application/json")
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxReportBytes)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeJSONError(w, http.StatusRequestEntityTooLarge, "report JSON is too large")
		return
	}
	if len(bytes.TrimSpace(body)) == 0 {
		writeJSONError(w, http.StatusBadRequest, "report JSON is empty")
		return
	}
	if !json.Valid(body) {
		writeJSONError(w, http.StatusBadRequest, "report body is not valid JSON")
		return
	}

	var report reportEnvelope
	if err := json.Unmarshal(body, &report); err != nil {
		writeJSONError(w, http.StatusBadRequest, "report body is not valid JSON")
		return
	}

	if err := os.MkdirAll("reports", 0755); err != nil {
		writeJSONError(w, http.StatusInternalServerError, "could not create reports directory")
		return
	}

	now := time.Now()
	var filename string
	var fullPath string
	var file *os.File
	var saveErr error
	for i := 0; i < 100; i++ {
		suffix := 0
		if i > 0 {
			suffix = i + 1
		}
		filename = reportFilenameWithSuffix(now, reportFilenameUseCase(report), suffix)
		fullPath = filepath.Join("reports", filename)
		file, saveErr = os.OpenFile(fullPath, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0644)
		if !errors.Is(saveErr, os.ErrExist) {
			break
		}
	}
	if saveErr != nil {
		writeJSONError(w, http.StatusInternalServerError, "could not save report log")
		return
	}
	defer file.Close()

	logText := formatReportLog(report, now)
	if _, err := file.WriteString(logText); err != nil {
		writeJSONError(w, http.StatusInternalServerError, "could not write report log")
		return
	}

	value := map[string]any{
		"ok":       true,
		"filename": filename,
		"path":     filepath.ToSlash(filepath.Join("reports", filename)),
	}
	data, _ := json.Marshal(value)
	writeJSON(w, http.StatusOK, data)
}

func isJSONContentType(value string) bool {
	mediaType, _, err := mime.ParseMediaType(value)
	return err == nil && strings.EqualFold(mediaType, "application/json")
}

func formatReportLog(report reportEnvelope, savedAt time.Time) string {
	var b strings.Builder
	labels := reportLogLabels(report.Language)
	line := strings.Repeat("=", 72)
	fmt.Fprintf(&b, "%s\n%s\n\n", labels.Title, line)
	fmt.Fprintf(&b, "%s: %s\n", labels.SavedAt, savedAt.Format(time.RFC3339))
	fmt.Fprintf(&b, "%s: %s\n", labels.TestTimestamp, valueOrDash(report.Timestamp))
	fmt.Fprintf(&b, "%s: %s\n", labels.AppVersion, valueOrDash(report.AppVersion))
	fmt.Fprintf(&b, "%s: %s\n", labels.TestMode, localizedMode(report.TestMode, report.Language))
	fmt.Fprintf(&b, "%s: %s\n\n", labels.UseCase, valueOrDash(report.SelectedUseCasePreset))

	fmt.Fprintf(&b, "%s\n%s\n", labels.Recommendation, line)
	fmt.Fprintf(&b, "%s: %s\n", labels.Result, valueOrDash(report.Recommendation.Result))
	fmt.Fprintf(&b, "%s: %s\n", labels.Recommended, valueOrDash(report.Recommendation.Recommended))
	fmt.Fprintf(&b, "%s: %s\n", labels.VerySafe, valueOrDash(report.Recommendation.VerySafe))
	fmt.Fprintf(&b, "%s: %s\n", labels.RiskyUpper, valueOrDash(report.Recommendation.RiskyUpper))
	fmt.Fprintf(&b, "%s: %s\n", labels.Avoid, valueOrDash(report.Recommendation.Avoid))
	fmt.Fprintf(&b, "%s: %s\n", labels.Protocol, valueOrDash(report.Recommendation.Protocol))
	if len(report.Recommendation.Why) > 0 {
		fmt.Fprintf(&b, "%s:\n", labels.Why)
		writeBulletList(&b, report.Recommendation.Why)
	}
	b.WriteString("\n")

	fmt.Fprintf(&b, "%s\n%s\n", labels.Metrics, line)
	fmt.Fprintf(&b, "%s: %s / %s / %s / %s / %s ms\n",
		labels.LatencyLine,
		logFloat(report.Metrics.Latency.AverageMs),
		logFloat(report.Metrics.Latency.P95Ms),
		logFloat(report.Metrics.Latency.P99Ms),
		logFloat(report.Metrics.Latency.MaxMs),
		logFloat(report.Metrics.Latency.JitterMs))
	writeThroughput(&b, labels.Download, report.Metrics.Download, labels)
	writeThroughput(&b, labels.Upload, report.Metrics.Upload, labels)
	b.WriteString("\n")

	fmt.Fprintf(&b, "%s\n%s\n", labels.Ladder, line)
	if len(report.BitrateLadder) == 0 {
		fmt.Fprintf(&b, "%s\n", labels.NoLadder)
	} else {
		fmt.Fprintf(&b, "%-10s %-12s %-12s %-12s %-10s %-12s %-12s %s\n", labels.Target, labels.Status, labels.Actual, "P5", labels.Loss, labels.Jitter, labels.MaxSpike, labels.Queue)
		for _, row := range report.BitrateLadder {
			if row.Status == "Not tested" || row.Status == "Skipped" {
				continue
			}
			fmt.Fprintf(&b, "%-10s %-12s %-12s %-12s %-10s %-12s %-12s %s\n",
				logFloat(row.TargetMbps)+" Mbps",
				localizedStatus(row.Status, report.Language),
				logFloat(row.ActualReceiveMbps)+" Mbps",
				logFloat(row.P5ThroughputMbps)+" Mbps",
				logFloat(row.PacketLossPercent)+"%",
				logFloat(row.JitterMs)+" ms",
				logFloat(row.MaxLatencySpikeMs)+" ms",
				yesNo(row.BackpressureWarning, report.Language))
		}
	}
	b.WriteString("\n")
	return b.String()
}

type reportLabels struct {
	Title          string
	SavedAt        string
	TestTimestamp  string
	AppVersion     string
	TestMode       string
	UseCase        string
	Recommendation string
	Result         string
	Recommended    string
	VerySafe       string
	RiskyUpper     string
	Avoid          string
	Protocol       string
	Why            string
	Metrics        string
	LatencyLine    string
	Download       string
	Upload         string
	Throughput     string
	Avg            string
	Peak           string
	Min1s          string
	Worst5s        string
	Stalls         string
	Ladder         string
	NoLadder       string
	Target         string
	Status         string
	Actual         string
	Loss           string
	Jitter         string
	MaxSpike       string
	Queue          string
}

func reportLogLabels(language string) reportLabels {
	if language == "ru" {
		return reportLabels{
			Title:          "Отчёт SpeedBand",
			SavedAt:        "Сохранено",
			TestTimestamp:  "Время теста",
			AppVersion:     "Версия приложения",
			TestMode:       "Режим теста",
			UseCase:        "Сценарий",
			Recommendation: "Рекомендация",
			Result:         "Результат",
			Recommended:    "Рекомендуется",
			VerySafe:       "Очень безопасно",
			RiskyUpper:     "Верхняя зона риска",
			Avoid:          "Избегать",
			Protocol:       "Протокол",
			Why:            "Почему",
			Metrics:        "Метрики",
			LatencyLine:    "Задержка средн. / p95 / p99 / макс. / джиттер",
			Download:       "Загрузка",
			Upload:         "Отдача",
			Throughput:     "throughput",
			Avg:            "средн.",
			Peak:           "пик",
			Min1s:          "мин. 1с",
			Worst5s:        "худшие 5с",
			Stalls:         "просадки",
			Ladder:         "Realtime лестница битрейтов",
			NoLadder:       "В отчёте нет строк ladder.",
			Target:         "Цель",
			Status:         "Статус",
			Actual:         "Факт",
			Loss:           "Потери",
			Jitter:         "Джиттер",
			MaxSpike:       "Макс. пик",
			Queue:          "Очередь",
		}
	}
	return reportLabels{
		Title:          "SpeedBand Report",
		SavedAt:        "Saved at",
		TestTimestamp:  "Test timestamp",
		AppVersion:     "App version",
		TestMode:       "Test mode",
		UseCase:        "Use case",
		Recommendation: "Recommendation",
		Result:         "Result",
		Recommended:    "Recommended",
		VerySafe:       "Very safe",
		RiskyUpper:     "Risky upper",
		Avoid:          "Avoid",
		Protocol:       "Protocol",
		Why:            "Why",
		Metrics:        "Metrics",
		LatencyLine:    "Latency avg / p95 / p99 / max / jitter",
		Download:       "Download",
		Upload:         "Upload",
		Throughput:     "throughput",
		Avg:            "avg",
		Peak:           "peak",
		Min1s:          "min1s",
		Worst5s:        "worst5s",
		Stalls:         "stalls",
		Ladder:         "Realtime bitrate ladder",
		NoLadder:       "No ladder rows in report.",
		Target:         "Target",
		Status:         "Status",
		Actual:         "Actual",
		Loss:           "Loss",
		Jitter:         "Jitter",
		MaxSpike:       "Max spike",
		Queue:          "Queue",
	}
}

func writeThroughput(b *strings.Builder, label string, value reportThroughput, labels reportLabels) {
	fmt.Fprintf(b, "%s %s: %s=%s Mbps, %s=%s Mbps, p10=%s Mbps, p5=%s Mbps, %s=%s Mbps, %s=%s Mbps, %s=%d\n",
		label,
		labels.Throughput,
		labels.Avg,
		logFloat(value.AverageMbps),
		labels.Peak,
		logFloat(value.PeakMbps),
		logFloat(value.P10Mbps),
		logFloat(value.P5Mbps),
		labels.Min1s,
		logFloat(value.Min1sMbps),
		labels.Worst5s,
		logFloat(value.Worst5sMbps),
		labels.Stalls,
		value.Stalls)
}

func writeBulletList(b *strings.Builder, items []string) {
	for _, item := range items {
		if strings.TrimSpace(item) != "" {
			fmt.Fprintf(b, "- %s\n", item)
		}
	}
}

func valueOrDash(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return "--"
	}
	return value
}

func logFloat(value float64) string {
	return strings.TrimRight(strings.TrimRight(fmt.Sprintf("%.2f", value), "0"), ".")
}

func yesNo(value bool, language string) string {
	if value {
		if language == "ru" {
			return "да"
		}
		return "yes"
	}
	if language == "ru" {
		return "нет"
	}
	return "no"
}

func localizedStatus(status string, language string) string {
	if language != "ru" {
		return valueOrDash(status)
	}
	switch status {
	case "Passed":
		return "Пройдено"
	case "Risky":
		return "Рискованно"
	case "Failed":
		return "Провалено"
	case "Testing":
		return "Проверяется"
	case "Skipped":
		return "Пропущено"
	case "Not tested":
		return "Не проверено"
	default:
		return valueOrDash(status)
	}
}

func localizedMode(mode string, language string) string {
	if language != "ru" {
		return valueOrDash(mode)
	}
	switch mode {
	case "quick":
		return "быстрый"
	case "full":
		return "полный"
	default:
		return valueOrDash(mode)
	}
}

func reportFilenameUseCase(report reportEnvelope) string {
	if strings.TrimSpace(report.SelectedUseCaseKey) != "" {
		return report.SelectedUseCaseKey
	}
	return report.SelectedUseCasePreset
}

func reportFilename(now time.Time, useCase string) string {
	return reportFilenameWithSuffix(now, useCase, 0)
}

func reportFilenameWithSuffix(now time.Time, useCase string, suffix int) string {
	name := "speedband-" + now.Format("20060102-150405") + "-" + sanitizeReportUseCase(useCase)
	if suffix > 0 {
		name += "-" + itoaReportSuffix(suffix)
	}
	return name + ".log"
}

func sanitizeReportUseCase(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	var b strings.Builder
	lastDash := false
	for _, r := range value {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
			lastDash = false
			continue
		}
		if !lastDash {
			b.WriteByte('-')
			lastDash = true
		}
	}
	result := strings.Trim(b.String(), "-")
	if result == "" {
		return "report"
	}
	return result
}

func itoaReportSuffix(value int) string {
	if value <= 0 {
		return "0"
	}
	buf := [16]byte{}
	i := len(buf)
	for value > 0 {
		i--
		buf[i] = byte('0' + value%10)
		value /= 10
	}
	return string(buf[i:])
}

func writeJSONError(w http.ResponseWriter, status int, message string) {
	data, _ := json.Marshal(map[string]any{
		"ok":    false,
		"error": message,
	})
	writeJSON(w, status, data)
}
