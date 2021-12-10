import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

// Import axios
import axios from "axios";

// Material UI Date Picker
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    width: "530px",
    margin: "0 auto",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginTop: "-50px",
      width: "420px",
      marginBottom: "20px",
    },
  },
  formTitle: {
    fontSize: "30px",
  },

  formButton: {
    padding: "10px",
  },
  subscribeButton: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    width: "200px",
    height: "40vh",
    marginInline: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    marginInline: "auto",
    width: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paperModal: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 3, 2),
  },
  qrDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  qrButton: {
    marginTop: "30px",
  },
  qrCodeText: { textAlign: "center" },
}));

//
const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date); // create a date object directly from dob1 argument
  let age_now = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};

const AddVaccineChild = () => {
  const classes = useStyles();
  const history = useHistory("");

  const initalState = {
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    age: "",
    birthday: "",
    immunizer: "",
    brgy: "",
  };

  const [userData, setUserData] = useState(initalState);
  const [isLoading, setIsLoading] = useState(false);

  //   Fetched Barangays
  const [barangays, setBarangays] = useState([]);

  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2020-08-18T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //   handleOnChange
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Fetch Barangay
  const fetchBarangay = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/barangay`
      );
      setBarangays(data);

      console.log(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBarangay();
  }, []);

  // Add Child Vacinated
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      middleName,
      lastName,
      gender,
      age,
      birthday,
      immunizer,
      brgy,
    } = userData;

    if (firstName === "") {
      return Swal.fire("Error", "Please enter last name", "error");
    }

    if (middleName === "") {
      return Swal.fire("Error", "Please enter middleName", "error");
    }
    if (lastName === "") {
      return Swal.fire("Error", "Please enter lastName", "error");
    }

    if (gender === "") {
      return Swal.fire("Error", "Please enter gender", "error");
    }

    if (age === "") {
      return Swal.fire("Error", "Please enter birthday", "error");
    }

    if (immunizer === "") {
      return Swal.fire("Error", "Please enter immunizer", "error");
    }
    if (brgy === "") {
      return Swal.fire("Error", "Please enter brgy", "error");
    }

    if (calculateAge(new Date(selectedDate)) <= 20) {
      return Swal.fire("Error", "You must be 21 to be a vaccinator", "error");
    }

    console.log(userData);

    // Success No Error
    try {
      setIsLoading(true);

      const { data } = await axios.post(
        "https://tanuan-backend.herokuapp.com/api/vaccinator/create-vaccinator",
        {
          firstName,
          middleName,
          lastName,
          gender,
          age,
          birthday,
          immunizer,
          brgy,
        }
      );

      // console.log(data);

      Swal.fire("Success ", "New vaccinator added", "success");

      history.push("/dashboard");

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    setUserData(initalState);
  };

  return (
    <Grid justifyContent="center" container>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Card className={classes.formContainer}>
            <CardContent>
              <Typography
                align="center"
                className={classes.formTitle}
                gutterBottom
                variant="h4"
              >
                Add Vaccinator Form
              </Typography>
              {/* <Typography paragraph color="textSecondary" gutterBottom>
            Fill up the form to receive a QR code via email.
          </Typography> */}
            </CardContent>
            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} item>
                  <TextField
                    onChange={handleOnChange}
                    name="firstname"
                    value={userData.firstName}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <TextField
                    onChange={handleOnChange}
                    name="middlename"
                    value={userData.middleName}
                    label=" Middle Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="lastname"
                    value={userData.lastName}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <TextField
                    onChange={handleOnChange}
                    name="sex"
                    value={userData.gender}
                    label="Sex"
                    variant="outlined"
                    fullWidth
                    select
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Birth Day"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        variant="outlined"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="contact"
                    value={userData.contact}
                    label="Contact Number"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="email"
                    value={userData.age}
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
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
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </>
      )}
    </Grid>
  );
};

export default AddVaccineChild;