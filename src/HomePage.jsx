import { Box, Typography } from "@mui/material";
import React from "react";
import "./homepage.scss";
import ContactUs from "./ContactUs";
import AboutUs from "./About";
import Search from "./Search";
import CardSlider from "./CardSlider";
import ImageSlider from "./ImageSlider";
function HomePage() {
  return (
    <Box className="homepage">
      <Box
        id="search"
        className="section"
        // style={{ backgroundColor: "#82b6d9" }}
      >
        <Box className="content">
          <Search />
          {/* <CardSlider /> */}
          {/* <ImageSlider /> */}
        </Box>
      </Box>
      <Box
        id="about"
        className="section"
        // style={{ backgroundColor: "#A0E77D" }}
      >
        <Box className="content">
          <AboutUs />
        </Box>
      </Box>
      <Box
        id="contactus"
        className="section"
        // style={{ backgroundColor: "#ef8677" }}
      >
        <Box className="content">
          <ContactUs />
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
