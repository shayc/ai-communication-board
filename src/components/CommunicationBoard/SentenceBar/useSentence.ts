import { useState } from "react";

interface SentenceContent {
  id: string;
  label: string;
  image?: string;
  vocalization?: string;
}

export function useSentence() {
  const [sentence, setSentence] = useState<SentenceContent[]>([]);

  const addContent = (content: SentenceContent) => {
    setSentence((prev) => [...prev, content]);
  };

  const clearSentence = () => {
    setSentence([]);
  };

  return {
    sentence,
    addContent,
    clearSentence,
  };
}
