import { useSpeechSynthesis } from "./useSpeechSynthesis";

export function SpeechProvider({ children }: any) {
  const speech = useSpeechSynthesis();

  return (
    <SpeechContext.Provider value={speech}>{children}</SpeechContext.Provider>
  );
}

export function useSpeechContext() {
  return useContext(SpeechContext);
}
