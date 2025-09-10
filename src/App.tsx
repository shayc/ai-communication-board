import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";

export function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-label="Menu"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Communication Board
          </Typography>
        </Toolbar>
      </AppBar>

      <CommunicationBoard />
    </>
  );
}
