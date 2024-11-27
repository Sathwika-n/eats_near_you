import React, { createContext, useContext, useState } from "react";
import NotifyAlert from "./NotifyAlert";

// Create Alert Context
const AlertContext = createContext();

// Provider for managing alerts
export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Show an alert
  const showAlert = (severity, message) => {
    setAlertConfig({ open: true, severity, message });
  };

  // Close the alert
  const handleClose = () => {
    setAlertConfig((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {/* NotifyAlert here to persist across all pages */}
      <NotifyAlert
        open={alertConfig.open}
        severity={alertConfig.severity}
        message={alertConfig.message}
        onClose={handleClose}
      />
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook for using alert context
export const useAlert = () => useContext(AlertContext);
