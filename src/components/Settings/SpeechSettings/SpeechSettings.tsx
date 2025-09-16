import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useSpeech } from "../../../providers/SpeechProvider/SpeechProvider";

export function SpeechSettings() {
  const {
    voices,
    voiceURI,
    setVoiceURI,
    pitch,
    setPitch,
    rate,
    setRate,
    volume,
    setVolume,
    isSupported,
  } = useSpeech();

  if (!isSupported) {
    return (
      <Typography color="error">
        Speech synthesis is not supported in this browser
      </Typography>
    );
  }

  return (
    <div>
      <Typography gutterBottom>Voice</Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Voice</InputLabel>
        <Select
          label="Voice"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={voiceURI}
          onChange={(event) => setVoiceURI(event.target.value)}
        >
          {voices.map((voice) => (
            <MenuItem key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom>Pitch</Typography>
      <Slider
        aria-label="Pitch"
        value={pitch}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(_event, value) => setPitch(value)}
      />

      <Typography gutterBottom>Rate</Typography>
      <Slider
        aria-label="Rate"
        value={rate}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(_event, value) => setRate(value)}
      />

      <Typography gutterBottom>Volume</Typography>
      <Slider
        aria-label="Volume"
        value={volume}
        min={0}
        max={1}
        step={0.1}
        onChange={(_event, value) => setVolume(value)}
      />
    </div>
  );
}
