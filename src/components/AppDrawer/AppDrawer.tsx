import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AppDrawer({ open, onClose }: AppDrawerProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 360 }}>App Drawer</Box>
    </Drawer>
  );
}
