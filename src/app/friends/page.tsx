'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSession } from '@clerk/nextjs';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Fade,
  Avatar,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';

interface Player {
  id: string;
  username: string;
  pl: string;
  ptc: string;
  favplayer: string;
  favpiece: string;
  favopening: string;
  favstyle: string;
}

// Mapping from API keys to user-friendly display names
const preferenceDisplayMap = {
  // Platform preferences
  lichess: 'Lichess',
  unauthlichess: 'Lichess (Guest)',
  allplatform: 'All Platforms',
  
  // Time control preferences
  classical: 'Classical (30+ min)',
  rapid: 'Rapid (10-30 min)',
  blitz: 'Blitz (3-10 min)',
  bullet: 'Bullet (<3 min)',
  
  // Player preferences
  mag: 'Magnus Carlsen',
  fab: 'Fabiano Caruana',
  din: 'Ding Liren',
  guk: 'Gukesh Dommaraju',
  
  // Piece preferences
  bis: 'Bishop',
  paw: 'Pawn',
  kni: 'Knight',
  roo: 'Rook',
  kin: 'King',
  que: 'Queen',
  
  // Opening preferences
  qge: "Queen's Gambit",
  kge: "King's Gambit",
  sic: 'Sicilian Defense',
  kid: "King's Indian Defense",
  
  // Style preferences
  agg: 'Aggressive',
  pos: 'Positional',
  tac: 'Tactical',
  def: 'Defensive',
};

const preferenceOptions = {
  pl: [
    { value: 'lichess', label: 'Lichess' },
    { value: 'unauthlichess', label: 'Lichess (Guest)' },
    { value: 'allplatform', label: 'All Platforms' },
  ],
  ptc: [
    { value: 'classical', label: 'Classical (30+ min)' },
    { value: 'rapid', label: 'Rapid (10-30 min)' },
    { value: 'blitz', label: 'Blitz (3-10 min)' },
    { value: 'bullet', label: 'Bullet (<3 min)' },
  ],
  favPlayer: [
    { value: 'mag', label: 'Magnus Carlsen' },
    { value: 'fab', label: 'Fabiano Caruana' },
    { value: 'din', label: 'Ding Liren' },
    { value: 'guk', label: 'Gukesh Dommaraju' },
  ],
  favPiece: [
    { value: 'bis', label: 'Bishop ♗' },
    { value: 'paw', label: 'Pawn ♙' },
    { value: 'kni', label: 'Knight ♘' },
    { value: 'roo', label: 'Rook ♖' },
    { value: 'kin', label: 'King ♔' },
    { value: 'que', label: 'Queen ♕' },
  ],
  favOpening: [
    { value: 'qge', label: "Queen's Gambit" },
    { value: 'kge', label: "King's Gambit" },
    { value: 'sic', label: 'Sicilian Defense' },
    { value: 'kid', label: "King's Indian Defense" },
  ],
  favStyle: [
    { value: 'agg', label: 'Aggressive ⚔️' },
    { value: 'pos', label: 'Positional 🏗️' },
    { value: 'tac', label: 'Tactical 🎯' },
    { value: 'def', label: 'Defensive 🛡️' },
  ],
};

const fieldLabels = {
  pl: 'Preferred Platform',
  ptc: 'Time Control',
  favPlayer: 'Favorite Player',
  favPiece: 'Favorite Piece',
  favOpening: 'Favorite Opening',
  favStyle: 'Playing Style',
};

export default function PlayerMatchPage() {
  const { isSignedIn, user } = useUser();
  const {session} = useSession();
  const [players, setPlayers] = useState<Player[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [matches, setMatches] = useState<Player[]>([]); 
  const [showOnlyOne, setShowOnlyOne] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isUserInNetwork, setIsUserInNetwork] = useState(false);

  const getDiscordId = (): string | null => {
    if (!user) return null;
    return user.externalAccounts?.[0]?.providerUserId || null;
  };

  
  const getDiscordAvatarUrl = (userId: string): string => {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 6}.png`;
  };

  const [searchPreferences, setSearchPreferences] = useState({
    platform: '',
    ptc: '',
    favplayer: '',
    favpiece: '',
    favopening: '',
    favstyle: '',
  });

  const [joinPreferences, setJoinPreferences] = useState({
    pl: '',
    ptc: '',
    favPlayer: '',
    favPiece: '',
    favOpening: '',
    favStyle: '',
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data);
        
        if (isSignedIn && user) {
          const discordId = getDiscordId();
          const userExists = discordId ? data.some((player: Player) => player.id === discordId) : false;
          setIsUserInNetwork(userExists);
        }
      } catch (err) {
        console.error('Failed to fetch players', err);
      } finally {
        setInitialLoading(false);
        setTimeout(() => setDataReady(true), 100);
      }
    };
    fetchPlayers();
  }, [isSignedIn, user]);

  const handleSearchChange = (field: keyof typeof searchPreferences) => (event: SelectChangeEvent<string>) => {
    setSearchPreferences((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleJoinChange = (field: keyof typeof joinPreferences) => (event: SelectChangeEvent<string>) => {
    setJoinPreferences((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const findMatches = () => {
    const currentUserDiscordId = getDiscordId();
    
    const filteredMatches = players.filter((player) => {
      
      if (currentUserDiscordId && player.id === currentUserDiscordId) {
        return false;
      }

     
      return (
        (searchPreferences.platform === '' || player.pl === searchPreferences.platform) &&
        (searchPreferences.ptc === '' || player.ptc === searchPreferences.ptc) &&
        (searchPreferences.favplayer === '' || player.favplayer === searchPreferences.favplayer) &&
        (searchPreferences.favpiece === '' || player.favpiece === searchPreferences.favpiece) &&
        (searchPreferences.favopening === '' || player.favopening === searchPreferences.favopening) &&
        (searchPreferences.favstyle === '' || player.favstyle === searchPreferences.favstyle)
      );
    });

    setMatches(filteredMatches);
  };

  const handleJoinNetwork = async () => {
    if (!isSignedIn || !user) return;

    const discordId = getDiscordId();
    const token = await session?.getToken();

    setSubmitting(true);
    try {
      const response = await fetch('/api/addplayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: discordId,
          username: user.firstName || 'Unknown',
          ...joinPreferences,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Successfully joined the ChessLise network!');
        setSnackbarOpen(true);
        setDialogOpen(false);
        setIsUserInNetwork(true);
        
      
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data);
        
    
        setJoinPreferences({
          pl: '',
          ptc: '',
          favPlayer: '',
          favPiece: '',
          favOpening: '',
          favStyle: '',
        });
      } else {
        setSnackbarMessage('Failed to join network. Please try again.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error joining network:', error);
      setSnackbarMessage('An error occurred. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getDisplayValue = (key: string): string => {
    return preferenceDisplayMap[key as keyof typeof preferenceDisplayMap] || key;
  };

  const getSelectedSearchPreferences = () => {
    return Object.entries(searchPreferences)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => ({
        label: fieldLabels[key === 'platform' ? 'pl' : key as keyof typeof fieldLabels] || key,
        value: getDisplayValue(value),
      }));
  };

  const isJoinFormValid = () => {
    return Object.values(joinPreferences).every(value => value !== '');
  };

  const hasActiveFilters = () => {
    return Object.values(searchPreferences).some(value => value !== '');
  };


  const getMatchesToDisplay = () => {
    if (showOnlyOne && matches.length > 0) {
      return [matches[0]];
    }
    return matches;
  };

  if (initialLoading || !dataReady) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh" p={4}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary">
          Loading ChessLise network...
        </Typography>
      </Box>
    );
  }

  const matchesToDisplay = getMatchesToDisplay();

  return (
    <Fade in={dataReady} timeout={500}>
      <Box p={4} maxWidth="lg" mx="auto">
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          ChessLise Network
        </Typography>

        <Box sx={{ mb: 4 }}>
          {!isSignedIn ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Browse chess friends:</strong> You can view and search through all available players below. Sign in with Discord to join the network and connect with others!
              </Typography>
            </Alert>
          ) : isUserInNetwork ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Welcome back!</strong> You are already part of the ChessLise network. Other players can find and connect with you!
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Join the network:</strong> You are signed in! Click the Join ChessLise Network button below to set your preferences and become discoverable by other players.
              </Typography>
            </Alert>
          )}

          <Alert severity="success">
            <Typography variant="body2">
              <strong>Found a match?</strong> Send them a friend request on Discord and start chatting about chess!
            </Typography>
          </Alert>
        </Box>

        {isSignedIn && !isUserInNetwork && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setDialogOpen(true)}
              sx={{ mb: 2 }}
            >
              🎯 Join ChessLise Network
            </Button>
            <Typography variant="body2" color="text.secondary">
              Set your preferences and become discoverable by other chess players
            </Typography>
          </Box>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          🔍 Find Chess Friends
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Filter players by shared preferences to find your perfect chess friends!
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3} my={4}>
          {Object.entries(preferenceOptions).map(([field, options]) => {
            const searchField = field === 'pl' ? 'platform' : 
                               field === 'favPlayer' ? 'favplayer' :
                               field === 'favPiece' ? 'favpiece' :
                               field === 'favOpening' ? 'favopening' :
                               field === 'favStyle' ? 'favstyle' : field;
            
            return (
              <FormControl key={field} fullWidth>
                <InputLabel>{fieldLabels[field as keyof typeof fieldLabels]}</InputLabel>
                <Select
                  value={searchPreferences[searchField as keyof typeof searchPreferences]}
                  onChange={handleSearchChange(searchField as keyof typeof searchPreferences)}
                  label={fieldLabels[field as keyof typeof fieldLabels]}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>

        {getSelectedSearchPreferences().length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Your search filters:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {getSelectedSearchPreferences().map((pref, index) => (
                <Chip
                  key={index}
                  label={`${pref.label}: ${pref.value}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={findMatches} 
            disabled={players.length === 0}
            size="large"
          >
            🔍 Find Your Chess Friends
          </Button>

          {matches.length > 1 && (
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyOne}
                  onChange={(e) => setShowOnlyOne(e.target.checked)}
                  color="primary"
                />
              }
              label="Show only one match"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {players.length} players available for matching
        </Typography>

        {matchesToDisplay.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom color="success.main" sx={{ mb: 3 }}>
              🎉 {matchesToDisplay.length === 1 ? 'Perfect Match Found!' : `${matches.length} Matches Found!`}
              {showOnlyOne && matches.length > 1 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Showing 1 of {matches.length} matches. Turn off Show only one match to see all results.
                </Typography>
              )}
            </Typography>
            
            <Grid container spacing={3}>
              {matchesToDisplay.map((match, index) => (
                <Grid  key={`${match.id}-${index}`}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                        <Avatar
                          src={getDiscordAvatarUrl(match.id)}
                          alt={match.username}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ mb: 0.5 }}>
                            @{match.username}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            href={`https://discordlookup.com/user/${match.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            🔍 View Profile
                          </Button>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />
                      
                      <Box display="grid" gap={2}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Platform</Typography>
                          <Typography variant="body2">{getDisplayValue(match.pl)}</Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Time Control</Typography>
                          <Typography variant="body2">{getDisplayValue(match.ptc)}</Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Favorite Player</Typography>
                          <Typography variant="body2">{getDisplayValue(match.favplayer)}</Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Favorite Piece</Typography>
                          <Typography variant="body2">{getDisplayValue(match.favpiece)}</Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Favorite Opening</Typography>
                          <Typography variant="body2">{getDisplayValue(match.favopening)}</Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">Playing Style</Typography>
                          <Typography variant="body2">{getDisplayValue(match.favstyle)}</Typography>
                        </Box>
                      </Box>

                      <Alert severity="success" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                          Send <strong>@{match.username}</strong> a Discord friend request! 🤝
                        </Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          hasActiveFilters() && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                No matches found with your current preferences. Try adjusting your selections or check back later as more players join!
              </Typography>
            </Alert>
          )
        )}

        {/* Join Network Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Join ChessLise Network
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Set your chess preferences so other players can find and connect with you
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3} sx={{ mt: 2 }}>
              {Object.entries(preferenceOptions).map(([field, options]) => (
                <FormControl key={field} fullWidth required>
                  <InputLabel>{fieldLabels[field as keyof typeof fieldLabels]} *</InputLabel>
                  <Select
                    value={joinPreferences[field as keyof typeof joinPreferences]}
                    onChange={handleJoinChange(field as keyof typeof joinPreferences)}
                    label={`${fieldLabels[field as keyof typeof fieldLabels]} *`}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Your Discord Info:</strong> Username: <strong>@{user?.username || user?.firstName || 'Unknown'}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Other players will be able to find you using these preferences and send you friend requests on Discord.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleJoinNetwork}
              disabled={!isJoinFormValid() || submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Joining...' : 'Join Network'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('Successfully') ? 'success' : 'error'}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}