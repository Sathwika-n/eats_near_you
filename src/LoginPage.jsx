import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  FormHelperText,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import GoogleOAuthProvider
import "./login.scss";
import logo from "../public/vite.svg";
import {
  changePassword,
  forgotPassword,
  loginUser,
  signupUser,
} from "./services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import "./loader.scss";

const clientId =
  "http://136635546864-vbg6659ri8m8mgl5n4jgj5e0ck27auq7.apps.googleusercontent.com"; // Replace with your Google Client ID

function LoginPage({ setIsLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between login and signup
  const [isforgotPassword, setIsforgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpRecieved, setOtpRecieved] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [forgotData, setForgotData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpSentEmail, setOtpSentEmail] = useState("");

  const [mutationResponse, setMutationResponse] = useState(null);

  const [mutationState, setMutationState] = useState("");

  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      setMutationState("success");
      setMutationResponse(data?.message);
      setIsSignUp(false);

      console.log("isSignUp:", isSignUp);
      setIsLoading(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      console.error("Mutation failed!", error);
      setMutationState("error");
      setMutationResponse(error?.response?.data?.detail);
      setIsLoading(false);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(data?.result));

      setIsLoggedIn(true);
      setIsLoading(false);
      navigate("/home");
    },
    onError: (error) => {
      console.error("Mutation failed!", error?.response?.data?.detail);
      setMutationResponse(error?.response?.data?.detail);
      setIsLoading(false);
    },
  });

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      setIsLoading(false);
      setOtpSent(true);
    },
    onError: (error) => {
      console.error("Mutation failed!", error?.response?.data?.detail);
      setMutationResponse(error?.response?.data?.detail);
      setIsLoading(false);
      setOtpSent(false);
    },
  });
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      console.log("Mutation succeeded!", data);
      setMutationResponse(data?.message);
      setIsLoading(false);
      setForgotData({
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMutationState("success");
      setIsSignUp(false);
      setIsforgotPassword(false);
      setOtpSent(false);
    },
    onError: (error) => {
      console.error("Mutation failed!", error);
      setMutationResponse(error?.response?.data?.detail);
      setIsLoading(false);
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMutationState("error");
    },
  });

  // Handle Google Login Success
  const handleGoogleSuccess = async (response) => {
    const profile = response.profileObj;

    try {
      // Send Google profile to the backend
      const res = await axios.post("http://localhost:5000/auth/google", {
        email: profile.email,
        name: profile.name,
        googleId: profile.googleId,
      });

      console.log("Response from server:", res.data);

      // Handle backend response
      if (res.data.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("user", JSON.stringify(profile));
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        alert("Error signing in with Google");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Something went wrong");
    }
  };

  // Handle Google Login Failure
  const handleGoogleFailure = (response) => {
    console.error("Google Sign-In Failed:", response);
    alert("Google Sign-In Failed. Please try again.");
  };

  const handleManualSignup = () => {
    setIsLoading(true);
    setMutationResponse(null);
    let isValid = true;
    const errors = {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    };

    // Check if fields are empty
    if (!formData?.username) {
      errors.username = "Username is required";
      isValid = false;
    }
    if (!formData?.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!formData?.password) {
      errors.password = "Password is required";
      isValid = false;
    }
    if (!formData?.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
      isValid = false;
    }

    // Check password length
    if (formData?.password && formData?.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Check if passwords match
    if (formData?.password !== formData?.confirmPassword) {
      errors.confirmPassword = "Confirm Password does not match Password";
      isValid = false;
    }

    setFormErrors(errors);

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    signupMutation.mutate({
      username: formData?.username,
      password: formData?.password,
      email: formData?.email,
    });
  };
  const handleManualLogin = () => {
    setIsLoading(true);
    setMutationResponse(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData?.email)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      setIsLoading(false);
      return;
    }

    // Validate password: minimum 8 characters
    if (formData?.password.length < 8) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters.",
      }));
      setIsLoading(false);
      return;
    }

    // If no errors, clear the error messages
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
      password: "",
    }));

    // Proceed with the login mutation
    loginMutation.mutate({
      password: formData?.password,
      email: formData?.email,
    });
  };

  const handleSendOtp = () => {
    setIsLoading(true);
    setMutationResponse(null);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData?.email)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      setIsLoading(false);
      return;
    }
    // If no errors, clear the error messages
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      email: "",
      password: "",
    }));
    setOtpSentEmail(formData?.email);
    // Proceed with the login mutation
    forgotMutation.mutate({
      email: formData?.email,
    });
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    setMutationResponse(null);

    changePasswordMutation.mutate({
      old_password: forgotData?.otp,
      email: otpSentEmail,
      new_password: forgotData?.newPassword,
    });
  };

  // Handle Toggle Between Login and Sign-Up
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setIsforgotPassword(false);
  };
  const toggleForgotMode = () => {
    setIsforgotPassword(!isforgotPassword);
  };
  const toggleSignIn = () => {
    setIsSignUp(false);
    setIsforgotPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      // Validate email using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        // If the email is invalid, you can set an error state or message
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
      } else {
        // Clear the error if email is valid
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleOtpInputChange = (e) => {
    const { name, value } = e.target;

    setForgotData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      // Validate email using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }

    if (name === "password") {
      // Validate password: minimum 8 characters
      if (value.length < 8) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 8 characters.",
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          password: "",
        }));
      }
    }

    // Update the form data state
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {/* Wrap with GoogleOAuthProvider */}
      <Grid container className="login-page">
        <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="grid-item">
          <Box>
            <img src={logo} alt="Logo" style={{ height: 32 }} />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isforgotPassword ? (
              <Typography variant="title" color="#004687">
                Reset Password to Eats Near You
              </Typography>
            ) : (
              <Typography variant="title" color="#004687">
                {isSignUp ? "Sign up" : "Sign in"} to Eats Near You
              </Typography>
            )}
            <Box className="content-box">
              <Box className="form-content">
                <Box className="text-fields">
                  {isSignUp ? (
                    <>
                      {/* Full Name */}
                      <Box>
                        <TextField
                          required
                          name="username"
                          type="text"
                          placeholder="Full Name"
                          value={formData?.username}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                        {formErrors.username && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.username}
                          </FormHelperText>
                        )}
                      </Box>
                      {/* Email */}
                      <Box>
                        <TextField
                          required
                          name="email"
                          type="email"
                          placeholder="Your Email Address"
                          value={formData?.email}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                        {formErrors.email && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.email}
                          </FormHelperText>
                        )}
                      </Box>
                      {/* Password */}
                      <Box>
                        <TextField
                          required
                          name="password"
                          type="password"
                          placeholder="Your Password"
                          value={formData?.password}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                        {formErrors.password && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.password}
                          </FormHelperText>
                        )}
                      </Box>
                      {/* Confirm Password */}
                      <Box>
                        <TextField
                          required
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          value={formData?.confirmPassword}
                          onChange={handleInputChange}
                          margin="normal"
                        />
                        {formErrors.confirmPassword && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.confirmPassword}
                          </FormHelperText>
                        )}
                      </Box>
                    </>
                  ) : isforgotPassword ? (
                    <>
                      <Box>
                        <TextField
                          required
                          name="email"
                          type="email"
                          placeholder="Your Email Address"
                          value={formData?.email || ""}
                          onChange={handleLoginInputChange}
                          margin="normal"
                        />
                        {formErrors.email && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.email}
                          </FormHelperText>
                        )}
                      </Box>
                      {otpSent && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          <Box>
                            <TextField
                              required
                              name="otp"
                              type="text"
                              placeholder="OTP Recieved on Email"
                              value={forgotData?.otp}
                              onChange={handleOtpInputChange}
                              margin="normal"
                            />
                            {formErrors.email && (
                              <FormHelperText error sx={{ marginLeft: 2 }}>
                                {formErrors.email}
                              </FormHelperText>
                            )}
                          </Box>
                          <Box>
                            <TextField
                              required
                              name="newPassword"
                              type="password"
                              placeholder="New Password"
                              value={forgotData?.newPassword}
                              onChange={handleOtpInputChange}
                              margin="normal"
                            />
                            {formErrors.email && (
                              <FormHelperText error sx={{ marginLeft: 2 }}>
                                {formErrors.email}
                              </FormHelperText>
                            )}
                          </Box>
                          <Box>
                            <TextField
                              required
                              name="confirmPassword"
                              type="password"
                              placeholder="Confirm Password"
                              value={forgotData?.confirmPassword}
                              onChange={handleOtpInputChange}
                              margin="normal"
                            />
                            {formErrors.email && (
                              <FormHelperText error sx={{ marginLeft: 2 }}>
                                {formErrors.email}
                              </FormHelperText>
                            )}
                          </Box>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Email */}
                      <Box>
                        <TextField
                          required
                          name="email"
                          type="email"
                          placeholder="Your Email Address"
                          value={formData?.email || ""}
                          onChange={handleLoginInputChange}
                          margin="normal"
                        />
                        {formErrors.email && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.email}
                          </FormHelperText>
                        )}
                      </Box>
                      <Box>
                        <TextField
                          required
                          name="password"
                          type="password"
                          placeholder="Your Password"
                          value={formData?.password || ""}
                          onChange={handleLoginInputChange}
                          margin="normal"
                        />
                        {formErrors.password && (
                          <FormHelperText error sx={{ marginLeft: 2 }}>
                            {formErrors.password}
                          </FormHelperText>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {isLoading ? (
                    <Loader />
                  ) : isSignUp ? (
                    <Button
                      variant="contained"
                      sx={{
                        "&:focus": {
                          outline: "none",
                        },
                      }}
                      onClick={handleManualSignup}
                    >
                      Sign Up
                    </Button>
                  ) : isforgotPassword ? (
                    otpSent ? (
                      <Button
                        variant="contained"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={handleSendOtp}>
                        Send OTP
                      </Button>
                    )
                  ) : (
                    <Button variant="contained" onClick={handleManualLogin}>
                      Sign In
                    </Button>
                  )}
                  {!isSignUp &&
                    (isforgotPassword ? (
                      <Typography
                        variant="clickableText"
                        onClick={toggleSignIn}
                        sx={{ cursor: "pointer" }}
                      >
                        Go back to Sign In
                      </Typography>
                    ) : (
                      <Typography
                        variant="clickableText"
                        onClick={toggleForgotMode}
                        sx={{ cursor: "pointer" }}
                      >
                        Forgot Password?
                      </Typography>
                    ))}
                </Box>

                <GoogleLogin
                  clientId={clientId}
                  buttonText={
                    isSignUp ? "Sign Up with Google" : "Sign In with Google"
                  }
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                  cookiePolicy={"single_host_origin"}
                />
                {mutationResponse && (
                  <Alert severity={mutationState}>{mutationResponse}</Alert>
                )}
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="clickableText"
              onClick={toggleAuthMode}
              sx={{ cursor: "pointer" }}
            >
              {isSignUp
                ? "Have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
          className="grid-item-right"
        ></Grid>
      </Grid>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
