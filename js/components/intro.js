import { sfxIntro, sfxDotAppear, _getAC } from '../audio/engine.js';
import { showMap } from './map.js';

let entered = false;
let sfxPlayed = false;

export function initIntro() {
  const iv = document.getElementById('intro-video');
  const ie = document.getElementById('intro');
  const ne = document.getElementById('i-name');
  let tr = false;

  window.origamiBurst = function () {
    return new Promise((res) => {
      const r = ne.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      ne.style.animation = 'none';
      ne.style.transition = 'opacity 0.5s ease';
      ne.style.opacity = '0';
      setTimeout(() => {
        const cv = document.createElement('canvas');
        cv.id = 'origami-canvas';
        cv.width = innerWidth;
        cv.height = innerHeight;
        document.body.appendChild(cv);
        const ctx = cv.getContext('2d');
        const COLS = 22;
        const ROWS = 8;
        const cw = (r.width * 1.5) / COLS;
        const ch = (r.height * 1.8) / ROWS;
        const ox = cx - r.width * 1.5 / 2;
        const oy = cy - r.height * 1.8 / 2;
        const F = [[240, 235, 224], [255, 252, 240], [220, 210, 190], [201, 168, 76], [180, 170, 155]];
        const tris = [];
        for (let ri = 0; ri < ROWS; ri++) {
          for (let c = 0; c < COLS; c++) {
            const x0 = ox + c * cw;
            const y0 = oy + ri * ch;
            const x1 = x0 + cw;
            const y1 = y0 + ch;
            const j = () => (Math.random() - 0.5) * cw * 0.18;
            [[[x0 + j(), y0 + j()], [x1 + j(), y0 + j()], [x0 + j(), y1 + j()]], [[x1 + j(), y0 + j()], [x1 + j(), y1 + j()], [x0 + j(), y1 + j()]]].forEach((pts, ti) => {
              const tx2 = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
              const ty2 = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
              const dx = tx2 - cx;
              const dy = ty2 - cy;
              const d = Math.sqrt(dx * dx + dy * dy) || 1;
              const sp = 4 + Math.random() * 8;
              const b = F[(ri + c + ti) % F.length];
              const v = Math.round((Math.random() - 0.5) * 22);
              const ig = Math.random() < 0.07;
              const is = ti === 1 && (ri + c) % 3 === 0;
              tris.push({
                pts,
                tcx: tx2,
                tcy: ty2,
                vx: dx / d * sp + (Math.random() - 0.5) * 5,
                vy: dy / d * sp + (Math.random() - 0.5) * 5 - 2.5,
                spin: (Math.random() - 0.5) * 0.16,
                angle: 0,
                alpha: 1,
                fc: ig ? 'rgba(201,168,76,.9)' : is ? 'rgb(' + (b[0] - 30 + v) + ',' + (b[1] - 30 + v) + ',' + (b[2] - 25 + v) + ')' : 'rgb(' + (b[0] + v) + ',' + (b[1] + v) + ',' + (b[2] + v) + ')',
                ec: ig ? 'rgba(160,120,40,.9)' : 'rgba(' + (b[0] - 50) + ',' + (b[1] - 50) + ',' + (b[2] - 45) + ',.7)',
                fe: ti === 0 ? 2 : 0
              });
            });
          }
        }
        const D = 2000;
        let t0 = null;
        function fr(ts) {
          if (!t0) t0 = ts;
          const t = Math.min(1, (ts - t0) / D);
          ctx.clearRect(0, 0, cv.width, cv.height);
          tris.forEach((t2) => {
            t2.tcx += t2.vx;
            t2.tcy += t2.vy;
            t2.vy += 0.1;
            t2.vx *= 0.984;
            t2.angle += t2.spin;
            t2.alpha = Math.max(0, 1 - Math.pow(Math.max(0, t - 0.1) / 0.9, 1.6));
            ctx.save();
            ctx.globalAlpha = t2.alpha;
            ctx.translate(t2.tcx, t2.tcy);
            ctx.rotate(t2.angle);
            ctx.translate(-t2.tcx, -t2.tcy);
            ctx.beginPath();
            ctx.moveTo(t2.pts[0][0], t2.pts[0][1]);
            ctx.lineTo(t2.pts[1][0], t2.pts[1][1]);
            ctx.lineTo(t2.pts[2][0], t2.pts[2][1]);
            ctx.closePath();
            ctx.fillStyle = t2.fc;
            ctx.fill();
            ctx.strokeStyle = t2.ec;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(t2.pts[t2.fe][0], t2.pts[t2.fe][1]);
            ctx.lineTo(t2.pts[(t2.fe + 1) % 3][0], t2.pts[(t2.fe + 1) % 3][1]);
            ctx.strokeStyle = 'rgba(255,252,240,.55)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
          });
          if (t < 1) requestAnimationFrame(fr);
          else {
            cv.remove();
            res();
          }
        }
        requestAnimationFrame(fr);
      }, 520);
    });
  };

  function ti() {
    if (tr) return;
    tr = true;
    ie.classList.add('playing');
    ne.style.animation = 'nameZoomIn 6000ms cubic-bezier(.16,1,.3,1) 0s forwards';
  }
  iv.addEventListener('playing', ti);
  iv.addEventListener('canplaythrough', ti);
  setTimeout(ti, 3000);

  setupAudioUnlock(iv);

  window.addEventListener('wheel', onScroll, { passive: true });
  window.addEventListener('touchmove', onScroll, { passive: true });
  setTimeout(enterStudio, 7000);
}

function setupAudioUnlock(vid) {
  try { _getAC().resume(); } catch (e) {}
  if (vid) {
    const linkVideo = () => {
      try {
        const ac = _getAC();
        const src = ac.createMediaElementSource(vid);
        src.connect(ac.destination);
        ac.resume().then(() => { if (ac.state === 'running') sfxIntro(); });
      } catch (e) {}
    };
    if (vid.readyState >= 2) linkVideo();
    else vid.addEventListener('canplay', linkVideo, { once: true });
    vid.addEventListener('playing', () => {
      const ac = _getAC();
      if (ac.state === 'suspended') ac.resume().then(() => { if (ac.state === 'running') sfxIntro(); });
    }, { once: true });
  }
  ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach((ev) => {
    window.addEventListener(ev, function ug() {
      unlockAudio();
      window.removeEventListener(ev, ug);
    }, { passive: true });
  });
}

export function unlockAudio() {
  const ac = _getAC();
  const hint = document.getElementById('audio-hint');
  if (hint) hint.style.display = 'none';
  if (ac.state === 'suspended') {
    ac.resume().then(() => {
      if (!sfxPlayed) { sfxPlayed = true; sfxIntro(); }
    });
  } else if (!sfxPlayed) {
    sfxPlayed = true;
    sfxIntro();
  }
}

export function enterStudio() {
  if (entered) return;
  entered = true;
  window.removeEventListener('wheel', onScroll);
  window.removeEventListener('touchmove', onScroll);
  document.getElementById('scroll-hint').style.opacity = '0';
  const intro = document.getElementById('intro');
  intro.classList.add('out');
  setTimeout(() => {
    intro.style.display = 'none';
    showMap();
    const groups = Array.from(document.querySelectorAll('.door-group'));
    groups.sort((a, b) => +a.dataset.ry - +b.dataset.ry);
    groups.forEach((g, i) => {
      setTimeout(() => { g.classList.add('entered'); sfxDotAppear(); }, 300 + i * 200);
    });
  }, 1000);
}

export function onScroll() {
  enterStudio();
}
