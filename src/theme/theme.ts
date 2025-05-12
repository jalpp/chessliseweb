import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: " #23272A", // Darker purple-tinted background
      paper: "#2b2640",   // Purple-tinted surface background
    },
    primary: {
      main: "#7289da",    // Light purple/lavender color
      contrastText: "#fff",
    },
    secondary: {
      main: "#9b84ec",    // Lighter purple accent
    },
    text: {
      primary: "#fff",
      secondary: "#c2bdde", // Light purple-tinted text
    },
    divider: "#392e5c",   // Purple-tinted divider
    error: {
      main: "#f04747",    // Discord's red, kept for consistency
    },
    warning: {
      main: "#faa61a",    // Discord's warning color
    },
    success: {
      main: "#43b581",    // Discord's green, kept for consistency
    },
  },
  shape: {
    borderRadius: 8,      // Discord's slightly rounded corners
  },
  typography: {
    fontFamily: '"gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none', // Discord doesn't use all-caps buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default paper elevation shadow
        },
      },
    },
  },
});

export default theme;