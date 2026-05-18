#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
go build -o speedband ./cmd/speedband
echo "Built speedband"
