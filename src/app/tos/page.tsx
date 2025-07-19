'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Security,
  Gavel,
  VerifiedUser,
  Code,
  Delete,
  Update,
  Shield,
  Info,
  CheckCircle,
} from '@mui/icons-material';

const TOSPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ♟️ Chesslise Legal Center
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Terms of Service, Privacy Policy & License Information
        </Typography>
        <Chip 
          label="Last Updated: July 2025" 
          color="primary" 
          variant="outlined"
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Quick Overview Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>TL;DR:</strong> Chesslise is free, respects your privacy, and helps chess lovers connect. 
          We only store minimal data needed for matching players. You are responsible for your Discord server usage.
        </Typography>
      </Alert>

      {/* Terms of Service Section */}
      <Paper elevation={2} sx={{ mb: 4, p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Gavel sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h2" fontWeight="bold">
            Terms of Service
          </Typography>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Update color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Software Updates"
                  secondary="You agree to use the latest updated versions of Chesslise for optimal performance and security."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Code color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Feature Maintenance"
                  secondary="Some commands may be discontinued if the developer chooses not to maintain them in future updates."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Shield color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Server Responsibility"
                  secondary="You are fully responsible for your Discord server. Chesslise has no access to server information or management capabilities."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <VerifiedUser color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Privacy Agreement"
                  secondary="By using Chesslise, you agree to our Privacy Policy, which ensures we do not store private information."
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Paper>

      {/* Privacy Policy Section */}
      <Paper elevation={2} sx={{ mb: 4, p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Security sx={{ mr: 2, fontSize: 32, color: 'success.main' }} />
          <Typography variant="h4" component="h2" fontWeight="bold">
            Privacy Policy
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Privacy First:</strong> Chesslise does not and will not store any private user information.
          </Typography>
        </Alert>

        {/* General Bot Usage */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🤖 General Bot Usage
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="All bot commands integrate with Lichess, Chess.com, and Stockfish"
                  secondary="We use slash commands for proper functionality and don't store command data"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Shield color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="No Liability for User Actions"
                  secondary="Chesslise is not responsible for any user actions on their Discord servers"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* CSSN Data Collection */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              🌐 CSSN (Chesslise Social Server Network)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              For our friend-matching service, we collect minimal data:
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2} mb={2}>
              <Chip label="Discord ID" variant="outlined" />
              <Chip label="Username" variant="outlined" />
              <Chip label="Chess Preferences" variant="outlined" />
              <Chip label="Game Data (User vs Engine)" variant="outlined" />
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Privacy Protection:</strong> None of this information is public and is only used for matching players with similar preferences.
              </Typography>
            </Alert>

            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Game Storage:</strong> We store user vs engine games including User ID, FEN position, and chosen depth for game analysis.
            </Typography>
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Delete sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" color="error.main">
                Data Deletion Rights
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Users can request to delete their data by:
            </Typography>
            
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<Info />}
                href="https://discord.gg/T2eH3tQjKC"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact on Discord
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* License Section */}
      <Paper elevation={2} sx={{ mb: 4, p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Code sx={{ mr: 2, fontSize: 32, color: 'info.main' }} />
          <Typography variant="h4" component="h2" fontWeight="bold">
            License Information
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>100% Free:</strong> Chesslise will never charge users for its service. 
            Optional donations may be available for users who want to support development.
          </Typography>
        </Alert>

        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🌍 General Chesslise Software
              </Typography>
              <Chip label="MIT License" color="success" sx={{ mb: 2 }} />
              <Typography variant="body2">
                Open-source software designed for chess lovers to integrate their favorite chess platforms with Discord.
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                🤝 CSSN Software
              </Typography>
              <Chip label="GPL License" color="info" sx={{ mb: 2 }} />
              <Typography variant="body2">
                The social networking features are licensed under GPL for community collaboration and transparency.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Please read the full license documentation for complete details and terms.
        </Typography>
      </Paper>

      {/* Footer */}
      <Box textAlign="center" py={4}>
        <Typography variant="body2" color="text.secondary">
          Questions about these terms? Contact the Chesslise development team.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Chesslise • Made with ♟️ for the chess community
        </Typography>
      </Box>
    </Container>
  );
};

export default TOSPage;