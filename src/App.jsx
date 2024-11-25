import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import Profile from "./account/Profile";
import ChangePassword from "./account/ChangePassword";
import RestaurantDetail from "./RestaurantDetail";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true" // Ensure boolean type
  );
  const [hasRedirected, setHasRedirected] = useState(false); // Track if redirect happened

  // Update lastPath in sessionStorage whenever location changes
  useEffect(() => {
    if (isLoggedIn && location.pathname !== "/") {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [location, isLoggedIn]);

  // Handle initial redirection logic only once
  useEffect(() => {
    if (isLoggedIn && !hasRedirected) {
      const lastPath = sessionStorage.getItem("lastPath");
      if (lastPath && lastPath !== location.pathname) {
        navigate(lastPath); // Redirect to lastPath
      }
      setHasRedirected(true); // Mark as redirected
    }
  }, [isLoggedIn, hasRedirected, navigate, location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("lastPath");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login page
  };

  return (
    <Box className="main-class">
      {/* Show Navbar only if logged in and not on login page */}
      {isLoggedIn && location.pathname !== "/" && (
        <Navbar onLogout={handleLogout} />
      )}
      <Routes>
        {/* Handle root path */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace /> // Default to home if no redirection needed
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/changePassword"
          element={isLoggedIn ? <ChangePassword /> : <Navigate to="/" />}
        />
        <Route
          path="/restaurantDetail"
          element={isLoggedIn ? <RestaurantDetail /> : <Navigate to="/" />}
        />
      </Routes>
    </Box>
  );
}

export default App;
