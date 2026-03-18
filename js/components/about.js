export function toggleTutorial() {
  document.getElementById('tutorial').classList.toggle('collapsed');
}

export function openAbout() {
  document.getElementById('about-panel').classList.add('open');
  document.getElementById('about-close').classList.add('open');
}

export function closeAbout() {
  document.getElementById('about-panel').classList.remove('open');
  document.getElementById('about-close').classList.remove('open');
}
