"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
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
  Badge,
  TextField,
  Snackbar,
  Menu
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
  OpenInNew,
  Add,
  Edit,
  Delete,
  MoreVert
} from '@mui/icons-material';
import { useSession } from '@clerk/nextjs';

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

interface SessionFormData {
  sessionName: string;
  type: string;
  theme: string;
  platform: string;
  duration: string;
  timezone: string;
}

const SessionManagementPage: React.FC = () => {
  const { user } = useUser();
  const {session} = useSession();
  const isAuthenticated = !!user;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  
  // CRUD Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form refs instead of controlled state
  const sessionNameRef = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const themeRef = useRef<HTMLSelectElement>(null);
  const platformRef = useRef<HTMLSelectElement>(null);
  const durationRef = useRef<HTMLSelectElement>(null);
  const timezoneRef = useRef<HTMLInputElement>(null);

  // Remove formData state - we'll get values from refs when needed
  const [initialFormData, setInitialFormData] = useState<SessionFormData>({
    sessionName: '',
    type: '',
    theme: '',
    platform: '',
    duration: '',
    timezone: ''
  });

  // Filters
  const [typeFilter, setTypeFilter] = useState('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  // Get Discord ID from Clerk user
  const getDiscordId = (): string | null => {
    if (!user) return null;
    // Assuming Discord ID is stored in user.externalId or user.id depending on your Clerk setup
    return user.externalAccounts?.[0]?.providerUserId;
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

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

  // Get form values from refs
  const getFormValues = (): SessionFormData => ({
    sessionName: sessionNameRef.current?.value || '',
    type: typeRef.current?.value || '',
    theme: themeRef.current?.value || '',
    platform: platformRef.current?.value || '',
    duration: durationRef.current?.value || '',
    timezone: timezoneRef.current?.value || ''
  });

  const createSession = async () => {
    const discordId = getDiscordId();
    if (!discordId) {
      showSnackbar('Discord ID not found', 'error');
      return;
    }

    const formValues = getFormValues();
    
    // Validate required fields
    if (!formValues.sessionName || !formValues.type || !formValues.theme || 
        !formValues.platform || !formValues.duration || !formValues.timezone) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      setFormLoading(true);
      const token = await session?.getToken();
      
      const response = await fetch('/api/createsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          discordId: discordId,
          username: user?.firstName || 'Unknown',
          ...formValues
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create session');
      }

      showSnackbar('Session created successfully!');
      setCreateDialogOpen(false);
      resetForm();
      fetchSessions();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to create session', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const updateSession = async () => {
  const discordId = getDiscordId();
  if (!discordId || !selectedSession) {
    showSnackbar('Discord ID or session not found', 'error');
    return;
  }

  const formValues = getFormValues();
  
  // Validate required fields
  if (!formValues.sessionName || !formValues.type || !formValues.theme || 
      !formValues.platform || !formValues.duration || !formValues.timezone) {
    showSnackbar('Please fill in all required fields', 'error');
    return;
  }

  try {
    setFormLoading(true);
    const token = await session?.getToken();
    
    const response = await fetch(`/api/updatesession`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        discordId: discordId,
        username: user?.firstName || 'Unknown',
        sessionName: selectedSession.sessionName, // Original session name for identification
        newSessionName: formValues.sessionName,
        type: formValues.type,
        theme: formValues.theme,
        platform: formValues.platform,
        duration: formValues.duration,
        timezone: formValues.timezone
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update session');
    }

    showSnackbar('Session updated successfully!');
    setUpdateDialogOpen(false);
    resetForm();
    setSelectedSession(null);
    fetchSessions();
  } catch (err) {
    showSnackbar(err instanceof Error ? err.message : 'Failed to update session', 'error');
  } finally {
    setFormLoading(false);
  }
};

  const deleteSession = async () => {
    const discordId = getDiscordId();
    if (!discordId || !selectedSession) {
      showSnackbar('Discord ID or session not found', 'error');
      return;
    }

    try {
      setFormLoading(true);
      const token = await session?.getToken();
      
      const response = await fetch(`/api/deletesession?discordId=${discordId}&sessionName=${selectedSession.sessionName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete session');
      }

      showSnackbar('Session deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedSession(null);
      fetchSessions();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to delete session', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    if (sessionNameRef.current) sessionNameRef.current.value = '';
    if (typeRef.current) typeRef.current.value = '';
    if (themeRef.current) themeRef.current.value = '';
    if (platformRef.current) platformRef.current.value = '';
    if (durationRef.current) durationRef.current.value = '';
    if (timezoneRef.current) timezoneRef.current.value = '';
    
    setInitialFormData({
      sessionName: '',
      type: '',
      theme: '',
      platform: '',
      duration: '',
      timezone: ''
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const openUpdateDialog = (session: Session) => {
    setSelectedSession(session);
    setInitialFormData({
      sessionName: session.sessionName,
      type: session.type,
      theme: session.theme,
      platform: session.platform,
      duration: session.duration,
      timezone: session.timezone
    });
    setUpdateDialogOpen(true);
    setMenuAnchor(null);
  };

  const openDeleteDialog = (session: Session) => {
    setSelectedSession(session);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, session: Session) => {
    event.stopPropagation();
    setSelectedSession(session);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSession(null);
  };

  // Check if current user owns the session
  const isMySession = (session: Session): boolean => {
    const discordId = getDiscordId();
    return discordId === session.id;
  };

  // Get user's sessions
  const mySessions = sessions.filter(session => isMySession(session));

  useEffect(() => {
    fetchSessions();
  }, []);

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

  // Session Form Component using refs instead of controlled inputs
  const SessionForm: React.FC<{ title: string }> = ({ title }) => (
  <Stack spacing={3}>
    <Typography variant="h6">{title}</Typography>
    
    {/* Loading overlay */}
    {formLoading && (
      <Stack 
        alignItems="center" 
        justifyContent="center" 
        spacing={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Processing session...
        </Typography>
      </Stack>
    )}
    
    <TextField
      inputRef={sessionNameRef}
      label="Session Name"
      defaultValue={initialFormData.sessionName}
      fullWidth
      required
      variant="outlined"
      disabled={formLoading}
    />
    
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <FormControl fullWidth required variant="outlined">
        <InputLabel>Session Type</InputLabel>
        <Select
          inputRef={typeRef}
          defaultValue={initialFormData.type}
          label="Session Type"
          disabled={formLoading}
        >
          <MenuItem value="play">Playing Chess</MenuItem>
          <MenuItem value="lecture">Chess Lecture</MenuItem>
          <MenuItem value="analysis">Analysis</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth required variant="outlined">
        <InputLabel>Theme</InputLabel>
        <Select
          inputRef={themeRef}
          defaultValue={initialFormData.theme}
          label="Theme"
          disabled={formLoading}
        >
          <MenuItem value="opening">Opening</MenuItem>
          <MenuItem value="middlegame">Middlegame</MenuItem>
          <MenuItem value="endgame">Endgame</MenuItem>
          <MenuItem value="mastergame">Master Game</MenuItem>
          <MenuItem value="gameanalysis">Game Analysis</MenuItem>
        </Select>
      </FormControl>
    </Stack>
    
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <FormControl fullWidth required variant="outlined">
        <InputLabel>Platform</InputLabel>
        <Select
          inputRef={platformRef}
          defaultValue={initialFormData.platform}
          label="Platform"
          disabled={formLoading}
        >
          <MenuItem value="discord">Discord</MenuItem>
          <MenuItem value="lichess">Lichess</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth required variant="outlined">
        <InputLabel>Duration</InputLabel>
        <Select
          inputRef={durationRef}
          defaultValue={initialFormData.duration}
          label="Duration"
          disabled={formLoading}
        >
          <MenuItem value="30min">30 minutes</MenuItem>
          <MenuItem value="1hour">1 hour</MenuItem>
          <MenuItem value="2hour">2 hours</MenuItem>
        </Select>
      </FormControl>
    </Stack>
    
    <TextField
      inputRef={timezoneRef}
      label="Timezone"
      defaultValue={initialFormData.timezone}
      fullWidth
      required
      variant="outlined"
      placeholder="e.g., UTC, EST at 1PM, PST in evening"
      helperText="Enter your timezone (e.g., UTC, EST, PST, UTC+2) and time of the session"
      disabled={formLoading}
    />
  </Stack>
);

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
          
          {/* My Sessions Summary - Only show when authenticated */}
          {isAuthenticated && mySessions.length > 0 && (
            <Alert severity="info">
              <AlertTitle>Your Sessions</AlertTitle>
              You have {mySessions.length} active session{mySessions.length !== 1 ? 's' : ''}. You can create up to 5 sessions total.
            </Alert>
          )}
          
          {/* Authentication Notice for non-logged in users */}
          {!isAuthenticated && (
            <Alert severity="warning">
              <AlertTitle>🔐 Sign In to Create Sessions</AlertTitle>
              You are viewing sessions as a guest. Sign in with Discord to create, edit, and manage your own chess sessions.
            </Alert>
          )}
          
          {/* Connection Info Alert */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>💬 How to Connect</AlertTitle>
            To join a session, send a friend request to the session creator on Discord. Use the View Profile button on each session card to learn more about the host before connecting.
          </Alert>
          
          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            {/* Only show Create Session button when authenticated */}
            {isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openCreateDialog}
                disabled={mySessions.length >= 5}
              >
                Create Session
              </Button>
            )}
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
                Try adjusting your filters or create a new session
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
                sx={{ 
                  height: 'fit-content',
                  border: isAuthenticated && isMySession(session) ? '2px solid' : 'none',
                  borderColor: isAuthenticated && isMySession(session) ? 'primary.main' : 'transparent'
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header with Menu */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: isAuthenticated && isMySession(session) ? 'primary.main' : 'grey.500' }}>
                        <Person />
                      </Avatar>
                      <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" component="h3" noWrap>
                            {session.sessionName}
                          </Typography>
                          {/* Only show menu for authenticated users on their own sessions */}
                          {isAuthenticated && isMySession(session) && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, session)}
                            >
                              <MoreVert />
                            </IconButton>
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          by {session.username} {isAuthenticated && isMySession(session) && '(You)'}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Session Type */}
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

      {/* Session Menu - Only show when authenticated */}
      {isAuthenticated && (
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedSession && openUpdateDialog(selectedSession)}>
            <Edit sx={{ mr: 1 }} />
            Edit Session
          </MenuItem>
          <MenuItem onClick={() => selectedSession && openDeleteDialog(selectedSession)}>
            <Delete sx={{ mr: 1 }} />
            Delete Session
          </MenuItem>
        </Menu>
      )}

      {/* Create Session Dialog - Only show when authenticated */}
      {isAuthenticated && (
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Create New Session</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <SessionForm title="Session Details" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={createSession} 
              variant="contained"
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'Create Session'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Update Session Dialog - Only show when authenticated */}
      {isAuthenticated && (
        <Dialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Update Session</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <SessionForm title="Update Session Details" />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={updateSession} 
              variant="contained"
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'Update Session'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Session Dialog - Only show when authenticated */}
      {isAuthenticated && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Delete Session</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the session {selectedSession?.sessionName}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={deleteSession} 
              variant="contained"
              color="error"
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={20} /> : 'Delete Session'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Commands Dialog - Keep existing content */}
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
                    View all your sessions with a summary of each session details
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

            <Alert severity="success">
              <AlertTitle>🤝 Connecting with Session Hosts</AlertTitle>
              After creating a session, your Discord profile will be visible to others. When someone finds your session interesting, they can click View Profile to learn more about you, then send you a friend request on Discord to join your chess session!
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommands(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SessionManagementPage;