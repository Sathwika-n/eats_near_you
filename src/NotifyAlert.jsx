import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Typography } from "@mui/material";

// Alert component to be used inside Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotifyAlert = ({
  open,
  onClose,
  severity = "success",
  message = "This is a success Alert!",
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      sx={{
        zIndex: 1400, // Adjust as needed, default Material-UI z-index for modals is 1300
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        <Typography variant="body">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default NotifyAlert;
