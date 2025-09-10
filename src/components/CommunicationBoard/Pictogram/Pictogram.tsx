import classes from "./Pictogram.module.css";

export interface PictogramProps {
  src?: string;
  label?: string;
}

export function Pictogram(props: PictogramProps) {
  const { src, label } = props;

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        {src && <img className={classes.image} src={src} alt="" />}
      </div>
      {label && <div className={classes.label}>{label}</div>}
    </div>
  );
}
