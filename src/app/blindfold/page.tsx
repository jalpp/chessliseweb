'use client';

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Stack,
} from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import BlindfoldTrainer from "@/components/Blindfoldtrainer";
import { useTheme } from "@emotion/react";

const blindfoldDifficultySettings = [
  {
    level: "easy",
    icon: <AutoAwesomeIcon fontSize="large" color="success" />,
    title: "Easy",
    description: "5 minutes, 1 piece, 10 second working memory interval. Great for warm-up!",
  },
  {
    level: "medium",
    icon: <VisibilityOffIcon fontSize="large" color="primary" />,
    title: "Medium",
    description: "3 minutes, 2 piece, 7 second working memory interval. Challenge your memory.",
  },
  {
    level: "hard",
    icon: <FlashOnIcon fontSize="large" color="error" />,
    title: "Hard",
    description: "1 minute, 1 piece, 5 second working memory interval. For experts only!",
  },
];

export default function BlindfoldTrainerPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);


  return (
    <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
      {!selectedDifficulty ? (
        <>
          <Typography variant="h3" gutterBottom>
            Welcome to Blindfold Trainer 
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            Train your ability to maintain your working memory, select a level and start the game!
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {blindfoldDifficultySettings.map((diff) => (
              <Card
                key={diff.level}
                elevation={4}
                sx={{
                  width: 260,
                  borderRadius: 4,
                  transition: "0.3s",
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardActionArea onClick={() => setSelectedDifficulty(diff.level)}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{diff.icon}</Box>
                    <Typography variant="h5" gutterBottom>
                      {diff.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {diff.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </>
      ) : (
        <BlindfoldTrainer difficulty={selectedDifficulty as "easy" | "medium" | "hard"} />
      )}
    </Box>
  );
}
