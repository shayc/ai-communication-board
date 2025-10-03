import { useSpeech } from "../../providers/SpeechProvider/SpeechProvider";
import classes from "./CommunicationBoard.module.css";
import { Grid } from "./Grid/Grid";
import { useCommunicationBoard } from "./hooks/useCommunicationBoard";
import { useGrid } from "./hooks/useGrid";
import { useSentence } from "./hooks/useSentence";
import { SentenceBar } from "./SentenceBar/SentenceBar";
import { SuggestionBar } from "./SuggestionBar/SuggestionBar";
import { Tile } from "./Tile/Tile";
import type { BoardButton } from "./types";

export function CommunicationBoard() {
  const speech = useSpeech();
  const board = useCommunicationBoard();
  const sentence = useSentence();
  const grid = useGrid(board.buttons, board.grid);

  return (
    <div className={classes.root}>
      <SentenceBar
        words={sentence.words}
        onClearClick={() => sentence.clear()}
        onBackspaceClick={() => sentence.removeLastWord()}
      />

      <SuggestionBar />

      <Grid<BoardButton>
        grid={grid.grid}
        renderCell={(button) => (
          <Tile
            label={button.label}
            onClick={() => {
              const hasActions =
                button.action || (button.actions && button.actions.length > 0);

              if (hasActions) {
                return;
              }

              sentence.addWord(button);
              speech.speak(button.vocalization || button.label);
            }}
          />
        )}
      />
    </div>
  );
}
