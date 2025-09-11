import { createContext, useContext, type ReactNode } from "react";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

export interface SpeechContextType {
  voices: SpeechSynthesisVoice[];
  voiceURI: string;
  setVoiceURI: (voiceURI: string) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  rate: number;
  setRate: (rate: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  speak: (text: string) => void;
  cancel: () => void;
  isSupported: boolean;
}

export interface SpeechProviderProps {
  children: ReactNode;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export function SpeechProvider({ children }: SpeechProviderProps) {
  const speech = useSpeechSynthesis();

  return (
    <SpeechContext.Provider value={speech}>{children}</SpeechContext.Provider>
  );
}

export function useSpeech(): SpeechContextType {
  const context = useContext(SpeechContext);

  if (context === undefined) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }

  return context;
}
