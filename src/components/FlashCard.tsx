"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

type FlashCard = {
  fen: string;
  comment: string;
};

const FlashCardPage: React.FC = () => {
  const [pgn, setPgn] = useState("");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = () => {
    const chess = new Chess();
    const ok = chess.loadPgn(pgn);

    const comments = chess.getComments();
    setCards(comments);
    setCurrent(0);
    setFlipped(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % cards.length);
    setFlipped(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Chess Flashcard Generator
      </Typography>

      <TextField
        label="Paste PGN here"
        multiline
        minRows={6}
        fullWidth
        value={pgn}
        onChange={(e) => setPgn(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleGenerate}>
        Generate Flashcards
      </Button>

      {cards.length > 0 && (
        <>
          <Typography variant="h6" mt={4} textAlign="center">
            Flashcard {current + 1} of {cards.length}
          </Typography>

          <Box
            sx={{
              perspective: "1000px",
              width: 400,
              height: 400,
              margin: "auto",
              mt: 2,
              cursor: "pointer",
            }}
            onClick={() => setFlipped(!flipped)}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                position: "relative",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front - Board */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                }}
              >
                <Chessboard
                  position={cards[current].fen}
                  arePiecesDraggable={false}
                />
              </Box>

              {/* Back - Comment */}
              <Paper
                elevation={4}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  fontSize: "1.2rem",
                  textAlign: "center",
                }}
              >
                {cards[current].comment}
              </Paper>
            </Box>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button variant="outlined" onClick={prev}>
              Previous
            </Button>
            <Button variant="contained" onClick={next}>
              Next
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default FlashCardPage;
