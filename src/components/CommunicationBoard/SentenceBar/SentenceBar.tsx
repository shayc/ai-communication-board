import BackspaceIcon from "@mui/icons-material/Backspace";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import classes from "./SentenceBar.module.css";
import { Pictogram } from "../Pictogram/Pictogram";

interface Word {
  id: string;
  label: string;
}

export interface SentenceBarProps {
  words: Word[];
  onClearClick: () => void;
  onBackspaceClick: () => void;
}

export function SentenceBar(props: SentenceBarProps) {
  const { words, onClearClick, onBackspaceClick } = props;
  const hasWords = words.length > 0;

  return (
    <div className={classes.root}>
      <div className={classes.sentence}>
        {words.map((word) => (
          <Pictogram key={word.id} label={word.label} />
        ))}
      </div>

      <div className={classes.actions}>
        {hasWords && (
          <IconButton
            aria-label="Clear"
            size="large"
            color="inherit"
            onClick={onClearClick}
          >
            <ClearIcon />
          </IconButton>
        )}

        <IconButton
          aria-label="Backspace"
          size="large"
          color="inherit"
          onClick={onBackspaceClick}
        >
          <BackspaceIcon />
        </IconButton>
      </div>
    </div>
  );
}
