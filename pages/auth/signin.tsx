import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getCsrfToken, signIn } from "next-auth/client";
import Image from "next/image";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import { useRouter } from "next/router";
import { Alert, AlertTitle } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import { useForm } from "react-hook-form";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
        },
        "& .MuiPaper-elevation1": {
          boxShadow: "none",
        },
      },
    },
    title: {
      textAlign: "center",
      marginTop: 35,
      marginBottom: 10,
    },

    paper: {
      width: "100%",
      maxWidth: 500,
      marginTop: "10%",
      height: 650,
      padding: 40,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      "& .MuiTextField-root": {
        margin: theme.spacing(2),
        width: 320,
        [theme.breakpoints.down("xs")]: {
          width: 280,
        },
      },
    },
    forgetPassText: {
      textAlign: "center",
      marginTop: 10,
    },
    button: {
      marginTop: 20,
      width: 320,
      textAlign: "center",
      [theme.breakpoints.down("xs")]: {
        width: 280,
      },
    },
    color: {
      color: `${theme.palette.text.secondary}`,
    },
    imageWrapper: {
      width: 100,
      height: 80,
      position: "relative",
    },
    loader: {
      display: "flex",
      justifyContent: "center",
      "& > * + *": {
        marginLeft: theme.spacing(2),
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function SignIn({ csrfToken }) {
  const { errorMessage } = useRouter().query;
  const classes = useStyles();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (errorMessage) {
      setOpen(true);
    }
  }, [errorMessage]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const onSubmit = (data) => {
    setLoading(true);
    setOpenBackDrop(true);
    signIn("credentials", {
      ...data,
      callbackUrl: "/api/auth/callback/credentials",
    });
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <form
          className={classes.form}
          noValidate
          // method="post"
          // action="/api/auth/callback/credentials"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className={classes.imageWrapper}>
            <Image src="/assets/logo.png" alt="logo" layout="fill" />
          </div>
          <Typography className={classes.title} variant="h5">
            Precision <span className={classes.color}>Eco</span> Landscaping
          </Typography>
          <Typography className={classes.title} color="secondary">
            Please enter your credentials to login
          </Typography>
          <TextField
            focused
            error={errors.username}
            helperText={errors.username && "The username is required."}
            id="outlined-username-input"
            label="username"
            type="text"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            {...register("username", { required: true })}
          />
          <TextField
            error={errors.password}
            helperText={errors.password && "The password is required."}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon />
                </InputAdornment>
              ),
            }}
            {...register("password", { required: true })}
          />
          <Typography className={classes.forgetPassText} color="primary">
            Forgot password?
          </Typography>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            LogIn
          </Button>
        </form>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Invalid username or password — <strong>check it out!</strong>
        </Alert>
      </Snackbar>
      {loading && (
        <div className={classes.loader}>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress  color="secondary"/>
          </Backdrop>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
