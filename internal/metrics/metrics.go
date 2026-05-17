package metrics

import "time"

type ThroughputSummary struct {
	AverageMbps float64 `json:"averageMbps"`
	PeakMbps    float64 `json:"peakMbps"`
	P50Mbps     float64 `json:"p50Mbps"`
	P10Mbps     float64 `json:"p10Mbps"`
	P5Mbps      float64 `json:"p5Mbps"`
	Min1sMbps   float64 `json:"min1sMbps"`
	Worst5sMbps float64 `json:"worst5sMbps"`
	Stalls      int     `json:"stalls"`
}

type LatencySummary struct {
	AverageMs float64 `json:"averageMs"`
	MedianMs  float64 `json:"medianMs"`
	P95Ms     float64 `json:"p95Ms"`
	P99Ms     float64 `json:"p99Ms"`
	MaxMs     float64 `json:"maxMs"`
	JitterMs  float64 `json:"jitterMs"`
}

func Mbps(bytes int64, elapsed time.Duration) float64 {
	if elapsed <= 0 {
		return 0
	}
	return float64(bytes) * 8 / elapsed.Seconds() / 1_000_000
}

func SummarizeThroughput(samples []float64) ThroughputSummary {
	if len(samples) == 0 {
		return ThroughputSummary{}
	}
	return ThroughputSummary{
		AverageMbps: Average(samples),
		PeakMbps:    Max(samples),
		P50Mbps:     Percentile(samples, 50),
		P10Mbps:     Percentile(samples, 10),
		P5Mbps:      Percentile(samples, 5),
		Min1sMbps:   Min(samples),
		Worst5sMbps: WorstWindowAverage(samples, 5),
		Stalls:      CountStalls(samples, Percentile(samples, 50)*0.45),
	}
}

func SummarizeLatency(samples []float64) LatencySummary {
	if len(samples) == 0 {
		return LatencySummary{}
	}
	return LatencySummary{
		AverageMs: Average(samples),
		MedianMs:  Percentile(samples, 50),
		P95Ms:     Percentile(samples, 95),
		P99Ms:     Percentile(samples, 99),
		MaxMs:     Max(samples),
		JitterMs:  Jitter(samples),
	}
}
