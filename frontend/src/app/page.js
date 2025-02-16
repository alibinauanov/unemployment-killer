"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleScan = async () => {
    setLoading(true);
    const formData = new FormData();

    if (resumeFile) {
      formData.append("resume", resumeFile);
    } else if (resumeText) {
      formData.append("resume_text", resumeText);
    } else {
      alert("Please provide a resume.");
      setLoading(false);
      return;
    }

    const jobDescription = document.querySelector(".job-description-textarea").value;
    if (!jobDescription.trim()) {
      alert("Please provide a job description.");
      setLoading(false);
      return;
    }

    formData.append("job_description", jobDescription);

    try {
      console.log("Sending request to backend...");
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);

      router.push(`/result?message=${encodeURIComponent(data.message)}&similarity_score=${data.similarity_score}`);

    } catch (error) {
      console.error("Error fetching results:", error);
      alert("An error occurred during analysis. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom>
        New Scan
      </Typography>
      <Card className={styles.card}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Resume
            </Typography>
            <Box
              className={`${styles.box} ${isDragging ? styles.dragging : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                setResumeFile(e.dataTransfer.files[0]);
                setResumeText("");
              }}
            >
              {!resumeFile ? (
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text or type here..."
                  className={styles.textarea}
                  disabled={resumeFile !== null}
                />
              ) : (
                <Box className={styles.fileInfo}>
                  <Typography variant="body1" fontWeight="bold">
                    {resumeFile.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="error"
                    style={{ cursor: "pointer", marginTop: "8px" }}
                    onClick={() => { setResumeFile(null); setResumeText(""); }}
                  >
                    Delete selected file
                  </Typography>
                </Box>
              )}

              {!resumeFile && (
                <Box className={styles.dragDropOverlay} component="label">
                  Drag & Drop or Upload
                  <input type="file" hidden onChange={(e) => { setResumeFile(e.target.files[0]); setResumeText(""); }} />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <Box className={styles.descriptionBox}>
              <textarea
                placeholder="Copy and paste job description here..."
                className={`${styles.descriptionTextarea} job-description-textarea`}
              />
            </Box>
          </Grid>
        </Grid>
        <Box textAlign="right" mt={2}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? "Scanning..." : "Scan"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}