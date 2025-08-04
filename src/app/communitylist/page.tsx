"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Container,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Launch as LaunchIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Community {
  guildId: string;
  guildName: string;
  inviteUrl: string;
  isApproved: boolean;
}

const CommunityList: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/discord');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: Community[] = await response.json();
        setCommunities(data.filter(community => community.isApproved));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleInviteClick = (inviteUrl: string) => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLookupClick = (guildId: string) => {
    window.open(`https://discordlookup.com/guild/${guildId}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Chess Discord Communities
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Explore a curated list of active chess Discord communities. Connect, learn, and play with fellow enthusiasts from around the world!
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <InfoIcon color="info" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            How to Add Your Community
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Want to add your Discord server to this list? Follow these simple steps:
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Install the <strong>Chesslise</strong> bot in your Discord server
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Run the <code style={{ padding: '2px 6px', borderRadius: '4px' }}>/addcommunity</code> command in your server
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            Wait for approval from our moderation team
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mt: 2 }}>
          <AlertTitle>Please Note</AlertTitle>
          Community approval may take some time. We review each submission to ensure quality and appropriate content.
        </Alert>
      </Paper>

      <Divider sx={{ mb: 4 }} />

      {communities.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No Communities Found</AlertTitle>
          No approved communities are currently available. Check back later!
        </Alert>
      ) : (
        <Stack spacing={3}>
          {communities.map((community) => (
            <Card 
              key={community.guildId}
              elevation={3} 
              sx={{ 
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
                 
                  <Box flex={1} minWidth="250px">
                    {/* Guild Name */}
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom 
                      fontWeight="bold"
                    >
                      {community.guildName}
                    </Typography>

                   
                    <Box mb={2}>
                      <Chip 
                        label="Approved" 
                        color="success" 
                        size="small"
                        icon={<AddIcon />}
                      />
                    </Box>

                    {/* Guild ID */}
                    <Typography variant="body2" color="text.secondary">
                      Server ID: {community.guildId}
                    </Typography>
                  </Box>

                  
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<LaunchIcon />}
                      onClick={() => handleInviteClick(community.inviteUrl)}
                      sx={{ py: 1, px: 2 }}
                    >
                      Join Server
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      onClick={() => handleLookupClick(community.guildId)}
                      sx={{ py: 1, px: 2 }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      
      <Box mt={6} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Communities are reviewed and approved by our moderation team to ensure a safe and welcoming environment.
        </Typography>
      </Box>
    </Container>
  );
};

export default CommunityList;