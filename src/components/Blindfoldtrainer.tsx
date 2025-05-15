"use client";

import { useEffect, useState, useMemo } from "react";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import Fade from "@mui/material/Fade";
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
import ShareIcon from "@mui/icons-material/Share";
import copy from "copy-to-clipboard";

type Difficulty = "easy" | "medium" | "hard";

interface CoordinateTrainerProps {
  difficulty: Difficulty;
}

export default function BlindfoldTrainer({ difficulty }: CoordinateTrainerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const allFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const allRanks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const pieceTypes = ["p", "k", "n", "b", "q", "r"];
  const side = ["b", "w"];

  const getRandomSquare = () =>
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

  const getHideDelay = () => {
    switch (difficulty) {
      case "easy":
        return 10;
      case "medium":
        return 7;
      case "hard":
        return 5;
    }
  };

  const [fen, setFen] = useState("");
  const [targetSquare, setTargetSquare] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [showBoard, setShowBoard] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLimit());
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [hideCountdown, setHideCountdown] = useState(getHideDelay());
  const [copiedText, setCopiedText] = useState<string>("");

  const gameOver = !started && timeLeft === 0;
  
  const totalAttempts = useMemo(() => correct + incorrect, [correct, incorrect]);
  const correctPercentage = useMemo(() => 
    totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0, 
    [correct, totalAttempts]
  );
  const incorrectPercentage = useMemo(() => 
    totalAttempts > 0 ? Math.round((incorrect / totalAttempts) * 100) : 0,
    [incorrect, totalAttempts]
  );

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

  useEffect(() => {
    if (!showBoard) return;

    let countdown = getHideDelay();
    setHideCountdown(countdown);
    const countdownInterval = setInterval(() => {
      countdown--;
      setHideCountdown(countdown);
      if (countdown <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showBoard]);

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
      chess.put({ type: piece, color }, square as Square);

      if (i === 0) {
        chosenTarget = square;
      }
    }

    setFen(chess.fen());
    setTargetSquare(chosenTarget);
    setOptions(generateOptions(chosenTarget));
    setShowBoard(true);
    setFeedback(null);

    setTimeout(() => setShowBoard(false), getHideDelay() * 1000);
  };

  const handleAnswer = (selected: string) => {
    if (selected === targetSquare) {
      setCorrect((c) => c + 1);
      setFeedback("✅ Correct!");
    } else {
      setIncorrect((i) => i + 1);
      setFeedback("❌ Wrong.");
    }
    setTimeout(nextPosition, 1000);
  };

  const startGame = () => {
    setCorrect(0);
    setIncorrect(0);
    setTimeLeft(getTimeLimit());
    setStarted(true);
    setCopiedText("");
    nextPosition();
  };
  
  const formatDifficulty = (diff: Difficulty) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };
  
   const handleShare = () => {
    const shareText = `Chesslise coordinates challenge!\n${correctPercentage}% right\n${incorrectPercentage}% wrong\nI got ${correct} correct out of ${totalAttempts} in ${formatDifficulty(difficulty)} mode!`;
    
    try {
      // Use the copy-to-clipboard library
      const success = copy(shareText);
      
      if (success) {
        setCopiedText(shareText);
      } else {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Copy operation failed:', err);
    }
  };

  const highlightAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  `;

  const highlightStyles = showBoard
    ? {
        [targetSquare]: {
          background: "radial-gradient(circle, #8413F0 40%, transparent 70%)",
          borderRadius: "50%",
          animation: `${highlightAnimation} 0.8s ease-out`,
        },
      }
    : {};

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const boardSize = isMobile
    ? Math.min(window.innerWidth * 0.9, 320)
    : 600;

  return (
    <Box sx={{ textAlign: "center", mt: 4, px: 2 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Blindfold Trainer
      </Typography>

      {!started && !gameOver ? (
        <>
          <Paper elevation={3} sx={{ p: 2, mx: "auto", maxWidth: 600, mb: 4 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Memorize the board. After a few seconds, it disappears. Identify
              square location of the piece Note: the board point of view is from white side
            </Typography>
            <Alert severity="info">
              {difficulty === "easy" && "🟢 Easy: Board hides after 10s"}
              {difficulty === "medium" && "🟡 Medium: Board hides after 7s"}
              {difficulty === "hard" && "🔴 Hard: Board hides after 5s"}
            </Alert>
          </Paper>
          <Button variant="contained" size="large" onClick={startGame} fullWidth={isMobile}>
            Start Game
          </Button>
        </>
      ) : gameOver ? (
        <>
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⏰ Time is up!
          </Alert>
          
          <Paper elevation={3} sx={{ p: 3, mx: "auto", maxWidth: 600, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Your Results
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-around', mb: 2 }}>
              <Box>
                <Typography variant="h6">Total Attempts:</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalAttempts}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: isMobile ? 2 : 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="body1">
                    <strong>{correct}</strong> correct ({correctPercentage}%)
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelIcon color="error" />
                  <Typography variant="body1">
                    <strong>{incorrect}</strong> incorrect ({incorrectPercentage}%)
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Copy to share your results
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShareIcon />}
              onClick={handleShare}
              sx={{ mt: 1 }}
            >
              Copy Results
            </Button>
            
            {copiedText && (
              <Paper 
                elevation={1} 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  whiteSpace: 'pre-line'
                }}
              >
                <Typography variant="body2" fontFamily="monospace">
                  {copiedText}
                </Typography>
              </Paper>
            )}
          </Paper>
          
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button variant="contained" onClick={startGame} fullWidth={isMobile}>
              Try Again
            </Button>
            <Button variant="outlined" color="secondary" href="/blindfold" fullWidth={isMobile}>
              Home
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Box sx={{ maxWidth: 600, mx: "auto", mb: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Chip
                icon={<AccessTimeIcon />}
                label={`Time: ${formatTime(timeLeft)}`}
                color="info"
              />
              <Chip
                icon={<CheckCircleIcon />}
                label={`Correct: ${correct}`}
                color="success"
              />
              <Chip
                icon={<CancelIcon />}
                label={`Incorrect: ${incorrect}`}
                color="error"
              />
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
                }}
              >
                {feedback}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: boardSize,
              aspectRatio: "1 / 1",
              mx: "auto",
            }}
          >
            <Fade in={showBoard} timeout={800} unmountOnExit>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <LinearProgress
                  variant="determinate"
                  value={(hideCountdown / getHideDelay()) * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 5, width: "90%", mx: "auto" }}
                  color="warning"
                />
                <Chessboard
                  position={fen}
                  boardWidth={boardSize}
                  arePiecesDraggable={false}
                  customSquareStyles={highlightStyles}
                  customNotationStyle={{ fontSize: "1px" }}
                />
              </Box>
            </Fade>

            <Fade in={!showBoard} timeout={800} unmountOnExit>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Chessboard
                  position=""
                  boardWidth={boardSize}
                  arePiecesDraggable={false}
                  customNotationStyle={{ fontSize: "1px" }}
                />
                <Stack
                  spacing={2}
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="center"
                  alignItems="center"
                  mt={3}
                >
                  {options.sort().map((opt) => (
                    <Button
                      key={opt}
                      variant="contained"
                      onClick={() => handleAnswer(opt)}
                      fullWidth={isMobile}
                    >
                      {opt.toLocaleLowerCase()}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Box>
        </>
      )}
    </Box>
  );
}