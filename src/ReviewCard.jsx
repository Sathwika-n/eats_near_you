import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa"; // Icons for rating and location
import "./review-card.scss"; // CSS for styling the card
import { Box, Typography } from "@mui/material";

const ReviewCard = ({ name, mapsUrl, rating, review, time, location }) => {
  console.log(name);
  return (
    <Box className="review-card">
      <Box className="review-details">
        <Box className="name-time">
          <Typography variant="reviewTitle">{name}</Typography>
          <Typography variant="reviewContent">{time}</Typography>{" "}
        </Box>
        <Box className="rating-location">
          <Box className="rating">
            <FaStar className="icon" />
            <Typography variant="reviewContent">{rating}</Typography>
          </Box>
          <Box className="rating">
            <FaMapMarkerAlt className="icon" />
            <Typography variant="reviewContent">{location}</Typography>
          </Box>
        </Box>

        <Typography variant="reviewContent">{review}</Typography>
      </Box>
    </Box>
  );
};

export default ReviewCard;
