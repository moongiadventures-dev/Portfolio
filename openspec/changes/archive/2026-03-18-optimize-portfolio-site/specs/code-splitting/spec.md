## ADDED Requirements

### Requirement: Single HTML file SHALL be split into modular file structure
The monolithic `gallery (3).html` (1,381 lines) SHALL be replaced by an `index.html` shell that references external CSS and ES Module JS files. The original file SHALL be deleted after migration.

#### Scenario: Project file structure after split
- **WHEN** the migration is complete
- **THEN** the project SHALL contain the following files:
  - `index.html` — HTML structure only, no inline `<style>` or `<script>` blocks (except `<script type="module" src="js/main.js">`)
  - `css/style.css` — all CSS extracted from the original `<style>` block
  - `js/main.js` — entry point that imports all component modules
  - `js/config/rooms.js` — `ROOMS` data object exported as named export
  - `js/audio/engine.js` — AudioContext setup and all `sfx*` functions
  - `js/components/cursor.js` — custom cursor logic
  - `js/components/intro.js` — intro screen and origami burst animation
  - `js/components/map.js` — map screen, door markers, site plan initialization
  - `js/components/room.js` — room loading, hotspot building and positioning
  - `js/components/modal.js` — video modal open/close/navigate
  - `js/components/about.js` — about panel open/close

#### Scenario: Original file is removed
- **WHEN** the migration is complete
- **THEN** `gallery (3).html` SHALL no longer exist in the project

### Requirement: Each JS module SHALL use ES Module syntax
All JS files SHALL use `export` for public functions/data and `import` for dependencies. No global variable pollution.

#### Scenario: Module exports and imports
- **WHEN** `js/components/modal.js` needs the ROOMS data
- **THEN** it SHALL import via `import { ROOMS } from '../config/rooms.js'`
- **THEN** it SHALL NOT access a global `ROOMS` variable

#### Scenario: Browser compatibility
- **WHEN** the page is loaded
- **THEN** `index.html` SHALL use `<script type="module" src="js/main.js"></script>`
- **THEN** the site SHALL function in all modern browsers (Chrome, Firefox, Safari, Edge)

### Requirement: Individual files SHALL be 200 lines or fewer
Each CSS/JS file SHALL contain no more than 200 lines to ensure AI coding tools can process entire files within their context window.

#### Scenario: File length validation
- **WHEN** any individual JS or CSS file exceeds 200 lines
- **THEN** it SHALL be further split into sub-modules

### Requirement: All existing functionality SHALL be preserved
The split SHALL NOT change any user-facing behavior. Every feature from the original file MUST work identically.

#### Scenario: Feature parity checklist
- **WHEN** the split is complete
- **THEN** the following features SHALL work identically to the original:
  - Intro video with autoplay and origami burst animation
  - Scroll-to-enter and auto-enter after 7 seconds
  - Custom gold cursor with hover ring expansion
  - Map screen with 4 door markers (staggered entry animation)
  - Door hover effects (label, leader line, darkened overlay)
  - Room loading with background video
  - Hotspot hover overlay with typewriter title animation
  - Video modal with prev/next navigation and keyboard controls
  - About panel open/close
  - All sound effects (intro, map open, dot appear, hover, click, enter room, typewriter)
  - Tutorial panel toggle

### Requirement: ROOMS data SHALL be the single source of video configuration
The `js/config/rooms.js` file SHALL be the only file Moongi needs to edit when adding, removing, or modifying portfolio videos.

#### Scenario: Adding a new video to a room
- **WHEN** Moongi wants to add a new portfolio video to the Architecture Studio
- **THEN** Moongi SHALL only need to add a new entry to the `arch.spots` array in `js/config/rooms.js`
- **THEN** no other file changes SHALL be required

### Requirement: Local development SHALL work with a simple command
A `package.json` SHALL be created with a `dev` script that starts a local server for ES Module support.

#### Scenario: Starting local development
- **WHEN** a developer runs `npm run dev`
- **THEN** a local HTTP server SHALL start serving the project
- **THEN** ES Modules SHALL load without CORS errors
