let _ac = null;
let _tickBuf = null;
let _archTickBuf = null;

export function _getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  return _ac;
}

export function _play(fn) {
  const ac = _getAC();
  if (ac.state === 'running') fn(ac);
  else ac.resume().then(() => fn(ac));
}

function _bakeTickBuf(ac) {
  if (_tickBuf) return;
  const len = Math.floor(ac.sampleRate * 0.022);
  _tickBuf = ac.createBuffer(1, len, ac.sampleRate);
  const d = _tickBuf.getChannelData(0);
  for (let j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / len, 3);
}

function _bakeArchTickBuf(ac) {
  if (_archTickBuf) return;
  const len = Math.floor(ac.sampleRate * 0.03);
  _archTickBuf = ac.createBuffer(1, len, ac.sampleRate);
  const d = _archTickBuf.getChannelData(0);
  for (let j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / len, 2) * 0.6;
}

export function sfxIntro() {
  _play((ac) => {
    const master = ac.createGain();
    master.connect(ac.destination);
    [55, 82, 110].forEach((freq, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(master); o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, ac.currentTime + i * 0.1);
      g.gain.linearRampToValueAtTime(0.07, ac.currentTime + i * 0.1 + 1);
      g.gain.linearRampToValueAtTime(0, ac.currentTime + 5);
      o.start(ac.currentTime + i * 0.1); o.stop(ac.currentTime + 5.2);
    });
    const sh = ac.createOscillator();
    const sg = ac.createGain();
    sh.connect(sg); sg.connect(master); sh.type = 'sine';
    sh.frequency.setValueAtTime(3200, ac.currentTime + 0.4);
    sh.frequency.linearRampToValueAtTime(1600, ac.currentTime + 4);
    sg.gain.setValueAtTime(0, ac.currentTime + 0.4);
    sg.gain.linearRampToValueAtTime(0.035, ac.currentTime + 1.2);
    sg.gain.linearRampToValueAtTime(0, ac.currentTime + 4.5);
    sh.start(ac.currentTime + 0.4); sh.stop(ac.currentTime + 4.6);
    const len = Math.floor(ac.sampleRate * 4);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const ns = ac.createBufferSource();
    const nf = ac.createBiquadFilter();
    const ng = ac.createGain();
    nf.type = 'bandpass'; nf.frequency.value = 600; nf.Q.value = 0.5;
    ns.buffer = buf; ns.connect(nf); nf.connect(ng); ng.connect(master);
    ng.gain.setValueAtTime(0, ac.currentTime);
    ng.gain.linearRampToValueAtTime(0.06, ac.currentTime + 1.5);
    ng.gain.linearRampToValueAtTime(0, ac.currentTime + 4);
    ns.start(); ns.stop(ac.currentTime + 4.1);
  });
}

export function sfxMapOpen() {
  _play((ac) => {
    const len = Math.floor(ac.sampleRate * 0.35);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    const f = ac.createBiquadFilter();
    const g = ac.createGain();
    f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.2;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.22, ac.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
    src.start(); src.stop(ac.currentTime + 0.36);
    const o = ac.createOscillator();
    const g2 = ac.createGain();
    o.connect(g2); g2.connect(ac.destination); o.type = 'sine'; o.frequency.value = 75;
    g2.gain.setValueAtTime(0.18, ac.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
    o.start(); o.stop(ac.currentTime + 0.56);
  });
}

export function sfxDotAppear() {
  _play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination); o.type = 'sine';
    o.frequency.setValueAtTime(280, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(1000, ac.currentTime + 0.13);
    g.gain.setValueAtTime(0.1, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    o.start(); o.stop(ac.currentTime + 0.16);
  });
}

export function sfxHover() {
  _play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination); o.type = 'sine';
    o.frequency.setValueAtTime(880, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.08);
    g.gain.setValueAtTime(0.07, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.16);
    o.start(); o.stop(ac.currentTime + 0.17);
  });
}

export function sfxClick() {
  _play((ac) => {
    [[440, 0, 0.12], [660, 0.06, 0.15]].forEach((p) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination); o.type = 'triangle'; o.frequency.value = p[0];
      g.gain.setValueAtTime(0.12, ac.currentTime + p[1]);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + p[1] + p[2]);
      o.start(ac.currentTime + p[1]); o.stop(ac.currentTime + p[1] + p[2]);
    });
  });
}

export function sfxEnterRoom() {
  _play((ac) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination); o.type = 'sine';
    o.frequency.setValueAtTime(120, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(38, ac.currentTime + 0.3);
    g.gain.setValueAtTime(0.28, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.36);
    o.start(); o.stop(ac.currentTime + 0.37);
    const o2 = ac.createOscillator();
    const g2 = ac.createGain();
    o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = 1800;
    g2.gain.setValueAtTime(0, ac.currentTime + 0.05);
    g2.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
    o2.start(ac.currentTime + 0.05); o2.stop(ac.currentTime + 0.41);
  });
}

export function sfxArchTypeSequence(charCount, msPerChar) {
  _play((ac) => {
    _bakeArchTickBuf(ac);
    for (let i = 0; i < charCount; i++) {
      const t = ac.currentTime + i * msPerChar / 1000;
      const src = ac.createBufferSource();
      const f = ac.createBiquadFilter();
      const g = ac.createGain();
      f.type = 'bandpass'; f.frequency.value = 600; f.Q.value = 0.8;
      src.buffer = _archTickBuf; src.connect(f); f.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.028);
      src.start(t); src.stop(t + 0.032);
    }
  });
}

export function sfxTypeSequence(charCount, msPerChar) {
  _play((ac) => {
    _bakeTickBuf(ac);
    for (let i = 0; i < charCount; i++) {
      const t = ac.currentTime + i * msPerChar / 1000;
      const src = ac.createBufferSource();
      const f = ac.createBiquadFilter();
      const g = ac.createGain();
      f.type = 'highpass'; f.frequency.value = 1800;
      src.buffer = _tickBuf; src.connect(f); f.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.11, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      src.start(t); src.stop(t + 0.025);
    }
  });
}
