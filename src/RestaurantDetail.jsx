import React, { useEffect, useState } from "react";
import "./restaurant-detail.scss";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  Rating,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import {
  addReview,
  useRestaurantDetails,
  useUserReviewsByRestaurant,
} from "./services/api";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import GoogleMapComponent from "./GoogleMapComponent";
import ReviewCard from "./ReviewCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { parseISO, formatDistanceToNow } from "date-fns";
import NotifyAlert from "./NotifyAlert";
function RestaurantDetail() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useRestaurantDetails(
    location.state.restaurant_id
  );
  const {
    data: reviewData,
    isLoading: isReviewsLoading,
    error: isError,
  } = useUserReviewsByRestaurant(location.state.restaurant_id);

  const [review, setReview] = useState({ rating: 0, review: "" });
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedImage("");
  };

  const {
    details: {
      name,
      formatted_address,
      international_phone_number,
      website,
      geometry,
      photos,
      reviews,
      url,
    } = {},
  } = data || {};

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const addReviewMutation = useMutation({
    mutationFn: addReview,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      handleOpen("success", "Review Added");
      queryClient.invalidateQueries(["userReviewsByRestaurant"]);

      // setMutationResponse(data?.message);
      // setIsLoading(false);
      setReview({
        rating: 0,
        review: "",
      });
      // setMutationState("success");
    },
    onError: (error) => {
      console.error("Mutation failed!", error);
      handleOpen("error", "Cannot add Review");
      // setMutationResponse(error?.response?.data?.detail);
      // setIsLoading(false);
    },
  });
  const handleSubmitReview = () => {
    addReviewMutation.mutate({
      user_id: JSON.parse(sessionStorage.getItem("user"))?.user_id,
      restaurant_id: location.state.restaurant_id,
      rating: review?.rating,
      review_text: review?.review,
    });
  };

  return (
    <Box className="restaurant-detail">
      {isLoading ? (
        <Loader />
      ) : (
        <Box className="restaurant-page">
          <NotifyAlert
            open={alertOpen?.openState}
            onClose={handleClose}
            severity={alertOpen?.severity}
            message={alertOpen?.message}
          />
          <Box className="restaurant-profile">
            <Box className="name-image">
              <Box>
                <img
                  className="restaurant-image"
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${
                    photos[0].photo_reference
                  }&key=${
                    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                  }&w=248&fit=crop&auto=format`}
                  alt={name}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: { xs: "250px", sm: "100%" },
                }}
              >
                <Typography variant="title">{name}</Typography>
                <Typography variant="body">{formatted_address}</Typography>
                <Typography variant="body">
                  {international_phone_number}
                </Typography>
                <Typography variant="body">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      wordBreak: "break-word", // Break long words
                      whiteSpace: "normal", // Allow text wrapping
                      overflowWrap: "break-word", // Break words if necessary
                    }}
                  >
                    {website}
                  </a>
                </Typography>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View on Google
                </a>
              </Box>
            </Box>
            <GoogleMapComponent location={geometry?.location} />
          </Box>
          <Grid container className="rest-tab">
            <Grid item size={{ xs: 12, sm: 6 }}>
              <Box className="image-list">
                <Typography variant="category" color="#004687">
                  RESTAURANT IMAGES
                </Typography>
                <ImageList
                  variant="quilted"
                  // sx={{ width: 300, height: 300 }}
                  cols={5}
                  // cols={{ xs: 4, sm: 5 }}
                  gap={8}
                >
                  {photos.map((item, index) => (
                    <ImageListItem key={index}>
                      <img
                        srcSet={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${
                          item.photo_reference
                        }&key=${
                          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                        }&w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${
                          item.photo_reference
                        }&key=${
                          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                        }&w=248&fit=crop&auto=format`}
                        alt={"item.title"}
                        onClick={() =>
                          handleImageClick(
                            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${
                              item.photo_reference
                            }&key=${
                              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                            }&w=248&fit=crop&auto=format`
                          )
                        }
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
                <Dialog
                  open={open}
                  onClose={handleDialogClose}
                  fullWidth
                  // maxWidth="lg"
                  sx={{
                    "& .MuiDialog-paper": {
                      backgroundColor: "transparent", // Make the dialog's background transparent
                      boxShadow: "none", // Remove dialog shadow
                    },
                  }}
                  BackdropProps={{
                    style: {
                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
                    },
                  }}
                >
                  {/* Close Button */}
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    padding="8px"
                    bgcolor="transparent"
                  >
                    <IconButton
                      onClick={handleDialogClose}
                      aria-label="close"
                      sx={{
                        color: "white", // White icon for contrast
                        zIndex: 1, // Ensure it's above the image
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Dialog Content */}
                  <DialogContent
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: "transparent",
                      height: "100vh", // Occupy full height
                    }}
                  >
                    <img
                      src={selectedImage}
                      alt="Selected"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "75vh", // Keep image responsive
                        objectFit: "contain",
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </Box>
              <Box className="my-reviews">
                <Typography variant="category" color="#004687">
                  RESTAURANT REVIEWS
                </Typography>
                <Grid container spacing={1} className="grid">
                  {reviews?.length > 0 ? (
                    reviews?.map((review, index) => (
                      <Grid
                        item
                        size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
                        key={index}
                      >
                        <ReviewCard
                          key={index}
                          name={review?.author_name}
                          review={review?.text}
                          rating={review?.rating}
                          time={review?.relative_time_description}
                          avatar={review?.profile_photo_url}
                        />
                      </Grid>
                    ))
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
                </Grid>
              </Box>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <Box className="add-review">
                <Typography variant="category" color="#004687">
                  ADD REVIEW
                </Typography>

                <Box className="rating-review">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="boldHaveAccount">Rating:</Typography>
                    <Rating
                      name="rating"
                      defaultValue={review?.rating}
                      precision={0.5}
                      onChange={handleReviewChange}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Typography variant="boldHaveAccount">Review:</Typography>
                    <TextField
                      className="text-field-class"
                      fullWidth
                      multiline
                      rows={4}
                      required
                      name="review"
                      type="text"
                      placeholder="Please Enter Your Review"
                      value={review?.review}
                      onChange={handleReviewChange}
                      margin="normal"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button variant="contained" onClick={handleSubmitReview}>
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box className="my-reviews">
                <Typography variant="category" color="#004687">
                  RESTAURANT REVIEWS BY EATS NEAR YOU USERS
                </Typography>
                <Grid container spacing={1} className="grid">
                  {!isReviewsLoading && reviewData?.length > 0 ? (
                    reviewData?.map((restaurant, index) => (
                      <Grid
                        item
                        size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
                        key={index}
                      >
                        <ReviewCard
                          key={index}
                          name={restaurant.author_name}
                          rating={restaurant.rating}
                          review={restaurant.review_text}
                          time={formatDistanceToNow(
                            parseISO(restaurant.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        />
                      </Grid>
                    ))
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
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default RestaurantDetail;
