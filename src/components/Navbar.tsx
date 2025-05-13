"use client";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { FaDiscord } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md"; // Import donation icon
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Coordinate Game", href: "/trainer" },
    { label: "Blindfold Game", href: "/blindfold" },
    { label: "Flashcards", href: "/flashcard" },
  ];

  const iconLinks = [
    {
      icon: <GitHubIcon />,
      href: "https://github.com/jalpp/Chesslise",
      name: "Github"
    },
    {
      icon: <FaDiscord />,
      href: "https://discord.gg/T2eH3tQjKC",
      name: "Discord",
    },
    {
      icon: <FavoriteIcon/>,
      href: "https://buymeacoffee.com/chesslise",
      name: "Donate"
    },
  ];

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ChessLise
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {navLinks.map((link) => (
                <Button key={link.href} color="inherit" href={link.href}>
                  {link.label}
                </Button>
              ))}
              {/* Donate button */}
              {iconLinks.map((link, idx) => (
                <IconButton
                  key={idx}
                  color="inherit"
                  href={link.href}
                  target="_blank"
                >
                  {link.icon}
                </IconButton>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: "primary.main",
            height: "100%",
            color: "white",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.href}
                component="a"
                href={link.href}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {iconLinks.map((link, idx) => (
              <ListItem
                key={idx}
                component="a"
                href={link.href}
                target="_blank"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemText
                  primary={link.name}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
