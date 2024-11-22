import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import "./dummy.scss";

function DummyComp() {
  return (
    <Grid container spacing={4} className="dummy">
      <Grid item size={6}>
        <Typography>Dummy Comp</Typography>
      </Grid>
      <Grid item size={6}>
        <Typography>Dummy Comp</Typography>
      </Grid>
    </Grid>
  );
}

export default DummyComp;
