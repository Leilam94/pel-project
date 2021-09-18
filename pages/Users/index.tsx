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
    container: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

export default function Users({ token }) {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [users, setUsers] = useState([]);
  const [isloading, setloading] = useState(false);

  const [promotionID, setProjectID] = useState(null);

  const [opendialog, setOpenDialog] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

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
          `https://pelglobal.iran.liara.run/api/getUserList`,
          config
        )
        .then((response) => {
          // console.log(response.data.data.forEach((user,index) => user.id = index))
          const result = [
            ...response.data.data,
            ...response.data.data.map((user,index) => user.id = index)
          ]
          setUsers(result.filter(user => user.type === 1));
          setloading(false);
          setOpenBackDrop(false);
        })
        .catch((error) => {
          setloading(false);
          setOpenBackDrop(false);
        });
    }
  }, []);
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
  const addUserHandler = () => {
    router.push("/Users/AddUser");
  };
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "email",
      flex: 1,
    },
    {
      field: "username",
      headerName: "username",
      flex: 1,
    },
    {
      field: "createdDate",
      headerName: "createdDate",
      flex: 1,
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
        <IconButton onClick={() => deleteHandler(params)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  const columnsSmallScreen: GridColDef[] = [
    {
      field: "name",
      headerName: "name",
      width: 150,
    },
    {
      field: "email",
      headerName: "email",
      width: 120,
    },
    {
      field: "username",
      headerName: "username",
      width: 120,
    },
    {
      field: "createdDate",
      headerName: "createdDate",
      width: 200,
    },
    {
      field: "action",
      headerName: "action",
      width: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <IconButton onClick={() => deleteHandler(params)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  return (
    <>
      <div className={classes.container}>
        <h1 className={classes.title}>Users</h1>
        <Button
          color="primary"
          variant="outlined"
          onClick={addUserHandler}
          className={classes.margin}
          startIcon={<AddCircleIcon />}
        >
          {!smallScreen ? "Add New User" : "New User"}
        </Button>
      </div>
      {!isloading ? (
        <div className={classes.tableContainer}>
          <TableComponent
            rows={users}
            columns={!smallScreen ? columns : columnsSmallScreen}
            handleRowSelection={getRowId}
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
