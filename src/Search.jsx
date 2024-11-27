import React, { useEffect, useState } from "react";
import { reverseGeocode, searchRestaurants } from "./services/api";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import RestaurantCard from "./RestaurantCard";
import Slider2 from "@mui/material/Slider";
import Loader from "./Loader";
import "./search.scss";
import "./loader.scss";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import noImage from "../src/assets/noImage.png";
import { useAlert } from "./AlertProvider";

function Search() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchData, setSearchData] = useState({
    location: "",
    radius: "10",
  });
  const { showAlert } = useAlert();

  useEffect(() => {
    const storedData = sessionStorage.getItem("nearby-restaurants");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const searchResMutation = useMutation({
    mutationFn: searchRestaurants,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      setIsLoading(false);
      setData(data);
      sessionStorage.setItem("nearby-restaurants", JSON.stringify(data));
    },
    onError: (error) => {
      console.error("Mutation failed!", error?.response?.data?.detail);
      showAlert("error", error?.response?.data?.detail);
      setIsLoading(false);
    },
  });
  const reverseGeocodeMutation = useMutation({
    mutationFn: reverseGeocode,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      showAlert("success", "Location Fetched!");
      setIsLocationLoading(false);
      setSearchData((prevValues) => ({
        ...prevValues,
        location: data?.location,
      }));
    },
    onError: (error) => {
      console.error("Mutation failed!", error);
      showAlert("error", "Unable to fetch location!");
      setIsLocationLoading(false);
    },
  });

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;

    setSearchData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSliderChange = (event, newValue) => {
    setSearchData((prevValues) => ({
      ...prevValues,
      radius: newValue, // Only update the radius, not the entire state
    }));
  };
  const handleSearch = () => {
    setIsLoading(true);

    searchResMutation.mutate({
      location: searchData?.location,
      radius: searchData?.radius,
      user_id: JSON.parse(sessionStorage.getItem("user"))?.user_id,
    });
  };
  const handleGetCurrentLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocodeMutation.mutate({
            latitude: latitude,
            longitude: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          showAlert(
            "error",
            "Unable to fetch location. Please enable location services."
          );
          setIsLocationLoading(false);
        }
      );
    } else {
      showAlert("Geolocation is not supported by your browser.");
      setIsLocationLoading(false);
    }
  };
  return (
    <Box className="search-container">
      <Box className="search-form">
        <Typography variant="title" className="text-class">
          Start Exploring
        </Typography>
        <Box className="form-data">
          <Box className="fields">
            <TextField
              className="textfield-class"
              required
              name="location"
              type="text"
              placeholder="Your Location"
              value={searchData?.location || ""}
              onChange={handleSearchInputChange}
              margin="normal"
            />
            {isLocationLoading ? (
              <Loader />
            ) : (
              <MyLocationIcon
                onClick={handleGetCurrentLocation}
                className="location-icon"
              />
            )}
          </Box>

          <Box className="radius">
            <Typography variant="body" sx={{ textAlign: "center" }}>
              Select the radius below to find nearby restaurants (in miles)
            </Typography>
            <Slider2
              value={searchData?.radius} // Bind the state to the slider value
              onChange={handleSliderChange} // Update state on slider value change
              defaultValue={searchData?.radius} // Initial value
              valueLabelDisplay="auto" // Show the value on the slider
              marks
              step={2}
              min={0} // Set min value
              max={40} // Set max value
              aria-label="Slider"
              sx={{
                color: "#f50159",
              }}
            />
          </Box>
        </Box>
        {isLoading ? (
          <Loader />
        ) : (
          <Button
            variant="contained"
            className="button-class"
            onClick={handleSearch}
          >
            Explore
          </Button>
        )}
      </Box>
      {Array.isArray(data) && data.length > 0 ? (
        <Grid container spacing={2} className="restaurants-list">
          {data.map((restaurant, index) => (
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={restaurant.id}
              className="restaurant-card-wrapper"
            >
              <RestaurantCard
                name={restaurant.name}
                imageUrl={restaurant.photo_url || noImage}
                rating={restaurant.rating}
                location={restaurant.address}
                restaurant_id={restaurant.id}
                isFavorite={restaurant.isFavorite}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        data && (
          <Typography variant="haveAccount">No Restaurants Found.</Typography>
        )
      )}
    </Box>
  );
}

export default Search;
