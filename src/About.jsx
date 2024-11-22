import { Box, Typography } from "@mui/material";
import React from "react";
import "./about.scss";
import AboutusBox from "./AboutusBox";
import Grid from "@mui/material/Grid2";

const AboutUs = () => {
  return (
    <Box className="about-container">
      <Box className="title">
        <Typography variant="columnHeading">About Us</Typography>
        <Typography variant="body">
          Welcome to <strong>Eats Near You</strong>, your trusted companion for
          discovering the best dining experiences near you!
        </Typography>
      </Box>
      <Box className="title">
        <Typography variant="body">
          We understand that finding the perfect place to eat—whether for a
          casual outing, a family dinner, or a special occasion—can be a
          challenge. That's why we've created a platform that makes it easy for
          you to explore top-rated restaurants customized to your preferences.
        </Typography>
      </Box>

      <Box className="what-we-offer">
        <Typography variant="columnHeading">What We Offer</Typography>
        <Box className="offers">
          <Typography variant="body">
            <strong>Personalized Recommendations:</strong> Use our search
            feature to find restaurants that match your tastes and location.
          </Typography>
          <Typography variant="body">
            <strong>Ratings and Reviews:</strong> We curate authentic ratings
            and reviews from fellow food enthusiasts to help you make delicious
            decisions.
          </Typography>
          <Typography variant="body">
            <strong>Convenience at Your Fingertips:</strong> From cozy cafes to
            fine dining, we ensure you'll always find the best options nearby.
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={2} className="missions">
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <AboutusBox
            title={"Our Mission"}
            text={
              " At Eats Near You, we aim to connect people with great food and memorable dining experiences. Whether you're exploring new cuisines or revisiting favorites, our platform is designed to save you time and effort while delivering excellent results."
            }
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <AboutusBox
            title={"Why Choose Us?"}
            text={
              "Up-to-date information about restaurants and reviews. A growing community of food lovers who share their experiences. We're more than just a search tool; we're your gateway to discovering the flavors of your favorite destinations and beyond."
            }
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          <AboutusBox
            title={"Join Us on This Culinary Journey"}
            text={
              "Start exploring now and let Eats Near You guide you to your next favorite meal!"
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
