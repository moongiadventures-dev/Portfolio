import { initCursor } from './components/cursor.js';
import { initIntro } from './components/intro.js';
import { showMap, goToRoom } from './components/map.js';
import { positionHotspots } from './components/room.js';
import { openModal, closeModal, navigateFrame } from './components/modal.js';
import { openAbout, closeAbout, toggleTutorial } from './components/about.js';

function bindClicks() {
  const mapAboutBtn = document.getElementById('map-about-btn');
  if (mapAboutBtn) mapAboutBtn.addEventListener('click', openAbout);

  document.querySelectorAll('.door-group').forEach((el) => {
    el.addEventListener('click', () => {
      goToRoom(el.dataset.room);
    });
  });

  const mapBtn = document.getElementById('map-btn');
  if (mapBtn) mapBtn.addEventListener('click', showMap);

  const aboutLabel = document.getElementById('about-label');
  if (aboutLabel) aboutLabel.addEventListener('click', openAbout);

  const tutHeader = document.getElementById('tut-header');
  if (tutHeader) tutHeader.addEventListener('click', toggleTutorial);

  const modalBg = document.getElementById('modal-bg');
  if (modalBg) modalBg.addEventListener('click', closeModal);

  const navBtns = document.querySelectorAll('.nav-btn');
  if (navBtns[0]) navBtns[0].addEventListener('click', () => navigateFrame(-1));
  if (navBtns[1]) navBtns[1].addEventListener('click', () => navigateFrame(1));

  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', closeModal);

  const aboutClose = document.getElementById('about-close');
  if (aboutClose) aboutClose.addEventListener('click', closeAbout);
}

function bindGlobals() {
  window.goToRoom = goToRoom;
  window.showMap = showMap;
  window.openAbout = openAbout;
  window.closeAbout = closeAbout;
  window.closeModal = closeModal;
  window.navigateFrame = navigateFrame;
  window.toggleTutorial = toggleTutorial;
  window.openModal = openModal;
}

function bindGlobalKeysAndResize() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      closeModal();
      closeAbout();
    }
    if (e.code === 'ArrowRight') navigateFrame(1);
    if (e.code === 'ArrowLeft') navigateFrame(-1);
  });
  window.addEventListener('resize', positionHotspots);
}

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initIntro();
  bindClicks();
  bindGlobals();
  bindGlobalKeysAndResize();
});
