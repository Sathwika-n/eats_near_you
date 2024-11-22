import React from "react";
import "./restaurant-detail.scss";
import { Box } from "@mui/material";
import { useRestaurantDetails } from "./services/api";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import GoogleMapComponent from "./GoogleMapComponent";

function RestaurantDetail() {
  const location = useLocation();
  const { data, isLoading, error } = useRestaurantDetails(
    location.state.restaurant_id
  );
  return (
    <Box className="restaurant-detail">
      {isLoading ? (
        <Loader />
      ) : (
        <Box>
          {data.details.name}
          <GoogleMapComponent />
        </Box>
      )}
    </Box>
  );
}

export default RestaurantDetail;
