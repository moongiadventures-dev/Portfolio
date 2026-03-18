import { allHots, activeIdx, setActiveIdx } from '../config/rooms.js';

const MP4_PRIORITY_BASES = new Set([
  'videos/architects-office/chateau-construction',
  'videos/architects-office/architects-house'
]);

function shouldUseMp4First(path) {
  return MP4_PRIORITY_BASES.has(path.replace(/\.mp4$/i, '').replace(/\.webm$/i, ''));
}

export function openModal(idx) {
  setActiveIdx(idx);
  _fill(allHots[idx]);
  _counter();
  document.getElementById('modal-bg').classList.add('open');
  document.getElementById('modal').classList.add('open');
  document.getElementById('esc').classList.add('on');
}

export function navigateFrame(dir) {
  if (activeIdx < 0) return;
  setActiveIdx((activeIdx + dir + allHots.length) % allHots.length);
  const med = document.getElementById('modal-media');
  med.style.transition = 'opacity .18s ease';
  med.style.opacity = '0';
  setTimeout(() => {
    _fill(allHots[activeIdx]);
    _counter();
    med.style.opacity = '1';
  }, 180);
}

function _fill(el) {
  document.getElementById('modal-title').textContent = el.dataset.title || '';
  document.getElementById('modal-sub').textContent = el.dataset.sub || '';
  const med = document.getElementById('modal-media');
  const ph = document.getElementById('modal-ph');
  const old = med.querySelector('iframe,video');
  if (old) old.remove();
  ph.style.display = '';
  const url = el.dataset.video || '';
  if (!url) return;
  if (/youtube|youtu\.be|vimeo/.test(url)) {
    let videoId = '';
    const ytMatch = url.match(/(?:embed\/|shorts\/|watch\?v=|youtu\.be\/)([^?&\s]+)/);
    if (ytMatch) videoId = ytMatch[1];
    const embedUrl = videoId
      ? 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1&controls=1'
      : url + (url.indexOf('?') === -1 ? '?autoplay=1' : '&autoplay=1');
    const ifr = document.createElement('iframe');
    ifr.src = embedUrl;
    ifr.allow = 'autoplay;fullscreen;picture-in-picture';
    ifr.allowFullscreen = true;
    med.insertBefore(ifr, ph);
    ph.style.display = 'none';
  } else if (/drive\.google\.com/.test(url)) {
    const gdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const gdUrl = gdMatch ? 'https://drive.google.com/file/d/' + gdMatch[1] + '/preview' : url;
    const ifr = document.createElement('iframe');
    ifr.src = gdUrl;
    ifr.allow = 'autoplay;fullscreen';
    ifr.allowFullscreen = true;
    med.insertBefore(ifr, ph);
    ph.style.display = 'none';
  } else if (/\.(mp4|webm)$/i.test(url)) {
    const vid = document.createElement('video');
    const basePath = url.replace(/\.mp4$/i, '').replace(/\.webm$/i, '');
    const mp4Url = basePath + '.mp4';
    const webmUrl = basePath + '.webm';
    const mp4First = shouldUseMp4First(url);
    const first = document.createElement('source');
    const second = document.createElement('source');
    if (mp4First) {
      first.src = mp4Url;
      first.type = 'video/mp4';
      second.src = webmUrl;
      second.type = 'video/webm';
    } else {
      first.src = webmUrl;
      first.type = 'video/webm';
      second.src = mp4Url;
      second.type = 'video/mp4';
    }
    vid.appendChild(first);
    vid.appendChild(second);
    vid.controls = true;
    vid.autoplay = true;
    med.insertBefore(vid, ph);
    ph.style.display = 'none';
  }
}

function _counter() {
  document.getElementById('nav-counter').textContent = activeIdx + 1 + ' / ' + allHots.length;
}

export function closeModal() {
  document.getElementById('modal-bg').classList.remove('open');
  document.getElementById('modal').classList.remove('open');
  document.getElementById('esc').classList.remove('on');
  const med = document.getElementById('modal-media');
  const old = med.querySelector('iframe,video');
  if (old) old.remove();
  document.getElementById('modal-ph').style.display = '';
  med.style.transition = '';
  med.style.opacity = '';
  setActiveIdx(-1);
}
