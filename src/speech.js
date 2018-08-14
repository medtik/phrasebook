/* eslint-disable no-console,no-plusplus */
let synth;
let voice;

let status = false;

// https://stackoverflow.com/q/21513706
let attempts = 0;
function loadVoices() {
  attempts++;
  const voices = synth.getVoices();
  if (voices.length) {
    voice = voices.find(_voice => /ja[-_]JP/.test(_voice.lang));
  }
  if (!voice) {
    if (attempts < 10) {
      console.log('`ja-JP` voice not found, retry in 100 ms...');
      setTimeout(() => {
        loadVoices();
      }, 250);
    } else {
      console.error('`ja-JP` voice not found.');
    }
  }
}

if ('speechSynthesis' in window) {
  synth = window.speechSynthesis;
  loadVoices();
}

function toggle(value) {
  status = value;
}

function speak(text) {
  if (!status) {
    return;
  }
  if (!synth || synth.speaking) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.addEventListener('error', error => console.error(error));
  utterance.lang = 'ja-JP';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.voice = voice;
  utterance.volume = 1;
  synth.speak(utterance);
}

export default {
  toggle,
  speak,
};