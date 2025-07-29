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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { FaDiscord } from "react-icons/fa";
import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useClerk } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { openSignIn, openSignUp } = useClerk();
  
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Coordinate Game", href: "/trainer" },
    { label: "Blindfold Game", href: "/blindfold" },
    { label: "Flashcards", href: "/flashcard" },
    { label: "Friend Finder", href: "/friends" },
    { label: "Communities", href: "/communitylist" },
    { label: "Sessions", href: "/session" },
    { label: "TOS", href: "/tos" }
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
      href: "https://buymeacoffee.com/jalp",
      name: "Donate"
    },
  ];

  const handleSignIn = () => {
    openSignIn();
  };

  const handleSignUp = () => {
    openSignUp();
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ChessLise
          </Typography>
          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <IconButton color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navLinks.map((link) => (
                <Button key={link.href} color="inherit" href={link.href}>
                  {link.label}
                </Button>
              ))}

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

              <SignedOut>
                <Button 
                  color="inherit" 
                  onClick={handleSignIn}
                  sx={{ 
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  color="inherit" 
                  onClick={handleSignUp}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </SignedOut>
              
              <SignedIn>
                <UserButton />
              </SignedIn>
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

            <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
            
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
                <ListItemText primary={link.name} />
              </ListItem>
            ))}

            <SignedOut>
              <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
              <ListItem
                onClick={handleSignIn}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemText primary="Sign In" />
              </ListItem>
              <ListItem
                onClick={handleSignUp}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                <ListItemText primary="Sign Up" />
              </ListItem>
            </SignedOut>
          </List>
        </Box>
      </Drawer>
    </>
  );
}