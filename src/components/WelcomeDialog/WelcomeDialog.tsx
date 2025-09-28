import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export function WelcomeDialog() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Communication Board
      </Typography>

      <Typography variant="body1" gutterBottom>
        A new way to turn symbols into speech.
      </Typography>

      <ul>
        <li>Smart suggestions powered by built-in AI</li>
        <li>Translate and speak across languages</li>
        <li>Works offline and keeps your data private</li>
      </ul>

      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </div>
  );
}
