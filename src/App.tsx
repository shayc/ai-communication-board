import { useState } from "react";
import { AppBar } from "./components/AppBar/AppBar";
import { AppDrawer } from "./components/AppDrawer/AppDrawer";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";
import { SettingsDrawer } from "./components/SettingsDrawer/SettingsDrawer";
import { WelcomeDialog } from "./components/WelcomeDialog/WelcomeDialog";

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <AppBar
        setIsDrawerOpen={setIsDrawerOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />

      <AppDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <SettingsDrawer
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <CommunicationBoard />

      <WelcomeDialog />
    </>
  );
}
