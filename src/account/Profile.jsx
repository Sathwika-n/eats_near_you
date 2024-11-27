import React, { useState } from "react";
import "./profile.scss";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import RestaurantCard from "../RestaurantCard";
import { useUserFavourites, useUserReviews } from "../services/api";
import ReviewCard from "../ReviewCard";
import Loader from "../Loader";
import { parseISO, formatDistanceToNow } from "date-fns";

const Profile = () => {
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    error: isReviewsError,
  } = useUserReviews(JSON.parse(sessionStorage.getItem("user"))?.user_id);

  const {
    data: favouritesData,
    isLoading: isFavouritesLoading,
    error: isFavouritesError,
  } = useUserFavourites(JSON.parse(sessionStorage.getItem("user"))?.user_id);

  // Utility function for title casing
  function toTitleCase(text) {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // UI for loading and error states
  // Main content
  return (
    <Box className="profile-content">
      <Box className="profile-title">
        <Typography variant="columnHeading" color="#004687">
          MY PROFILE
        </Typography>
      </Box>
      <Box className="profile-details-container">
        <Box className="profile-details">
          <Box className="profile">
            <Typography variant="boldHaveAccount">Full Name:</Typography>
            <Typography variant="cardTitle">
              {toTitleCase(
                JSON.parse(sessionStorage.getItem("user"))?.username
              )}
            </Typography>
          </Box>
          <Box className="profile">
            <Typography variant="boldHaveAccount">Email:</Typography>
            <Typography variant="cardTitle">
              {toTitleCase(JSON.parse(sessionStorage.getItem("user"))?.email)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Grid container className="tabs">
        <Grid item size={{ xs: 12, sm: 6 }}>
          <Box className="favourites">
            <Typography variant="category" color="#004687">
              FAVOURITES
            </Typography>
            {isFavouritesLoading ? (
              <Loader />
            ) : favouritesData?.length > 0 ? (
              <Grid container spacing={2} className="restaurants-list">
                {favouritesData?.map((restaurant, index) => (
                  <Grid
                    item
                    size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
                    key={index}
                    className="restaurant-card-wrapper"
                  >
                    <RestaurantCard
                      name={restaurant.name}
                      imageUrl={
                        restaurant.image || "https://placehold.co/300x300"
                      }
                      rating={restaurant.rating}
                      location={restaurant.location}
                      restaurant_id={restaurant.id}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="haveAccount">No Favourites</Typography>
            )}
          </Box>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6 }}>
          <Box className="my-reviews">
            <Typography variant="category" color="#004687">
              MY REVIEWS
            </Typography>
            {isReviewsLoading ? (
              <Loader />
            ) : reviewsData?.length > 0 ? (
              <Grid container spacing={1} className="grid">
                {reviewsData?.map((restaurant, index) => (
                  <Grid
                    item
                    size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
                    key={index}
                  >
                    <ReviewCard
                      key={index}
                      name={restaurant.restaurant_name}
                      rating={restaurant.rating}
                      location={restaurant.restaurant_address}
                      review={restaurant.review_text}
                      mapsUrl={restaurant?.maps_url}
                      time={formatDistanceToNow(
                        parseISO(restaurant.created_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="haveAccount">No Reviews</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
