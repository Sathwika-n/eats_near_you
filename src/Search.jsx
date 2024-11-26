import React, { useState } from "react";
import { reverseGeocode, searchRestaurants } from "./services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import mockdata from "./mockdata.json";
import RestaurantCard from "./RestaurantCard";
import Slider from "react-slick";
import Slider2 from "@mui/material/Slider";
import Loader from "./Loader";
import "./search.scss";
import "./loader.scss";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import noImage from "../src/assets/noImage.png";
import NotifyAlert from "./NotifyAlert";

function Search() {
  const [mutationError, setMutationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [searchData, setSearchData] = useState({
    location: "Hyderabad",
    radius: "10",
  });
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

  const settings = {
    dots: true, // Pagination dots below slider
    infinite: false, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 4, // Show 4 cards at a time
    slidesToScroll: 4, // Scroll 1 card at a time
    responsive: [
      {
        breakpoint: 1024, // Medium-sized screens (like tablets)
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768, // Small-sized screens (like phones)
        settings: { slidesToShow: 2, centerMode: true, centerPadding: "20px" },
      },
      {
        breakpoint: 480, // Extra small screens (like mobile phones)
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "20px" },
      },
    ],
  };

  const searchResMutation = useMutation({
    mutationFn: searchRestaurants,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      setIsLoading(false);
      setData(data);
    },
    onError: (error) => {
      console.error("Mutation failed!", error?.response?.data?.detail);
      setMutationError(error?.response?.data?.detail);
      setIsLoading(false);
    },
  });
  const reverseGeocodeMutation = useMutation({
    mutationFn: reverseGeocode,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      handleOpen("success", "Location Fetched!");
      setIsLocationLoading(false);
      setSearchData((prevValues) => ({
        ...prevValues,
        location: data?.location,
      }));
    },
    onError: (error) => {
      console.error("Mutation failed!", error);
      handleOpen("error", "Unable to fetch location!");
      setLocationError(error?.response?.data?.detail);
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
    setMutationError(null);

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
          //   setCurrentLocation({ latitude, longitude });
          reverseGeocodeMutation.mutate({
            latitude: latitude,
            longitude: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
  return (
    <Box className="search-container">
      <NotifyAlert
        open={alertOpen?.openState}
        onClose={handleClose}
        severity={alertOpen?.severity}
        message={alertOpen?.message}
      />
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

  // return (
  //   <Box className="search-container" sx={{ maxWidth: "1400px" }}>

  //     <Box sx={{ display: "flex" }}>
  //       <TextField
  //         required
  //         name="location"
  //         type="text"
  //         placeholder="Your Location"
  //         value={searchData?.location || ""}
  //         onChange={handleSearchInputChange}
  //         margin="normal"
  //       />
  //       {/* <Button variant="contained" onClick={handleGetCurrentLocation}> */}
  //       {isLocationLoading ? (
  //         <Loader />
  //       ) : (
  //         <MyLocationIcon
  //           onClick={handleGetCurrentLocation}
  //           sx={{ cursor: "pointer" }}
  //         />
  //       )}

  //       {/* </Button> */}
  //       {/* {formErrors.email && (
  //         <FormHelperText error sx={{ marginLeft: 2, fontStyle: "DM Sans" }}>
  //           {formErrors.email}
  //         </FormHelperText>
  //       )} */}
  //     </Box>
  //     <Box>
  //       <Slider2
  //         value={searchData?.radius} // Bind the state to the slider value
  //         onChange={handleSliderChange} // Update state on slider value change
  //         defaultValue={50} // Initial value
  //         valueLabelDisplay="auto" // Show the value on the slider
  //         min={0} // Set min value
  //         max={1000} // Set max value
  //         aria-label="Slider"
  //       />
  //     </Box>

  //     {isLoading ? (
  //       <Loader />
  //     ) : (
  //       <Button variant="signUp" onClick={handleSearch}>
  //         Explore
  //       </Button>
  //     )}

  //     {data?.length > 0 ? (
  //       <Slider {...settings} className="slider">
  //         {data?.map((restaurant, index) => (
  //           <Box key={index} className="restaurant-card-wrapper">
  //             <RestaurantCard
  //               name={restaurant.name}
  //               imageUrl={restaurant.photo_url}
  //               rating={restaurant.rating}
  //               location={restaurant.address}
  //             />
  //           </Box>
  //         ))}
  //       </Slider>
  //     ) : (
  //       <Typography variant="haveAccount"> No Restaurants Found.</Typography>
  //     )}
  //   </Box>
  // );
}

export default Search;
