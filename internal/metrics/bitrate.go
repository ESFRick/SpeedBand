package metrics

type LadderResult struct {
	TargetMbps          int     `json:"targetMbps"`
	Status              string  `json:"status"`
	ActualReceiveMbps   float64 `json:"actualReceiveMbps"`
	PacketLossPercent   float64 `json:"packetLossPercent"`
	JitterMs            float64 `json:"jitterMs"`
	P5ThroughputMbps    float64 `json:"p5ThroughputMbps"`
	MaxLatencySpikeMs   float64 `json:"maxLatencySpikeMs"`
	BackpressureWarning bool    `json:"backpressureWarning"`
}

type Recommendation struct {
	Result      string   `json:"result"`
	VerySafe    string   `json:"verySafe"`
	Recommended string   `json:"recommended"`
	RiskyUpper  string   `json:"riskyUpper"`
	Avoid       string   `json:"avoid"`
	Why         []string `json:"why"`
	Protocol    string   `json:"protocol"`
}

func Recommend(ladder []LadderResult, preset string) Recommendation {
	passed := make([]int, 0, len(ladder))
	risky := make([]int, 0, len(ladder))
	failed := make([]int, 0, len(ladder))
	for _, item := range ladder {
		switch item.Status {
		case "Passed":
			passed = append(passed, item.TargetMbps)
		case "Risky":
			risky = append(risky, item.TargetMbps)
		case "Failed":
			failed = append(failed, item.TargetMbps)
		}
	}

	if len(passed) == 0 {
		return Recommendation{
			Result:      "Unstable",
			VerySafe:    "Not established",
			Recommended: "Run the full stability test",
			RiskyUpper:  firstIntText(risky, "Not established"),
			Avoid:       firstIntText(failed, "Unknown"),
			Protocol:    "websocket-fallback",
			Why: []string{
				"No bitrate level passed with enough stability.",
				"Use the full stability test before choosing a high bitrate.",
			},
		}
	}

	best := passed[len(passed)-1]
	verySafe := roundDownLadder(best * safetyPercent(preset) / 100)
	lower := roundDownLadder(best * recommendationLowPercent(preset) / 100)
	if lower <= 0 {
		lower = passed[0]
	}
	recommended := formatRange(lower, best)

	result := "Good"
	if best >= 200 {
		result = "Excellent"
	}

	why := []string{
		formatMbps(best) + " passed with stable receive rate.",
		"Peak speed was not used as the recommended bitrate.",
	}

	riskyUpper := firstAbove(best, risky, failed)
	riskyUpperText := ""
	avoidText := ""
	if riskyUpper > best {
		avoid := firstAbove(riskyUpper, failed, nil)
		if avoid <= riskyUpper {
			avoid = nextLadderLevel(riskyUpper)
		}
		riskyUpperText = formatMbps(riskyUpper)
		if avoid > riskyUpper {
			avoidText = formatMbps(avoid) + "+"
		} else {
			avoidText = "Above tested range"
		}
		why = append(why, formatMbps(riskyUpper)+" is treated as the risky upper bound.")
		if avoid > riskyUpper {
			why = append(why, formatMbps(avoid)+"+ should be avoided unless real apps prove stable.")
		}
	} else {
		recommended += " within tested range"
		riskyUpperText = formatMbps(best) + " passed. Upper limit was not found within the tested range."
		avoidText = "Higher levels not tested"
		why = append(why, "All tested ladder levels up to "+formatMbps(best)+" passed.")
		why = append(why, "This does not mean the network max is "+formatMbps(best)+"; higher levels were not tested.")
	}

	return Recommendation{
		Result:      result,
		VerySafe:    formatMbps(verySafe),
		Recommended: recommended,
		RiskyUpper:  riskyUpperText,
		Avoid:       avoidText,
		Why:         why,
		Protocol:    "websocket-fallback",
	}
}

func safetyPercent(preset string) int {
	switch preset {
	case "VR streaming", "Game streaming":
		return 65
	case "NAS / media transfer":
		return 80
	default:
		return 70
	}
}

func recommendationLowPercent(preset string) int {
	switch preset {
	case "VR streaming", "Game streaming":
		return 78
	case "NAS / media transfer":
		return 88
	default:
		return 82
	}
}

func roundDownLadder(value int) int {
	levels := []int{25, 50, 75, 100, 120, 150, 180, 200, 250, 300, 350, 400, 500}
	best := levels[0]
	for _, level := range levels {
		if level <= value {
			best = level
		}
	}
	return best
}

func firstAbove(base int, primary []int, secondary []int) int {
	for _, value := range primary {
		if value > base {
			return value
		}
	}
	for _, value := range secondary {
		if value > base {
			return value
		}
	}
	return base
}

func nextLadderLevel(base int) int {
	levels := []int{25, 50, 75, 100, 120, 150, 180, 200, 250, 300, 350, 400, 500}
	for _, level := range levels {
		if level > base {
			return level
		}
	}
	return 0
}

func firstIntText(values []int, fallback string) string {
	if len(values) == 0 {
		return fallback
	}
	return formatMbps(values[0])
}

func formatRange(low, high int) string {
	if low >= high {
		return formatMbps(high)
	}
	return itoa(low) + "-" + formatMbps(high)
}

func formatMbps(value int) string {
	if value <= 0 {
		return "Not established"
	}
	return itoa(value) + " Mbps"
}

func itoa(value int) string {
	if value == 0 {
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
