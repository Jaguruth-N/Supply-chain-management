import React from "react";
import Navbar from "../components/Navbar";
import Button from "@material-ui/core/Button";
import { useStyles } from "../components/Styles";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

export default function Home() {
  const classes = useStyles();
  const navItem = [];

  return (
    <>
      <div className={classes.pageWrap}>
        <Navbar navItems={navItem}>
          <Grid
            container
            spacing={3}
            style={{ height: "100%", minHeight: "90vh", width: "100%" }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <img
                alt="."
                src="/homeArt4.png"
                style={{ width: "80%", height: "auto" }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              style={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <div className={classes.HomeCardWrap}>
                <h1 className={classes.pageHeading}>Assign Roles</h1>
                <Link
                  to="/roleAdmin"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <Button
                    className={classes.HomeBtn}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "15px" }}
                  >
                    Assign
                  </Button>
                </Link>
                <br />

                <h1 className={classes.pageHeading}>Visit As</h1>
                <Link
                  to="/manufacturer/manufacture"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <Button
                    className={classes.HomeBtn}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "15px" }}
                  >
                    Manufacturer
                  </Button>
                </Link>
                <Link
                  to="/ThirdParty/allProducts"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <Button
                    className={classes.HomeBtn}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "15px" }}
                  >
                    Third Party
                  </Button>
                </Link>
                <Link
                  to="/DeliveryHub/receive"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <Button
                    className={classes.HomeBtn}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "15px" }}
                  >
                    Delivery Hub
                  </Button>
                </Link>
                <Link
                  to="/Customer/buy"
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  <Button
                    className={classes.HomeBtn}
                    size="large"
                    variant="outlined"
                    color="primary"
                    style={{ fontSize: "15px" }}
                  >
                    Customer
                  </Button>
                </Link>
              </div>
            </Grid>
          </Grid>
        </Navbar>
      </div>
    </>
  );
}
