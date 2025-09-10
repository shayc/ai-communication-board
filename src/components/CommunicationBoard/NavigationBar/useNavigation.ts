import { useState } from "react";

interface HistoryEntry {
  id: string;
  title: string;
}

export function useNavigation() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [position, setPosition] = useState(0);
  const currentBoard = history[position];

  const canGoBack = position > 0;
  const canGoForward = position < history.length - 1;

  const addToHistory = (entry: HistoryEntry) => {
    setHistory((prev) => [...prev, entry]);
    setPosition((prev) => prev + 1);
  };

  const goBack = () => {
    if (!canGoBack) {
      return;
    }

    setPosition((prev) => prev - 1);
  };

  const goForward = () => {
    if (!canGoForward) {
      return;
    }

    setPosition((prev) => prev + 1);
  };

  const goHome = () => {
    setPosition(0);
  };

  return {
    addToHistory,
    currentBoard,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    goHome,
  };
}
