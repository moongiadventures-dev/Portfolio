import { ROOMS, setCurrentRoom, setAllHots } from '../config/rooms.js';
import { openModal } from './modal.js';
import { curRing } from './cursor.js';

let IMG_W;
let IMG_H;
let sc;
let offX;
let offY;

const MP4_PRIORITY_BASES = new Set([
  'videos/architects-office/chateau-construction',
  'videos/architects-office/architects-house'
]);

function shouldUseMp4First(path) {
  return MP4_PRIORITY_BASES.has(path.replace(/\.mp4$/i, '').replace(/\.webm$/i, ''));
}

export function loadRoom(roomId) {
  const room = ROOMS[roomId];
  if (!room) return;
  setCurrentRoom(roomId);

  const ms = document.getElementById('map-screen');
  ms.classList.remove('visible');
  setTimeout(() => {
    ms.style.display = 'none';
  }, 600);

  const vid = document.getElementById('room-video');
  vid.innerHTML = '';
  if (room.video) {
    const basePath = room.video.replace(/\.mp4$/, '');
    vid.poster = basePath + '-poster.jpg';
    const mp4First = shouldUseMp4First(room.video);
    const mp4Src = document.createElement('source');
    mp4Src.src = room.video;
    mp4Src.type = 'video/mp4';
    const webmSrc = document.createElement('source');
    webmSrc.src = basePath + '.webm';
    webmSrc.type = 'video/webm';
    if (mp4First) {
      vid.appendChild(mp4Src);
      vid.appendChild(webmSrc);
    } else {
      vid.appendChild(webmSrc);
      vid.appendChild(mp4Src);
    }
    vid.muted = !(roomId === 'arch' || roomId === 'brand');
    vid.load();
  }

  const rs = document.getElementById('room-screen');
  rs.style.display = 'block';
  setTimeout(() => {
    rs.classList.add('visible');
  }, 50);

  buildHotspots(room);

  document.getElementById('room-name-badge').textContent = room.name;
  document.getElementById('map-btn').style.display = 'block';
  document.getElementById('about-label').style.display = 'none';
  document.getElementById('coming-soon-badge').style.display = roomId === 'web' || roomId === 'imag' ? 'block' : 'none';

  setTimeout(() => {
    document.getElementById('tutorial').classList.add('on');
  }, 2000);
}

export function buildHotspots(room) {
  IMG_W = room.imgW;
  IMG_H = room.imgH;
  const hl = document.getElementById('hl');
  hl.innerHTML = '';
  const nextHots = [];
  let typeTimer = null;

  room.spots.forEach((spot, i) => {
    const el = document.createElement('div');
    el.className = 'h';
    el.dataset.sx = spot.sx;
    el.dataset.sy = spot.sy;
    el.dataset.sw = spot.sw;
    el.dataset.sh = spot.sh;
    el.dataset.title = spot.title;
    el.dataset.sub = spot.sub;
    el.dataset.video = spot.video || '';
    el.innerHTML = '<div class="h-border"></div><div class="h-play"></div>';

    el.addEventListener('mouseenter', () => {
      const isComingSoon = spot.title === 'Coming Soon';
      document.getElementById('ho-sub').textContent = spot.sub;
      const hov = document.getElementById('hover-overlay');
      hov.style.borderColor = isComingSoon ? 'rgba(255,255,255,.25)' : '#c9a84c';
      hov.classList.add('on');
      curRing.classList.add('hover');
      if (typeTimer) {
        clearInterval(typeTimer);
        typeTimer = null;
      }
      const ht = document.getElementById('ho-title');
      const full = spot.title;
      const chars = full.length;
      const dur = Math.max(0.4, chars * 0.045);
      ht.textContent = full;
      ht.style.color = isComingSoon ? 'rgba(255,255,255,.45)' : '';
      ht.style.animation = 'none';
      ht.style.width = '0';
      void ht.offsetWidth;
      ht.style.animation =
        'hoTypeAnim ' + dur + 's steps(' + chars + ',end) forwards,' +
        'hoCaretAnim 0.4s step-end ' + dur + 's 4';
    });

    el.addEventListener('mouseleave', () => {
      if (typeTimer) {
        clearInterval(typeTimer);
        typeTimer = null;
      }
      const ht = document.getElementById('ho-title');
      ht.style.animation = 'none';
      ht.style.width = '0';
      ht.textContent = '';
      ht.style.color = '';
      document.getElementById('hover-overlay').style.borderColor = '';
      document.getElementById('hover-overlay').classList.remove('on');
      curRing.classList.remove('hover');
    });

    el.addEventListener('click', () => {
      if (spot.title !== 'Coming Soon') openModal(i);
    });

    hl.appendChild(el);
    nextHots.push(el);
  });

  setAllHots(nextHots);
  positionHotspots();
}

export function positionHotspots() {
  if (!IMG_W) return;
  const sw = innerWidth;
  const sh = innerHeight;
  sc = Math.max(sw / IMG_W, sh / IMG_H);
  offX = (sw - IMG_W * sc) / 2;
  offY = (sh - IMG_H * sc) / 2;
  const hl = document.getElementById('hl');
  hl.style.left = offX + 'px';
  hl.style.top = offY + 'px';
  hl.style.width = IMG_W * sc + 'px';
  hl.style.height = IMG_H * sc + 'px';
  document.querySelectorAll('#hl .h').forEach((el) => {
    el.style.left = +el.dataset.sx * sc + 'px';
    el.style.top = +el.dataset.sy * sc + 'px';
    el.style.width = +el.dataset.sw * sc + 'px';
    el.style.height = +el.dataset.sh * sc + 'px';
  });
}
