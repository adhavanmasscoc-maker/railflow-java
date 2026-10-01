class AudioEngine {
  constructor() {
    this.context = null;
    this.muted = false;
    this.masterGain = null;
  }

  init() {
    if (this.context) return;
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = 0.5;
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
    if (this.muted || !this.context) return;
    try {
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.context.currentTime);
      
      gain.gain.setValueAtTime(vol, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start();
      osc.stop(this.context.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playBeep() {
    this.playTone(880, 'sine', 0.1, 0.5);
  }
  
  playError() {
    this.playTone(220, 'sawtooth', 0.3, 0.7);
  }
  
  playChime() {
    this.playTone(523.25, 'sine', 0.2, 0.4); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.4), 200); // E5
  }
}

const audioEngine = new AudioEngine();
export default audioEngine;
