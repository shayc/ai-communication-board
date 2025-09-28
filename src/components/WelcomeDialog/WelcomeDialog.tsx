import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function WelcomeDialog() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Communication Board
      </Typography>

      <Typography variant="body1" gutterBottom>
        A new way to turn symbols into speech, powered by built-in AI.
      </Typography>

      <ul>
        <li>Smart suggestions as you build messages</li>
        <li>Speak and translate instantly</li>
        <li>
          Works offline, private by design<sup>1</sup>
        </li>
      </ul>

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        gutterBottom
      >
        <sup>1</sup> Supports Open Board Format
      </Typography>

      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </div>
  );
}
