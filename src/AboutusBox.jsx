import React from "react";
import "./AboutusBox.scss"; // CSS for styling the card
import { Box, Typography } from "@mui/material";

const AboutusBox = ({ title, text }) => {
  return (
    <Box className="about-card">
      <Box className="about-title">
        <Typography variant="reviewTitle">{title}</Typography>
      </Box>
      <Box className="about-text">
        <Typography variant="body">{text}</Typography>
      </Box>
    </Box>
  );
};

export default AboutusBox;
