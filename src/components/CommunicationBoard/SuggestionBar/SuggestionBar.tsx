import { ToneSelect } from "@/components/common/ToneSelect/ToneSelect";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import classes from "./SuggestionBar.module.css";

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

      <Box sx={{ marginInlineStart: "auto" }}>
        <ToneSelect />
      </Box>
    </div>
  );
}
