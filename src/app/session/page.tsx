"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Avatar,
  Divider,
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  CircularProgress,
  Container,
  Stack,
  Badge
} from '@mui/material';
import {
  FilterList,
  Person,
  Schedule,
  Public,
  Category,
  Topic,
  Refresh,
  Info,
  ContentCopy,
  Clear,
  OpenInNew
} from '@mui/icons-material';

interface Session {
  id: string;
  username: string;
  sessionName: string;
  type: string;
  theme: string;
  platform: string;
  timezone: string;
  duration: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

const SessionManagementPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  
  // Filter states
  const [typeFilter, setTypeFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/session');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setSessions(data);
      setFilteredSessions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = sessions;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(session => session.type === typeFilter);
    }
    if (themeFilter !== 'all') {
      filtered = filtered.filter(session => session.theme === themeFilter);
    }
    if (platformFilter !== 'all') {
      filtered = filtered.filter(session => session.platform === platformFilter);
    }
    if (durationFilter !== 'all') {
      filtered = filtered.filter(session => session.duration === durationFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, typeFilter, themeFilter, platformFilter, durationFilter]);

  // Helper functions
  const getDisplayName = (value: string, category: string): string => {
    const displayMap: Record<string, Record<string, string>> = {
      type: {
        play: 'Playing Chess',
        lecture: 'Chess Lecture',
        analysis: 'Analysis'
      },
      theme: {
        opening: 'Opening',
        middlegame: 'Middlegame',
        endgame: 'Endgame',
        mastergame: 'Master Game',
        gameanalysis: 'Game Analysis'
      },
      platform: {
        discord: 'Discord',
        lichess: 'Lichess'
      },
      duration: {
        '30min': '30 minutes',
        '1hour': '1 hour',
        '2hour': '2 hours'
      }
    };
    
    return displayMap[category]?.[value] || value;
  };

  const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' => {
    switch (type) {
      case 'play': return 'primary';
      case 'lecture': return 'secondary';
      case 'analysis': return 'success';
      default: return 'primary';
    }
  };

  const clearAllFilters = () => {
    setTypeFilter('all');
    setThemeFilter('all');
    setPlatformFilter('all');
    setDurationFilter('all');
  };

  const activeFiltersCount = [typeFilter, themeFilter, platformFilter, durationFilter]
    .filter(filter => filter !== 'all').length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateObj: { $date: string }) => {
    return new Date(dateObj.$date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDiscordProfile = (discordId: string) => {
    window.open(`https://discordlookup.com/user/${discordId}`, '_blank');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="h6" color="text.secondary">
            Loading sessions...
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack spacing={2}>
          <Typography variant="h3" component="h1" fontWeight="bold">
            ♟️ ChessLise Sessions 
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Connect with fellow chess enthusiasts worldwide. Discover personalized chess sessions, from beginner tutorials to grandmaster analysis. Learn, play, and improve together.
          </Typography>
          
          {/* Connection Info Alert */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>💬 How to Connect</AlertTitle>
            To join a session, send a friend request to the session creator on Discord. Use the "View Profile" button on each session card to learn more about the host before connecting.
          </Alert>
          
          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Info />}
              onClick={() => setShowCommands(true)}
            >
              View Commands
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchSessions}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {/* Error Alert */}
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <FilterList />
                <Typography variant="h6">Filters</Typography>
                {activeFiltersCount > 0 && (
                  <Badge badgeContent={activeFiltersCount} color="primary">
                    <Box />
                  </Badge>
                )}
              </Stack>
              {activeFiltersCount > 0 && (
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
              )}
            </Stack>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Session Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Session Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="play">Playing Chess</MenuItem>
                  <MenuItem value="lecture">Chess Lecture</MenuItem>
                  <MenuItem value="analysis">Analysis</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={themeFilter}
                  label="Theme"
                  onChange={(e) => setThemeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Themes</MenuItem>
                  <MenuItem value="opening">Opening</MenuItem>
                  <MenuItem value="middlegame">Middlegame</MenuItem>
                  <MenuItem value="endgame">Endgame</MenuItem>
                  <MenuItem value="mastergame">Master Game</MenuItem>
                  <MenuItem value="gameanalysis">Game Analysis</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Platform</InputLabel>
                <Select
                  value={platformFilter}
                  label="Platform"
                  onChange={(e) => setPlatformFilter(e.target.value)}
                >
                  <MenuItem value="all">All Platforms</MenuItem>
                  <MenuItem value="discord">Discord</MenuItem>
                  <MenuItem value="lichess">Lichess</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Duration</InputLabel>
                <Select
                  value={durationFilter}
                  label="Duration"
                  onChange={(e) => setDurationFilter(e.target.value)}
                >
                  <MenuItem value="all">All Durations</MenuItem>
                  <MenuItem value="30min">30 minutes</MenuItem>
                  <MenuItem value="1hour">1 hour</MenuItem>
                  <MenuItem value="2hour">2 hours</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        {/* Results Summary */}
        <Typography variant="body1" color="text.secondary">
          Showing {filteredSessions.length} of {sessions.length} sessions
        </Typography>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="text.secondary">
                No sessions found matching your filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or create a new session using Discord commands
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <Stack 
            direction="row" 
            flexWrap="wrap" 
            spacing={3}
            sx={{
              '& > *': {
                flexBasis: { xs: '100%', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
                flexGrow: 0,
                flexShrink: 0
              }
            }}
          >
            {filteredSessions.map((session) => (
              <Card 
                key={`${session.id}-${session.sessionName}`} 
                elevation={2} 
                sx={{ height: 'fit-content' }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {session.sessionName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {session.username}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Session Type Chip */}
                    <Stack direction="row">
                      <Chip
                        label={getDisplayName(session.type, 'type')}
                        color={getTypeColor(session.type)}
                        size="small"
                        icon={<Category />}
                      />
                    </Stack>

                    {/* Session Details */}
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Topic sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {getDisplayName(session.theme, 'theme')}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Public sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {getDisplayName(session.platform, 'platform')}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {getDisplayName(session.duration, 'duration')} • {session.timezone}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider />

                    {/* Timestamps */}
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Created: {formatDate(session.createdAt)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Updated: {formatDate(session.updatedAt)}
                      </Typography>
                    </Stack>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<OpenInNew />}
                      onClick={() => openDiscordProfile(session.id)}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      View Profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Commands Dialog */}
      <Dialog
        open={showCommands}
        onClose={() => setShowCommands(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ♟️ ChessLise Session Commands
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="info">
              <AlertTitle>How to Create Sessions</AlertTitle>
              Use these Discord commands in any server or channel to manage your chess sessions. Each user can have up to 5 sessions. Once created, others can find your sessions here and send you friend requests to connect!
            </Alert>

            {/* Commands List */}
            <Stack spacing={2}>
              {/* Add Session */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="primary">
                      📝 /addsession
                    </Typography>
                    <Tooltip title="Copy command">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard('/addsession')}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Create a new chess session with session name, type, theme, platform, duration, and timezone
                  </Typography>
                </Stack>
              </Paper>

              {/* Update Session */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="primary">
                      ✏️ /updatesession
                    </Typography>
                    <Tooltip title="Copy command">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard('/updatesession')}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Update an existing session by providing the session name and the fields you want to change
                  </Typography>
                </Stack>
              </Paper>

              {/* Delete Session */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="primary">
                      🗑️ /deletesession
                    </Typography>
                    <Tooltip title="Copy command">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard('/deletesession')}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Delete an existing session by providing the session name
                  </Typography>
                </Stack>
              </Paper>

              {/* List Sessions */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" color="primary">
                      📋 /listsessions
                    </Typography>
                    <Tooltip title="Copy command">
                      <IconButton 
                        size="small" 
                        onClick={() => copyToClipboard('/listsessions')}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    View all your sessions with a summary of each session's details
                  </Typography>
                </Stack>
              </Paper>
            </Stack>

            {/* Available Options */}
            <Paper elevation={1} sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h6" color="primary">
                  📌 Available Options
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Session Types:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      play, lecture, analysis
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Themes:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      opening, middlegame, endgame, mastergame, gameanalysis
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Platforms:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      discord, lichess
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Durations:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      30 min, 1 hour, 2 hour
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>

            {/* Connection Instructions */}
            <Alert severity="success">
              <AlertTitle>🤝 Connecting with Session Hosts</AlertTitle>
              After creating a session, your Discord profile will be visible to others. When someone finds your session interesting, they can click "View Profile" to learn more about you, then send you a friend request on Discord to join your chess session!
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommands(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SessionManagementPage;