import { useSpeech } from "../../hooks/useSpeech";
import classes from "./CommunicationBoard.module.css";
import { Grid } from "./Grid/Grid";
import { useGrid } from "./Grid/useGrid";
import { NavigationBar } from "./NavigationBar/NavigationBar";
import { useNavigation } from "./NavigationBar/useNavigation";
import { SentenceBar } from "./SentenceBar/SentenceBar";
import { useSentence } from "./SentenceBar/useSentence";
import { Tile } from "./Tile/Tile";
import type { Button } from "./types";
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
        words={sentence.sentence}
        onClearClick={() => sentence.clearSentence()}
        onSpeakClick={() =>
          speech.speak(sentence.sentence.map((word) => word.label).join(" "))
        }
      />

      <NavigationBar
        title={board.name}
        onBackClick={() => navigation.goBack()}
        onHomeClick={() => navigation.goHome()}
      />

      <Grid<Button>
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

              sentence.addContent(button);
              speech.speak(button.vocalization || button.label);
            }}
          />
        )}
      />
    </div>
  );
}
