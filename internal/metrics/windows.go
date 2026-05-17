package metrics

func WorstWindowAverage(values []float64, window int) float64 {
	if len(values) == 0 {
		return 0
	}
	if window <= 1 || len(values) < window {
		return Min(values)
	}
	var sum float64
	for i := 0; i < window; i++ {
		sum += values[i]
	}
	worst := sum / float64(window)
	for i := window; i < len(values); i++ {
		sum += values[i] - values[i-window]
		avg := sum / float64(window)
		if avg < worst {
			worst = avg
		}
	}
	return worst
}

func CountStalls(values []float64, threshold float64) int {
	if len(values) == 0 || threshold <= 0 {
		return 0
	}
	count := 0
	inStall := false
	for _, value := range values {
		if value < threshold {
			if !inStall {
				count++
				inStall = true
			}
			continue
		}
		inStall = false
	}
	return count
}
