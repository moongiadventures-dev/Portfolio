## ADDED Requirements

### Requirement: Intro video SHALL use deferred loading with poster
The intro video SHALL NOT begin downloading the full video file on page load. A poster image SHALL be displayed immediately while video metadata loads.

#### Scenario: Initial page load
- **WHEN** the page loads
- **THEN** the intro `<video>` element SHALL have `preload="metadata"` (not `preload="auto"`)
- **THEN** a `poster` attribute SHALL reference a JPEG thumbnail of the intro video's first frame
- **THEN** the poster image SHALL be visible until the video begins playing

#### Scenario: Video playback start
- **WHEN** the intro animation sequence begins (on canplay or user gesture)
- **THEN** the video SHALL start playing via JavaScript (`video.play()`)
- **THEN** the transition from poster to video SHALL be visually seamless

### Requirement: Room background videos SHALL have poster images
Each room's background video SHALL have a poster attribute to prevent black frames during video load.

#### Scenario: Entering a room
- **WHEN** a user navigates to a room (e.g., Architecture Studio)
- **THEN** the room video element SHALL have a `poster` attribute matching that room's thumbnail
- **THEN** the poster SHALL be visible until the video's first frame is decoded

### Requirement: Google Fonts SHALL use preconnect and font-display swap
Font loading SHALL be optimized to prevent layout shift and render blocking.

#### Scenario: Font preconnect
- **WHEN** the page loads
- **THEN** `index.html` SHALL include:
  - `<link rel="preconnect" href="https://fonts.googleapis.com">`
  - `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- **THEN** the Google Fonts URL SHALL include `&display=swap`

#### Scenario: Font fallback during load
- **WHEN** web fonts have not yet loaded
- **THEN** text SHALL render in fallback fonts (Georgia for Cormorant Garamond, sans-serif for Josefin Sans)
- **THEN** when web fonts load, they SHALL swap in without page reflow

### Requirement: Map hover SHALL preload room background video
When a user hovers over a door marker on the map, the corresponding room's background video SHALL begin preloading.

#### Scenario: Hover preload
- **WHEN** a user hovers over the Architecture Studio door marker
- **THEN** the system SHALL create a `<link rel="preload" as="video" href="studio-bg.mp4">` or begin fetching the video via JavaScript
- **THEN** when the user clicks to enter the room, the video SHALL already be partially or fully cached

#### Scenario: No unnecessary preloading
- **WHEN** the user does NOT hover over any door marker
- **THEN** no room background videos SHALL be preloaded
- **THEN** only the map screen assets (site-plan.jpg) SHALL be loaded

### Requirement: Portfolio videos SHALL load only on modal open
Portfolio video files (played inside the modal) SHALL NOT be preloaded or fetched until the user explicitly clicks a hotspot.

#### Scenario: Modal video loading
- **WHEN** the user clicks a hotspot to open the video modal
- **THEN** the video file SHALL begin loading at that moment
- **THEN** no portfolio video files SHALL have been fetched before the click event

### Requirement: Initial page load SHALL transfer minimal data
The first meaningful paint SHALL require downloading only essential assets.

#### Scenario: Critical path assets
- **WHEN** the page first loads (before any user interaction)
- **THEN** only the following assets SHALL be requested:
  - `index.html`
  - `css/style.css`
  - `js/main.js` and its imported modules
  - Google Fonts CSS + font files
  - Intro video poster image (JPEG, ~50-100KB)
  - Intro video metadata (not full file)
- **THEN** total initial transfer size SHALL be under 500KB (excluding fonts)
