"use client";

import {
  Box,
  Typography,
  Stack,
  useTheme,
  Card,
  CardContent,
  useMediaQuery,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Fade,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Coordinate Game", href: "/trainer" },
  { label: "Blindfold Game", href: "/blindfold" },
  { label: "Flashcards", href: "/flashcard" },
  { label: "Friend Finder", href: "/friends" },
  { label: "TOS", href: "/tos" },
];

const commands = [
  { cmd: "/help", desc: "To see command information for the Chesslise" },
  { cmd: "/profile", desc: "See lichess profiles for given username" },
  { cmd: "/puzzle", desc: "See the daily lichess or chess.com puzzle" },
  { cmd: "/play", desc: "Create a challenge, select time control and mode" },
  { cmd: "/watch", desc: "View the last lichess game played by a user" },
  { cmd: "/playengine", desc: "Play Stockfish at various levels" },
  { cmd: "/profilecc", desc: "View Chess.com user profile" },
  { cmd: "/move", desc: "Play Stockfish engine in Discord" },
  { cmd: "/fen", desc: "View chess FEN position in Discord" },
  { cmd: "/pgn", desc: "Scroll through game PGN in Discord" },
  { cmd: "/chessdb", desc: "Analyze chess positions via chessdb.cn" },
  { cmd: "/learnchess", desc: "Learn basic chess rules" },
  { cmd: "/connect", desc: "Connect to Chesslise friends network" },
  { cmd: "/disconnect", desc: "Go offline in the CSSN" },
  { cmd: "/pairchallenge", desc: "Find a challenge in the open network" },
  { cmd: "/pairchallengenetwork", desc: "Find a challenge in your network" },
  { cmd: "/setpreference", desc: "Change user preference" },
  { cmd: "/mychallenges", desc: "View your challenges" },
  { cmd: "/viewfriends", desc: "View your friends" },
  { cmd: "/findfriend", desc: "Find a new friend" },
  { cmd: "/sendfriendrequest", desc: "Send a friend request" },
  { cmd: "/acceptfriendreqest", desc: "Accept a friend request" },
];

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, #23272A 0%, #2C2F33 100%)`,
        color: "#fff",
        pt: 8,
        pb: 12,
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(45deg, #5865f211 0 2px, transparent 2px 40px)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Hero */}
        <Fade in timeout={600}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <img src="/chessliselogo.png" alt="Chesslise Logo" height={80} />
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                fontSize: { xs: "2.2rem", md: "3rem" },
                letterSpacing: 1,
              }}
            >
              Chesslise
            </Typography>
            <Typography
              variant="h6"
              sx={{ maxWidth: 600, color: "#b9bbbe", fontWeight: 400 }}
            >
              A community-driven Discord chess bot to play, learn, and connect—
              seamlessly in your server or private chats.
            </Typography>

            {/* CTA + Tags */}
            <Stack direction="column" spacing={2} alignItems="center">
              <Button
                href="https://discord.com/oauth2/authorize?client_id=930544707300393021&permissions=277025446912&integration_type=0&scope=bot"
                sx={{
                  backgroundColor: "#5865F2",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 2,
                  ":hover": { backgroundColor: "#4752c4" },
                }}
              >
                ➕ Add Chesslise to Discord
              </Button>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                justifyContent="center"
              >
                <Button
                  href="https://discord.gg/T2eH3tQjKC"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{
                    borderColor: "#5865f2",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    ":hover": {
                      backgroundColor: "#5865f2",
                      color: "#fff",
                    },
                  }}
                >
                  💬 Join Community Discord
                </Button>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: "#5865f222",
                    border: "1px solid #5865f2",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "#fff",
                  }}
                >
                  Open Source
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: "#5865f222",
                    border: "1px solid #43b581",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "#43b581",
                  }}
                >
                  MIT License
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Fade>

        {/* Features */}
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={3}
          mt={10}
          alignItems="stretch"
          justifyContent="center"
        >
          <FeatureCard
            icon={
              <SportsEsportsIcon fontSize="large" sx={{ color: "#5865f2" }} />
            }
            title="Play"
            description="Challenge friends, play Stockfish inside Discord"
          />
          <FeatureCard
            icon={<SchoolIcon fontSize="large" sx={{ color: "#43b581" }} />}
            title="Learn"
            description="Play puzzles, flashcards, and learn coordinates"
          />
          <FeatureCard
            icon={
              <FitnessCenterIcon fontSize="large" sx={{ color: "#eb7134" }} />
            }
            title="Train"
            description="Use the blindfold and coordinate trainers"
          />
          <FeatureCard
            icon={<VisibilityIcon fontSize="large" sx={{ color: "#ffcc29" }} />}
            title="Watch"
            description="Spectate games or show FEN/PGN inside chat"
          />
          <FeatureCard
            icon={
              <PersonSearchIcon fontSize="large" sx={{ color: "#a233ff" }} />
            }
            title="Connect"
            description="Use CSSN to find chess friends easily"
          />
        </Stack>

        {/* Quick Links */}
        <Box mt={10}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            🚀 Quick Links
          </Typography>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {navLinks.map((link) => (
              <Button
                key={link.href}
                href={link.href}
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#5865f2",
                  ":hover": {
                    backgroundColor: "#5865f2",
                    color: "#fff",
                  },
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Install Instructions */}
        <Card sx={{ mt: 10, backgroundColor: "#2C2F33" }}>
          <CardContent>
            <Typography variant="h5" color="#fff" gutterBottom>
              🔧 How to Install
            </Typography>
            <Typography color="#b9bbbe">
              1. Click the Add Chesslise button above.
              <br />
              2. Give the bot permissions to read/send messages and embed links.
              <br />
              3. Use <code>/help</code> to get started inside your server!
            </Typography>
          </CardContent>
        </Card>

        {/* Command List Accordion */}
        <Accordion
          sx={{
            mt: 6,
            backgroundColor: "#2C2F33",
            color: "#b9bbbe",
            borderRadius: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
          >
            <Typography sx={{ color: "#fff", fontWeight: 600 }}>
              💬 Discord Command List
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {commands.map((command, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <span style={{ color: "#5865F2", fontWeight: 500 }}>
                          {command.cmd}
                        </span>
                      }
                      secondary={command.desc}
                    />
                  </ListItem>
                  {index !== commands.length - 1 && (
                    <Divider sx={{ backgroundColor: "#444" }} />
                  )}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      elevation={4}
      sx={{
        flex: 1,
        background: "#2C2F33",
        borderRadius: 4,
        px: 2,
        py: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ":hover": {
          transform: "translateY(-4px)",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0px 10px 30px rgba(88, 101, 242, 0.3)",
        },
      }}
    >
      <Box mb={1}>{icon}</Box>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" fontWeight={700} color="#fff" mb={0.5}>
          {title}
        </Typography>
        <Typography variant="body2" color="#b9bbbe">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
