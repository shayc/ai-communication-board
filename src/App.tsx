import { useState } from "react";
import { AppBar } from "./components/AppBar/AppBar";
import { AppDrawer } from "./components/AppDrawer/AppDrawer";
import { SettingsDrawer } from "./components/SettingsDrawer/SettingsDrawer";
import { CommunicationBoard } from "./components/CommunicationBoard/CommunicationBoard";

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
    </>
  );
}
