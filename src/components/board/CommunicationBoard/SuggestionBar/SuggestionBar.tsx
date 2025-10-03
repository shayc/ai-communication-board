import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import classes from "./SuggestionBar.module.css";
import Box from "@mui/material/Box";

export function SuggestionBar() {
  return (
    <div className={classes.root}>
      <Chip
        label="I'm hungry, I'd like a sandwich"
        onClick={() => alert("I'm hungry, I'd like a sandwich")}
      />
      <Chip
        label="I'm hungry, I'd like a salad"
        onClick={() => alert("I'm hungry, I'd like a salad")}
      />

      <Box sx={{ ml: "auto" }}>
        <IconButton color="primary" aria-label="Satisfied tone">
          <SentimentSatisfiedAltIcon />
        </IconButton>

        <IconButton color="primary" aria-label="Dissatisfied tone">
          <SentimentVeryDissatisfiedIcon />
        </IconButton>
      </Box>
    </div>
  );
}
