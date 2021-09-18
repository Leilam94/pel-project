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
import { Translate } from "@material-ui/icons";
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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginBottom: 20,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 600,
      left: "50%",
      transform: "Translate(-50%,-50%)",
      width: 800,
      maxWidth: "90%",
      boxShadow: "1px 1px 2px 2px #d9d9d9",
      borderRadius: 3,
      [theme.breakpoints.down("xs")]: {
        top: 500,
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
  })
);
const categories = [
  {
    id: 1,
    title: "News",
  },
  { id: 2, title: "Blog" },
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
export default function AddNewsAndBlogs() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [category, setCategory] = useState("");
  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCategory(event.target.value as string);
  };
  const addPromotionHandler = () => {};
  const goBackButtonHandler = () => {
    router.push("/News_Blogs");
  };
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <form
      className={classes.paper}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.container}>
        <h2 className={classes.title}>
          {!smallScreen ? "Add News/Blogs" : "New News/Blogs"}
        </h2>
        <Button
          className={classes.backButton}
          color="primary"
          variant="outlined"
          onClick={goBackButtonHandler}
          endIcon={<ArrowRightIcon />}
        >
          {!smallScreen ? "back to News/Blogs" : "back"}
        </Button>
      </div>
      <TextField
        error={errors.title}
        helperText={errors.title && "The title is required."}
        className={classes.field}
        id="outlined-basic"
        label="title"
        variant="outlined"
        {...register("title", { required: true })}
      />
      <TextField
        className={classes.field}
        error={errors.description}
        helperText={errors.description && "The description is required."}
        placeholder="description..."
        label="description"
        multiline
        rows={20}
        variant="outlined"
        maxRows={20}
        {...register("description", { required: true })}
      />
      <TextField
        className={classes.field}
        id="outlined-link"
        label="link"
        variant="outlined"
      />
      <TextField
        className={classes.field}
        error={errors.cover}
        helperText={errors.cover && "Please upload the cover image."}
        id="outlined-cover"
        variant="outlined"
        type="file"
        label="cover"
        InputLabelProps={{ shrink: true }}
        {...register("cover", { required: true })}
      />
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-name-label">category</InputLabel>
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          value={category}
          onChange={handleCategoryChange}
          MenuProps={MenuProps}
          variant="outlined"
        >
          {categories.map((category, index) => (
            <MenuItem key={category.id} value={category.id}>
              {category.title}
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
