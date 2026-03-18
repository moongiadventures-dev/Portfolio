## ADDED Requirements

### Requirement: Site SHALL be deployed to Vercel as a static site
The project SHALL be configured for automatic deployment to Vercel on every push to the main branch.

#### Scenario: Vercel project setup
- **WHEN** the project is connected to Vercel
- **THEN** Vercel SHALL detect it as a static site (no build command needed)
- **THEN** `index.html` SHALL be served as the root page
- **THEN** all assets (CSS, JS, videos, images) SHALL be served from Vercel's CDN

#### Scenario: Automatic deployment on push
- **WHEN** a commit is pushed to the `master` branch
- **THEN** Vercel SHALL automatically deploy the updated site
- **THEN** the deployment SHALL complete within 2 minutes (static files only)

### Requirement: Video files SHALL be served with long-term cache headers
Compressed video files SHALL leverage browser caching to avoid re-downloading on repeat visits.

#### Scenario: Cache headers for video assets
- **WHEN** a browser requests a video file (MP4 or WebM)
- **THEN** the response SHALL include `Cache-Control: public, max-age=31536000, immutable`
- **THEN** on subsequent visits, the browser SHALL serve the video from cache

#### Scenario: Cache headers for CSS and JS
- **WHEN** a browser requests CSS or JS files
- **THEN** Vercel SHALL serve them with appropriate cache headers
- **THEN** cache invalidation SHALL occur automatically on new deployments

### Requirement: Vercel configuration SHALL be defined in vercel.json
A `vercel.json` file SHALL exist at the project root to configure headers and routing.

#### Scenario: vercel.json content
- **WHEN** the configuration is created
- **THEN** `vercel.json` SHALL define:
  - Cache headers for video files (`*.mp4`, `*.webm`) with max-age of 1 year
  - Cache headers for image files (`*.jpg`, `*.jpeg`, `*.png`) with max-age of 1 year
  - Cache headers for poster images with max-age of 1 year

### Requirement: Site SHALL be accessible via a clean URL
The site SHALL NOT require navigating to a file with spaces or parentheses in the name.

#### Scenario: Root URL access
- **WHEN** a user visits the deployed site URL (e.g., `https://moongi-portfolio.vercel.app/`)
- **THEN** `index.html` SHALL be served
- **THEN** all navigation (rooms, about, modal) SHALL work without page reload

### Requirement: Deployment SHALL exclude unnecessary files
Development-only files and original uncompressed videos SHALL NOT be included in the deployment.

#### Scenario: Excluded files
- **WHEN** Vercel builds the deployment
- **THEN** the following SHALL be excluded via `.vercelignore` or `.gitignore`:
  - `scripts/` directory (build tools)
  - Original uncompressed video files (if stored separately)
  - `openspec/` directory (project management)
  - `gallery (3).html` (legacy file)
  - `node_modules/` (if any)
