import classes from "./NavigationBar.module.css";

export interface NavigationBarProps {
  title: string;
  onBackClick: () => void;
  onHomeClick: () => void;
}

export function NavigationBar({ title, onBackClick, onHomeClick }: NavigationBarProps) {
  return (
    <div className={classes.root}>
      <button onClick={onBackClick}>← Back</button>
      <button onClick={onHomeClick}>Home</button>
      <span>{title}</span>
    </div>
  );
}
