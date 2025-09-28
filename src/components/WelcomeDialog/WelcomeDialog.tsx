import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function WelcomeDialog() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Communication Board
      </Typography>

      <Typography variant="h6" gutterBottom>
        Turn symbols into speech, naturally with built-in AI.
      </Typography>

      <ul>
        <li>Smart suggestions as you build messages</li>
        <li>Translate and speak instantly</li>
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
