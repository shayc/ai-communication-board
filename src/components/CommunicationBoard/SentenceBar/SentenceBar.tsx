import BackspaceIcon from "@mui/icons-material/Backspace";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { Pictogram } from "../Pictogram/Pictogram";
import classes from "./SentenceBar.module.css";

interface Word {
  id: string;
  label: string;
  image?: string;
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
        {words.map((word, index) => (
          <Pictogram key={index} label={word.label} src={word.image} />
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
