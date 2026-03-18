import { sfxMapOpen, sfxHover, sfxClick, sfxEnterRoom } from '../audio/engine.js';
import { closeModal } from './modal.js';
import { loadRoom } from './room.js';
import { ROOMS } from '../config/rooms.js';

const preloadedRooms = new Set();

export function showMap() {
  closeModal();
  sfxMapOpen();
  const ms = document.getElementById('map-screen');
  ms.style.display = 'flex';
  requestAnimationFrame(() => {
    ms.classList.add('visible');
    initSitePlan();
  });
  document.getElementById('room-screen').classList.remove('visible');
  setTimeout(() => {
    document.getElementById('room-screen').style.display = 'none';
    document.getElementById('map-btn').style.display = 'none';
    document.getElementById('room-name-badge').textContent = '';
    document.getElementById('about-label').style.display = 'none';
    document.getElementById('tutorial').classList.remove('on');
    document.getElementById('hover-overlay').classList.remove('on');
    const csb = document.getElementById('coming-soon-badge');
    if (csb) csb.style.display = 'none';
  }, 300);
}

export function initSitePlan() {
  document.querySelectorAll('.door-group').forEach((g) => {
    if (g.dataset.hoverBound === '1') return;
    g.dataset.hoverBound = '1';
    const ring = document.getElementById('cur-ring');
    g.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
      sfxHover();
      const roomId = g.dataset.room;
      const roomData = ROOMS[roomId];
      if (roomId && roomData && roomData.video && !preloadedRooms.has(roomId)) {
        preloadedRooms.add(roomId);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = roomData.video;
        document.head.appendChild(link);
      }
    });
    g.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
    });
  });
}

export function goToRoom(roomId) {
  let targetG = null;
  document.querySelectorAll('.door-group').forEach((g) => {
    if (g.dataset.room === roomId) targetG = g;
  });
  if (!targetG) return;
  sfxClick();
  setTimeout(() => {
    sfxEnterRoom();
  }, 200);
  loadRoom(roomId);
}
