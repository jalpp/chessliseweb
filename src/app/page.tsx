"use client";

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
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
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LaunchIcon from "@mui/icons-material/Launch";
import CodeIcon from "@mui/icons-material/Code";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Check } from "@mui/icons-material";

// Import Clerk components
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";


interface NavLink {
  label: string;
  href: string;
  description: string;
  category: 'training' | 'social' | 'legal';
}

const navLinks: NavLink[] = [
  { label: "Coordinate Game", href: "/trainer", description: "Master board coordinates with interactive training", category: 'training' },
  { label: "Blindfold Game", href: "/blindfold", description: "Enhance visualization skills without seeing the board", category: 'training' },
  { label: "Flashcards", href: "/flashcard", description: "Convert Chess game into flashcards and download them locally", category: 'training' },
  { label: "Friend Finder", href: "/friends", description: "Connect with chess players worldwide", category: 'social' },
  { label: "Communities", href: "/communitylist", description: "Discover and join chess communities", category: 'social' },
  { label: "Sessions", href: "/session", description: "Schedule and join chess training sessions", category: 'social' },
  { label: "Terms of Service", href: "/tos", description: "Chesslise terms and conditions", category: 'legal' }
];

interface Command {
  cmd: string;
  desc: string;
  category: 'gameplay' | 'training' | 'social' | 'utility';
}

const commands: Command[] = [
  { cmd: "/help", desc: "View all available commands and their usage", category: 'utility' },
  { cmd: "/addcommunity", desc: "Submit your chess community for inclusion in our directory", category: 'social' },
  { cmd: "/addsession", desc: "Create and schedule a new chess training session", category: 'social' },
  { cmd: "/updatesession", desc: "Modify details of your existing chess sessions", category: 'social' },
  { cmd: "/deletesession", desc: "Remove a session from the sessions board", category: 'social' },
  { cmd: "/listsession", desc: "View all sessions you've created and their status", category: 'social' },
  { cmd: "/profile", desc: "Display detailed Lichess profile statistics", category: 'utility' },
  { cmd: "/puzzle", desc: "Get today's featured puzzle from Lichess or Chess.com", category: 'training' },
  { cmd: "/play", desc: "Challenge players with custom time controls and formats", category: 'gameplay' },
  { cmd: "/watch", desc: "Spectate the most recent game by any user", category: 'utility' },
  { cmd: "/playengine", desc: "Challenge Stockfish engine at different difficulty levels", category: 'gameplay' },
  { cmd: "/profilecc", desc: "View comprehensive Chess.com user statistics", category: 'utility' },
  { cmd: "/move", desc: "Make moves against Stockfish directly in Discord", category: 'gameplay' },
  { cmd: "/fen", desc: "Visualize any chess position using FEN notation", category: 'utility' },
  { cmd: "/pgn", desc: "Navigate through games move-by-move with PGN", category: 'utility' },
  { cmd: "/chessdb", desc: "Access opening theory and endgame databases", category: 'training' },
  { cmd: "/learnchess", desc: "Interactive chess rules and basic strategy lessons", category: 'training' },
  { cmd: "/connect", desc: "Join the Chesslise Social Network (CSSN)", category: 'social' },
  { cmd: "/disconnect", desc: "Go offline in the chess social network", category: 'social' },
  { cmd: "/pairchallenge", desc: "Find opponents in the global challenge pool", category: 'gameplay' },
  { cmd: "/pairchallengenetwork", desc: "Match with players in your friend network", category: 'gameplay' },
  { cmd: "/setpreference", desc: "Customize your chess playing preferences", category: 'utility' },
  { cmd: "/mychallenges", desc: "Review all your active and pending challenges", category: 'gameplay' },
  { cmd: "/viewfriends", desc: "Browse your chess friends and their activity", category: 'social' },
  { cmd: "/findfriend", desc: "Discover new chess partners based on skill level", category: 'social' },
  { cmd: "/sendfriendrequest", desc: "Send connection requests to other players", category: 'social' },
  { cmd: "/acceptfriendrequest", desc: "Accept pending friend requests", category: 'social' },
];

export default function HomePage() {
  const clerk = useClerk();
  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const groupedLinks = navLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, NavLink[]>);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, #1a1d21 0%, #23272A 25%, #2C2F33 100%)`,
        color: "#fff",
        pt: 8,
        pb: 12,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 25% 25%, #5865f208 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #43b58108 0%, transparent 50%),
            repeating-linear-gradient(45deg, #5865f205 0 1px, transparent 1px 60px)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
     <Fade in timeout={800}>
          <Stack spacing={6} alignItems="center" textAlign="center">
            <Box
              sx={{
                p: 3,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5865f220, #43b58120)",
                border: "2px solid #5865f230",
              }}
            >
              <img src="/chessliselogo.png" alt="Chesslise Logo" height={80} />
            </Box>
            
            <Stack spacing={3} alignItems="center">
              <Typography
                variant="h1"
                fontWeight={900}
                sx={{
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  letterSpacing: -1,
                  background: "linear-gradient(135deg, #fff 0%, #b9bbbe 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Chesslise
              </Typography>
              
              <Typography
                variant="h4"
                sx={{ 
                  maxWidth: 700, 
                  color: "#e3e5e8",
                  fontWeight: 300,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  lineHeight: 1.4,
                }}
              >
                The ultimate Discord chess companion for chess players, trainers, and communities
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                <Chip
                  icon={<CodeIcon />}
                  label="Open Source"
                  sx={{
                    backgroundColor: "#5865f220",
                    color: "#5865f2",
                    border: "1px solid #5865f2",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<Check />}
                  label="Verified App"
                  sx={{
                    backgroundColor: "#ffcc2920",
                    color: "#ffcc29",
                    border: "1px solid #ffcc29",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<SecurityIcon />}
                  label="MIT License"
                  sx={{
                    backgroundColor: "#43b58120",
                    color: "#43b581",
                    border: "1px solid #43b581",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<GroupsIcon />}
                  label="Community Driven"
                  sx={{
                    backgroundColor: "#eb713420",
                    color: "#eb7134",
                    border: "1px solid #eb7134",
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Stack>

            {/* CTA Buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
              <Button
                href="https://discord.com/oauth2/authorize?client_id=930544707300393021&permissions=277025446912&integration_type=0&scope=bot"
                size="large"
                endIcon={<LaunchIcon />}
                sx={{
                  backgroundColor: "#5865F2",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(88, 101, 242, 0.3)",
                  ":hover": {
                    backgroundColor: "#4752c4",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(88, 101, 242, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Add to Discord
              </Button>

              <Button
                href="https://discord.gg/T2eH3tQjKC"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="large"
                endIcon={<LaunchIcon />}
                sx={{
                  borderColor: "#5865f2",
                  color: "#fff",
                  fontWeight: 600,
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  borderWidth: 2,
                  ":hover": {
                    backgroundColor: "#5865f2",
                    color: "#fff",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Join Community
              </Button>
            </Stack>

            {/* Authentication Buttons */}
            <SignedOut>
              <Box 
                sx={{ 
                  mt: 4,
                  p: 4,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(67, 181, 129, 0.05), rgba(88, 101, 242, 0.05))",
                  border: "1px solid rgba(67, 181, 129, 0.2)",
                  backdropFilter: "blur(10px)",
                  maxWidth: 600,
                  width: "100%",
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Typography
                    variant="h5"
                    sx={{ 
                      color: "#e3e5e8",
                      fontWeight: 400,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      lineHeight: 1.5,
                      textAlign: "center",
                    }}
                  >
                    Join the ChessLise community to manage your chess sessions and connect with fellow players
                  </Typography>
                  
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <Button
                      variant="contained"
                      startIcon={<LoginIcon />}
                      onClick={() => clerk.openSignIn()}
                      sx={{
                        backgroundColor: "#43b581",
                        color: "#fff",
                        fontWeight: 600,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        minWidth: 140,
                        boxShadow: "0 4px 16px rgba(67, 181, 129, 0.3)",
                        ":hover": {
                          backgroundColor: "#369657",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(67, 181, 129, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sign In
                    </Button>
               
                    <Button
                      variant="outlined"
                      onClick={() => clerk.openSignUp()}
                      startIcon={<PersonAddIcon />}
                      sx={{
                        borderColor: "#43b581",
                        color: "#43b581",
                        fontWeight: 600,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        borderWidth: 2,
                        fontSize: "1rem",
                        minWidth: 140,
                        ":hover": {
                          backgroundColor: "#43b581",
                          color: "#fff",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(67, 181, 129, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </SignedOut>
          </Stack>
        </Fade>

        {/* Features Section */}
        <Box mt={12}>
          <Stack spacing={4} alignItems="center" textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              Everything You Need for Chess
            </Typography>
            <Typography variant="h6" color="#b9bbbe" maxWidth={600}>
              From casual games to serious training, Chesslise brings the complete chess experience to Discord
            </Typography>
          </Stack>

          <Stack 
            direction={{ xs: "column", md: "row" }} 
            spacing={3} 
            flexWrap="wrap"
            useFlexGap
            alignItems="stretch"
          >
            <FeatureCard
              icon={<SportsEsportsIcon fontSize="large" sx={{ color: "#5865f2" }} />}
              title="Play & Compete"
              description="Challenge friends, play against Stockfish, or find opponents through our matchmaking system"
              gradient="linear-gradient(135deg, #5865f220, #5865f210)"
              borderColor="#5865f2"
            />
            <FeatureCard
              icon={<SchoolIcon fontSize="large" sx={{ color: "#43b581" }} />}
              title="Learn & Improve"
              description="Access daily puzzles, interactive lessons, and comprehensive chess education tools"
              gradient="linear-gradient(135deg, #43b58120, #43b58110)"
              borderColor="#43b581"
            />
            <FeatureCard
              icon={<FitnessCenterIcon fontSize="large" sx={{ color: "#eb7134" }} />}
              title="Train Your Skills"
              description="Master coordinates, practice blindfold chess, and use flashcards for improvement"
              gradient="linear-gradient(135deg, #eb713420, #eb713410)"
              borderColor="#eb7134"
            />
          </Stack>
          
          <Stack 
            direction={{ xs: "column", md: "row" }} 
            spacing={3} 
            mt={3}
            flexWrap="wrap"
            useFlexGap
            alignItems="stretch"
          >
            <FeatureCard
              icon={<VisibilityIcon fontSize="large" sx={{ color: "#ffcc29" }} />}
              title="Analyze & Watch"
              description="Spectate games, analyze positions with FEN/PGN, and access opening databases"
              gradient="linear-gradient(135deg, #ffcc2920, #ffcc2910)"
              borderColor="#ffcc29"
            />
            <FeatureCard
              icon={<PersonSearchIcon fontSize="large" sx={{ color: "#a233ff" }} />}
              title="Connect & Socialize"
              description="Join communities, find chess friends, and participate in organized sessions"
              gradient="linear-gradient(135deg, #a233ff20, #a233ff10)"
              borderColor="#a233ff"
            />
            <FeatureCard
              icon={<EmojiEventsIcon fontSize="large" sx={{ color: "#f04747" }} />}
              title="Compete & Grow"
              description="Track your progress, join tournaments, and climb the leaderboards"
              gradient="linear-gradient(135deg, #f0474720, #f0474710)"
              borderColor="#f04747"
            />
          </Stack>
        </Box>

        {/* Pages & Features */}
        <Box mt={12}>
          <Typography variant="h4" gutterBottom fontWeight={700} mb={4}>
            <FlashOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            ChessLise Web Features
          </Typography>
          
          {Object.entries(groupedLinks).map(([category, links]) => (
            <Box key={category} mb={4}>
              <Typography 
                variant="h6" 
                color="#5865f2" 
                fontWeight={600} 
                mb={2}
                textTransform="capitalize"
              >
                {category === 'training' ? '🎯 Training Tools' : 
                 category === 'social' ? '👥 Social Features' : 
                 '📋 Information'}
              </Typography>
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2} 
                flexWrap="wrap"
                useFlexGap
              >
                {links.map((link) => (
                  <Box key={link.href} sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(33.333% - 10.67px)" } }}>
                    <Card
                      sx={{
                        backgroundColor: "#2C2F33",
                        border: "1px solid #404348",
                        borderRadius: 3,
                        height: "100%",
                        transition: "all 0.3s ease",
                        ":hover": {
                          borderColor: "#5865f2",
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 32px rgba(88, 101, 242, 0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3, height: "100%" }}>
                        <Stack spacing={1} height="100%">
                          <Button
                            href={link.href}
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              justifyContent: "flex-start",
                              textTransform: "none",
                              p: 0,
                              minWidth: 0,
                              ":hover": { backgroundColor: "transparent" },
                            }}
                          >
                            {link.label}
                            <LaunchIcon sx={{ ml: 1, fontSize: "1rem" }} />
                          </Button>
                          <Typography variant="body2" color="#b9bbbe">
                            {link.description}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>

        {/* Installation Guide */}
        <Card sx={{ mt: 10, backgroundColor: "#2C2F33", border: "1px solid #404348", borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" color="#fff" gutterBottom fontWeight={700}>
              🚀 ChessLise Discord App Setup Guide
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#5865f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  1
                </Box>
                <Typography color="#e3e5e8">
                  Click Add to Discord and select your server
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#43b581",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  2
                </Box>
                <Typography color="#e3e5e8">
                  Grant necessary permissions (read/send messages, embed links)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#eb7134",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  3
                </Box>
                <Typography color="#e3e5e8">
                  Type <code style={{ backgroundColor: "#1a1d21", padding: "2px 6px", borderRadius: "4px" }}>/help</code> to explore all available commands
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Commands Section */}
        <Box mt={8}>
          {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
            <Accordion
              key={category}
              sx={{
                mt: 2,
                backgroundColor: "#2C2F33",
                border: "1px solid #404348",
                borderRadius: 3,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                sx={{ px: 3 }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 600, textTransform: "capitalize" }}>
                  {category === 'gameplay' ? '🎮 Gameplay Commands' :
                   category === 'training' ? '📚 Training Commands' :
                   category === 'social' ? '👥 Social Commands' :
                   '🔧 Utility Commands'} ({categoryCommands.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <List dense>
                  {categoryCommands.map((command, index) => (
                    <Box key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography
                              component="span"
                              sx={{
                                color: "#5865F2",
                                fontWeight: 600,
                                fontFamily: "monospace",
                                fontSize: "0.95rem",
                              }}
                            >
                              {command.cmd}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ color: "#b9bbbe", mt: 0.5 }}>
                              {command.desc}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index !== categoryCommands.length - 1 && (
                        <Divider sx={{ backgroundColor: "#404348", mx: 0 }} />
                      )}
                    </Box>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
}

function FeatureCard({ icon, title, description, gradient, borderColor }: FeatureCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 16px)" },
        minHeight: 200,
        background: gradient,
        border: `1px solid ${borderColor}30`,
        borderRadius: 4,
        p: 3,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.3s ease",
        ":hover": {
          transform: "translateY(-8px)",
          borderColor: borderColor,
          boxShadow: `0px 16px 48px ${borderColor}20`,
        },
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: "50%",
          backgroundColor: "#2C2F33",
          border: `2px solid ${borderColor}30`,
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Typography variant="h6" fontWeight={700} color="#fff" mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" color="#b9bbbe" lineHeight={1.6}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}