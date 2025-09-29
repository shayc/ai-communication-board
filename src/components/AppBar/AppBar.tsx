import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { default as MUIAppBar } from "@mui/material/AppBar";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
interface AppBarProps {
  setIsDrawerOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
}

export function AppBar({ setIsDrawerOpen, setIsSettingsOpen }: AppBarProps) {
  return (
    <MUIAppBar position="static">
      <Toolbar>
        <IconButton
          aria-label="Menu"
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <Select
            value={"AI Communication Board"}
            onChange={() => {}}
            displayEmpty
          >
            <MenuItem value={"AI Communication Board"}>
              AI Communication Board
            </MenuItem>
            <MenuItem value={"Core 24"}>Core 24</MenuItem>
            <MenuItem value={"Core 60"}>Core 60</MenuItem>
          </Select>
        </FormControl>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>

        <IconButton
          aria-label="GitHub"
          size="large"
          color="inherit"
          href="https://github.com/shayc/ai-communication-board"
        >
          <GitHubIcon />
        </IconButton>

        <IconButton
          aria-label="Settings"
          size="large"
          edge="end"
          color="inherit"
          onClick={() => setIsSettingsOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </MUIAppBar>
  );
}
