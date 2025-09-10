import { useState } from "react";

interface SentenceContent {
  id: string;
  label: string;
  image?: string;
  vocalization?: string;
}

export function useSentence() {
  const [words, setWords] = useState<SentenceContent[]>([]);

  const addWord = (content: SentenceContent) => {
    setWords((prev) => [...prev, content]);
  };

  const clear = () => {
    setWords([]);
  };

  const removeLastWord = () => {
    setWords((prev) => prev.slice(0, -1));
  };

  return {
    words,
    addWord,
    clear,
    removeLastWord,
  };
}
