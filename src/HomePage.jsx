import { Box, Typography } from "@mui/material";
import React from "react";
import "./homepage.scss";
import ContactUs from "./ContactUs";
import AboutUs from "./About";
import Search from "./Search";
function HomePage() {
  return (
    <Box className="homepage">
      <Box id="search" className="section">
        <Box className="content">
          <Search />
        </Box>
      </Box>
      <Box id="about" className="section">
        <Box className="content">
          <AboutUs />
        </Box>
      </Box>
      <Box id="contactus" className="section">
        <Box className="content">
          <ContactUs />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
