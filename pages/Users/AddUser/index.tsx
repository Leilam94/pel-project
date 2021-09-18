import TextField from "@material-ui/core/TextField";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Image from "next/image";
import { Autocomplete } from "@material-ui/lab";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { Translate, TrendingUpTwoTone } from "@material-ui/icons";
import { useRouter } from "next/router";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import SaveIcon from "@material-ui/icons/Save";
import { useForm } from "react-hook-form";
import { getSession } from "next-auth/client";
import { useMediaQuery } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useState } from "react";
import axios from "axios";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginBottom: 20,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 400,
      left: "50%",
      transform: "Translate(-50%,-50%)",
      width: 500,
      maxWidth: "90%",
      boxShadow: "1px 1px 2px 2px #d9d9d9",
      borderRadius: 3,
      [theme.breakpoints.down("xs")]: {
        top: 300,
        boxShadow: "none",
      },
    },
    field: {
      marginTop: theme.spacing(2),
    },
    button: {
      height: 45,
      marginTop: theme.spacing(2),
    },
    container: {
      display: "flex",
      justifyContent: "space-between",
    },
    title: {
      color: theme.palette.primary.dark,
    },
    backButton: {
      height: 40,
      marginTop: 20,
    },
    formControl: {
      marginTop: theme.spacing(2),
      "& .MuiInputLabel-formControl": {
        top: 2,
        left: 15,
      },
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
const levels = [
  {
    id: 1,
    title: "manager",
  },
  {
    id: 2,
    title: "employee",
  },
  {
    id: 3,
    title: "developer",
  },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default function AddUser({ token }) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const router = useRouter();
  const [isloading, setloading] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [accessLevel, setAccessLevel] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleAccessLevelChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAccessLevel(event.target.value as string);
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const goBackButtonHandler = () => {
    router.push("/Users");
  };

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const onSubmit = (data) => {
    console.log(data);
    // setErrMessage(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)?""
    // :'Email is not valid');
    // console.log(errMessage)
    // if(!errMessage){
    setloading(true);
    setOpenBackDrop(true);
    const input = {
      email: data.email,
      username: data.username,
      name: data.name,
      type: 1,
      password: data.password,
      password_confirmation: data.passwordconfirmation,
    };
    axios
      .post(`https://pelglobal.iran.liara.run/api/register`, input, config)
      .then((response) => {
        setloading(false);
        setOpenBackDrop(false);
        setOpenSnackBar(true);
        router.push("/Users");
      })
      .catch((error) => {
        const parseError = Object.assign({}, error);
        setErrMessage(parseError.response.data.message);
        setOpenSnackBar(true);
        // error.message((cur) => {
        //   setErrMessage(cur)
        // })
        setloading(false);
        setOpenBackDrop(false);
      });
    // } else{
    //   setOpenSnackBar(true);
    // }
  };
  return (
    <>
      {!isloading ? (
        <form
          className={classes.paper}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.container}>
            <h2 className={classes.title}>
              {!smallScreen ? "Add New User" : "New User"}
            </h2>
            <Button
              className={classes.backButton}
              color="primary"
              variant="outlined"
              onClick={goBackButtonHandler}
              endIcon={<ArrowRightIcon />}
            >
              {!smallScreen ? "back to users" : "back"}
            </Button>
          </div>
          <TextField
            error={errors.name}
            helperText={errors.name && "The name is required."}
            className={classes.field}
            id="outlined-basic"
            label="name"
            variant="outlined"
            {...register("name", { required: true })}
          />
          <TextField
            className={classes.field}
            error={errors.username}
            helperText={errors.username && "The username is required."}
            placeholder="username..."
            label="username"
            variant="outlined"
            {...register("username", { required: true })}
          />
          <TextField
            className={classes.field}
            error={errors.email}
            helperText={errors.email && (errors.email.type === 'required' ? 'The Email is required.': 'The Email is not valid')}
            placeholder="email..."
            label="email"
            variant="outlined"
            {...register("email", {
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
          />
          <TextField
            className={classes.field}
            error={errors.password}
            helperText={errors.password && "The password is required."}
            id="outlined-password-input"
            label="password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            {...register("password", { required: true })}
          />
          <TextField
            className={classes.field}
            error={errors.passwordconfirmation}
            helperText={
              errors.passwordconfirmation &&
              "The password-confirmation is required."
            }
            id="outlined-passwordconfirmation-input"
            label="password-confirmation"
            type="password"
            autoComplete="current-passwordconfirmation"
            variant="outlined"
            {...register("passwordconfirmation", { required: true })}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-name-label">access level</InputLabel>
            <Select
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              value={accessLevel}
              onChange={handleAccessLevelChange}
              MenuProps={MenuProps}
              variant="outlined"
            >
              {levels.map((level, index) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
          >
            save
          </Button>
        </form>
      ) : (
        <div className={classes.loader}>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="secondary"/>
          </Backdrop>
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token: session.accessToken,
    },
  };
}
