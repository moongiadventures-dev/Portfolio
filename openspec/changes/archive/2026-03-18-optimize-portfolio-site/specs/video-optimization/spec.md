## ADDED Requirements

### Requirement: All video files SHALL be compressed via FFmpeg script
A reusable shell script (`scripts/optimize-videos.sh`) SHALL compress all MP4 files and generate WebM alternatives and poster thumbnails.

#### Scenario: Running the optimization script
- **WHEN** the script is executed with `bash scripts/optimize-videos.sh`
- **THEN** for each source MP4 in the `videos/` directory and root directory:
  - A compressed MP4 SHALL be created (H.264, CRF 28, 720p max height, AAC 128kbps)
  - A compressed WebM SHALL be created (VP9, CRF 35, 720p max height, Opus 96kbps)
  - A poster JPEG SHALL be created from the first frame (720p, quality 85)

#### Scenario: Background videos use higher compression
- **WHEN** compressing background videos (`intro-bg.mp4`, `studio-bg.mp4`, `brand-bg.mp4`)
- **THEN** the script SHALL use CRF 32 (MP4) and CRF 38 (WebM)
- **THEN** the script SHALL strip audio tracks from these files

### Requirement: Compressed video files SHALL be 80-90% smaller than originals
The compression SHALL target significant file size reduction while maintaining acceptable visual quality.

#### Scenario: Individual file size targets
- **WHEN** compression is complete
- **THEN** each portfolio video (originally 18-128MB) SHALL be under 10MB for MP4
- **THEN** each background video SHALL be under 3MB for MP4

#### Scenario: Total project video size
- **WHEN** all videos are compressed
- **THEN** the total size of all compressed MP4 files SHALL be under 100MB (down from ~750MB)

### Requirement: File and folder names SHALL use kebab-case
All video files and directories SHALL be renamed from their current names (with spaces and special characters) to kebab-case.

#### Scenario: Directory renaming
- **WHEN** renaming is complete
- **THEN** `videos/Architect's office/` SHALL become `videos/architects-office/`
- **THEN** `videos/Brand vault/` SHALL become `videos/brand-vault/`

#### Scenario: File renaming examples
- **WHEN** renaming is complete
- **THEN** `Alphine Retreat - Swiss Lodge.mp4` SHALL become `alpine-retreat-swiss-lodge.mp4`
- **THEN** `Built for You - A Builder's Sotry.mp4` SHALL become `built-for-you-a-builders-story.mp4`
- **THEN** `architect's house.mp4` SHALL become `architects-house.mp4`
- **THEN** `Dream House Rendered Real.mp4` SHALL become `dream-house-rendered-real.mp4`

### Requirement: ROOMS data paths SHALL reference compressed files
After compression and renaming, all video paths in `rooms.js` SHALL point to the compressed kebab-case filenames.

#### Scenario: Updated room configuration
- **WHEN** rooms.js is updated
- **THEN** `video: "videos/Architect's office/architect's house.mp4"` SHALL become `video: "videos/architects-office/architects-house.mp4"`
- **THEN** all other video paths SHALL follow the same pattern

### Requirement: HTML SHALL provide dual-format video sources
Where `<video>` elements are used, the HTML SHALL provide both MP4 and WebM sources for browser format negotiation.

#### Scenario: Video element with dual sources
- **WHEN** a video element is rendered (intro background, room background)
- **THEN** it SHALL contain `<source src="*.webm" type="video/webm">` followed by `<source src="*.mp4" type="video/mp4">`
- **THEN** browsers supporting WebM SHALL download the smaller WebM file

### Requirement: Original video files SHALL be excluded from deployment
The optimization script SHALL output compressed files to a separate directory structure. Only compressed files SHALL be deployed.

#### Scenario: Compressed output location
- **WHEN** the script runs
- **THEN** compressed files SHALL be written alongside originals with a naming convention or to a `dist/videos/` output directory
- **THEN** `.gitignore` SHALL exclude original uncompressed files from the deployment branch
