"use client"

import { ClerkProvider } from "@clerk/nextjs";
import { CssBaseline, ThemeProvider, Container } from "@mui/material";
import theme from "@/theme/theme";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            <Container sx={{ mt: 4 }}>
              {children}
            </Container>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}