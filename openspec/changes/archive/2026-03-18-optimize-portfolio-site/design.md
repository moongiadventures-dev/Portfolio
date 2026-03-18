## Context

Moongi의 포트폴리오 사이트는 `gallery (3).html` 단일 파일(1,381줄)에 CSS, JS, HTML이 전부 인라인으로 포함되어 있다. 비디오 14개(총 ~750MB)는 압축 없이 원본 상태로 Git LFS에 저장되어 있고, 빌드/배포 파이프라인이 없다.

현재 파일 구조:
```
gallery (3).html     ← 모든 코드 (1,381줄)
intro-bg.mp4         ← 15MB
studio-bg.mp4        ← 8.3MB
site-plan.jpg
videos/
  Architect's office/ ← 8개 영상 (38~128MB)
  Brand vault/        ← 6개 영상 (5.6~91MB) + 배경 1개
```

주요 제약:
- Moongi는 바이브코딩(AI)으로 사이트를 유지보수함 → 파일이 짧고 명확해야 함
- 프레임워크 도입은 과도함 → Vanilla JS + ES Modules 유지
- 기존 사이트의 모든 기능(인트로 애니메이션, 맵 네비게이션, 방 전환, 비디오 모달, 사운드, About 패널)이 100% 동일하게 동작해야 함

## Goals / Non-Goals

**Goals:**
- 파일 구조를 파일당 100~200줄로 분리하여 바이브코딩 효율 극대화
- 비디오 파일 크기를 원본 대비 80~90% 축소 (750MB → ~75MB 목표)
- 초기 페이지 로드 시 다운로드되는 데이터를 최소화
- 글로벌 CDN 배포로 어디서든 빠른 로딩
- Moongi가 새 비디오를 추가할 때 `rooms.js` 데이터만 편집하면 되는 구조

**Non-Goals:**
- React, Vue 등 프레임워크 도입 (과도함)
- HLS/DASH 적응형 스트리밍 (이 규모에서는 불필요)
- 서버사이드 렌더링 (순수 정적 사이트)
- 비디오 콘텐츠 자체의 편집/재촬영
- SEO 최적화 (포트폴리오 사이트 — 직접 링크 공유 위주)

## Decisions

### 1. 코드 분리: ES Modules (빌드 도구 없이)

**선택**: `<script type="module">` + 네이티브 `import/export`

**대안 검토**:
- (A) 단순 `<script src>` 순서 로딩 → 전역 스코프 오염, 의존성 순서 관리 번거로움
- (B) Vite/Webpack 번들러 → 빌드 단계 추가, Moongi에게 불필요한 복잡성
- **(C) ES Modules (선택)** → 빌드 없이 브라우저 네이티브 지원, import/export로 의존성 명확

**로컬 개발**: `file://`에서 CORS 에러 발생하므로 `npx serve` 사용 (package.json에 스크립트 추가)

**파일 구조**:
```
index.html                 ← HTML shell + <script type="module">
css/
  style.css                ← 모든 CSS (변수, 인트로, 맵, 방, 모달, about)
js/
  main.js                  ← 엔트리포인트, 이벤트 바인딩, 초기화
  config/
    rooms.js               ← ROOMS 데이터 (Moongi가 주로 편집하는 파일)
  audio/
    engine.js              ← AudioContext, 모든 sfx 함수
  components/
    cursor.js              ← 커스텀 커서 로직
    intro.js               ← 인트로 화면 + origami burst
    map.js                 ← 맵 화면, door markers, site plan
    room.js                ← 방 로딩, 핫스팟 빌드/포지션
    modal.js               ← 비디오 모달 (open/close/navigate)
    about.js               ← About 패널
```

### 2. 비디오 압축: FFmpeg 스크립트

**선택**: 쉘 스크립트(`scripts/optimize-videos.sh`)로 일괄 처리

**인코딩 설정**:
- 코덱: H.264 (MP4) + VP9 (WebM)
- CRF: 28 (MP4), 35 (WebM) — 포트폴리오 영상 품질 유지하면서 파일 크기 대폭 축소
- 해상도: 720p (1280×720) — 배경 비디오와 모달 재생 모두 충분
- 오디오: AAC 128kbps (MP4), Opus 96kbps (WebM)
- 배경 비디오(intro-bg, studio-bg, brand-bg): 오디오 스트립 + 더 높은 CRF (32)

**예상 결과**:
| 파일 | 원본 | 압축 후 (예상) |
|------|------|---------------|
| Dream House Rendered Real.mp4 | 128MB | ~8MB |
| Luxury Mansion walkthrough.mp4 | 110MB | ~7MB |
| fashion lookbook.mp4 | 91MB | ~6MB |
| 전체 합계 | ~750MB | ~60~80MB |

**대안 검토**:
- 클라우드 인코딩 서비스 (Cloudflare Stream 등) → 비용 발생, 이 규모에 과도
- 수동 HandBrake → 재현 불가, 새 비디오 추가 시 매번 수작업

### 3. 파일명 정규화

**규칙**: 모든 파일/폴더명을 kebab-case로 변환
```
videos/Architect's office/  → videos/architects-office/
Alphine Retreat - Swiss Lodge.mp4 → alpine-retreat-swiss-lodge.mp4
Built for You - A Builder's Sotry.mp4 → built-for-you-a-builders-story.mp4
gallery (3).html → index.html
```

`rooms.js`의 모든 경로 참조도 일괄 업데이트.

### 4. 로딩 전략

**인트로 비디오**: `preload="metadata"` + poster 이미지. 페이지 로드 시 썸네일만 표시하고, 사용자 인터랙션 후 재생 시작.

**방 배경 비디오**: 현재도 on-demand 로드 (OK). poster 이미지 추가하여 로드 전 검은 화면 방지.

**포트폴리오 비디오**: 모달 클릭 시 로드 (현재와 동일). 변경 없음.

**Fonts**: `<link rel="preconnect" href="https://fonts.googleapis.com">` + `font-display: swap` 추가.

### 5. 배포: Vercel

**선택**: Vercel (정적 사이트)

**이유**:
- GitHub 연동 자동 배포 (push하면 배포)
- 글로벌 CDN 자동 적용
- 커스텀 도메인 무료
- 캐시 헤더 자동 최적화
- 무료 tier로 충분 (정적 사이트 + 비디오)

**대안 검토**:
- Cloudflare Pages → 비슷한 수준이지만 Vercel이 설정 더 간단
- GitHub Pages → CDN 성능 열위, 커스텀 헤더 설정 불가
- S3 + CloudFront → 설정 복잡, 이 규모에 과도

**비디오 서빙**: 압축된 비디오를 repo에 포함하여 Vercel에서 직접 서빙. 60~80MB 수준이면 Vercel 정적 에셋으로 충분.

## Risks / Trade-offs

**[ES Modules 로컬 개발 CORS]** → `npx serve` 또는 VS Code Live Server로 해결. package.json에 `"dev": "npx serve"` 스크립트 추가하여 Moongi가 쉽게 실행 가능하도록 함.

**[비디오 압축 품질 손실]** → CRF 28은 육안으로 구분 어려운 수준. 배경 비디오는 더 공격적으로 압축해도 오버레이/블러 효과로 가려짐. 원본은 별도 보관 권장 (Git LFS 또는 로컬).

**[파일명 변경 시 기존 링크 깨짐]** → 현재 외부에서 직접 비디오 URL로 링크하는 경우 없음 (포트폴리오 단일 페이지). `rooms.js` 경로만 업데이트하면 됨.

**[Vercel 비디오 용량 제한]** → Vercel 무료 tier 단일 파일 100MB 제한. 압축 후 모든 파일이 ~8MB 이하이므로 문제 없음. 총 배포 크기 제한(1GB)도 80MB 수준으로 여유.

**[바이브코딩 AI가 ES Modules를 못 다룰 수 있음]** → import/export는 모든 주요 AI 모델이 잘 지원. 오히려 파일이 짧아져서 정확도 향상. 각 파일 상단에 주석으로 역할 설명 추가.

## Open Questions

- Moongi가 커스텀 도메인을 사용할 예정인지? (Vercel에서 무료 설정 가능)
- 원본 비디오 파일을 어디에 백업할지? (Git LFS에 유지 vs 로컬/클라우드 스토리지)
- arch/brand 방의 배경 비디오에 오디오가 의도적으로 포함된 것인지? (`vid.muted = !(roomId === 'arch' || roomId === 'brand')` 로직 존재)
