import { useSpeech } from "../../providers/SpeechProvider/SpeechProvider";
import classes from "./CommunicationBoard.module.css";
import { Grid } from "./Grid/Grid";
import { useGrid } from "./Grid/useGrid";
import { SentenceBar } from "./SentenceBar/SentenceBar";
import { useSentence } from "./SentenceBar/useSentence";
import { SuggestionBar } from "./SuggestionBar/SuggestionBar";
import { Tile } from "./Tile/Tile";
import type { BoardButton } from "./types";
import { useCommunicationBoard } from "./useCommunicationBoard";

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
