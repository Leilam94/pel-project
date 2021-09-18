import { useRouter } from "next/router";
import { getSession } from "next-auth/client";
import React, { useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { GridColDef } from "@material-ui/data-grid";
import AlertDialog from "../../../../components/AlertDialog";
import SaveIcon from "@material-ui/icons/Save";
import TableComponent from "../../../../components/Table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
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
      justifyContent: "flex-start",
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
    container: {
      display: "flex",
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
      display: "flex",
      justifyContent: "flex-end",
      // alignSelf: "flex-end",
    },
    addButton: {
      marginLeft: theme.spacing(2),
    },
  })
);
export interface plantsConfig {
  id: number;
  name: string;
}
export default function ProjectPage({ token }) {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [isloading, setloading] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [opendialog, setOpenDialog] = useState(false);
  const [plants, setPlants] = useState<plantsConfig[]>([]);
  const [plantName, setPlantName] = useState("");
  const [plantID, setPlantID] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    if (!isloading) {
      //   setloading(true);
      //   setOpenBackDrop(true);
      //   axios
      //     .get(
      //       `https://pelglobal.iran.liara.run/api/project/createProjectPDF?projectId=${router.query.projectId}`,
      //       config
      //     )
      //     .then((response) => {
      //       setPlants(response.data.data)
      //       setloading(false);
      //     })
      //     .catch((error) => {
      //       router.push("/404");
      //       setloading(false);
      //     });
    }
  }, [router.query.projectId]);
  const handleChangePlantName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlantName(event.target.value);
  };
  const addPlantHandler = () => {
    const data = {
      id: plants.length,
      name: plantName,
    };
    setPlants([...plants, data]);
    setPlantName("");
  };
  const getRowId = (params) => {
    setPlantID(params.data.id);
  };
  const deleteHandler = (params) => {
    setDeleteId(params.id);
    setOpenDialog(true);
  };
  const selectNoHandler = () => {
    setOpenDialog(false);
  };
  const selectYesHandler = () => {
    setOpenDialog(false);
    setPlants(plants.filter((item, index) => index !== deleteId));
  };
  const saveHandler = () => {
    setloading(true);
    setOpenBackDrop(true);
    const data = {
      plantCode: plants.map((plant) => {
        return plant.name;
      }),
      projectCode: router.query.project,
    };
    axios
      .post(
        "https://pelglobal.iran.liara.run/api/plant/addPlantsOfProject",
        data,
        config
      )
      .then((response) => {
        setloading(false);
        router.push(`/Projects/${router.query.type}`);
      })
      .catch((error) => {
        setloading(false);
        const parseError = Object.assign({}, error);
        setErrMessage(parseError.response.data.message);
        setOpenSnackBar(true);
        setOpenBackDrop(false);
      });
  };
  const goBackButtonHandler = () => {
    router.push(`/Projects/${router.query.type}`);
  };
  const fileHandler = (event) => {
    if (event.target.files) {
      let fileObj = event.target.files[0];
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          const rows = resp.rows.map((row, index) => {
            return {
              id: index,
              name: row[0],
            };
          });
          setPlants(rows);
        }
      });
    }
  };
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "name",
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
      <Paper className={classes.paper}>
        <TextField
          id="outlined-basic"
          label="plant name"
          variant="outlined"
          value={plantName}
          onChange={handleChangePlantName}
        />
        <Button
          className={classes.addButton}
          color="primary"
          variant="outlined"
          onClick={addPlantHandler}
          startIcon={<AddCircleIcon />}
        >
          add
        </Button>
        <Button
          className={classes.addButton}
          color="primary"
          variant="outlined"
          component="label"
          startIcon={<AttachFileIcon />}
        >
          Upload File
          <input type="file" hidden onChange={fileHandler} />
        </Button>
      </Paper>

      {!isloading ? (
        <div className={classes.tableContainer}>
          <TableComponent
            rows={plants}
            columns={!smallScreen ? columns : columnsSmallScreen}
            handleRowSelection={getRowId}
          />
          <div className={classes.projectButton}>
            <Button
              color="primary"
              variant="contained"
              onClick={saveHandler}
              startIcon={<SaveIcon />}
            >
              save
            </Button>
            <Button
              className={classes.addButton}
              color="primary"
              variant="outlined"
              onClick={goBackButtonHandler}
              endIcon={<ArrowRightIcon />}
            >
              back to Projects
            </Button>
          </div>
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
        hasActions={true}
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
