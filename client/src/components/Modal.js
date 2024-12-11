import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useStyles } from "./Styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function ProductModal({
  prod = [],
  open,
  handleClose,
  handleReceiveButton,
  aText,
}) {
  const [rdata, setRdata] = useState({ long: "", lat: "" });
  const [showMore, setShowMore] = useState(true); // Always show all details

  const handleChangeForm = (e) => {
    setRdata({
      ...rdata,
      [e.target.name]: e.target.value,
    });
  };

  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <Typography variant="h4" gutterBottom>
            Product Details
          </Typography>
          <Grid container spacing={2}>
            {/* Always show all details */}
            <Grid item xs={12}>
              <Typography>
                <strong>Universal ID:</strong> {prod?.[0]?.[0] || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Manufacturer:</strong> {prod?.[0]?.[3] || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Product Name:</strong> {prod?.[1]?.[1] || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Longitude of Manufacture:</strong>{" "}
                {prod?.[0]?.[6] || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Latitude of Manufacture:</strong> {prod?.[0]?.[7] || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Manufactured Date:</strong>{" "}
                {prod?.[1]?.[0]
                  ? new Date(parseInt(prod?.[1]?.[0]) * 1000).toLocaleString()
                  : "N/A"}
              </Typography>
            </Grid>

            {/* Longitude and Latitude Input Section */}
            {handleReceiveButton && (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="long"
                    variant="outlined"
                    value={rdata.long}
                    onChange={handleChangeForm}
                    label="Longitude"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="lat"
                    variant="outlined"
                    value={rdata.lat}
                    onChange={handleChangeForm}
                    label="Latitude"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleReceiveButton(prod?.[0]?.[0], rdata.long, rdata.lat)
                    }
                  >
                    Submit Coordinates
                  </Button>
                </Grid>
              </>
            )}

            {/* Close Button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleClose}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Modal>
  );
}
