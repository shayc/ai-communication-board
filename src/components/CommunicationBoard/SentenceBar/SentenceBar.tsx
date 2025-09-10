import classes from "./SentenceBar.module.css";

interface Word {
  id: string;
  label: string;
}

export interface SentenceBarProps {
  words: Word[];
  onClearClick: () => void;
  onSpeakClick: () => void;
}

export function SentenceBar(props: SentenceBarProps) {
  const { words, onClearClick, onSpeakClick } = props;
  const hasWords = words.length > 0;

  return (
    <div className={classes.root}>
      <div className={classes.sentence}>
        {words.map((word) => (
          <span key={word.id}>{word.label}</span>
        ))}
      </div>

      <div className={classes.actions}>
        {hasWords && <button onClick={onClearClick}>Clear</button>}

        <button onClick={onSpeakClick} disabled={!hasWords}>
          Speak
        </button>
      </div>
    </div>
  );
}
