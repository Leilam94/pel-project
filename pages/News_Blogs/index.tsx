import React, { useState } from "react";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { useEffect } from "react";
import { getSession } from "next-auth/client";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import AlertDialog from "../../components/AlertDialog";
import TableComponent from "../../components/Table";
import {
  GridColDef,
  GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS,
} from "@material-ui/data-grid";
import Backdrop from "@material-ui/core/Backdrop";
import { Alert, AlertTitle } from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { useRouter } from "next/router";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import Image from "next/image";
export interface ProjectsState {
  status: string;
  startDate: null | Date;
  endDate: null | Date;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(2),
      minWidth: 120,
      maxWidth: 300,
    },
    paper: {
      marginBottom: 20,
      padding: 20,
      display: "flex",
      justifyContent: "space-between",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        "& .MuiFormControl-marginNormal": {
          margin: 16,
        },
      },
    },
    margin: {
      margin: theme.spacing(2),
    },
    btnContainer: {
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
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
    tableContainer: {
      display: "flex",
      flexDirection: "column",
    },
    projectButton: {
      marginTop: theme.spacing(2),
      alignSelf: "flex-end",
    },
    title: {
      color: theme.palette.primary.dark,
    },
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    imageWrapper: {
      width: 200,
      height: 100,
      position: "relative",
    },
  })
);
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
const categories = [
  {
    id: 1,
    title: "News",
  },
  { id: 2, title: "Blog" },
];
export default function NewsAndBlogs({ token }) {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [project, setProject] = useState([]);
  const [isloading, setloading] = useState(false);

  const [promotionID, setProjectID] = useState(null);

  const [opendialog, setOpenDialog] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");

  const [category, setCategory] = useState("");
  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCategory(event.target.value as string);
  };

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!isloading) {
      setloading(true);
      setOpenBackDrop(true);
      axios
        .get(
          "https://pelglobal.iran.liara.run/api/types/getTypes?keyType=5",
          config
        )
        .then((response) => {
        //   setStatus(response.data.data.data);
          setloading(false);
        })
        .catch((error) => {
          setloading(false);
        });
    }
  }, []);

  const getData = () => {
    // if (!isloading) {
    //   setloading(true);
    //   setOpenBackDrop(true);
    //   const initData = {
    //     status: projectState.status,
    //     createdDateFrom: projectState.startDate,
    //     createdDateTo: projectState.endDate,
    //   };
    //   axios
    //     .get(
    //       `https://pelglobal.iran.liara.run/api/project/getProjects?status=${initData.status}&createdDateFrom=${initData.createdDateFrom}&createdDateTo=${initData.createdDateTo}`,
    //       config
    //     )
    //     .then((response) => {
    //       setProject(response.data.data);
    //       setloading(false);
    //       setOpenBackDrop(false);
    //     })
    //     .catch((error) => {
    //       setloading(false);
    //       setOpenBackDrop(false);
    //     });
    // }
  };
  const searchHandler = () => {
    getData();
  };
  const removeHandler = () => {
    // setProjectState({
    //   status: "",
    //   startDate: new Date(),
    //   endDate: new Date(),
    // });
  };
  // useEffect(() => {
  //   getData();
  // }, [projectState]);
  const deleteHandler = (params) => {
    setOpenDialog(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const selectNoHandler = () => {
    setOpenDialog(false);
  };
  const getRowId = (params) => {
    setProjectID(params.data.id);
  };

  const selectYesHandler = () => {
    setOpenDialog(false);
    if (!isloading) {
      setloading(true);
      setOpenBackDrop(true);
      axios
        .delete(
          `https://pelglobal.iran.liara.run/api/project/deleteProjectByAdmin?promotionID=${promotionID}`,
          config
        )
        .then((response) => {
          getData();
          setloading(false);
          setOpenBackDrop(false);
        })
        .catch((error) => {
          setloading(false);
          setOpenBackDrop(false);
        });
    }
  };
  const editHandler = (params) => {};
  const projectHandler = () => {
    router.push(`/News_Blogs/AddNews_Blogs`);
  };
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "title",
      flex: 1,
    },
    {
      field: "description",
      headerName: "description",
      flex: 1,
      // minWidth: 150,
    },
    {
      field: "link",
      headerName: "link",
      flex: 1,
      // minWidth: 150,
    },
    {
      field: "cover",
      headerName: "cover",
      flex: 1,
      align: "center",
      // eslint-disable-next-line react/display-name
      // renderCell: (params) => <Avatar alt="cover" src={coverImageUrl} className={classes.large}/>,
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <div className={classes.imageWrapper}>
          <Image src="/assets/backgroundimg.jpg" alt="cover" layout="fill" />
        </div>
      ),
    },
    {
      field: "action",
      headerName: "action",
      width: 150,
      // flex: 0.5,
      // minWidth: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <IconButton onClick={() => editHandler(params)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteHandler(params)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  const columnsSmallScreen: GridColDef[] = [
    {
      field: "title",
      headerName: "title",
      width: 150,
    },
    {
      field: "description",
      headerName: "description",
      width: 120,
    },
    {
      field: "link",
      headerName: "link",
      width: 200,
    },
    {
      field: "cover",
      headerName: "cover",
      width: 200,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <Avatar alt="cover" src={coverImageUrl} className={classes.large} />
      ),
    },
    {
      field: "action",
      headerName: "action",
      width: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <IconButton onClick={() => deleteHandler(params)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => editHandler(params)}>
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <>
      <h1 className={classes.title}>News and Blogs</h1>
      <Paper className={classes.paper}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-name-label">category</InputLabel>
          <Select
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            value={category}
            onChange={handleCategoryChange}
            MenuProps={MenuProps}
          >
            {categories.map((category, index) => (
              <MenuItem key={category.id} value={category.id}>
                {category.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.btnContainer}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={removeHandler}
            className={classes.margin}
          >
            remove filter
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={searchHandler}
            className={classes.margin}
            startIcon={<SearchRoundedIcon />}
          >
            search
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={projectHandler}
            className={classes.margin}
            startIcon={<AddCircleIcon />}
          >
            new
          </Button>
        </div>
      </Paper>
      {!isloading ? (
        <div className={classes.tableContainer}>
          <TableComponent
            rows={project}
            columns={!smallScreen ? columns : columnsSmallScreen}
            handleRowSelection={getRowId}
            rowHeight={100}
          />
        </div>
      ) : (
        <div className={classes.loader}>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="secondary"/>
          </Backdrop>
        </div>
      )}
      <AlertDialog
        open={opendialog}
        clickClose={selectNoHandler}
        clickYes={selectYesHandler}
        content={"Are you sure you want to delete the selected row?"}
      />
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
