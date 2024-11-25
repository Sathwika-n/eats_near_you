import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa"; // Icons for rating and location
import "./review-card.scss"; // CSS for styling the card
import { Avatar, Box, Typography, Button, Rating } from "@mui/material";
import useDelayedImage from "./UseDelayedImage";

const MAX_REVIEW_LENGTH = 100; // Adjust this value as needed

const ReviewCard = ({
  name,
  mapsUrl,
  rating,
  review,
  time,
  location,
  avatar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const delayedAvatar = useDelayedImage(avatar, 1000);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const renderReviewContent = () => {
    if (isExpanded || review?.length <= MAX_REVIEW_LENGTH) {
      return review;
    }
    return `${review?.slice(0, MAX_REVIEW_LENGTH)}...`;
  };

  return (
    <Box
      className="review-card"
      onClick={() => {
        if (mapsUrl) {
          window.open(mapsUrl, "_blank");
        }
      }}
    >
      <Box className="review-details">
        <Box className="name-time">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {delayedAvatar && (
              <Avatar alt="Remy Sharp" loading="lazy" src={delayedAvatar} />
            )}
            <Typography variant="reviewTitle">{name}</Typography>
          </Box>
          <Typography variant="reviewContent">{time}</Typography>
        </Box>
        <Box className="rating-location">
          <Box className="rating">
            <FaStar className="icon" />
            <Typography variant="reviewContent">{rating}</Typography>
          </Box>
          <Box className="rating">
            {location && <FaMapMarkerAlt className="icon" />}
            <Typography variant="reviewContent">{location}</Typography>
          </Box>
        </Box>

        <Typography variant="reviewContent">{renderReviewContent()}</Typography>
        {review?.length > MAX_REVIEW_LENGTH && (
          <Button
            disableTouchRipple
            disableRipple
            disableFocusRipple
            onClick={handleToggleExpand}
            size="small"
            variant="text"
            color="primary"
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
          >
            {isExpanded ? "View Less" : "View More"}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReviewCard;
