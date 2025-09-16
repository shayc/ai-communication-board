import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";
import { FileImportButton } from "./components/FileImportButton/FileImportButton";
import { Settings } from "./components/Settings/Settings";
import { useLanguageDetector } from "./hooks/ai/useLanguageDetector";

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const { isSupported, progress, ensureReady, detect } = useLanguageDetector();

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
      </AppBar>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <div>
          <FileImportButton />
        </div>
        <dl>
          <dt>LanguageDetector API</dt>
          <dd>{isSupported ? "Supported" : "Not supported"}</dd>
        </dl>
        <p>Model load progress: {progress}%</p>
        <button onClick={() => ensureReady()}>Ensure ready</button>
        <textarea
          placeholder="Type or paste text here"
          onChange={async (e) => {
            const lang = await detect(e.target.value);
            setLanguage(lang?.language || "");
          }}
        ></textarea>
        <p>Detected language: {language}</p>
      </Drawer>

      <Drawer
        anchor="right"
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      >
        <Settings />
      </Drawer>

      <CommunicationBoard />
    </>
  );
}
