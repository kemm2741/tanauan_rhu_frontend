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

// Modal Material UI
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Select from "react-select";

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
    marginTop: "25px",
    marginInline: "auto",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  circularContainer: {
    marginTop: "50px",
  },
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
    brgy: "",
    immunizationType: "",
  };

  const [userData, setUserData] = useState(initalState);
  const [isLoading, setIsLoading] = useState(false);
  const [immunizations, setImmunizations] = useState([]);

  //   Fetched Barangays
  const [barangays, setBarangays] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    console.log(1);
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
      //   setBarangays(data);

      setBarangays(
        data.map(({ barangay }) => {
          return {
            value: barangay._id,
            label: barangay.barangayName,
          };
        })
      );

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAvailableImmunization = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://tanuan-backend.herokuapp.com/api/children"
      );

      setImmunizations(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleBarangayOnChange = ({ value }) => {
    setUserData({ ...userData, brgy: value });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Add Child Vacinated
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, middleName, lastName, gender, age, brgy } = userData;

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
      return Swal.fire("Error", "Please enter age", "error");
    }

    if (selectedDate === "") {
      console.log("selected date", selectedDate);
      return Swal.fire("Error", "Please enter birthday", "error");
    }

    if (brgy === "") {
      return Swal.fire("Error", "Please enter brgy", "error");
    }

    // Success No Error
    Swal.fire({
      title: "Please review before creating",
      text: "You won't be able to edit this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Create",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);

          const { status, data } = await axios.put(
            `https://tanuan-backend.herokuapp.com/api/children/addVaccinatedChild/${userData.immunizationType}`,
            {
              firstName,
              middleName,
              lastName,
              gender,
              age,
              birthday: selectedDate,
              brgy,
            }
          );

          if (status === 200) {
            setIsLoading(false);
            history.push("/immunization");
            setIsLoading(false);
            Swal.fire("Success ", `${data.msg}`, "success");
            return setUserData(initalState);
          }
        } catch (error) {
          setIsLoading(false);
          Swal.fire("Warning", `${error.response.data.msg}`, "warning");
          setUserData(initalState);
        }
      }
    });
  };

  useEffect(() => {
    fetchBarangay();
    fetchAvailableImmunization();
  }, []);

  return (
    <Grid justifyContent="center" container>
      {isLoading ? (
        <div className={classes.circularContainer}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <h2 id="transition-modal-title">Transition modal</h2>
                <p id="transition-modal-description">
                  react-transition-group animates me.
                </p>
              </div>
            </Fade>
          </Modal>

          <Card className={classes.formContainer}>
            <CardContent>
              <Typography
                align="center"
                className={classes.formTitle}
                gutterBottom
                variant="h4"
              >
                Add Vaccinated Children
              </Typography>
              {/* <Typography paragraph color="textSecondary" gutterBottom>
            Fill up the form to receive a QR code via email.
          </Typography> */}
            </CardContent>
            <form noValidate autoComplete="off">
              <Grid container spacing={2}>
                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="firstName"
                    value={userData.firstName}
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="middleName"
                    value={userData.middleName}
                    label=" Middle Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="lastName"
                    value={userData.lastName}
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="gender"
                    value={userData.gender}
                    label="Gender"
                    variant="outlined"
                    fullWidth
                    select
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>

                <Grid xs={12} sm={12} item>
                  <Select
                    menuPortalTarget={document.body}
                    // menuPosition={"fixed"}
                    placeholder="Select Barangay"
                    onChange={handleBarangayOnChange}
                    options={barangays}
                  />
                </Grid>

                <Grid xs={12} sm={6} item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justifyContent="space-around">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Birth Day"
                        format="MM/dd/yyyy"
                        value={selectedDate === "" ? new Date() : selectedDate}
                        // value={selectedDate}
                        onChange={handleDateChange}
                        variant="outlined"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <TextField
                    onChange={handleOnChange}
                    name="age"
                    value={userData.age}
                    label="Age Number"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid xs={12} sm={12} item>
                  <TextField
                    onChange={handleOnChange}
                    name="immunizationType"
                    value={userData.immunization}
                    label="Immunization Type"
                    variant="outlined"
                    fullWidth
                    select
                  >
                    {immunizations?.map((immunization) => (
                      <MenuItem value={immunization._id}>
                        {immunization.vaccineName}
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
