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
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CoordinateBoard from "@/components/CoordinateBoard";

const difficultySettings = [
  {
    level: "easy",
    icon: <EmojiEmotionsIcon fontSize="large" color="success" />,
    title: "Easy",
    description: "5 minutes • 1 piece at a time. Great for beginners!",
  },
  {
    level: "medium",
    icon: <SportsEsportsIcon fontSize="large" color="primary" />,
    title: "Medium",
    description: "3 minutes • 5 pieces. A balanced challenge.",
  },
  {
    level: "hard",
    icon: <WhatshotIcon fontSize="large" color="error" />,
    title: "Hard",
    description: "1 minute • 8 pieces. For seasoned tacticians!",
  },
];

export default function TrainerPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  return (
    <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
      {!selectedDifficulty ? (
        <>
          <Typography variant="h3" gutterBottom>
            Welcome to Coordinate Trainer 
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            Sharpen your board vision by choosing a difficulty level and identifying piece positions quickly.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {difficultySettings.map((diff) => (
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
        <CoordinateBoard difficulty={selectedDifficulty as "easy" | "medium" | "hard"} />
      )}
    </Box>
  );
}
