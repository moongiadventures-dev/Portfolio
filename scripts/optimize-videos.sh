#!/usr/bin/env bash
#!/usr/bin/env bash
# optimize-videos.sh — High quality rebuild from original masters
# Usage: bash scripts/optimize-videos.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE_ROOT="$PROJECT_ROOT/videos-original"

if [ ! -d "$SOURCE_ROOT" ]; then
	echo "ERROR: $SOURCE_ROOT not found"
	exit 1
fi

echo "═══════════════════════════════════════"
echo "  Moongi Portfolio — HQ Re-encode"
echo "═══════════════════════════════════════"
echo "Source masters: $SOURCE_ROOT"
echo "Target profile: 1080p max / CRF 18 / AAC 192k"
echo ""

reencode_one() {
	local src_abs="$1"
	local rel="${src_abs#$SOURCE_ROOT/}"
	local out_abs="$PROJECT_ROOT/$rel"
	local out_dir
	out_dir="$(dirname "$out_abs")"
	local base_noext
	base_noext="${out_abs%.mp4}"

	mkdir -p "$out_dir"

	echo "━━━ $rel"

	ffmpeg -y -i "$src_abs" \
		-vf "scale=-2:'min(1080,ih)':flags=lanczos" \
		-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 \
		-c:a aac -b:a 192k \
		-movflags +faststart \
		"$out_abs" 2>/dev/null
	echo "  ✓ mp4:   $rel ($(du -h "$out_abs" | cut -f1))"

	ffmpeg -y -i "$src_abs" \
		-vf "scale=-2:'min(1080,ih)':flags=lanczos" \
		-c:v libvpx-vp9 -crf 28 -b:v 0 \
		-c:a libopus -b:a 128k \
		"$base_noext.webm" 2>/dev/null
	echo "  ✓ webm:  ${rel%.mp4}.webm ($(du -h "$base_noext.webm" | cut -f1))"

	ffmpeg -y -i "$src_abs" \
		-vframes 1 -vf "scale=-2:'min(1080,ih)':flags=lanczos" -q:v 2 \
		"$base_noext-poster.jpg" 2>/dev/null
	echo "  ✓ poster:${rel%.mp4}-poster.jpg ($(du -h "$base_noext-poster.jpg" | cut -f1))"

	echo ""
}

while IFS= read -r src; do
	reencode_one "$src"
done < <(find "$SOURCE_ROOT" -name "*.mp4" | sort)

echo "═══════════════════════════════════════"
echo "  Summary"
echo "═══════════════════════════════════════"

echo "Total MP4:"
find "$PROJECT_ROOT" -name "*.mp4" -not -path "*/videos-original/*" -exec du -ch {} + | tail -1

echo "Total WebM:"
find "$PROJECT_ROOT" -name "*.webm" -not -path "*/videos-original/*" -exec du -ch {} + | tail -1

echo "Done."
