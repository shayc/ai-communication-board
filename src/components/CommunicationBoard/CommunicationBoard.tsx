import { useSpeech } from "../../providers/SpeechProvider/SpeechProvider";
import classes from "./CommunicationBoard.module.css";
import { Grid } from "./Grid/Grid";
import { useGrid } from "./Grid/useGrid";
import { NavigationBar } from "./NavigationBar/NavigationBar";
import { useNavigation } from "./NavigationBar/useNavigation";
import { SentenceBar } from "./SentenceBar/SentenceBar";
import { useSentence } from "./SentenceBar/useSentence";
import { Tile } from "./Tile/Tile";
import type { BoardButton } from "./types";
import { useCommunicationBoard } from "./useCommunicationBoard";

export function CommunicationBoard() {
  const speech = useSpeech();
  const board = useCommunicationBoard();
  const navigation = useNavigation();
  const sentence = useSentence();
  const grid = useGrid(board.buttons, board.grid);

  return (
    <div className={classes.root}>
      <SentenceBar
        words={sentence.words}
        onClearClick={() => sentence.clear()}
        onBackspaceClick={() => sentence.removeLastWord()}
      />

      <NavigationBar
        title={board.name}
        onBackClick={() => navigation.goBack()}
        onHomeClick={() => navigation.goHome()}
      />

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
