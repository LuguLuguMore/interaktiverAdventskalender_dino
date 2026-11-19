/**
 * Vorlese-Modul (Web Speech API) für deutsche Geschichten
 */
window.StoryReader = (function () {
  let currentUtterance = null;
  let isSpeaking = false;
  let isPaused = false;
  let onStateChange = null;
  let selectedVoice = null;

  function pickGermanVoice() {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer natural / Google / Microsoft German voices
    const germanVoices = voices.filter((v) =>
      v.lang && v.lang.toLowerCase().startsWith("de")
    );
    if (germanVoices.length === 0) return null;

    const preferred =
      germanVoices.find((v) => /google|natural|anna|katja|hedda|vicki/i.test(v.name)) ||
      germanVoices[0];
    selectedVoice = preferred;
    return preferred;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = pickGermanVoice;
    pickGermanVoice();
  }

  function notify(state) {
    if (typeof onStateChange === "function") {
      onStateChange(state);
    }
  }

  function speak(text, rate = 0.95, callback = null) {
    if (!("speechSynthesis" in window)) {
      alert("Dein Browser unterstützt leider keine Sprachausgabe (Vorlesen).");
      return;
    }

    stop();
    onStateChange = callback;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = selectedVoice || pickGermanVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = (voice && voice.lang) || "de-DE";
    utterance.rate = rate;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      isSpeaking = true;
      isPaused = false;
      notify("playing");
    };
    utterance.onpause = () => {
      isPaused = true;
      notify("paused");
    };
    utterance.onresume = () => {
      isPaused = false;
      notify("playing");
    };
    utterance.onend = () => {
      isSpeaking = false;
      isPaused = false;
      currentUtterance = null;
      notify("idle");
    };
    utterance.onerror = () => {
      isSpeaking = false;
      isPaused = false;
      currentUtterance = null;
      notify("idle");
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function togglePause() {
    if (!("speechSynthesis" in window) || !isSpeaking) return;
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.pause();
    }
  }

  function stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
    isPaused = false;
    currentUtterance = null;
    notify("idle");
  }

  return {
    speak,
    togglePause,
    stop,
    getState: () => (isSpeaking ? (isPaused ? "paused" : "playing") : "idle"),
    isSupported: () => "speechSynthesis" in window
  };
})();
