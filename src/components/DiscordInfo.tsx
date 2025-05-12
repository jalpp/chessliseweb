// components/DiscordAppInfo.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const discordPurple = "#5865F2";
const discordDark = "#2C2F33";
const discordLight = "#b9bbbe";

const commands = [
  { cmd: "/help", desc: "To see command information for the LISEBOT" },
  { cmd: "/profile", desc: "To see lichess profiles for given username" },
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
  { cmd: "/pairchallengenetwork", desc: "Find a challenge your friends network" },
  { cmd: "/setpreference", desc: "Change user preference" },
  { cmd: "/mychallenges", desc: "View your challenges" },
  { cmd: "/viewfriends", desc: "View your friends" },
  { cmd: "/findfriend", desc: "Find a new friend" },
  { cmd: "/sendfriendrequest", desc: "Send a friend request" },
  { cmd: "/acceptfriendreqest", desc: "Accept a friend request" },
];

export default function DiscordAppInfo() {
  return (
    <Box mt={10} id="discord-info">
      {/* Discord Logo */}
      <Box display="flex" justifyContent="center" mb={2}>
        <img src="/discord-logo.svg" alt="Discord Logo" height={80} />
      </Box>

      {/* Section Title */}
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        fontWeight={700}
        color={discordPurple}
      >
        Discord Bot Commands
      </Typography>

      {/* Installation Instructions */}
      <Card
        sx={{
          backgroundColor: "#23272A",
          color: discordLight,
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom color="#fff">
            🔧 Installation
          </Typography>
          <Typography>
            1. Invite the bot to your server with the invite link.
            <br />
            2. Grant it permissions like messaging and embed links.
            <br />
            3. Start with <code>/help</code> to see available commands.
          </Typography>
        </CardContent>
      </Card>

      {/* Commands Accordion */}
      <Accordion sx={{ backgroundColor: "#2C2F33", color: discordLight }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
          <Typography sx={{ color: "#fff", fontWeight: 600 }}>
            💬 Command List
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {commands.map((command, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <span style={{ color: discordPurple, fontWeight: 500 }}>
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
    </Box>
  );
}
