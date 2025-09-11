import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";
import { Settings } from "./components/Settings/Settings";

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Communication Board
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Settings />
      </Drawer>

      <CommunicationBoard />
    </>
  );
}
