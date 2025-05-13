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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

const commands = [
  { cmd: "/help", desc: "To see command information for the Chesslise" },
  { cmd: "/profile", desc: "See lichess profiles for given username" },
  { cmd: "/puzzle", desc: "See the daily lichess or chess.com puzzle" },
  { cmd: "/play", desc: "Create a challenge, select time control and mode" },
  { cmd: "/watch", desc: "View the last lichess game played by a user" },
  { cmd: "/playengine", desc: "Play Stockfish at various levels" },
  { cmd: "/profilecc", desc: "View Chess.com user profile" },
  { cmd: "/move", desc: "Play Stockfish engine in Discord" },
  { cmd: "/chessdb", desc: "Analyze chess positions via chessdb.cn" },
  { cmd: "/learnchess", desc: "Learn basic chess rules" },
  { cmd: "/connect", desc: "Connect to CSSN" },
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 70% 20%, ${theme.palette.primary.main}22 0%, transparent 60%), 
                     linear-gradient(120deg, #23272A 0%, #36393F 100%)`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.04,
          background: `repeating-linear-gradient(45deg, #5865f2 0 2px, transparent 2px 40px)`,
        }}
      />

      <Container maxWidth="lg">
        <Stack
          spacing={6}
          alignItems="center"
          justifyContent="center"
          sx={{
            zIndex: 1,
            width: "100%",
            maxWidth: 800,
            mx: "auto",
            px: { xs: 2, sm: 4 },
            py: { xs: 6, md: 10 },
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <img src="/chessliselogo.png" alt="Discord Logo" height={80} />
          </Box>

          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              textAlign: "center",
              fontSize: { xs: "2.2rem", md: "3rem" },
              color: "#fff",
              letterSpacing: 1,
              textShadow: "0 2px 8px #0007",
            }}
          >
            Chesslise
          </Typography>

          <Typography
            variant="h5"
            align="center"
            color="#b9bbbe"
            fontWeight={400}
            sx={{ maxWidth: 530, fontSize: { xs: "1.1rem", md: "1.4rem" } }}
          >
            Chesslise is a community-driven, open-source chess bot designed to bring the ultimate chess experience to Discord. Chesslise makes it seamless—all within your Discord server, Group DMs, or friend chat rooms.

          </Typography>
          <Button
            sx={{
              backgroundColor: "#5865F2",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 2,
              ":hover": {
                backgroundColor: "#4752c4",
              },
            }}
            href="https://discord.com/oauth2/authorize?client_id=930544707300393021&permissions=277025446912&integration_type=0&scope=bot"
          >
            {" "}
            Add Chesslise
          </Button>
          {/* Feature Cards */}
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={isMobile ? 2.5 : 3}
            width="100%"
            alignItems="stretch"
            justifyContent="center"
          >
            <FeatureCard
              icon={
                <SportsEsportsIcon fontSize="large" sx={{ color: "#5865f2" }} />
              }
              title="Play"
              description="Challenge friends, play chess with Stockfish in Discord"
            />
            <FeatureCard
              icon={<SchoolIcon fontSize="large" sx={{ color: "#43b581" }} />}
              title="Learn"
              description="Attempt Puzzles from Lichess/Chess.com, play the coordinate game"
            />
            <FeatureCard
              icon={
                <FitnessCenterIcon fontSize="large" sx={{ color: "#eb7134" }} />
              }
              title="Train"
              description="Play the coordinates/blindfold trainer games"
            />
            <FeatureCard
              icon={
                <VisibilityIcon fontSize="large" sx={{ color: "#ffcc29" }} />
              }
              title="Watch"
              description="Watch live chess games, view custom fen positions"
            />
            <FeatureCard
              icon={
                <PersonSearchIcon fontSize="large" sx={{ color: "#a233ff" }} />
              }
              title="Connect"
              description="Find chess friends across different chess servers, via Chesslise Social Network"
            />

          </Stack>
          {/* Installation Instructions */}
          <Card
            sx={{ backgroundColor: "#2C2F33", color: "#b9bbbe", width: "100%" }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom color="#fff">
                🔧 How to Install
              </Typography>
              <Typography>
                1. Invite the bot using the invite button.
                <br />
                2. Ensure it has permissions to read/send messages & embed
                links.
                <br />
                3. Type <code>/help</code> in any channel to get started!
              </Typography>
            </CardContent>
          </Card>

          {/* Command List */}
          <Accordion
            sx={{ backgroundColor: "#2C2F33", color: "#b9bbbe", width: "100%" }}
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
        </Stack>
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
      elevation={6}
      sx={{
        flex: 1,
        borderRadius: 4,
        background: "rgba(44,47,51,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        py: 3,
        textAlign: "center",
        transition: "transform 0.18s, box-shadow 0.18s",
        ":hover": {
          transform: "translateY(-4px) scale(1.03)",
          boxShadow: "0 8px 32px 0 #5865f266",
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

