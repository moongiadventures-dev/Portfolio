export let curRing = null;

export function initCursor() {
  const curDot = document.getElementById('cur-dot');
  curRing = document.getElementById('cur-ring');
  let cx = -200;
  let cy = -200;
  let rx = -200;
  let ry = -200;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    document.body.style.cursor = 'none';
  }, { once: true });

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  (function cL() {
    requestAnimationFrame(cL);
    rx += (cx - rx) * 0.1;
    ry += (cy - ry) * 0.1;
    curDot.style.left = cx + 'px';
    curDot.style.top = cy + 'px';
    curRing.style.left = rx + 'px';
    curRing.style.top = ry + 'px';
  })();
}
