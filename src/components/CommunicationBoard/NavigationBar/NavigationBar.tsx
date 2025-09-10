import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import classes from "./NavigationBar.module.css";

export interface NavigationBarProps {
  title: string;
  onBackClick: () => void;
  onHomeClick: () => void;
}

export function NavigationBar({
  title,
  onBackClick,
  onHomeClick,
}: NavigationBarProps) {
  return (
    <div className={classes.root}>
      <IconButton aria-label="Back" size="large" onClick={onBackClick}>
        <ArrowBackIcon />
      </IconButton>

      <IconButton aria-label="Home" size="large" onClick={onHomeClick}>
        <HomeIcon />
      </IconButton>

      <span>{title}</span>
    </div>
  );
}
