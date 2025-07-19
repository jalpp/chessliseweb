'use client';

import { useEffect, useState } from 'react';
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
  platform: [
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
  favplayer: [
    { value: 'mag', label: 'Magnus Carlsen' },
    { value: 'fab', label: 'Fabiano Caruana' },
    { value: 'din', label: 'Ding Liren' },
    { value: 'guk', label: 'Gukesh Dommaraju' },
  ],
  favpiece: [
    { value: 'bis', label: 'Bishop ♗' },
    { value: 'paw', label: 'Pawn ♙' },
    { value: 'kni', label: 'Knight ♘' },
    { value: 'roo', label: 'Rook ♖' },
    { value: 'kin', label: 'King ♔' },
    { value: 'que', label: 'Queen ♕' },
  ],
  favopening: [
    { value: 'qge', label: "Queen's Gambit" },
    { value: 'kge', label: "King's Gambit" },
    { value: 'sic', label: 'Sicilian Defense' },
    { value: 'kid', label: "King's Indian Defense" },
  ],
  favstyle: [
    { value: 'agg', label: 'Aggressive ⚔️' },
    { value: 'pos', label: 'Positional 🏗️' },
    { value: 'tac', label: 'Tactical 🎯' },
    { value: 'def', label: 'Defensive 🛡️' },
  ],
};

const fieldLabels = {
  platform: 'Preferred Platform',
  ptc: 'Time Control',
  favplayer: 'Favorite Player',
  favpiece: 'Favorite Piece',
  favopening: 'Favorite Opening',
  favstyle: 'Playing Style',
};

export default function PlayerMatchPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<Player | null>(null);

  const [preferences, setPreferences] = useState({
    platform: '',
    ptc: '',
    favplayer: '',
    favpiece: '',
    favopening: '',
    favstyle: '',
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error('Failed to fetch players', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleChange = (field: keyof typeof preferences) => (e: any) => {
    setPreferences((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const findMatch = () => {
    const match = players.find((player) =>
      player.pl === preferences.platform ||
      player.ptc === preferences.ptc ||
      player.favplayer === preferences.favplayer ||
      player.favpiece === preferences.favpiece ||
      player.favopening === preferences.favopening ||
      player.favstyle === preferences.favstyle
    );
    setMatch(match || null);
  };

  const getDisplayValue = (key: string): string => {
    return preferenceDisplayMap[key as keyof typeof preferenceDisplayMap] || key;
  };

  const getSelectedPreferences = () => {
    return Object.entries(preferences)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => ({
        label: fieldLabels[key as keyof typeof fieldLabels],
        value: getDisplayValue(value),
      }));
  };

  return (
    <Box p={4} maxWidth="lg" mx="auto">
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        ♟️ Find Your Chess Buddy
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>How to get started:</strong> Install Chesslise Discord bot, run <code>/connect</code>, and set your preferences to appear in the friend finder.
          </Typography>
        </Alert>

        <Alert severity="success">
          <Typography variant="body2">
            <strong>Found a match?</strong> Send them a friend request on Discord and start chatting about chess!
          </Typography>
        </Alert>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        🎯 Set Your Preferences
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Select your chess preferences below. We'll find players who share similar interests!
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3} my={4}>
        {Object.entries(preferenceOptions).map(([field, options]) => (
          <FormControl key={field} fullWidth>
            <InputLabel>{fieldLabels[field as keyof typeof fieldLabels]}</InputLabel>
            <Select
              value={preferences[field as keyof typeof preferences]}
              onChange={handleChange(field as keyof typeof preferences)}
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
        ))}
      </Box>

      {getSelectedPreferences().length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Your selected preferences:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {getSelectedPreferences().map((pref, index) => (
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
        disabled={loading || players.length === 0}
        size="large"
        sx={{ mb: 3 }}
      >
        🔍 Find Your Chess Buddy
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {players.length} players available for matching
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}

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
                  💡 <strong>Tip:</strong> Use the "View Discord Profile" button above to see their profile picture and verify it's the right person before sending a friend request.
                </Typography>
              )}
            </Alert>
          </CardContent>
        </Card>
      ) : (
        !loading && getSelectedPreferences().length > 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              No matches found with your current preferences. Try adjusting your selections or check back later as more players join!
            </Typography>
          </Alert>
        )
      )}
    </Box>
  );
}