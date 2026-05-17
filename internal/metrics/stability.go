package metrics

import "math"

func Jitter(rttMs []float64) float64 {
	if len(rttMs) < 2 {
		return 0
	}
	var sum float64
	for i := 1; i < len(rttMs); i++ {
		sum += math.Abs(rttMs[i] - rttMs[i-1])
	}
	return sum / float64(len(rttMs)-1)
}

func StabilityLabel(p5Mbps, averageMbps, jitterMs, p95LatencyMs float64) string {
	if averageMbps <= 0 {
		return "Not tested"
	}
	ratio := 0.0
	if averageMbps > 0 {
		ratio = p5Mbps / averageMbps
	}
	switch {
	case ratio >= 0.85 && jitterMs <= 5 && p95LatencyMs <= 20:
		return "Excellent"
	case ratio >= 0.72 && jitterMs <= 10 && p95LatencyMs <= 35:
		return "Good"
	case ratio >= 0.58 && jitterMs <= 18 && p95LatencyMs <= 60:
		return "Acceptable"
	case ratio >= 0.45:
		return "Risky"
	default:
		return "Unstable"
	}
}
