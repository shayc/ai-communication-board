import { Pictogram } from "../Pictogram/Pictogram";
import classes from "./Tile.module.css";

export interface TileProps {
  label?: string;
  imageSrc?: string;
  backgroundColor?: string;
  borderColor?: string;
  disabled?: boolean;
  onClick: () => void;
}

export function Tile(props: TileProps) {
  const { label, imageSrc, backgroundColor, borderColor, disabled, onClick } =
    props;

  return (
    <button
      className={classes.root}
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ backgroundColor, borderColor }}
    >
      <Pictogram label={label} src={imageSrc} />
    </button>
  );
}
