import { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

// 10 Station Audio Dock Definitions
const STATIONS = {
  MS:   { code: 'MS',   name: 'Chennai Egmore',    zone: 'SR',  pf: 11, desc: 'Southern Railway Chord Line Hub', icon: '🌴' },
  MAS:  { code: 'MAS',  name: 'Chennai Central',   zone: 'SR',  pf: 17, desc: 'Grand Trunk Terminal', icon: '🏛️' },
  TPJ:  { code: 'TPJ',  name: 'Trichy (TPJ)',      zone: 'SR',  pf: 6,  desc: 'Delta & Golden Rock Hub', icon: '🌾' },
  ALU:  { code: 'ALU',  name: 'Ariyalur',          zone: 'SR',  pf: 3,  desc: 'Main Chord Line Junction', icon: '⚡' },
  MDU:  { code: 'MDU',  name: 'Madurai Jn',        zone: 'SR',  pf: 8,  desc: 'Pandian Corridor South Hub', icon: '🌺' },
  CBE:  { code: 'CBE',  name: 'Coimbatore Jn',     zone: 'SR',  pf: 6,  desc: 'Western Tamil Nadu Hub', icon: '🏭' },
  SBC:  { code: 'SBC',  name: 'Bengaluru (SBC)',   zone: 'SWR', pf: 10, desc: 'South Western Railway Hub', icon: '☕' },
  SC:   { code: 'SC',   name: 'Secunderabad',      zone: 'SCR', pf: 10, desc: 'South Central Headquarters', icon: '💎' },
  NDLS: { code: 'NDLS', name: 'New Delhi',         zone: 'NR',  pf: 16, desc: 'Northern Trunk Apex Terminal', icon: '🏰' },
  CSMT: { code: 'CSMT', name: 'Mumbai (CSMT)',     zone: 'CR',  pf: 18, desc: 'Central Railway UNESCO Terminal', icon: '🌊' },
};

// 9 Supported Indian Languages with Priority Ranking
const LANGUAGES = [
  { code: 'en-IN', label: '1️⃣ English (en-IN) — 1st Priority', short: 'English' },
  { code: 'ta-IN', label: '2️⃣ Tamil (தமிழ் - ta-IN) — 2nd Priority', short: 'Tamil' },
  { code: 'hi-IN', label: '3️⃣ Hindi (हिन्दी - hi-IN) — 3rd Priority', short: 'Hindi' },
  { code: 'te-IN', label: '4️⃣ Telugu (తెలుగు - te-IN)', short: 'Telugu' },
  { code: 'kn-IN', label: '5️⃣ Kannada (ಕನ್ನಡ - kn-IN)', short: 'Kannada' },
  { code: 'ml-IN', label: '6️⃣ Malayalam (മലയാളം - ml-IN)', short: 'Malayalam' },
  { code: 'bn-IN', label: '7️⃣ Bengali (বাংলা - bn-IN)', short: 'Bengali' },
  { code: 'mr-IN', label: '8️⃣ Marathi (मराठी - mr-IN)', short: 'Marathi' },
  { code: 'gu-IN', label: '9️⃣ Gujarati (ગુજરાતી - gu-IN)', short: 'Gujarati' },
];

// 6 Pre-Configured Multi-Lingual Operational Scenarios with Authentic Tamil Phonetics
const SCENARIOS = [
  {
    id: 'arrival',
    num: 'SCENARIO 01 • EXPRESS ARRIVAL',
    title: '12638 Pandian SF Express Arrival',
    badge: 'PLATFORM 1',
    scripts: {
      en: 'Attention please. Train No. 12638 Pandian Superfast Express is arriving on Platform 1.',
      ta: 'வண்டி எண் 12638 பாண்டியன் அதிவிரைவு வண்டி நடைமேடை 1-ல் வந்து கொண்டிருக்கிறது.',
      ta_phonetic: 'Vandi enn 12638 Pandiyan athiviraivu vandi, nadaimedai 1-il vandhu kondirukkiradhu.',
      hi: 'गाडी संख्या 12638 पाण्डियन सुपरफास्ट एक्सप्रेस प्लेटफार्म नंबर 1 पर आ रही है।'
    },
    translations: {
      'en-IN': 'Attention please. Train No. 12638 Pandian Superfast Express is arriving on Platform 1.',
      'ta-IN': 'வண்டி எண் 12638 பாண்டியன் அதிவிரைவு வண்டி நடைமேடை 1-ல் வந்து கொண்டிருக்கிறது.',
      'hi-IN': 'गाडी संख्या 12638 पाण्डियन सुपरफास्ट एक्सप्रेस प्लेटफार्म नंबर 1 पर आ रही है।',
      'te-IN': 'ప్రయాణికుల శ్రద్ధ వహించండి. రైలు నంబర్ 12638 పాండియన్ సూపర్ ఫాస్ట్ ఎక్స్‌ప్రెస్ ప్లాట్‌ఫారమ్ నంబర్ 1 పై చేరుకుంటుంది.',
      'kn-IN': 'ಪ್ರಯಾಣಿಕರ ಗಮನಕ್ಕೆ. ರೈಲು ಸಂಖ್ಯೆ 12638 ಪಾಂಡಿಯನ್ ಸೂಪರ್‌ಫಾಸ್ಟ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಸಂಖ್ಯೆ 1 ಕ್ಕೆ ಆಗಮಿಸುತ್ತಿದೆ.',
      'ml-IN': 'ശ്രദ്ധിക്കുക. ട്രെയിൻ നമ്പർ 12638 പാണ്ഡ്യൻ സൂപ്പർഫാസ്റ്റ് എക്സ്പ്രസ് പ്ലാറ്റ്ഫോം നമ്പർ 1-ൽ എത്തിച്ചേരുന്നു.',
      'bn-IN': 'যাত্রী সাধারণের দৃষ্টি আকর্ষণ করা হচ্ছে। ট্রেন নম্বর 12638 পান্ডিয়ান সুপারফাস্ট এক্সপ্রেস ১ নম্বর প্ল্যাটফর্মে আসছে।',
      'mr-IN': 'प्रवाशांनी कृपया लक्ष द्या. गाडी क्रमांक 12638 पांडियन सुपरफास्ट एक्सप्रेस प्लॅटफॉर्म क्रमांक 1 वर येत आहे.',
      'gu-IN': 'યાત્રીઓ ધ્યાન આપો. ટ્રેન નંબર 12638 પાંડિયન સુપરફાસ્ટ એક્સપ્રેસ પ્લેટફોર્મ નંબર 1 પર આવી રહી છે.'
    }
  },
  {
    id: 'platform',
    num: 'SCENARIO 02 • PLATFORM CONFLICT',
    title: 'Dynamic Reallocation to Platform 3',
    badge: 'REALLOCATED',
    scripts: {
      en: 'Due to heavy congestion, Train No. 12636 Vaigai Express will now arrive on Platform 3 instead of Platform 1.',
      ta: 'கூட்ட நெரிசல் காரணமாக, வைகை அதிவிரைவு வண்டி நடைமேடை 3-ல் வரும்.',
      ta_phonetic: 'Kootta nerisal kaaranamaaga, Vaigai athiviraivu vandi nadaimedai 3-il varum.',
      hi: 'अत्यधिक भीड़ के कारण, गाडी संख्या 12636 वैगई एक्सप्रेस प्लेटफार्म नंबर 3 पर आएगी।'
    },
    translations: {
      'en-IN': 'Due to heavy congestion, Train No. 12636 Vaigai Express will now arrive on Platform 3 instead of Platform 1.',
      'ta-IN': 'கூட்ட நெரிசல் காரணமாக, வைகை அதிவிரைவு வண்டி நடைமேடை 3-ல் வரும்.',
      'hi-IN': 'अत्यधिक भीड़ के कारण, गाडी संख्या 12636 वैगई एक्सप्रेस प्लेटफार्म नंबर 3 पर आएगी।',
      'te-IN': 'రద్దీ కారణంగా రైలు నంబర్ 12636 వైగై ఎక్స్‌ప్రెస్ ప్లాట్‌ఫారమ్ 1 కి బదులుగా ప్లాట్‌ఫారమ్ 3 లోకి వస్తుంది.',
      'kn-IN': 'ದಟ್ಟಣೆಯ ಕಾರಣದಿಂದ ರೈಲು ಸಂಖ್ಯೆ 12636 ವೈಗೈ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 1 ರ ಬದಲಿಗೆ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 3 ಕ್ಕೆ ಆಗಮಿಸಲಿದೆ.',
      'ml-IN': 'തിരക്ക് കാരണം ട്രെയിൻ നമ്പർ 12636 വൈഗൈ എക്സ്പ്രസ് പ്ലാറ്റ്ഫോം 1-ന് പകരം പ്ലാറ്റ്ഫോം 3-ൽ എത്തും.',
      'bn-IN': 'ভিড়ের কারণে ট্রেন নম্বর 12636 বৈগাই এক্সপ্রেস ১ নম্বরের পরিবর্তে ৩ নম্বর প্ল্যাটফর্মে আসবে।',
      'mr-IN': 'गर्दीमुळे गाडी क्रमांक 12636 वैगई एक्सप्रेस प्लॅटफॉर्म 1 ऐवजी प्लॅटफॉर्म 3 वर येईल.',
      'gu-IN': 'ભારે ભીડના કારણે ટ્રેન નંબર 12636 વૈગઈ એક્સપ્રેસ પ્લેટફોર્મ 1 ના બદલે પ્લેટફોર્મ 3 પર આવશે.'
    }
  },
  {
    id: 'kavach',
    num: 'SCENARIO 03 • SAFETY INTERVENTION',
    title: 'Kavach Automatic Braking Alert',
    badge: 'TCAS BRAKING',
    scripts: {
      en: 'Emergency alert! Kavach automatic train protection has initiated braking supervision on Track 2. Stand behind yellow line.',
      ta: 'அவசர எச்சரிக்கை! தடம் 2-ல் கவச் பிரேக்கிங் இயக்கப்பட்டுள்ளது. மஞ்சள் எல்லைக்கோட்டிற்கு பின்னால் நிற்கவும்.',
      ta_phonetic: 'Avasara echarikkai! Thadam 2-il Kavach braking iyakkappattulladhu. Manjal ellaikkottirku pinnaal nirkkavum.',
      hi: 'आपातकालीन चेतावनी! ट्रैक 2 पर कवच ब्रेकिंग सक्रिय है। पीली रेखा के पीछे रहें।'
    },
    translations: {
      'en-IN': 'Emergency alert! Kavach automatic train protection has initiated braking supervision on Track 2. Stand behind yellow line.',
      'ta-IN': 'அவசர எச்சரிக்கை! தடம் 2-ல் கவச் பிரேக்கிங் இயக்கப்பட்டுள்ளது. மஞ்சள் எல்லைக்கோட்டிற்கு பின்னால் நிற்கவும்.',
      'hi-IN': 'आपातकालीन चेतावनी! ट्रैक 2 पर कवच ब्रेकिंग सक्रिय है। पीली रेखा के पीछे रहें।',
      'te-IN': 'అత్యవసర హెచ్చరిక! కవచ్ ఆటోమేటిక్ రైలు రక్షణ వ్యవస్థ ట్రాక్ 2 పై బ్రేకింగ్ ప్రారంభించింది.',
      'kn-IN': 'ತುರ್ತು ಎಚ್ಚರಿಕೆ! ಕವಚ ಸ್ವಯಂಚಾಲಿತ ರೈಲು ರಕ್ಷಣಾ ವ್ಯವಸ್ಥೆಯು ಟ್ರ್ಯಾಕ್ 2 ರಲ್ಲಿ ಬ್ರೇಕಿಂಗ್ ಅನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿದೆ.',
      'ml-IN': 'സുരക്ഷാ മുന്നറിയിപ്പ്! കവച് ഓട്ടോമാറ്റിക് ബ്രേക്കിംഗ് ട്രാക്ക് 2-ൽ പ്രവർത്തിപ്പിച്ചു.',
      'bn-IN': 'জরুরি সতর্কতা! কবচ স্বয়ংক্রিয় ট্রেন সুরক্ষা ব্যবস্থা ট্র্যাক ২-এ ব্রেকিং শুরু করেছে।',
      'mr-IN': 'आणीबाणीची सूचना! कवच स्वयंचलित ट्रेन संरक्षण यंत्रणेने ट्रॅक 2 वर ब्रेकिंग सुरू केली आहे.',
      'gu-IN': 'કટોકટી ચેતવણી! કવચ સિસ્ટમે ટ્રેક 2 પર ઇમરજન્સી બ્રેકિંગ સક્રિય કર્યું છે.'
    }
  },
  {
    id: 'metering',
    num: 'SCENARIO 04 • CROWD MITIGATION',
    title: 'Concourse & FOB Crush Throttling',
    badge: 'METERING ACTIVE',
    scripts: {
      en: 'Advisory: Foot Overbridge 2 is experiencing heavy pedestrian density. Please utilize Ramp 1 and North gates.',
      ta: 'நடைமேடை பாலம் 2-ல் அதிக கூட்ட நெரிசல் உள்ளது. பயணிகள் வடக்கு வழியைப் பயன்படுத்தவும்.',
      ta_phonetic: 'Nadaimedai paalam 2-il adhiga kootta nerisal ulladhu. Payanigal vadakku vazhiyai payanpaduthavum.',
      hi: 'फुट ओवरब्रिज 2 पर अत्यधिक भीड़ है। कृपया उत्तरी निकास द्वार और रैंप 1 का उपयोग करें।'
    },
    translations: {
      'en-IN': 'Advisory: Foot Overbridge 2 is experiencing heavy pedestrian density. Please utilize Ramp 1 and North gates.',
      'ta-IN': 'நடைமேடை பாலம் 2-ல் அதிக கூட்ட நெரிசல் உள்ளது. பயணிகள் வடக்கு வழியைப் பயன்படுத்தவும்.',
      'hi-IN': 'फुट ओवरब्रिज 2 पर अत्यधिक भीड़ है। कृपया उत्तरी निकास द्वार और रैंप 1 का उपयोग करें।',
      'te-IN': 'సమాచారం: ఫుట్ ఓవర్‌బ్రిడ్జ్ 2 వద్ద రద్దీ ఎక్కువగా ఉంది. దయచేసి ర్యాంప్ 1 ని ఉపయోగించండి.',
      'kn-IN': 'ಮಾಹಿತಿ: ಕಾಲ್ನಡಿಗೆ ಸೇತುವೆ 2 ರಲ್ಲಿ ದಟ್ಟಣೆ ಹೆಚ್ಚಾಗಿದೆ. ದಯವಿಟ್ಟು ಉತ್ತರ ರ‍್ಯಾಂಪ್ ಬಳಸಿ.',
      'ml-IN': 'യാത്രക്കാരുടെ ശ്രദ്ധയ്ക്ക്: ഫുട്ഓവർബ്രിഡ്ജ് 2-ൽ കനത്ത തിരക്കുണ്ട്. വടക്കൻ റാംപ് ഉപയോഗിക്കുക.',
      'bn-IN': 'যাত্রীদের অনুরোধ: ফুট ওভারব্রিজে ভারী ভিড়। অনুগ্রহ করে উত্তর র‍্যাম্প ব্যবহার করুন।',
      'mr-IN': 'सूचना: फूट ओव्हरब्रिज 2 वर गर्दी आहे. कृपया उत्तर रॅम्पचा वापर करावा.',
      'gu-IN': 'સલાહ: ફૂટ ઓવરબ્રિજ 2 પર ભારે ભીડ છે. કૃપા કરીને ઉત્તર રેમ્પનો ઉપયોગ કરો.'
    }
  },
  {
    id: 'relief',
    num: 'SCENARIO 05 • RELIEF DEPLOYMENT',
    title: 'Special Clone Rake 02638 Dispatch',
    badge: 'CLONE RAKE',
    scripts: {
      en: 'Standby relief clone rake 02638 has been deployed from Golden Rock to accommodate waitlisted commuters.',
      ta: 'காத்திருப்போர் பட்டியல் பயணிகளுக்காக பொன்மலையிலிருந்து சிறப்பு மாற்று வண்டி 02638 இயக்கப்படுகிறது.',
      ta_phonetic: 'Kaathiruppor pattiyal payanigalukkaaga Ponmalaiyilirundhu sirappu maatru vandi 02638 iyakkappadugiradhu.',
      hi: 'प्रतीक्षा सूची के यात्रियों के लिए विशेष क्लोन रेक 02638 रवाना की जा रही है।'
    },
    translations: {
      'en-IN': 'Standby relief clone rake 02638 has been deployed from Golden Rock to accommodate waitlisted commuters.',
      'ta-IN': 'காத்திருப்போர் பட்டியல் பயணிகளுக்காக பொன்மலையிலிருந்து சிறப்பு மாற்று வண்டி 02638 இயக்கப்படுகிறது.',
      'hi-IN': 'प्रतीक्षा सूची के यात्रियों के लिए विशेष क्लोन रेक 02638 रवाना की जा रही है।',
      'te-IN': 'ప్రత్యేక క్లోన్ రైలు 02638 ప్రయాణికుల కోసం సిద్ధంగా ఉంది.',
      'kn-IN': 'ಹೆಚ್ಚುವರಿ ದಟ್ಟಣೆಗಾಗಿ ಪರಿಹಾರ ಕ್ಲೋನ್ ರೈಲು 02638 ಸಿದ್ಧವಾಗಿದೆ.',
      'ml-IN': 'അധിക യാത്രക്കാർക്കായി റിലീഫ് ക്ಲೋൺ ട്രെയിൻ 02638 ഒരുക്കിയിരിക്കുന്നു.',
      'bn-IN': 'অতিরিক্ত ভিড় সামলাতে ত্রাণের স্পেশাল ক্লোন ট্রেন ০২৬৩৮ প্রস্তুত রয়েছে।',
      'mr-IN': 'गर्दी नियंत्रणासाठी रिलीफ स्पेशल ट्रेन 02638 उपलब्ध आहे.',
      'gu-IN': 'વધારાની ભીડ માટે રાહત ક્લોન ટ્રેન 02638 ઉપલબ્ધ છે.'
    }
  },
  {
    id: 'departure',
    num: 'SCENARIO 06 • TRAIN DEPARTURE',
    title: '12606 Pallavan Express Departure',
    badge: 'DEPARTURE',
    scripts: {
      en: 'Train No. 12606 Pallavan Superfast Express to Chennai Egmore is ready for departure from Platform 2.',
      ta: 'வண்டி எண் 12606 பல்லவன் அதிவிரைவு வண்டி நடைமேடை 2-லிருந்து புறப்பட தயாராக உள்ளது.',
      ta_phonetic: 'Vandi enn 12606 Pallavan athiviraivu vandi nadaimedai 2-ilirundhu purappada thayaaraaga ulladhu.',
      hi: 'गाडी संख्या 12606 पल्लवन सुपरफास्ट एक्सप्रेस प्लेटफार्म नंबर 2 से प्रस्थान के लिए तैयार है।'
    },
    translations: {
      'en-IN': 'Train No. 12606 Pallavan Superfast Express to Chennai Egmore is ready for departure from Platform 2.',
      'ta-IN': 'வண்டி எண் 12606 பல்லவன் அதிவிரைவு வண்டி நடைமேடை 2-லிருந்து புறப்பட தயாராக உள்ளது.',
      'hi-IN': 'गाडी संख्या 12606 पल्लवन सुपरफास्ट एक्सप्रेस प्लेटफार्म नंबर 2 से प्रस्थान के लिए तैयार है।',
      'te-IN': 'రైలు నంబర్ 12606 పల్లవన్ ఎక్స్‌ప్రెస్ ప్లాట్‌ఫారమ్ 2 నుండి బయలుదేరడానికి సిద్ధంగా ఉంది.',
      'kn-IN': 'ರೈಲು ಸಂಖ್ಯೆ 12606 ಪಲ್ಲವನ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 2 ರಿಂದ ಹೊರಡಲು ಸಿದ್ಧವಾಗಿದೆ.',
      'ml-IN': 'ട്രെയിൻ നമ്പർ 12606 പല്ലവൻ എക്സ്പ്രസ് പ്ലാറ്റ്ഫോം 2-ൽ നിന്ന് പുറപ്പെടാൻ തയ്യാറായിരിക്കുന്നു.',
      'bn-IN': 'ট্রেন নম্বর ১২৬০৬ পল্লবন এক্সপ্রেস ২ নম্বর প্ল্যাটফর্ম থেকে ছাড়তে প্রস্তুত।',
      'mr-IN': 'गाडी क्रमांक 12606 पल्लवन एक्सप्रेस प्लॅटफॉर्म 2 वरून सुटण्यास तयार आहे.',
      'gu-IN': 'ટ્રેન નંબર 12606 પલ્લવન એક્સપ્રેસ પ્લેટફોર્મ 2 પરથી રવાના થવા માટે તૈયાર છે.'
    }
  }
];

export default function VoiceCommandPage() {
  // Station selection
  const [selectedStation, setSelectedStation] = useState('MS');

  // Audio parameters
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [speechRate, setSpeechRate] = useState(0.88);
  const [speechPitch, setSpeechPitch] = useState(1.00);
  
  // Voice Persona & Engine Selection
  // 'female' | 'male' | 'any'
  const [voiceGender, setVoiceGender] = useState('female');
  // 'cloud_hd' (default for natural Tamil & Indic) | 'browser_tts'
  const [audioMode, setAudioMode] = useState('cloud_hd');
  // Installed local voices
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [teleprompterText, setTeleprompterText] = useState(
    'Ready for transmission. Select any scenario below or initiate a tri-lingual chain broadcast.'
  );
  const [activeBadge, setActiveBadge] = useState('en-IN (English)');
  const [waveHeights, setWaveHeights] = useState([8, 18, 12, 24, 10, 20, 14, 6]);

  // Custom PA Studio
  const [customText, setCustomText] = useState('');
  const [includeChime, setIncludeChime] = useState(true);

  const waveIntervalRef = useRef(null);

  // Initialize and load system voices
  useEffect(() => {
    audioEngine.init();
    audioEngine.audioMode = audioMode;

    const refreshVoiceList = () => {
      const v = audioEngine.getAvailableVoices();
      setAvailableVoices(v || []);
    };

    refreshVoiceList();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', refreshVoiceList);
      // Fallback check after 500ms
      setTimeout(refreshVoiceList, 500);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', refreshVoiceList);
      };
    }
  }, []);

  // Sync audio engine mode whenever state changes
  useEffect(() => {
    audioEngine.audioMode = audioMode;
  }, [audioMode]);

  // Wave bar animation loop during playback
  const startWaveAnimation = () => {
    stopWaveAnimation();
    waveIntervalRef.current = setInterval(() => {
      setWaveHeights(Array.from({ length: 8 }, () => Math.floor(Math.random() * 22) + 4));
    }, 120);
  };

  const stopWaveAnimation = () => {
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
    setWaveHeights([8, 18, 12, 24, 10, 20, 14, 6]);
  };

  useEffect(() => {
    return () => {
      stopWaveAnimation();
      audioEngine.stopAllAudio();
    };
  }, []);

  // Play IR Chime Only
  const handlePlayChimeOnly = async () => {
    audioEngine.init();
    setIsPlaying(true);
    startWaveAnimation();
    setActiveBadge('4-TONE IR CHIME');
    setTeleprompterText('Synthesizing authentic 4-tone Indian Railways acoustic chime (D5-F#5-A5-D6)...');
    
    await audioEngine.playIRChime();
    
    stopWaveAnimation();
    setIsPlaying(false);
    setActiveBadge('Standby');
    setTeleprompterText('Chime transmission complete. Station audio dock nominal.');
  };

  // Stop Audio / Silence
  const handleSilence = () => {
    audioEngine.stopAllAudio();
    stopWaveAnimation();
    setIsPlaying(false);
    setActiveScenarioId(null);
    setActiveBadge('Standby');
    setTeleprompterText('Audio transmission stopped. Station PA standing by.');
  };

  // Quick Voice Preview / Test Voice
  const handleTestVoice = async () => {
    audioEngine.init();
    setIsPlaying(true);
    startWaveAnimation();
    setActiveBadge('Voice Sample Test');

    const isTa = selectedLang.startsWith('ta');
    const isHi = selectedLang.startsWith('hi');
    const sampleText = isTa
      ? 'பயணிகள் கவனத்திற்கு, இது தெற்கு இரயில்வே பயணிகள் தகவல் அறிவிப்பு.'
      : isHi
      ? 'यात्रीगण कृपया ध्यान दें, यह भारतीय रेल यात्री सूचना प्रणाली है।'
      : 'Attention please, this is the RailFlow high-fidelity passenger announcement system.';
    const samplePhonetic = isTa
      ? 'Payanigal kavanathirku, idhu Therkku Railway payanigal thagaval arivippu.'
      : null;

    setTeleprompterText(`[Testing ${voiceGender === 'female' ? 'Female PIS' : 'Male PA'} Voice]: "${sampleText}"`);

    await audioEngine.playIRChime();
    await new Promise(r => setTimeout(r, 200));

    await audioEngine.speakAnnouncement(
      sampleText,
      selectedLang,
      speechRate,
      speechPitch,
      null,
      null,
      voiceGender,
      selectedVoiceName,
      samplePhonetic
    );

    stopWaveAnimation();
    setIsPlaying(false);
    setActiveBadge('Standby');
    setTeleprompterText('Voice sample test complete. Vocal engine nominal.');
  };

  // Play Single Language Scenario
  const handlePlaySingle = async (scenario) => {
    audioEngine.init();
    setIsPlaying(true);
    setActiveScenarioId(scenario.id);
    
    const langObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    const script = scenario.translations[selectedLang] || scenario.translations['en-IN'];
    const phoneticFallback = (selectedLang.startsWith('ta') && scenario.scripts.ta_phonetic)
      ? scenario.scripts.ta_phonetic
      : null;
    
    setActiveBadge(langObj.label.split('—')[0].trim());
    setTeleprompterText(script);
    startWaveAnimation();

    // 1. Play genuine 4-tone chime
    await audioEngine.playIRChime();
    await new Promise(r => setTimeout(r, 200));

    // 2. Speak announcement with priority female voice & Tamil support
    await audioEngine.speakAnnouncement(
      script,
      selectedLang,
      speechRate,
      speechPitch,
      null,
      null,
      voiceGender,
      selectedVoiceName,
      phoneticFallback
    );

    stopWaveAnimation();
    setIsPlaying(false);
    setActiveScenarioId(null);
    setActiveBadge('Standby');
    setTeleprompterText(`Completed broadcast for ${scenario.title}.`);
  };

  // Play Chain Tri-lingual (EN ➔ TA ➔ HI)
  const handlePlayChain = async (scenario) => {
    audioEngine.init();
    setIsPlaying(true);
    setActiveScenarioId(scenario.id);

    const chain = [
      {
        lang: 'en-IN',
        label: '1️⃣ English (en-IN)',
        text: scenario.translations['en-IN'],
        phonetic: null
      },
      {
        lang: 'ta-IN',
        label: '2️⃣ Tamil (தமிழ் - ta-IN)',
        text: scenario.translations['ta-IN'],
        phonetic: scenario.scripts.ta_phonetic
      },
      {
        lang: 'hi-IN',
        label: '3️⃣ Hindi (हिन्दी - hi-IN)',
        text: scenario.translations['hi-IN'],
        phonetic: null
      }
    ];

    for (let i = 0; i < chain.length; i++) {
      const step = chain[i];
      setActiveBadge(`[${i + 1}/3] ${step.label}`);
      setTeleprompterText(`[Step ${i + 1} of 3]: "${step.text}"`);
      startWaveAnimation();

      await audioEngine.playIRChime();
      await new Promise(r => setTimeout(r, 200));
      
      await audioEngine.speakAnnouncement(
        step.text,
        step.lang,
        speechRate,
        speechPitch,
        null,
        null,
        voiceGender,
        selectedVoiceName,
        step.phonetic
      );
      
      await new Promise(r => setTimeout(r, 400));
    }

    stopWaveAnimation();
    setIsPlaying(false);
    setActiveScenarioId(null);
    setActiveBadge('Standby (Tri-Lingual)');
    setTeleprompterText(`Completed tri-lingual chain announcement for ${scenario.title}. All tracks nominal.`);
  };

  // Broadcast Custom Studio Script
  const handleBroadcastCustom = async () => {
    const text = customText.trim();
    if (!text) return;

    audioEngine.init();
    setIsPlaying(true);
    startWaveAnimation();
    
    const langObj = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
    setActiveBadge(`Custom: ${langObj.short}`);
    setTeleprompterText(text);

    if (includeChime) {
      await audioEngine.playIRChime();
      await new Promise(r => setTimeout(r, 200));
    }

    await audioEngine.speakAnnouncement(
      text,
      selectedLang,
      speechRate,
      speechPitch,
      null,
      null,
      voiceGender,
      selectedVoiceName,
      null
    );

    stopWaveAnimation();
    setIsPlaying(false);
    setActiveBadge('Standby');
  };

  const activeStn = STATIONS[selectedStation] || STATIONS.MS;

  // Filter installed voices matching the gender preference
  const femaleVoices = availableVoices.filter(v => v.gender === 'female');
  const maleVoices = availableVoices.filter(v => v.gender === 'male');

  return (
    <div className="rf-view-container space-y-6">
      {/* View Header */}
      <div className="rf-page-header space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SYSTEM 02.5 // VOICE &amp; AUDIO DISPATCH COMMANDER
          </span>
          <span className="text-xs text-slate-500 font-mono">• MULTI-LINGUAL ACOUSTIC SYNTHESIS • STATION PA SYSTEM</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <span>🎙️</span>
          <span>RailFlow Central Voice Commander &amp; Audio Dispatcher</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-4xl leading-relaxed">
          High-fidelity multi-lingual acoustic passenger information system (PIS) with genuine 4-tone Indian Railways chimes, strict language priority (English ➔ Tamil ➔ Hindi ➔ Regional), station location filtering, dynamic voice modulation, and live wave telemetry.
        </p>
      </div>

      {/* Priority Tags Row */}
      <div className="flex flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-semibold">
          PRIORITY 1: ENGLISH
        </span>
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-semibold">
          PRIORITY 2: TAMIL (தமிழ்)
        </span>
        <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-semibold">
          PRIORITY 3: HINDI (हिन्दी)
        </span>
        <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded font-semibold">
          8+ REGIONAL LANGUAGES
        </span>
        <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded font-semibold">
          4-TONE IR CHIME
        </span>
      </div>

      {/* Master Control Deck & Audio Dock */}
      <div className="rf-card p-6 space-y-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            BROADCAST STATION LOCATION &amp; AUDIO DOCK
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <span>📢</span>
            <span>{activeStn.name} ({activeStn.code}) • {activeStn.zone} Zone • {activeStn.pf} Platforms • {activeStn.desc}</span>
          </h2>
        </div>

        {/* 10 Station Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {Object.values(STATIONS).map(stn => (
            <button
              key={stn.code}
              onClick={() => setSelectedStation(stn.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedStation === stn.code
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {stn.icon} {stn.code} ({stn.name.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* Dedicated Voice Persona, Detected Voices & Audio Engine Console */}
        <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl space-y-4 shadow-lg shadow-emerald-500/5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">🎙️</span>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Voice Announcer &amp; Audio Engine Settings
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {voiceGender === 'female' ? '👩 FEMALE PIS PRIORITY' : voiceGender === 'male' ? '👨 MALE PA PRIORITY' : '✨ AUTO SELECT'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Full support for authentic Tamil (தமிழ்), Hindi, and English broadcasts with Indian Railways 4-tone acoustic chimes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestVoice}
                disabled={isPlaying}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                <span>🔊</span>
                <span>Test Voice Sample</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Persona Gender Toggle */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                1. Vocal Persona / Voice Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'female', label: '👩 Female', desc: 'Standard IR PIS' },
                  { id: 'male',   label: '👨 Male',   desc: 'Station PA' },
                  { id: 'any',    label: '✨ Auto',   desc: 'System Match' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVoiceGender(item.id);
                      if (item.id === 'female' && femaleVoices.length > 0) {
                        setSelectedVoiceName(femaleVoices[0].name);
                      } else if (item.id === 'male' && maleVoices.length > 0) {
                        setSelectedVoiceName(maleVoices[0].name);
                      }
                    }}
                    className={`p-2.5 rounded-lg text-left transition-all border ${
                      voiceGender === item.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 ring-1 ring-emerald-500/30 font-bold'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-mono">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Engine Mode */}
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">
                2. Indic Speech Engine Mode
              </label>
              <select
                value={audioMode}
                onChange={(e) => setAudioMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="cloud_hd">
                  🌐 RailFlow Cloud HD (Native Tamil / Indic Speech)
                </option>
                <option value="browser_tts">
                  💻 Device Web Speech API (Local Hardware Voices)
                </option>
              </select>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {audioMode === 'cloud_hd'
                  ? '✨ Fluent native Tamil & Indic pronunciation on all devices and browsers.'
                  : '⚡ Hardware speech synthesis using local OS voices.'}
              </p>
            </div>

            {/* Detected System Voices Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-300">
                  3. Detected System Voices ({availableVoices.length})
                </label>
                {voiceGender === 'female' && (
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    👩 Female Active
                  </span>
                )}
              </div>
              <select
                value={selectedVoiceName}
                onChange={(e) => setSelectedVoiceName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="">
                  {voiceGender === 'female'
                    ? '✨ Auto: Female PIS Announcer (Zira/Heera/Cloud HD)'
                    : voiceGender === 'male'
                    ? '✨ Auto: Male Station PA (David/Ravi)'
                    : '✨ Auto: Best Matching Voice'}
                </option>
                {availableVoices.map((v, i) => (
                  <option key={`${v.name}-${i}`} value={v.name}>
                    {v.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                {selectedVoiceName ? `Selected: ${selectedVoiceName}` : 'Default: RailFlow IR Female Announcer'}
              </p>
            </div>
          </div>
        </div>

        {/* Audio Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              Primary Language Preference
            </label>
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                const l = LANGUAGES.find(x => x.code === e.target.value);
                setActiveBadge(l ? l.label.split('—')[0].trim() : e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Speech Rate / Cadence</span>
              <span className="text-emerald-400 font-bold">{speechRate}x (IR Standard)</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.30"
              step="0.02"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>Vocal Pitch Modulation</span>
              <span className="text-cyan-400 font-bold">{speechPitch.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="1.30"
              step="0.05"
              value={speechPitch}
              onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Acoustic Filter & Chime Control Buttons */}
        <div className="pt-3 border-t border-slate-800">
          <label className="text-xs font-mono text-slate-400 block mb-2">
            Acoustic Filter &amp; Chime Control
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePlayChimeOnly}
              disabled={isPlaying}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-medium transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              🔔 Chime Only
            </button>
            <button
              onClick={handleSilence}
              className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5"
            >
              ⏹️ Silence / Stop
            </button>
            <button
              onClick={handleTestVoice}
              disabled={isPlaying}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              🔊 Test Active Voice
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Persona:</span>
              <span className="text-emerald-400 font-bold">
                {voiceGender === 'female' ? '👩 Female PIS' : voiceGender === 'male' ? '👨 Male PA' : '✨ Auto'}
              </span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{LANGUAGES.find(l => l.code === selectedLang)?.short || 'EN'}</span>
              <span>•</span>
              <span className="text-purple-400">{audioMode === 'cloud_hd' ? 'Cloud HD' : 'Local TTS'}</span>
            </div>
          </div>
        </div>

        {/* Live Broadcast Teleprompter & Wave Telemetry */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold tracking-wider">ACOUSTIC PIS FEED // LIVE BROADCAST TELEPROMPTER</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[11px]">
              {activeBadge}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dynamic Waveform Telemetry Bars */}
            <div className="flex items-end gap-1 h-8 px-2 bg-slate-900 border border-slate-800 rounded">
              {waveHeights.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}px` }}
                  className={`w-1 rounded-sm transition-all duration-100 ${
                    isPlaying ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Teleprompter text ticker */}
            <div className="flex-1 font-mono text-sm text-slate-200">
              {teleprompterText}
            </div>
          </div>
        </div>
      </div>

      {/* 6 Pre-Configured Operational Scenarios */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          OPERATIONAL PIS SCENARIOS — LIVE DISPATCH SCRIPTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENARIOS.map(sc => (
            <div
              key={sc.id}
              className={`rf-card p-5 space-y-4 flex flex-col justify-between transition-all ${
                activeScenarioId === sc.id
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-slate-900/90'
                  : 'hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    {sc.num}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    {sc.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">
                  {sc.title}
                </h4>

                <div className="space-y-2 text-xs text-slate-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <p><strong className="text-emerald-400">EN:</strong> "{sc.scripts.en}"</p>
                  <p><strong className="text-amber-400">TA:</strong> "{sc.scripts.ta}"</p>
                  <p><strong className="text-cyan-400">HI:</strong> "{sc.scripts.hi}"</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handlePlaySingle(sc)}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  ▶️ Play Selected Lang
                </button>
                <button
                  onClick={() => handlePlayChain(sc)}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  🔄 Chain: EN ➔ TA ➔ HI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Station Public Address Studio */}
      <div className="rf-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎙️</span>
            <h3 className="text-base font-bold text-white">
              Custom Station Public Address Studio
            </h3>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-xs font-mono font-bold">
            LIVE SPEECH SYNTHESIS
          </span>
        </div>

        <div className="space-y-3">
          <textarea
            rows="2"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter custom passenger announcement in English or Tamil (e.g., வண்டி எண் 12638...) to synthesize and broadcast across station speakers..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeChime}
                onChange={(e) => setIncludeChime(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span>Include 4-Tone Chime:</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setCustomText('வண்டி எண் 12638 பாண்டியன் அதிவிரைவு வண்டி நடைமேடை 1-ல் வந்து கொண்டிருக்கிறது.')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-all"
              >
                Sample (Tamil)
              </button>
              <button
                onClick={() => setCustomText('Attention please. Special holiday express from Chennai Central to Madurai will depart at 22:30 hours from Platform 5.')}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-all"
              >
                Sample (English)
              </button>
              <button
                onClick={handleBroadcastCustom}
                disabled={isPlaying || !customText.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                🎙️ Broadcast Announcement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div>
          <span>📢 <strong>Multi-Lingual Station PA Audio Engine</strong>: </span>
          <span>Synthesizes authentic Indian Railways 4-tone acoustic chimes (D5-F#5-A5-D6) with Web Audio API bandpass filtering (1800Hz, Q=1.2) and multi-lingual voice modulation across English, Tamil, Hindi, and regional languages.</span>
        </div>
        <div className="whitespace-nowrap text-slate-500">
          © 2026 AKNEX. All rights reserved. • Java 17+ LTS • SQLite WAL
        </div>
      </div>
    </div>
  );
}
