"use client";

import React, { useState } from "react";
import {
  Container,
  Card,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import styles from "./main.module.css";

export default function Main() {
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeText, setResumeText] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setResumeFile(file);
    setResumeText(""); // Disable text input after file upload
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setResumeText(""); // Disable text input after file upload
  };

  const handleDelete = () => {
    setResumeFile(null);
    setResumeText(""); // Allow text input after file deletion
  };

  const handleResumeChange = (e) => {
    setResumeText(e.target.value);
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom>
        New Scan
      </Typography>
      <Card className={styles.card}>
        <Grid container spacing={2}>
          {/* Resume Section */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Resume
            </Typography>
            <Box
              className={`${styles.box} ${isDragging ? styles.dragging : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!resumeFile ? (
                <textarea
                  value={resumeText}
                  onChange={handleResumeChange}
                  placeholder="Paste resume text or type here..."
                  className={styles.textarea}
                  disabled={resumeFile !== null} // Disable text input if a file is uploaded
                />
              ) : (
                <Box className={styles.fileInfo}>
                  <Typography variant="body1" fontWeight="bold">
                    {resumeFile.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error"
                    style={{
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                    onClick={handleDelete}
                  >
                    Delete selected file
                  </Typography>
                </Box>
              )}

              {/* Drag & Drop Overlay */}
              {!resumeFile && (
                <Box className={styles.dragDropOverlay} component="label">
                  Drag & Drop or Upload
                  <input type="file" hidden onChange={handleUpload} />
                </Box>
              )}
            </Box>
          </Grid>

          {/* Job Description Section */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Box className={styles.descriptionBox}>
              <textarea
                placeholder="Copy and paste job description here..."
                className={styles.descriptionTextarea}
              />
            </Box>
          </Grid>
        </Grid>
        <Box textAlign="right" mt={2}>
          <Button variant="contained" size="large" color="primary">
            Scan
          </Button>
        </Box>
      </Card>
    </Container>
  );
}