import { useEffect, useState } from "react";

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find((v) => v.voiceURI === voiceURI);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const getVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
  };

  useEffect(() => {
    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;
  }, []);

  return {
    voices,
    voiceURI,
    setVoiceURI,
    pitch,
    setPitch,
    rate,
    setRate,
    volume,
    setVolume,
    speak,
  };
}
