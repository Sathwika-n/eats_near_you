import React, { useState } from "react";
import "./contact.scss";
import { Box, Button, TextField, Typography } from "@mui/material";
import { userFeedback } from "./services/api";
import { useMutation } from "@tanstack/react-query";
import { useAlert } from "./AlertProvider";

const ContactUs = () => {
  const [feedback, setFeedback] = useState("");
  const { showAlert } = useAlert();

  const feedbackMutation = useMutation({
    mutationFn: userFeedback,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      showAlert("success", data?.message);
    },
    onError: (error) => {
      console.error("Mutation failed!", error?.response?.data?.detail);
      showAlert("error", error?.response?.data?.detail);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback !== "") {
      feedbackMutation.mutate({
        user_id: JSON.parse(sessionStorage.getItem("user"))?.user_id,
        feedback: feedback,
      });
      setFeedback("");
    } else {
      showAlert("error", "Please fill the field!");
    }
  };

  return (
    <Box className="contact-container">
      <Typography variant="title">Contact Us</Typography>
      <Typography variant="body">
        We're here to help you find the perfect dining experience! Whether you
        have a question, feedback, or a suggestion to improve our service, we'd
        love to hear from you.
      </Typography>

      <Box className="contact-info">
        <Typography variant="columnHeading">Get in Touch</Typography>
        <Box>
          <Typography variant="body">
            <strong>Email:</strong> projectworkyou@gmail.com
          </Typography>
        </Box>
        <Box>
          <Typography variant="body">
            <strong>Phone:</strong> +1 (744)-437-0918
          </Typography>
        </Box>
        <Box>
          <Typography variant="body">
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM to 6:00 PM
          </Typography>
        </Box>
      </Box>

      <Box className="feedback">
        <Typography variant="columnHeading">Have a Suggestion?</Typography>
        <Typography variant="body">
          Is there a feature you'd like to see or a restaurant you'd like us to
          add? Let us know through our feedback form.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="reviewTitle">
              {JSON.parse(sessionStorage.getItem("user"))?.username}
            </Typography>
          </Box>
          <Box>
            <Typography variant="reviewTitle">
              {JSON.parse(sessionStorage.getItem("user"))?.email}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <TextField
                className="text-field-class"
                fullWidth
                multiline
                rows={4}
                required
                name="message"
                type="text"
                placeholder="Please Enter Your Feedback"
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
                margin="normal"
              />
            </Box>

            <Button variant="contained" onClick={handleSubmit}>
              Submit Feedback
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Box className="social-media">
          <Typography variant="body">
            Follow Us for the Latest Updates. Stay connected for dining tips and
            more:
          </Typography>
        </Box>

        <Box className="response-time">
          <Typography variant="body">
            We strive to respond to all inquiries within 24 hours. Thank you for
            being part of our community!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
