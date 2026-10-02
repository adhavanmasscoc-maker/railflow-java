class AudioEngine {
  constructor() {
    this.context = null;
    this.muted = false;
    this.masterGain = null;
    this.currentUtterance = null;
    this.waveInterval = null;
  }

  init() {
    if (this.context) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.context = new AudioCtx();
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = 0.5;
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.5;
    }
    return this.muted;
  }

  playTone(freq, type, duration, vol) {
    if (this.muted) return;
    if (!this.context) this.init();
    if (!this.context) return;

    try {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.context.currentTime);
      
      gain.gain.setValueAtTime(vol, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();
      osc.stop(this.context.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playClick() {
    this.playTone(1200, 'sine', 0.05, 0.2);
  }

  playBeep() {
    this.playTone(880, 'sine', 0.1, 0.4);
  }
  
  playWarning() {
    this.playTone(220, 'sawtooth', 0.3, 0.6);
  }
  
  playChime() {
    return this.playIRChime();
  }

  // Authentic 4-Tone Indian Railways Acoustic Chime
  // Notes: D5 (587.33Hz), F#5 (739.99Hz), A5 (880.00Hz), D6 (1174.66Hz)
  // Acoustic Filter: Bandpass 1800Hz, Q=1.2
  playIRChime() {
    if (this.muted) return Promise.resolve();
    if (!this.context) this.init();
    if (!this.context) return Promise.resolve();

    return new Promise(resolve => {
      try {
        const ctx = this.context;
        if (ctx.state === 'suspended') ctx.resume();

        const notes = [587.33, 739.99, 880.00, 1174.66];
        const step = 0.16;
        const now = ctx.currentTime;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;
        filter.Q.value = 1.2;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.40, now);
        filter.connect(masterGain);
        masterGain.connect(this.masterGain || ctx.destination);

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * step);

          gain.gain.setValueAtTime(0.001, now + i * step);
          gain.gain.exponentialRampToValueAtTime(0.45, now + i * step + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * step + step * 1.5);

          osc.connect(gain);
          gain.connect(filter);
          osc.start(now + i * step);
          osc.stop(now + i * step + step * 1.6);
        });

        setTimeout(resolve, 850);
      } catch (e) {
        console.warn('IR Chime playback error:', e);
        resolve();
      }
    });
  }

  // Multi-lingual speech synthesis with priority fallbacks
  speakAnnouncement(text, langCode = 'en-IN', rate = 0.88, pitch = 1.0, onStart = null, onEnd = null) {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langCode || 'en-IN';
      utter.rate = parseFloat(rate) || 0.88;
      utter.pitch = parseFloat(pitch) || 1.0;

      // Keep reference to prevent GC bug in Chrome/Edge
      this.currentUtterance = utter;
      window._currentUtterance = utter;

      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        let match = voices.find(v => v.lang === utter.lang || v.lang.replace('_', '-').toLowerCase() === utter.lang.toLowerCase());
        if (!match) {
          const baseLang = utter.lang.slice(0, 2).toLowerCase();
          match = voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
        }
        if (match) utter.voice = match;
      }

      utter.onstart = () => {
        if (onStart) onStart();
      };

      utter.onend = () => {
        this.currentUtterance = null;
        window._currentUtterance = null;
        if (onEnd) onEnd();
        resolve();
      };

      utter.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.currentUtterance = null;
        window._currentUtterance = null;
        if (onEnd) onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utter);
    });
  }

  stopAllAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    window._currentUtterance = null;
  }
}

const audioEngine = new AudioEngine();
export { audioEngine };
export default audioEngine;
