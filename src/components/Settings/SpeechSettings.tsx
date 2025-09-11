import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useSpeechSynthesis } from "../../providers/SpeechProvider/useSpeechSynthesis";

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
  } = useSpeechSynthesis();

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
        min={0}
        max={1}
        step={0.1}
        onChange={(_event, newValue) => setPitch(newValue)}
      />

      <Typography gutterBottom>Rate</Typography>
      <Slider
        aria-label="Rate"
        value={rate}
        min={0}
        max={1}
        step={0.1}
        onChange={(_event, newValue) => setRate(newValue)}
      />

      <Typography gutterBottom>Volume</Typography>
      <Slider
        aria-label="Volume"
        value={volume}
        min={0}
        max={1}
        step={0.1}
        onChange={(_event, newValue) => setVolume(newValue)}
      />
    </div>
  );
}
