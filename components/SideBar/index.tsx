import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
  lighten,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Link from "next/link";
import Backdrop from "@material-ui/core/Backdrop";
import React, { useEffect, useState } from "react";
import Hidden from "@material-ui/core/Hidden";
import { TrendingUpOutlined } from "@material-ui/icons";
import GroupIcon from "@material-ui/icons/Group";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Image from "next/image";
import DrawerContext from "../../store/handleDrawer-context";
import { useContext } from "react";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import EcoIcon from "@material-ui/icons/Eco";
import SettingsIcon from "@material-ui/icons/Settings";
import SearchIcon from "@material-ui/icons/Search";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import TreeNode from "../TreeItem";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { Router } from "next/router";
import useMediaQuery from "@material-ui/core/useMediaQuery";
const drawerWidth = 340;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tree: {
      flexGrow: 1,
      maxWidth: 400,
      padding: theme.spacing(1.5, 6),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        cursor: "pointer",
      },
      "& .MuiSvgIcon-root": {
        fontSize: "1.5rem",
        fill: "rgba(0, 0, 0, 0.54)",
        marginRight: 52,
        [theme.breakpoints.down("xs")]: {
          fill: "white",
        },
      },
      "& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label":
        {
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
    },
    treeItem: {
      "& .MuiTreeItem-root": {
        padding: theme.spacing(2, 0, 2, 5),
        marginLeft: 20,
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        },
      },
      "& .MuiTreeItem-label:hover": {
        backgroundColor: "transparent",
      },
      "& .MuiTreeItem-group": {
        [theme.breakpoints.down("xs")]: {
          marginLeft: 0,
        },
      },
    },
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,

      [theme.breakpoints.down("xs")]: {
        width: 300,
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      // backgroundColor: theme.palette.primary.light,
      justifyContent: "space-between",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "flex-end",
      },
      // margin: theme.spacing(1, 0),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("sm")]: {
        marginLeft: -drawerWidth,
      },
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    contentHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1, 1),
      margin: theme.spacing(3, 0),
    },
    imageWrapper: {
      width: 65,
      height: 50,
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        width: 65,
        height: 50,
      },
    },
    color: {
      color: "white",
    },
    linkStyle: {
      all: "unset",
    },
  })
);

const nodes = [
  // {
  //   href: "/Projects/EcoLandscaping",
  //   nodeId: "2",
  //   label: "Eco Landscaping",
  //   icon: <EcoIcon />,
  // },
  {
    href: "/Projects/EcoPlantFinder",
    nodeId: "3",
    label: "Eco-Plant finder",
    icon: <SearchIcon />,
  },
  {
    href: "/Projects/DTM_DSM_DEM",
    nodeId: "4",
    label: "DTM/DSM/DEM",
    icon: <AssignmentIcon />,
  },
  {
    href: "/Projects/MonitoringServices",
    nodeId: "5",
    label: "Monitoring Services",
    icon: <DesktopWindowsIcon />,
  },
  {
    href: "/Projects/MangementServices",
    nodeId: "6",
    label: "Mangement Services",
    icon: <SettingsIcon />,
  },
];
export default function SideBar(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const drawerCtx = useContext(DrawerContext);
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  function handleChange() {
    // Here, we invoke the callback with the new value
    // props.handleDrawer(false);
    drawerCtx.changeDrawer(false);
  }
  useEffect(() => {
    if (smallScreen) {
      Router.events.on("routeChangeStart", () => drawerCtx.changeDrawer(false));
      return () => {
        Router.events.off("routeChangeStart", () =>
          drawerCtx.changeDrawer(true)
        ); // remove listener
      };
    }
  }, [smallScreen]);
  const setPageIcons = (index: number) => {
    switch (index) {
      case 0:
        return <LocalOfferIcon />;
      case 1:
        return <PostAddIcon />;
      case 2:
        return <GroupIcon />;
      case 3:
        return <AssignmentIndIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <Hidden>
        <Drawer
          className={classes.drawer}
          anchor="left"
          open={drawerCtx.open}
          variant="persistent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <div className={classes.imageWrapper}>
              <Image src="/assets/logo.png" alt="logo" layout="fill" />
            </div>
            <IconButton onClick={handleChange}>
              <MenuIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link href={`/Dashboard`} passHref>
              <a className={classes.linkStyle}>
                <ListItem button>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </a>
            </Link>
            <Divider />
            <TreeView
              className={classes.tree}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem
                nodeId="1"
                label="Projects"
                className={classes.treeItem}
              >
                {nodes.map((node, index) => (
                  <TreeNode
                    key={index}
                    href={node.href}
                    nodeId={node.nodeId}
                    label={node.label}
                    icon={node.icon}
                  />
                ))}
              </TreeItem>
            </TreeView>
            {["Promotions", "News_Blogs", "Customers", "Users"].map(
              (text, index) => (
                <Link href={`/${text}`} key={text} passHref>
                  <a className={classes.linkStyle}>
                    <ListItem button>
                      <ListItemIcon>{setPageIcons(index)}</ListItemIcon>
                      <ListItemText
                        primary={text === "News_Blogs" ? "News/Blogs" : text}
                      />
                    </ListItem>
                  </a>
                </Link>
              )
            )}
          </List>
        </Drawer>
      </Hidden>
      <Hidden smUp>
        <Drawer
          className={classes.drawer}
          anchor="left"
          open={drawerCtx.open}
          onClose={handleChange}
          variant="temporary"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            {/* <div className={classes.imageWrapper}>
              <Image src="/assets/logo.png" alt="logo" layout="fill" />
            </div> */}
            <IconButton onClick={handleChange}>
              <MenuIcon className={classes.color} />
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link href={`/Dashboard`} passHref>
              <a className={classes.linkStyle}>
                <ListItem button onClick={handleChange}>
                  <ListItemIcon>
                    <DashboardIcon className={classes.color} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </a>
            </Link>
            <Divider />
            <TreeView
              className={classes.tree}
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              <TreeItem
                nodeId="1"
                label="Projects"
                className={classes.treeItem}
              >
                {nodes.map((node, index) => (
                  <TreeNode
                    key={index}
                    href={node.href}
                    nodeId={node.nodeId}
                    label={node.label}
                    icon={node.icon}
                  />
                ))}
              </TreeItem>
            </TreeView>
            {["Promotions", "News_Blogs", "Customers", "Users"].map(
              (text, index) => (
                <Link href={`/${text}`} key={text} passHref>
                  <a className={classes.linkStyle}>
                    <ListItem button onClick={handleChange}>
                      <ListItemIcon className={classes.color}>
                        {setPageIcons(index)}
                      </ListItemIcon>
                      <ListItemText
                        primary={text === "News_Blogs" ? "News/Blogs" : text}
                      />
                    </ListItem>
                  </a>
                </Link>
              )
            )}
          </List>
        </Drawer>
      </Hidden>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerCtx.open,
        })}
      >
        <div className={classes.contentHeader} />
        {props.content}
      </main>
    </div>
  );
}
