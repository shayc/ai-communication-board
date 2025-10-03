import { useState } from "react";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";
import { AppBar } from "./components/layout/AppBar/AppBar";
import { NavigationDrawer } from "./components/layout/NavigationDrawer/NavigationDrawer";
import { SettingsDrawer } from "./components/layout/SettingsDrawer/SettingsDrawer";
import { WelcomeDialog } from "./components/layout/WelcomeDialog/WelcomeDialog";

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);

  return (
    <>
      <AppBar
        setIsDrawerOpen={setIsDrawerOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <NavigationDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <SettingsDrawer
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <CommunicationBoard />

      <WelcomeDialog
        open={isWelcomeDialogOpen}
        onClose={() => setIsWelcomeDialogOpen(false)}
      />
    </>
  );
}
