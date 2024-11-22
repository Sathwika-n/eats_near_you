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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check sessionStorage on initial load
  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login page
  };

  return (
    <Box className="main-class">
      {isLoggedIn && location.pathname !== "/" && (
        <Navbar onLogout={handleLogout} />
      )}
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
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
