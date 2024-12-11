import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#09126d",
    color: "#fff",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function PersistentDrawerLeft({ pageTitle,navItems, children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            noWrap
            style={{ display: "flex", alignItems: "center" ,fontFamily:"Work Sans, sans-serif;sans-serif",fontSize: "25px"}}
          >
            <img
              alt="."
              src="/logo3.png"
              style={{ height: "60px", width: "auto" }}
            />
            &nbsp;My DAAP
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
        <ListItemText primaryTypographyProps={{ style: { fontSize: "24px" , fontFamily:"Public Sans, sans-serif"} }}>{pageTitle}</ListItemText>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon style={{ color: "#fff",fontSize:"27px" }} />
            ) : (
              <ChevronRightIcon style={{fontSize:"27px"}} />
            )}
          </IconButton>
        </div>
        <List>
          <Link 
            key="home"
            to="/"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem>
              <ListItemText primaryTypographyProps={{ style: { fontSize: "20px" , fontFamily:"Work Sans, sans-serif"} }}>Home</ListItemText>
            </ListItem>
          </Link>
          <Link
            key="explorer"
            to="/explorer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem>
              <ListItemText primaryTypographyProps={{ style: { fontSize: "20px",fontFamily:"Work Sans, sans-serif;sans-serif" } }}>Explorer</ListItemText>
            </ListItem>
          </Link>
        </List>
        <List>
          {navItems.length !== 0 ? (
            navItems.map((item) => (
              <Link
                key={item[0]}
                to={item[1]}
                style={{ textDecoration: "none", color: "#fff",fontSize:"18px" }}
              >
                <ListItem button>
                  <ListItemText primary={item[0]} primaryTypographyProps={{ style: { fontSize: "16px",fontFamily:"Work Sans, sans-serif;sans-serif" }}} />
                </ListItem>
              </Link>
            ))
          ) : (
            <> </>
          )}
        </List>
        <div
          style={{ height: "100%", display: "flex", alignItems: "flex-end",fontSize: "60px" }}
        >
          
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <div style={{ margin: "0 auto", maxWidth: 1300, fontSize:"15px" }}>{children}</div>
      </main>
    </div>
  );
}
