import React, { useState, useEffect, useContext } from "react";

// React Router Dom
import { useHistory } from "react-router-dom";

import ListSubheader from "@material-ui/core/ListSubheader";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

//
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// React Icons
import AccountCircle from "@material-ui/icons/AccountCircle";
import { AiOutlineSchedule, AiOutlineLogout } from "react-icons/ai";
import { GiLoveInjection } from "react-icons/gi";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";

// Auth Context
import AuthContext from "../context/auth/authContext";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  something: {
    flex: 1,
  },
  titleContainer: {
    width: "100%",
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 5px",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function Layout({ children }) {
  const history = useHistory();
  //   const { window } = props;

  const [openDropDown, setOpenDropDown] = useState(false);
  const handleClickDropDown = () => {
    setOpenDropDown(!openDropDown);
  };

  const authContext = useContext(AuthContext);
  const { logout, loadAdmin, admin } = authContext;

  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //  RHU links
  const rhuLinks = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <MdDashboard size={25} />,
    },
    {
      name: "Vaccinator",
      link: "/vaccinator",
      icon: <FaUsers size={25} />,
    },
    {
      name: "Vaccine",
      link: "/vaccine",
      icon: <GiLoveInjection size={25} />,
    },
    {
      name: "Barangay",
      link: "/barangay",
      icon: <BsFillHouseFill size={25} />,
    },
    {
      name: "Schedule",
      link: "/schedule",
      icon: <AiOutlineSchedule size={25} />,
    },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.titleContainer}>
          <Typography variant="h6">
            Tanauan RHU <br /> Vaccination & Immigration System
          </Typography>
        </div>
      </div>
      <Divider />
      <List>
        {rhuLinks.map((nav, index) => (
          <ListItem
            onClick={() => {
              history.push(nav.link);
            }}
            button
            key={index}
          >
            <ListItemIcon>{nav.icon}</ListItemIcon>
            <ListItemText primary={nav.name} />
          </ListItem>
        ))}

        <ListItem button onClick={handleClickDropDown}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Immunization Details" />
          {openDropDown ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openDropDown} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              onClick={() => {
                history.push("/immunization-stock");
              }}
              butt
              button
              className={classes.nested}
            >
              <ListItemIcon>
                <AiOutlineStock size={25} />
              </ListItemIcon>
              <ListItemText primary="Immunization Stock" />
            </ListItem>
          </List>

          <List component="div" disablePadding>
            <ListItem
              onClick={() => {
                history.push("/archieve-immunization");
              }}
              butt
              button
              className={classes.nested}
            >
              <ListItemIcon>
                <AiOutlineStock size={25} />
              </ListItemIcon>
              <ListItemText primary="Archieved Immunizations" />
            </ListItem>
          </List>

          <List component="div" disablePadding>
            <ListItem
              onClick={() => {
                history.push("/immunization");
              }}
              button
              className={classes.nested}
            >
              <ListItemIcon>
                <GiLoveInjection size={25} />
              </ListItemIcon>
              <ListItemText primary="Immunization" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          onClick={() => {
            logout();
            history.push("/");
          }}
          button
        >
          <ListItemIcon>
            <AiOutlineLogout size={32} />
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItem>
      </List>
    </div>
  );

  // Menu Clickalbe
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const container =
  //     window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.something}></div>

          {/* Hide */}
          {/* <Tooltip arrow title="Emails">
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Notifications">
            <IconButton aria-label="show 11 new notifications" color="inherit">
              <Badge badgeContent={5} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip> */}
          <Tooltip arrow title="Profile">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          {/* Admin Profule Menus */}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                history.push("/profile");
              }}
            >
              Profile
            </MenuItem>
            {/* <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem> */}
          </Menu>
          {/*  */}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

export default Layout;
