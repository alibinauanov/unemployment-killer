"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Button, Card, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message") || "No message available.";
  const similarityScore = searchParams.get("similarity_score") || "N/A";

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Scan Results
      </Typography>
      <Card style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h5">Results</Typography>
        <Typography variant="body1" mt={2}>
          {message}
        </Typography>
        <Typography variant="body2" mt={1}>
          Match Percentage: {similarityScore}%
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
          >
            Start New Scan
          </Button>
        </Box>
      </Card>
    </Container>
  );
}