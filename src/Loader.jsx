import React from "react";
import "./loader.scss";
import { Box } from "@mui/material";

function Loader() {
  return (
    <Box className="scaling-dots">
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
      <Box></Box>
    </Box>
  );
}

export default Loader;
