## Why

Moongi는 AI 영상 제작자로, 포트폴리오 웹사이트에 14개 이상의 MP4 비디오(총 ~750MB)를 사용한다. 현재 사이트는 단일 HTML 파일(1,381줄)에 CSS/JS가 모두 인라인으로 들어있고, 비디오 파일은 압축 없이 원본 그대로(최대 128MB/개) 서빙된다. 빌드 시스템, CDN, 로딩 최적화가 전혀 없어서 초기 로딩이 느리고, 바이브코딩으로 유지보수할 때 AI가 1,400줄짜리 파일을 제대로 처리하지 못한다.

## What Changes

- **BREAKING** — `gallery (3).html` 단일 파일을 `index.html` + ES Modules 구조로 분리
- 인라인 CSS를 별도 `css/style.css`로 추출
- 인라인 JS를 기능별 ES Module 파일로 분리 (`js/main.js`, `js/config/rooms.js`, `js/audio/engine.js`, `js/components/*.js`)
- 비디오 파일을 FFmpeg로 압축 (CRF 28, 720p, 목표: 파일당 2~8MB)
- WebM 포맷 추가 생성 및 `<source>` 이중 제공
- 비디오 poster(썸네일) 이미지 자동 생성
- 인트로 비디오 `preload` 전략 변경 (`autoplay` → `preload="metadata"` + poster)
- 파일/폴더명 정규화 (공백, 특수문자 제거 → kebab-case)
- Vercel 또는 Cloudflare Pages 정적 배포 설정
- `<link rel="preconnect">` Google Fonts 사전 연결 추가

## Capabilities

### New Capabilities

- `code-splitting`: 단일 HTML 파일을 index.html + CSS 파일 + ES Module JS 파일들로 분리. 파일당 100~200줄 이하 유지하여 바이브코딩 AI가 개별 파일 단위로 정확하게 수정 가능하도록 구조화
- `video-optimization`: FFmpeg 기반 비디오 압축(CRF 28, 720p), WebM 포맷 변환, poster 썸네일 자동 생성. 스크립트화하여 새 비디오 추가 시 재사용 가능하게 함
- `loading-strategy`: 비디오 preload 전략 최적화, poster 이미지 적용, Google Fonts preconnect, 방 전환 시 프리로드 힌트. 체감 로딩 속도 개선
- `deployment`: Vercel 또는 Cloudflare Pages 정적 사이트 배포 구성. 글로벌 CDN 통한 비디오 서빙, 캐시 헤더 설정

### Modified Capabilities

(기존 spec 없음 — 신규 프로젝트)

## Impact

- **코드**: `gallery (3).html` 파일이 삭제되고 `index.html` + 10여개 CSS/JS 파일로 대체됨. 기존 HTML 구조와 기능은 100% 유지
- **비디오 파일**: 원본 파일명이 kebab-case로 변경됨. 압축본이 새로 생성됨. ROOMS 데이터의 경로 참조 일괄 업데이트 필요
- **의존성**: FFmpeg (비디오 처리, 로컬 빌드 도구), `npx serve` 또는 Vite (로컬 개발 서버, ES Modules CORS 해결)
- **배포**: GitHub Pages 또는 Vercel/Cloudflare 신규 설정 필요
- **호환성**: ES Modules 사용으로 IE 미지원 (모던 브라우저 전용 — 포트폴리오 사이트 특성상 문제 없음)
