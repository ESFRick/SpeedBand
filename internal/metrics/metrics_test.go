package metrics

import "testing"

func TestPercentileInterpolates(t *testing.T) {
	got := Percentile([]float64{10, 20, 30, 40}, 50)
	if got != 25 {
		t.Fatalf("expected p50 25, got %v", got)
	}
}

func TestRecommendUsesPassedLadder(t *testing.T) {
	rec := Recommend([]LadderResult{
		{TargetMbps: 100, Status: "Passed"},
		{TargetMbps: 150, Status: "Passed"},
		{TargetMbps: 180, Status: "Risky"},
		{TargetMbps: 200, Status: "Failed"},
	}, "General realtime streaming")
	if rec.Recommended == "" || rec.RiskyUpper != "180 Mbps" || rec.Avoid != "200 Mbps+" {
		t.Fatalf("unexpected recommendation: %+v", rec)
	}
}

func TestRecommendDoesNotAvoidPassedTopLevel(t *testing.T) {
	rec := Recommend([]LadderResult{
		{TargetMbps: 400, Status: "Passed"},
		{TargetMbps: 500, Status: "Passed"},
	}, "General realtime streaming")
	if rec.RiskyUpper != "500 Mbps passed. Upper limit was not found within the tested range." || rec.Avoid != "Higher levels not tested" {
		t.Fatalf("unexpected top-level recommendation: %+v", rec)
	}
	if rec.Recommended != "400-500 Mbps within tested range" {
		t.Fatalf("unexpected top-level recommended range: %+v", rec)
	}
	found := false
	for _, item := range rec.Why {
		if item == "This does not mean the network max is 500 Mbps; higher levels were not tested." {
			found = true
		}
	}
	if !found {
		t.Fatalf("unexpected top-level recommendation: %+v", rec)
	}
}
