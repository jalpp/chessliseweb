"use client";

import { useEffect, useState } from "react";
import { Chess, Color, PieceSymbol } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type Difficulty = "easy" | "medium" | "hard";

interface CoordinateTrainerProps {
  difficulty: Difficulty;
}

export default function CoordinateTrainer({ difficulty }: CoordinateTrainerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const boardSize = isMobile ? 300 : 600;

  const allFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const allRanks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const pieceTypes = ["p", "k", "n", "b", "q", "r"];
  const side = ["b", "w"];

  const getRandomSquare = (): string =>
    allFiles[Math.floor(Math.random() * 8)] + allRanks[Math.floor(Math.random() * 8)];

  const getRandomPiece = (): PieceSymbol =>
    pieceTypes[Math.floor(Math.random() * pieceTypes.length)] as PieceSymbol;

  const getRandomColor = (): Color =>
    side[Math.floor(Math.random() * side.length)] as Color;

  const generateOptions = (correct: string): string[] => {
    const options = new Set([correct]);
    while (options.size < 4) {
      options.add(getRandomSquare());
    }
    return Array.from(options).sort(() => 0.5 - Math.random());
  };

  const getTimeLimit = () => {
    switch (difficulty) {
      case "easy":
        return 5 * 60;
      case "medium":
        return 3 * 60;
      case "hard":
        return 60;
    }
  };

  const getPieceCount = () => {
    switch (difficulty) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 5;
    }
  };

  const [targetSquare, setTargetSquare] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [fen, setFen] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit());
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const gameOver = !started && timeLeft === 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setStarted(false);
      setFeedback("⏰ Time is up!");
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const nextPosition = () => {
    const chess = new Chess();
    chess.clear();

    const pieceCount = getPieceCount();
    const usedSquares = new Set<string>();
    let chosenTarget = "";

    for (let i = 0; i < pieceCount; i++) {
      let square = getRandomSquare();
      while (usedSquares.has(square)) {
        square = getRandomSquare();
      }
      usedSquares.add(square);

      const piece = getRandomPiece();
      const color = getRandomColor();
      chess.put({ type: piece, color }, square as any);

      if (i === 0) {
        chosenTarget = square;
      }
    }

    setFen(chess.fen());
    setTargetSquare(chosenTarget);
    setOptions(generateOptions(chosenTarget));
    setFeedback(null);
  };

  const handleAnswer = (selected: string) => {
    if (selected === targetSquare) {
      setCorrect((c) => c + 1);
      setFeedback("✅ Correct!");
      setTimeout(nextPosition, 400);
    } else {
      setIncorrect((i) => i + 1);
      setFeedback("❌ Try again.");
      setTimeout(nextPosition, 400);
    }
  };

  const startGame = () => {
    setCorrect(0);
    setIncorrect(0);
    setTimeLeft(getTimeLimit());
    setStarted(true);
    nextPosition();
  };

  const highlightAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  `;

  const highlightStyles = started
    ? {
        [targetSquare]: {
          background:
            "radial-gradient(circle, #8413F0 40%, transparent 70%)",
          borderRadius: "50%",
          animation: `${highlightAnimation} 0.8s ease-out`,
        },
      }
    : {};

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const buttonHoverAnimation = keyframes`
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
  `;

  return (
    <Box sx={{ textAlign: "center", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        🧠 Coordinate Trainer
      </Typography>

      {!started && !gameOver ? (
        <>
          <Paper elevation={3} sx={{ p: 3, mx: "auto", maxWidth: 600, width: "100%", mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              A piece will be placed on the board. Your goal is to identify its square.
            </Typography>
            <Alert severity="info">
              {difficulty === "easy" && "🟢 5 minutes • 1 piece at a time"}
              {difficulty === "medium" && "🟡 3 minutes • 2 pieces shown"}
              {difficulty === "hard" && "🔴 1 minute • 5 pieces shown"}
            </Alert>
          </Paper>
          <Button
            variant="contained"
            size="large"
            onClick={startGame}
            sx={{
              animation: `${buttonHoverAnimation} 0.3s ease-in-out`,
              "&:hover": {
                animation: `${buttonHoverAnimation} 0.3s ease-out`,
              },
            }}
          >
            Start Game
          </Button>
        </>
      ) : gameOver ? (
        <>
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⏰ Time's up!
          </Alert>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={2}
          >
            <Chip label={`Correct: ${correct}`} color="success" icon={<CheckCircleIcon />} />
            <Chip label={`Incorrect: ${incorrect}`} color="error" icon={<CancelIcon />} />
          </Stack>
          <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent="center">
            <Button variant="contained" onClick={startGame}>
              Try Again
            </Button>
            <Button variant="outlined" color="secondary" href="/">
              Home
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Box sx={{ maxWidth: 600, mx: "auto", mb: 2 }}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Chip icon={<AccessTimeIcon />} label={`Time: ${formatTime(timeLeft)}`} color="info" />
              <Chip icon={<CheckCircleIcon />} label={`Correct: ${correct}`} color="success" />
              <Chip icon={<CancelIcon />} label={`Incorrect: ${incorrect}`} color="error" />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(timeLeft / getTimeLimit()) * 100}
              sx={{ mt: 2, height: 8, borderRadius: 5 }}
              color="info"
            />
            {feedback && (
              <Typography
                variant="h6"
                sx={{
                  mt: 3,
                  color: feedback.includes("Correct") ? "green" : "red",
                  animation: `fadeIn 1s ease-out`,
                }}
              >
                {feedback}
              </Typography>
            )}
          </Box>

          <Box sx={{ width: boardSize, height: boardSize, margin: "0 auto" }}>
            <Chessboard
              position={fen}
              boardWidth={boardSize}
              arePiecesDraggable={false}
              customSquareStyles={highlightStyles}
              customNotationStyle={{ fontSize: "1px" }}
            />
          </Box>

          <Stack
            spacing={2}
            direction={isMobile ? "column" : "row"}
            justifyContent="center"
            alignItems="center"
            mt={3}
          >
            {options.map((opt) => (
              <Button
                key={opt}
                variant="contained"
                onClick={() => handleAnswer(opt)}
                color="primary"
                fullWidth={isMobile}
                sx={{
                  px: 4,
                  py: 1,
                  animation: `${buttonHoverAnimation} 0.3s ease-in-out`,
                  "&:hover": {
                    animation: `${buttonHoverAnimation} 0.3s ease-out`,
                  },
                }}
              >
                {opt.toUpperCase()}
              </Button>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
