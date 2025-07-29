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
  const [dataReady, setDataReady] = useState(false); // New state for smooth transition
  const [submitting, setSubmitting] = useState(false);
  const [match, setMatch] = useState<Player | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isUserInNetwork, setIsUserInNetwork] = useState(false);

  const getDiscordId = (): string | null => {
    if (!user) return null;
    return user.externalAccounts?.[0]?.providerUserId || null;
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

  const findMatch = () => {
    const match = players.find((player) =>
      player.pl === searchPreferences.platform ||
      player.ptc === searchPreferences.ptc ||
      player.favplayer === searchPreferences.favplayer ||
      player.favpiece === searchPreferences.favpiece ||
      player.favopening === searchPreferences.favopening ||
      player.favstyle === searchPreferences.favstyle
    );
    setMatch(match || null);
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
        
        // Refresh players list
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data);
        
        // Reset form
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

  // Show loading spinner while fetching initial data
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
          Filter players by shared preferences to find your perfect chess friend!
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

        <Button 
          variant="contained" 
          onClick={findMatch} 
          disabled={players.length === 0}
          size="large"
          sx={{ mb: 3 }}
        >
          🔍 Find Your Chess Friend
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {players.length} players available for matching
        </Typography>

        {match ? (
          <Card sx={{ mt: 4, p: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="success.main">
                🎉 Perfect Match Found!
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Discord Username</Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>@{match.username}</Typography>
                  {match.id && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={`https://discordlookup.com/user/${match.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1, fontSize: '0.75rem' }}
                    >
                      🔍 View Discord Profile
                    </Button>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Platform</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.pl)}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Time Control</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.ptc)}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Favorite Player</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.favplayer)}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Favorite Piece</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.favpiece)}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Favorite Opening</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.favopening)}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Playing Style</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{getDisplayValue(match.favstyle)}</Typography>
                </Box>
              </Box>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Ready to connect?</strong> Send <strong>@{match.username}</strong> a friend request on Discord and start your chess friendship! 🤝
                </Typography>
                {match.id && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    💡 <strong>Tip:</strong> Use the View Discord Profile button above to see their profile picture and verify it is the right person before sending a friend request.
                  </Typography>
                )}
              </Alert>
            </CardContent>
          </Card>
        ) : (
          getSelectedSearchPreferences().length > 0 && (
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