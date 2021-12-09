import React, { useState, useEffect } from "react";

// ! Import Base URL
// import { baseURL } from "../utils/baseURL";

// Import axios
import axios from "axios";

// Momemnt
import moment from "moment";

// SweetAlert
import Swal from "sweetalert2";

// Material Table
import MaterialTable from "material-table";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";

// Circular Progress
import CircularProgress from "@material-ui/core/CircularProgress";

// Material UI Date
import {
  DatePicker,
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

// makeJSDateObject
import makeJSDateObject from "../../utils/makeJSDateObject";

// Helper
// import CustomDatePicker from "./helper/CustomDatePicker";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: theme.spacing(3),
  },
  circularContainer: {
    width: "100%",
    height: "10vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Schedule = () => {
  // Schedule State
  const initalDate = {
    vaccineType: "",
  };
  // Creating Schedule State
  const [schedule, setSchedule] = useState(initalDate);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSchedule({
      ...schedule,
      [name]: value,
    });
  };

  const [selectedDate, handleDateChange] = useState(new Date());

  // Submit Data CREATE Schedule
  const handleSubmit = async (e) => {
    e.preventDefault();

    const availableData = makeJSDateObject(selectedDate);

    const mainData = {
      ...schedule,
      availableSchedule: moment(availableData).format("LL"),
    };

    try {
      setIsLoadingVaccine(true);
      await axios.post(
        `https://tanuan-backend.herokuapp.com/api/schedule`,
        mainData
      );
      Swal.fire("Success", "New Schedule Added", "success");
      setIsLoadingVaccine(false);
      fetchSchedule();
    } catch (error) {
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      setIsLoadingVaccine(false);
      fetchSchedule();
    }
  };

  // Schedules Data fetched items || States
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVaccine, setIsLoadingVaccine] = useState(false);
  const [datas, setDatas] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const classes = useStyles();

  const [columns, setColumns] = useState([
    {
      title: "Scheduled Date",
      type: "date",
      field: "availableSchedule",
      filtering: false,
      render: (rowData) => (
        <Typography variant="p">
          {moment(rowData.availableSchedule).format("LL")}
        </Typography>
      ),
    },
    {
      title: "Vaccine Type",
      field: "vaccineType.vaccineName",
      type: "string",
      editable: false,
    },
    {
      title: "Date Created",
      field: "date",
      type: "date",
      editable: "never",
      export: false,
    },
  ]);

  // Fetch Schedules
  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/schedule`
      );
      setDatas(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Fetch Vaccines
  const fetchVaccines = async () => {
    try {
      setIsLoadingVaccine(true);
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/vaccine`
      );
      setVaccines(data.vaccines);
      setIsLoadingVaccine(false);
    } catch (error) {
      console.log(error);
      setIsLoadingVaccine(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchVaccines();
  }, []);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4} lg={4}>
        <Card className={classes.formContainer}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              Add New Schedule
            </Typography>
            <Typography paragraph color="textSecondary" gutterBottom>
              Vaccine Scheduler
            </Typography>
          </CardContent>

          {isLoadingVaccine ? (
            <div className={classes.circularContainer}>
              <CircularProgress />
            </div>
          ) : (
            <>
              <form noValidate autoComplete="off">
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={12} item>
                      <KeyboardDatePicker
                        disablePast
                        fullWidth
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="Set Vaccine Schedule"
                        // format="MM/dd/yyyy"
                        value={selectedDate}
                        InputAdornmentProps={{ position: "start" }}
                        onChange={(date) => handleDateChange(date)}
                      />
                    </Grid>
                    <Grid xs={12} sm={12} item>
                      <TextField
                        onChange={handleOnChange}
                        value={schedule.vaccineType}
                        name="vaccineType"
                        label="Vaccine Type"
                        variant="outlined"
                        fullWidth
                        select
                      >
                        {vaccines.map((item, index) => (
                          <MenuItem key={index} value={item._id}>
                            {item.vaccineName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid xs={12} sm={12} item>
                      <Button
                        className={classes.formButton}
                        onClick={handleSubmit}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
              </form>
            </>
          )}
        </Card>
      </Grid>

      <Grid item xs={12} md={8} lg={8}>
        <MaterialTable
          isLoading={isLoading}
          title="Scheduled Users For Vaccination"
          columns={columns}
          data={datas}
          options={{
            sorting: true,
            exportButton: true,
            actionsColumnIndex: -1,
            addRowPosition: "first",
            filtering: true,
            pageSize: 10,
          }}
          // ! Crud Opertaions
          editable={{
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                Swal.fire({
                  title: "Are you sure you want to reschedule?",
                  // text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, resched",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const availableDay = moment(
                      newData.availableSchedule
                    ).format("LL");

                    axios
                      .put(
                        `https://tanuan-backend.herokuapp.com/api/schedule/${oldData._id}`,
                        {
                          availableSchedule: availableDay,
                          vaccineQouta: newData.vaccineQouta,
                        }
                      )
                      .then((res) => {
                        Swal.fire(
                          "Updated!",
                          "Schedule has been updated.",
                          "success"
                        );
                        fetchSchedule();
                        resolve();
                      })
                      .catch((error) => {
                        Swal.fire(
                          "Error",
                          `${error.response.data.msg}`,
                          "error"
                        );

                        resolve();
                      });
                  } else {
                    resolve();
                  }
                });
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                axios
                  .delete(
                    `https://tanuan-backend.herokuapp.com/api/schedule/${oldData._id}`
                  )
                  .then((res) => {
                    fetchSchedule();
                    Swal.fire("Success", "Schedule Deleted", "success");
                    resolve();
                  })
                  .catch((error) => {
                    Swal.fire("Error", `${error.response.data.msg}`, "error");
                    resolve();
                  });

                //   setTimeout(() => {a
                //     const dataDelete = [...datas];
                //     const index = oldData.tableData.id;
                //     dataDelete.splice(index, 1);
                //     setDatas([...dataDelete]);
                //     resolve();
                //   }, 1000);
              }),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Schedule;
