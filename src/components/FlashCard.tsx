"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type FlashCard = {
  fen: string;
  comment: string;
};

const FlashCardPage: React.FC = () => {
  const [pgn, setPgn] = useState("");
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [newFen, setNewFen] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    const cleanedPGN = pgn.replace(/\{[^}]*clk[^}]*\}/gi, "").trim();
    const chess = new Chess();
    const ok = chess.loadPgn(cleanedPGN);
    const comments = chess.getComments();
    setCards(comments);
    setCurrent(0);
    setFlipped(false);
    setEditedComment(comments[0]?.comment ?? "");
  };

  const next = () => {
    const nextIndex = (current + 1) % cards.length;
    setCurrent(nextIndex);
    setEditedComment(cards[nextIndex]?.comment ?? "");
    setFlipped(false);
  };

  const prev = () => {
    const prevIndex = (current - 1 + cards.length) % cards.length;
    setCurrent(prevIndex);
    setEditedComment(cards[prevIndex]?.comment ?? "");
    setFlipped(false);
  };

  const handleUpdate = () => {
    const updatedCards = [...cards];
    updatedCards[current].comment = editedComment;
    setCards(updatedCards);
  };

  const handleAdd = () => {
    if (!newFen || !newComment) {
      alert("Please enter both FEN and comment.");
      return;
    }

    const newCard: FlashCard = {
      fen: newFen,
      comment: newComment,
    };

    const updatedCards = [...cards];
    updatedCards.splice(current + 1, 0, newCard);
    setCards(updatedCards);
    setCurrent(current + 1);
    setEditedComment(newComment);
    setAddMode(false);
    setNewFen("");
    setNewComment("");
  };

  const handleDelete = () => {
    if (cards.length === 1) {
      alert("Cannot delete the only flashcard.");
      return;
    }

    const updatedCards = [...cards];
    updatedCards.splice(current, 1);
    const newIndex = current === 0 ? 0 : current - 1;
    setCards(updatedCards);
    setCurrent(newIndex);
    setEditedComment(updatedCards[newIndex]?.comment ?? "");
  };

  const handleDownloadAll = async () => {
    if (!printRef.current) return;

    // Show loading indicator
    setIsLoading(true);

    try {
      // Hide the print container from view but make it renderable
      if (printRef.current) {
        printRef.current.style.opacity = "1";
        printRef.current.style.zIndex = "-1"; // Keep it hidden from view
      }

      const pdf = new jsPDF("landscape", "pt");
      const margin = 40; // Add some margin

      const flashcards = Array.from(
        printRef.current.querySelectorAll(".flashcard")
      );

      for (let i = 0; i < flashcards.length; i++) {
        const card = flashcards[i] as HTMLElement;

        // Ensure card is visible before capturing
        card.style.display = "flex";

        const canvas = await html2canvas(card, {
          scale: 2, // Better quality
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        // Calculate dimensions while maintaining aspect ratio
        const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        let pdfWidth = pageWidth;
        let pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        // If the image is too tall, scale it down
        if (pdfHeight > pageHeight) {
          pdfHeight = pageHeight;
          pdfWidth = (imgWidth * pdfHeight) / imgHeight;
        }

        // Add new page for each card after the first
        if (i > 0) pdf.addPage();

        // Center the image on the page
        const xPos = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
        const yPos = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

        pdf.addImage(imgData, "PNG", xPos, yPos, pdfWidth, pdfHeight);
      }

      pdf.save("chess_flashcards.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      // Hide the print container again and remove loading state
      if (printRef.current) {
        printRef.current.style.opacity = "0";
        printRef.current.style.zIndex = "-1";
      }
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Flashcard Generator
      </Typography>

      <Typography variant="h6" mt={4} >
            Generate cards from PGN annontations to view chess annontations in cards view, download the cards to study them in real
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

          <Box mt={4}>
            <TextField
              label="Edit Comment"
              fullWidth
              multiline
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" onClick={handleUpdate}>
                Update
              </Button>

              {addMode ? (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => setAddMode(false)}
                >
                  Cancel Add
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => setAddMode(true)}
                >
                  Add New After
                </Button>
              )}

              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>

              <Button
                variant="outlined"
                onClick={handleDownloadAll}
                disabled={isLoading}
              >
                {isLoading ? "Generating PDF..." : "Download All as PDF"}
              </Button>
            </Stack>
          </Box>

          {/* Enhanced loading indicator with better visuals */}
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            open={isLoading}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: 4,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <CircularProgress color="inherit" size={60} />
              <Typography variant="h6">Generating PDF...</Typography>
              <Typography
                variant="body2"
                sx={{ maxWidth: 300, textAlign: "center" }}
              >
                This may take a moment depending on the number of flashcards.
              </Typography>
            </Box>
          </Backdrop>

          {addMode && (
            <Box width="100%" mt={4}>
              <TextField
                label="New FEN"
                fullWidth
                value={newFen}
                onChange={(e) => setNewFen(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Comment"
                fullWidth
                multiline
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleAdd}>
                  Confirm Add
                </Button>
              </Stack>
            </Box>
          )}

          {/* Improved container for PDF rendering */}
          <Box
            ref={printRef}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "#ffffff",
              padding: 4,
              zIndex: -1,
              opacity: 0,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "opacity 0.3s ease",
            }}
          >
            {cards.map((card, index) => (
              <Box
                key={index}
                className="flashcard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  padding: 4,
                  border: "2px solid #000",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  width: "800px",
                  height: "400px",
                  pageBreakAfter: "always",
                }}
              >
                <Box sx={{ width: "350px", flexShrink: 0 }}>
                  <Chessboard
                    position={card.fen}
                    arePiecesDraggable={false}
                    boardWidth={350}
                  />
                </Box>
                <Box
                  sx={{
                    width: "400px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "normal",
                      color: "#000000",
                    }}
                  >
                    {card.comment}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default FlashCardPage;
