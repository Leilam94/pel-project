import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Button from "@material-ui/core/Button";
import Router, { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import { signOut } from "next-auth/client";
import { useContext } from "react";
import DrawerContext from "../../store/handleDrawer-context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
const drawerWidth = 340;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    [theme.breakpoints.up("sm")]: {
      appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
  })
);
export default function NavBar(props: any) {
  const classes = useStyles();
  const drawerCtx = useContext(DrawerContext);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  function handleChange() {
    drawerCtx.changeDrawer(true);
    // Here, we invoke the callback with the new value
    // props.handleDrawer(true);
  }
  const logoutHandler = () => {
    signOut();
  };
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        elevation={0}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerCtx.open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleChange}
            edge="start"
            className={clsx(classes.menuButton, drawerCtx.open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {!smallScreen ? "Precision Eco Landscaping" : "PEL"}
          </Typography>
          <Button color="inherit" onClick={logoutHandler}>
            logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
