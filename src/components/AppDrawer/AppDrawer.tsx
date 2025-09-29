import FileOpenIcon from "@mui/icons-material/FileOpen";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { BrowserAISupport } from "./BrowserAISupport/BrowserAISupport";
interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function AppDrawer({ open, onClose }: AppDrawerProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 360 }}>
        <Toolbar />

        <Divider />

        <List>
          <ListItem key={"Open file"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FileOpenIcon />
              </ListItemIcon>
              <ListItemText primary={"Open file"} />
            </ListItemButton>
          </ListItem>

          {["Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <BrowserAISupport />
      </Box>
    </Drawer>
  );
}
