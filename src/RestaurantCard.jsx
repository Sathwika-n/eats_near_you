import React, { useEffect, useState } from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa"; // Icons for rating and location
import "./restaurant-card.scss"; // CSS for styling the card
import { Box, IconButton, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMutation } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "./services/api";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import NotifyAlert from "./NotifyAlert";

const RestaurantCard = ({
  name,
  imageUrl,
  rating,
  location,
  restaurant_id,
  isFavorite,
}) => {
  const queryClient = useQueryClient();
  const locationR = useLocation();
  const navigate = useNavigate();
  const [isFavoriteCard, setIsFavoriteCard] = useState(isFavorite ?? true);
  const [alertOpen, setAlertOpen] = useState({
    openState: false,
    severity: "info", // Default severity
    message: "", // Message to display
  });
  const handleOpen = (severity, message) => {
    setAlertOpen({
      openState: true,
      severity: severity,
      message: message,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    event.stopPropagation();
    setAlertOpen((prev) => ({ ...prev, openState: false }));
  };

  useEffect(() => {
    if (locationR.pathname === "/profile") {
      setIsFavoriteCard(true);
    }
  });
  function toTitleCase(text) {
    return text
      ?.toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const addMutation = useMutation({
    mutationFn: addFavorite, // Ensure addFavorite is the mutation function
    onSuccess: (data) => {
      handleOpen("success", "Added Favorite!");
      console.log("Added Favorite", data);
      queryClient.invalidateQueries(["userFavourites"]);
    },
    onError: (error) => {
      handleOpen("error", "Unable to Add Favorite!");
      setIsFavoriteCard((prev) => !prev);
      console.error("Unable to add Favorite", error);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite, // Ensure addFavorite is the mutation function
    onSuccess: (data) => {
      handleOpen("success", "Removed Favorite!");
      console.log("Removed Favorite", data);
      queryClient.invalidateQueries(["userFavourites"]);
    },
    onError: (error) => {
      handleOpen("error", "Unable to Remove Favorite!");
      setIsFavoriteCard((prev) => !prev);
      console.error("Unable to remove Favorite", error);
    },
  });

  const handleFavoriteToggle = () => {
    setIsFavoriteCard((prev) => !prev);
    if (isFavoriteCard) {
      removeMutation.mutate({
        user_id: JSON.parse(sessionStorage.getItem("user")).user_id,
        restaurant_id: restaurant_id,
      });
    } else if (!isFavoriteCard) {
      addMutation.mutate({
        user_id: JSON.parse(sessionStorage.getItem("user"))?.user_id,
        restaurant_id: restaurant_id,
      });
    }

    // setIsFavorited((prev) => !prev);
  };
  return (
    <Box
      className="restaurant-card"
      onClick={() => {
        navigate("/restaurantDetail", {
          state: { restaurant_id: restaurant_id },
        });
      }}
    >
      <NotifyAlert
        open={alertOpen?.openState}
        onClose={handleClose}
        severity={alertOpen?.severity}
        message={alertOpen?.message}
      />
      {/* Image Section */}
      <img src={imageUrl} alt={`${name}`} className="restaurant-image" />

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteToggle();
        }}
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          backgroundColor: isFavoriteCard ? "#fc7b6b" : "#e0e0e0",
          color: isFavoriteCard ? "#fff" : "#000",
          "&:hover": {
            backgroundColor: isFavoriteCard ? "#e25445" : "#d0d0d0",
          },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        {isFavoriteCard ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      {/* Details Section */}
      <Box className="restaurant-details" sx={{ position: "relative" }}>
        <Typography variant="cardTitle">{toTitleCase(name)}</Typography>
        <Box className="restaurant-info">
          <Box className="restaurant-rating">
            <FaStar className="icon" />
            <span>{rating}</span>
          </Box>
          <Box className="restaurant-location">
            <FaMapMarkerAlt className="icon" />
            <span>{location}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RestaurantCard;
