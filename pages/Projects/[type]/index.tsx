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
import AlertDialog from "../../../components/AlertDialog";
import TableComponent from "../../../components/Table";
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
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import PageviewIcon from "@material-ui/icons/Pageview";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { Details } from "@material-ui/icons";
export interface ProjectsState {
  status: string;
  startDate: null | Date | string;
  endDate: null | Date | string;
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
    container: {
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
    location: {
      display: "flex",
    },
    locationItem: {
      marginRight: 20,
      marginLeft: 20,
    },
    popup: {
      paddingBottom: 50,
    },
    popupTitle: {
      marginTop: 0,
      color: "#033617",
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
const pages = {
  EcoPlantFinder: {
    id: 0,
    apiName: "getProjects",
  },
  DTM_DSM_DEM: {
    id: 1,
    apiName: "getDtmDsmDemProject",
  },
  MonitoringServices: {
    id: 2,
    apiName: "getMonitoringService",
  },
  MangementServices: {
    id: 3,
    apiName: "getManagementService",
  },
};

export default function Projects({ token }) {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();

  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [project, setProject] = useState([]);
  const [isloading, setloading] = useState(false);

  const [projectID, setProjectID] = useState(null);
  const [statuses, setStatus] = useState([]);

  const [opendialog, setOpenDialog] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [projectState, setProjectState] = useState<ProjectsState>({
    status: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const [openDetailPopup, setOpenDetailPopup] = useState(false);
  const [openLocationPopup, setOpenLocationsPopup] = useState(false);
  const [details, setDetails] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statusIsChecked, setStatusIsChecked] = useState(false);
  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setProjectState({ ...projectState, status: event.target.value as string });
  };
  const handleStartDateChange = (date: Date | null) => {
    setProjectState({ ...projectState, startDate: date });
  };
  const handleEndDateChange = (date: Date | null) => {
    setProjectState({ ...projectState, endDate: date });
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
          setStatus(response.data.data.data);
          setloading(false);
        })
        .catch((error) => {
          setloading(false);
        });
    }
  }, []);
  useEffect(() => {
    setProject([]);
  }, [router.query.type]);
  const getData = () => {
    if (!isloading) {
      setloading(true);
      setOpenBackDrop(true);

      const initData = {
        status: projectState.status,
        createdDateFrom:
          projectState.startDate.getFullYear() +
          "-" +
          (projectState.startDate.getMonth() + 1) +
          "-" +
          projectState.startDate.getDate(),
        createdDateTo:
          projectState.endDate.getFullYear() +
          "-" +
          (projectState.endDate.getMonth() + 1) +
          "-" +
          projectState.endDate.getDate(),
      };
      axios
        .get(
          `https://pelglobal.iran.liara.run/api/project/${
            pages[router.query.type].apiName
          }?status=${initData.status}&createdDateFrom=${
            initData.createdDateFrom
          }&createdDateTo=${initData.createdDateTo}`,
          config
        )
        .then((response) => {
          setProject(response.data.data);
          setloading(false);
          setOpenBackDrop(false);
          // console.log(response.data.data[0].locations)
          // setDetails(response.data.data.locations);
        })
        .catch((error) => {
          setloading(false);
          setOpenBackDrop(false);
        });
    }
  };
  const searchHandler = () => {
    getData();
  };
  const removeHandler = () => {
    setProjectState({
      status: "",
      startDate: new Date(),
      endDate: new Date(),
    });
  };
  // useEffect(() => {
  //   getData();
  // }, [projectState]);
  const deleteHandler = (params) => {
    setOpenDialog(true);
  };
  const downloadPDFHandler = (params) => {
    if (!isloading) {
      setloading(true);
      setOpenBackDrop(true);
      axios
        .get(
          `https://pelglobal.iran.liara.run/api/project/createProjectPDF?projectId=${params.id}`,
          config
        )
        .then((response) => {
          window.open(
            `https://60bc6469ffa5a3001861b3a4.iran.liara.space/files/${response.data.fileName}`,
            "_blank"
          );
          setloading(false);
          setOpenBackDrop(false);
        })
        .catch((error) => {
          const parseError = Object.assign({}, error);
          setOpenSnackBar(true);
          setErrMessage(parseError.response.data.message);
          setloading(false);
          setOpenBackDrop(false);
        });
    }
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const selectNoHandler = () => {
    setOpenDialog(false);
    setOpenDetailPopup(false);
    setOpenLocationsPopup(false);
  };
  const getRowId = (params) => {
    setProjectID(params.data.id);
    if (params.data.status === "checked") {
      setStatusIsChecked(true);
    } else {
      setStatusIsChecked(false);
    }
  };

  const selectYesHandler = () => {
    setOpenDialog(false);
    if (!isloading) {
      setloading(true);
      setOpenBackDrop(true);
      axios
        .delete(
          `https://pelglobal.iran.liara.run/api/project/deleteProjectByAdmin?projectId=${projectID}`,
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
  const projectHandler = () => {
    if (projectID) {
      router.push(`/Projects/${router.query.type}/${projectID}`);
    } else {
      setOpenSnackBar(true);
      setErrMessage("Please select a row first");
    }
  };
  const openDetailsPopUp = (params) => {
    if (params.row.detail.length) {
      setDetails(params.row.detail);
      setOpenDetailPopup(true);
    } else {
      setOpenSnackBar(true);
      setErrMessage("the selected row doesn't have any details");
    }
  };

  const openLocationsPopup = (params) => {
    if (params.row.locations.length > 0) {
      setLocations(params.row.locations);
      setOpenLocationsPopup(true);
    }
  };
  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "title",
      flex: 1,
    },
    {
      field: "status",
      headerName: "status",
      flex: 1,
      // minWidth: 150,
    },
    {
      field: "createdDate",
      headerName: "createdDate",
      width: 200,
      flex: 1,
      // minWidth: 150,
    },
    {
      field: "details",
      headerName: "details",
      width: 200,
      // flex: 0.5,
      // minWidth: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            onClick={() => openDetailsPopUp(params)}
            startIcon={<PageviewIcon />}
          >
            more detail
          </Button>
        </>
      ),
    },
    {
      field: "locations",
      headerName: "locations",
      width: 200,
      // flex: 0.5,
      // minWidth: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            onClick={() => openLocationsPopup(params)}
            startIcon={<LocationOnIcon />}
          >
            locations
          </Button>
        </>
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
          {router.query.type === "EcoPlantFinder" && (
            <IconButton
              color="primary"
              onClick={() => downloadPDFHandler(params)}
            >
              <GetAppIcon />
            </IconButton>
          )}
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
      field: "status",
      headerName: "status",
      width: 120,
    },
    {
      field: "createdDate",
      headerName: "createdDate",
      width: 200,
    },
    {
      field: "details",
      headerName: "details",
      width: 200,
      // flex: 0.5,
      // minWidth: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={() => openDetailsPopUp(params)}
            className={classes.margin}
            startIcon={<PageviewIcon />}
          >
            more detail
          </Button>
        </>
      ),
    },
    {
      field: "locations",
      headerName: "locations",
      width: 200,
      // flex: 0.5,
      // minWidth: 150,
      align: "center",
      // eslint-disable-next-line react/display-name
      renderCell: (params) => (
        <>
          <Button
            color="primary"
            variant="contained"
            onClick={() => openLocationsPopup(params)}
            className={classes.margin}
          >
            locations
          </Button>
        </>
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
          {router.query.type === "EcoPlantFinder" && (
            <IconButton
              color="primary"
              onClick={() => downloadPDFHandler(params)}
            >
              <GetAppIcon />
            </IconButton>
          )}
          <IconButton onClick={() => deleteHandler(params)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <>
      <h1 className={classes.title}>{router.query.type}</h1>
      <Paper className={classes.paper}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-name-label">status</InputLabel>
          <Select
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            value={projectState.status}
            onChange={handleStatusChange}
            MenuProps={MenuProps}
          >
            {statuses.map((status, index) => (
              <MenuItem key={status.id} value={status.id}>
                {status.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-from"
            label="created date from"
            value={projectState.startDate}
            onChange={handleStartDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-to"
            label="created date to"
            value={projectState.endDate}
            onChange={handleEndDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <div className={classes.container}>
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
        </div>
      </Paper>
      {!isloading ? (
        <div className={classes.tableContainer}>
          <TableComponent
            rows={project}
            columns={!smallScreen ? columns : columnsSmallScreen}
            handleRowSelection={getRowId}
          />
          {router.query.type === "EcoPlantFinder" && (
            <Button
              color="primary"
              variant="outlined"
              onClick={projectHandler}
              className={classes.projectButton}
              endIcon={<ArrowRightIcon />}
              disabled={statusIsChecked ? true : false}
            >
              go to project
            </Button>
          )}
        </div>
      ) : (
        <div className={classes.loader}>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="secondary" />
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
      <AlertDialog
        open={openDetailPopup}
        clickClose={selectNoHandler}
        clickYes={selectYesHandler}
        content={
          <>
            <h2 className={classes.popupTitle}>Details</h2>
            {details.map((detail, index) => {
              return (
                <div key={index}>
                  {index + 1} - {detail.title}
                </div>
              );
            })}
          </>
        }
        hasActions={false}
      />
      <AlertDialog
        open={openLocationPopup}
        clickClose={selectNoHandler}
        clickYes={selectYesHandler}
        content={
          <div className={classes.popup}>
            <h2 className={classes.popupTitle}>Locations</h2>
            {locations.map((location, index) => {
              return (
                <div key={index} className={classes.location}>
                  {index + 1}-
                  <div className={classes.locationItem}>
                    latitude: {location.latitude}
                  </div>
                  <div className={classes.locationItem}>
                    longitude: {location.longitude}
                  </div>
                </div>
              );
            })}
          </div>
        }
        hasActions={false}
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
