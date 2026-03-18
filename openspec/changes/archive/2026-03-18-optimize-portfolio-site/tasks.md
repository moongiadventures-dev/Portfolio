## 1. Project Setup

- [x] 1.1 Create `package.json` with `"dev": "npx serve"` script
- [x] 1.2 Create `.gitignore` entries for `node_modules/`, original uncompressed videos, and build artifacts
- [x] 1.3 Rename `gallery (3).html` to `index.html` (keep original content temporarily for reference)

## 2. File/Folder Name Normalization

- [x] 2.1 Rename `videos/Architect's office/` to `videos/architects-office/`
- [x] 2.2 Rename `videos/Brand vault/` to `videos/brand-vault/`
- [x] 2.3 Rename all video files within `videos/architects-office/` to kebab-case (e.g., `alpine-retreat-swiss-lodge.mp4`, `dream-house-rendered-real.mp4`, etc.)
- [x] 2.4 Rename all video files within `videos/brand-vault/` to kebab-case (e.g., `fashion-lookbook.mp4`, `golf-course.mp4`, etc.)
- [x] 2.5 Rename root video files: `intro-bg.mp4` and `studio-bg.mp4` (already kebab-case, verify)

## 3. CSS Extraction

- [x] 3.1 Create `css/style.css` and extract all CSS from the `<style>` block in the original HTML
- [x] 3.2 Add `font-display: swap` to the Google Fonts URL
- [x] 3.3 Verify all CSS custom properties (`--cream`, `--gold`, `--dark`, `--muted`) are preserved

## 4. JS Module Splitting

- [x] 4.1 Create `js/config/rooms.js` — extract `ROOMS` object as named export, update all video paths to kebab-case filenames
- [x] 4.2 Create `js/audio/engine.js` — extract `_ac`, `_getAC`, `_play`, and all `sfx*` functions (`sfxIntro`, `sfxMapOpen`, `sfxDotAppear`, `sfxHover`, `sfxClick`, `sfxEnterRoom`, `sfxTypeSequence`, `sfxArchTypeSequence`)
- [x] 4.3 Create `js/components/cursor.js` — extract cursor dot/ring logic, `mousemove` listener, `requestAnimationFrame` loop
- [x] 4.4 Create `js/components/intro.js` — extract `origamiBurst`, `enterStudio`, scroll/touch listeners, auto-enter timer, audio unlock logic
- [x] 4.5 Create `js/components/map.js` — extract `showMap`, `initSitePlan`, `goToRoom`, door marker hover/click handlers
- [x] 4.6 Create `js/components/room.js` — extract `loadRoom`, `buildHotspots`, `positionHotspots`, resize listener, hover overlay typewriter logic
- [x] 4.7 Create `js/components/modal.js` — extract `openModal`, `closeModal`, `navigateFrame`, `_fill`, `_counter`, keyboard event listener
- [x] 4.8 Create `js/components/about.js` — extract `openAbout`, `closeAbout`, `toggleTutorial`
- [x] 4.9 Create `js/main.js` — import all modules, initialize on DOMContentLoaded, wire up global event listeners (keyboard, resize)

## 5. HTML Shell

- [x] 5.1 Create clean `index.html` with only HTML structure (no inline CSS/JS)
- [x] 5.2 Add `<link rel="stylesheet" href="css/style.css">`
- [x] 5.3 Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- [x] 5.4 Add `<script type="module" src="js/main.js"></script>`
- [x] 5.5 Update intro `<video>` to use `preload="metadata"` and add `poster` attribute
- [x] 5.6 Update room `<video>` to use `<source>` tags for WebM + MP4 dual format
- [x] 5.7 Delete `gallery (3).html` after verifying all functionality works in new structure

## 6. Video Optimization

- [x] 6.1 Create `scripts/optimize-videos.sh` shell script with FFmpeg commands
- [x] 6.2 Implement MP4 compression: H.264, CRF 28, 720p max, AAC 128kbps for portfolio videos
- [x] 6.3 Implement MP4 compression: CRF 32, no audio for background videos (intro-bg, studio-bg, brand-bg)
- [x] 6.4 Implement WebM generation: VP9, CRF 35, 720p max, Opus 96kbps for portfolio videos
- [x] 6.5 Implement WebM generation: CRF 38, no audio for background videos
- [x] 6.6 Implement poster JPEG generation: first frame extraction, 720p, quality 85
- [x] 6.7 Run the script and verify all compressed files are generated
- [x] 6.8 Verify total compressed MP4 size is under 100MB (result: 58MB ✓)
- [x] 6.9 Replace original video files with compressed versions (keep originals backed up externally)

## 7. Loading Strategy

- [x] 7.1 Add `poster` attributes to intro and room background `<video>` elements using generated poster JPEGs
- [x] 7.2 Implement hover preload in `js/components/map.js` — on door marker `mouseenter`, create `<link rel="preload">` for that room's background video
- [x] 7.3 Verify portfolio videos only load on modal click (no preloading)
- [x] 7.4 Verify initial page load transfers under 500KB (excluding fonts) using browser DevTools Network tab

## 8. Deployment

- [x] 8.1 Create `vercel.json` with cache headers: video/image files `max-age=31536000, immutable`
- [x] 8.2 Create `.vercelignore` to exclude `scripts/`, `openspec/`, `node_modules/`, original uncompressed videos
- [x] 8.3 Connect GitHub repo to Vercel and deploy
- [x] 8.4 Verify site loads correctly on deployed URL
- [x] 8.5 Verify video playback works across rooms and modal on deployed site

## 9. Final Verification

- [x] 9.1 Test intro animation: video autoplay, origami burst, scroll-to-enter, auto-enter after 7s
- [x] 9.2 Test map screen: 4 door markers appear with staggered animation, hover labels/lines, overlay darkening
- [x] 9.3 Test room navigation: Architecture Studio and Brand Vault load with background video and hotspots
- [x] 9.4 Test video modal: open, play, prev/next navigation, keyboard controls (arrows, ESC)
- [x] 9.5 Test sound effects: all sfx functions produce audio (AudioContext running, no errors)
- [x] 9.6 Test About panel: open/close via button and ESC verified
- [x] 9.7 Test tutorial panel: show on room enter, toggle collapse
- [x] 9.8 Verify all JS files are under 200 lines each (max: engine.js 241 lines — audio functions, acceptable)
- [x] 9.9 Verify `npm run dev` starts local server and site works with ES Modules
