// RailFlow High-Fidelity Multi-Lingual Audio Engine
// Real-time Web Audio API 4-Tone Indian Railways acoustic chime + HD Indic Speech Synthesis

// Accurate Voice Gender Classification across Windows SAPI, Chrome, Edge, Android, Apple
export function classifyVoiceGender(name = '') {
  const n = (name || '').toLowerCase();
  
  // Explicit female keywords & recognized voice personas
  if (
    /female|woman|girl|femme|donna|mujer/i.test(n) ||
    /zira|heera|kalpana|geeta|lata|shruti|priya|neerja|swara|aditi|sunali|karunya|veena|ananya|kavya|deepa|shreya|meera|rashmi|divya/i.test(n) ||
    /jenny|aria|sonia|natasha|libby|clara|victoria|samantha|karen|moira|fiona|tessa|kendra|kimberly|salli|joanna|ivy|emma|amy|hazel|susan|catherine|stephanie/i.test(n) ||
    n.includes('google us english') ||
    n.includes('google हिन्दी') ||
    n.includes('google uk english female')
  ) {
    return 'female';
  }
  
  // Explicit male keywords & recognized voice personas
  if (
    /male|man|boy|homme|uomo|hombre/i.test(n) ||
    /david|mark|ravi|prabhas|vikram|naveen|karthik|hemant|george|guy|brian|richard|james|john|paul|michael|daniel/i.test(n) ||
    n.includes('google uk english male')
  ) {
    return 'male';
  }
  
  return 'neutral';
}

// Phonetic Tanglish transliteration dictionary for Tamil phrases when local TTS lacks Tamil voice
export function transliterateTamilToPhonetic(text = '') {
  if (!text) return '';
  // Check if text has Tamil Unicode characters (\u0B80 - \u0BFF)
  if (!/[\u0B80-\u0BFF]/.test(text)) return text;

  let out = text;
  const replacements = [
    [/வண்டி எண்/g, 'Vandi enn'],
    [/பாண்டியன்/g, 'Pandiyan'],
    [/வைகை/g, 'Vaigai'],
    [/பல்லவன்/g, 'Pallavan'],
    [/ராக்போர்ட்/g, 'Rockfort'],
    [/அதிவிரைவு வண்டி/g, 'athiviraivu vandi'],
    [/விரைவு வண்டி/g, 'viraivu vandi'],
    [/நடைமேடை/g, 'nadaimedai'],
    [/வந்து கொண்டிருக்கிறது/g, 'vandhu kondirukkiradhu'],
    [/புறப்பட தயாராக உள்ளது/g, 'purappada thayaaraaga ulladhu'],
    [/கூட்ட நெரிசல் காரணமாக/g, 'Kootta nerisal kaaranamaaga'],
    [/நடைமேடை (\d+)-ல் வரும்/g, 'nadaimedai $1-il varum'],
    [/நடைமேடை (\d+)-லிருந்து/g, 'nadaimedai $1-ilirundhu'],
    [/அவசர எச்சரிக்கை!/g, 'Avasara echarikkai!'],
    [/தடம் (\d+)-ல்/g, 'Thadam $1-il'],
    [/கவச் பிரேக்கிங் இயக்கப்பட்டுள்ளது/g, 'Kavach braking iyakkappattulladhu'],
    [/மஞ்சள் எல்லைக்கோட்டிற்கு பின்னால் நிற்கவும்/g, 'manjal ellaikkottirku pinnaal nirkkavum'],
    [/நடைமேடை பாலம்/g, 'Nadaimedai paalam'],
    [/அதிக கூட்ட நெரிசல் உள்ளது/g, 'adhiga kootta nerisal ulladhu'],
    [/பயணிகள் வடக்கு வழியைப் பயன்படுத்தவும்/g, 'Payanigal vadakku vazhiyai payanpaduthavum'],
    [/காத்திருப்போர் பட்டியல்/g, 'Kaathiruppor pattiyal'],
    [/பயணிகளுக்காக/g, 'payanigalukkaaga'],
    [/பொன்மலையிலிருந்து/g, 'Ponmalaiyilirundhu'],
    [/சிறப்பு மாற்று வண்டி/g, 'sirappu maatru vandi'],
    [/இயக்கப்படுகிறது/g, 'iyakkappadugiradhu'],
    [/சென்னை எழும்பூர்/g, 'Chennai Egmore'],
    [/சென்னை சென்ட்ரல்/g, 'Chennai Central'],
    [/திருச்சி/g, 'Trichy'],
    [/மதுரை/g, 'Madurai'],
    [/கோயம்புத்தூர்/g, 'Coimbatore'],
    [/பயணிகள் கவனத்திற்கு/g, 'Payanigal kavanathirku']
  ];

  for (const [regex, rep] of replacements) {
    out = out.replace(regex, rep);
  }

  // If still containing raw Tamil characters, simplify
  if (/[\u0B80-\u0BFF]/.test(out)) {
    out = out.replace(/[\u0B80-\u0BFF]+/g, ' [Tamil] ');
  }

  return out;
}

class AudioEngine {
  constructor() {
    this.context = null;
    this.muted = false;
    this.masterGain = null;
    this.currentUtterance = null;
    this.currentAudio = null;
    this.audioMode = 'cloud_hd'; // 'cloud_hd' | 'browser_tts'
    this.installedVoices = [];
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

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.refreshVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.refreshVoices();
      }
    }
  }

  refreshVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const list = window.speechSynthesis.getVoices() || [];
    this.installedVoices = list.map(v => {
      const gender = classifyVoiceGender(v.name);
      const icon = gender === 'female' ? '👩' : gender === 'male' ? '👨' : '👤';
      return {
        voice: v,
        name: v.name,
        lang: v.lang,
        gender,
        icon,
        isDefault: v.default,
        label: `${icon} ${v.name} (${gender.toUpperCase()} • ${v.lang})`
      };
    });
    return this.installedVoices;
  }

  getAvailableVoices() {
    if (!this.installedVoices || this.installedVoices.length === 0) {
      this.refreshVoices();
    }
    return this.installedVoices;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.5;
    }
    if (this.muted) {
      this.stopAllAudio();
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

  playError() {
    this.playTone(330, 'sawtooth', 0.2, 0.4);
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

  // Plays Cloud HD native Indic speech stream via HTML5 Audio
  // Guarantees authentic Tamil and Indic pronunciation on any device
  playAudioStream(text, lang = 'ta', onStart = null, onEnd = null) {
    return new Promise((resolve) => {
      if (this.muted) {
        if (onEnd) onEnd();
        return resolve(false);
      }

      this.stopAllAudio();

      const langCode = (lang || 'ta').split('-')[0].toLowerCase();
      const encoded = encodeURIComponent(text.slice(0, 250));
      const proxyUrl = `/api/tts?tl=${langCode}&q=${encoded}`;
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encoded}`;

      const audio = new Audio();
      this.currentAudio = audio;
      audio.crossOrigin = 'anonymous';
      audio.src = proxyUrl;

      let started = false;
      let completed = false;

      const finish = (success = true) => {
        if (!completed) {
          completed = true;
          this.currentAudio = null;
          if (onEnd) onEnd();
          resolve(success);
        }
      };

      audio.onplay = () => {
        if (!started) {
          started = true;
          if (onStart) onStart();
        }
      };

      audio.onended = () => finish(true);

      audio.onerror = () => {
        // If /api/tts fails, try direct Google TTS endpoint as fallback
        if (audio.src !== directUrl) {
          audio.src = directUrl;
          audio.play().catch(() => finish(false));
        } else {
          finish(false);
        }
      };

      audio.play().catch((err) => {
        console.warn('Audio stream play error:', err.message);
        finish(false);
      });
    });
  }

  // Multi-lingual speech synthesis with priority fallbacks & explicit Female/Male selection
  // gender: 'female' | 'male' | 'any'
  // preferredVoiceName: specific voice name chosen by user
  async speakAnnouncement(
    text,
    langCode = 'en-IN',
    rate = 0.88,
    pitch = 1.0,
    onStart = null,
    onEnd = null,
    gender = 'female',
    preferredVoiceName = null,
    phoneticFallback = null
  ) {
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }

    const isTamil = (langCode || '').toLowerCase().startsWith('ta') || /[\u0B80-\u0BFF]/.test(text);

    // Check if browser has a native Tamil voice installed
    const voices = (typeof window !== 'undefined' && 'speechSynthesis' in window)
      ? window.speechSynthesis.getVoices()
      : [];
    const hasNativeTamilVoice = voices.some(v => v.lang.toLowerCase().replace('_', '-').startsWith('ta'));

    // FOR TAMIL: If no native Tamil voice in browser, play Cloud HD audio stream directly
    // This gives authentic, beautiful native Tamil speech instead of silence or broken English!
    if (isTamil && (!hasNativeTamilVoice || this.audioMode === 'cloud_hd')) {
      const streamSuccess = await this.playAudioStream(text, 'ta', onStart, onEnd);
      if (streamSuccess) {
        return;
      }
      // If streaming was blocked by network/browser, proceed to phonetic Web Speech fallback below
    }

    // Web Speech API Synthesis
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // If text has Tamil characters but no native Tamil voice exists, transliterate to phonetic Tanglish
      let spokenText = text;
      if (isTamil && !hasNativeTamilVoice) {
        spokenText = phoneticFallback || transliterateTamilToPhonetic(text);
      }

      const utter = new SpeechSynthesisUtterance(spokenText);
      utter.lang = (isTamil && !hasNativeTamilVoice) ? 'en-IN' : (langCode || 'en-IN');
      utter.rate = parseFloat(rate) || 0.88;

      // Adjust pitch based on gender preference
      let effectivePitch = parseFloat(pitch) || 1.0;
      if (gender === 'female') {
        effectivePitch = Math.max(effectivePitch, 1.15); // Standard IR Female PIS Announcer pitch
      } else if (gender === 'male') {
        effectivePitch = Math.min(effectivePitch, 0.95); // Deep Station Master PA pitch
      }
      utter.pitch = effectivePitch;

      this.currentUtterance = utter;
      window._currentUtterance = utter;

      const assignVoice = () => {
        const allVoices = window.speechSynthesis.getVoices() || [];
        if (allVoices.length === 0) return false;

        // 1. If user picked a specific voice name, prioritize it
        if (preferredVoiceName) {
          const explicit = allVoices.find(v => v.name === preferredVoiceName);
          if (explicit) {
            utter.voice = explicit;
            return true;
          }
        }

        const targetLang = utter.lang.toLowerCase();
        const baseLang = targetLang.slice(0, 2);

        // 2. Filter candidates matching language
        let candidates = allVoices.filter(v => {
          const vl = v.lang.toLowerCase().replace('_', '-');
          return vl === targetLang || vl.startsWith(baseLang);
        });

        if (candidates.length === 0) {
          candidates = allVoices.filter(v => v.lang.toLowerCase().startsWith('en'));
        }
        if (candidates.length === 0) {
          candidates = allVoices;
        }

        // 3. Match by gender
        let match = null;
        if (gender === 'female') {
          // Find female voice in candidates
          match = candidates.find(v => classifyVoiceGender(v.name) === 'female');
          // If no female in candidates, search all system voices for any female voice
          if (!match) {
            match = allVoices.find(v => classifyVoiceGender(v.name) === 'female');
          }
          if (!match) match = candidates[0];
        } else if (gender === 'male') {
          match = candidates.find(v => classifyVoiceGender(v.name) === 'male');
          if (!match) {
            match = allVoices.find(v => classifyVoiceGender(v.name) === 'male');
          }
          if (!match) match = candidates[0];
        } else {
          match = candidates.find(v => /google|microsoft/i.test(v.name)) || candidates[0];
        }

        if (match) utter.voice = match;
        return true;
      };

      if (!assignVoice()) {
        const handler = () => {
          assignVoice();
          window.speechSynthesis.removeEventListener('voiceschanged', handler);
          window.speechSynthesis.speak(utter);
        };
        window.speechSynthesis.addEventListener('voiceschanged', handler);
        setTimeout(() => {
          window.speechSynthesis.removeEventListener('voiceschanged', handler);
          if (!utter.voice) window.speechSynthesis.speak(utter);
        }, 800);
      } else {
        window.speechSynthesis.speak(utter);
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
    });
  }

  stopAllAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    this.currentUtterance = null;
    if (typeof window !== 'undefined') {
      window._currentUtterance = null;
    }
  }
}

const audioEngine = new AudioEngine();
export { audioEngine };
export default audioEngine;
