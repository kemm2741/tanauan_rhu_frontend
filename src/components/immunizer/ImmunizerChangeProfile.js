import React, { useState, useContext, useEffect } from "react";

// ! Import Base URL
import { baseURL } from "../../utils/baseURL";

// React Router Dom
import { useHistory } from "react-router-dom";

// Sweet Alert
import Swal from "sweetalert2";
import Alert from "@material-ui/lab/Alert";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Context
import AuthContext from "../../context/auth/authContext";

// Import axios
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
  formContainer: {
    width: "530px",
    margin: "0 auto",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginTop: "-40px",
      width: "450px",
      padding: theme.spacing(2),
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
  errorAlert: {
    marginBottom: "25px",
  },
  loadingContainer: {
    width: "400px",
    marginInline: "auto",
    marginTop: "100px",
    display: "flex",
    justifyContent: "center",
    padding: "10px",
  },
  profileImageContainer: {
    width: "100%",
    display: "block",
    margin: "0 auto",
  },
  profileImage: {
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    marginInline: "auto",
    objectFit: "cover",
  },
}));

const ImmunizerChangeProfile = () => {
  const history = useHistory();
  const classes = useStyles();
  // initiate Context
  const authContext = useContext(AuthContext);

  // Global Context
  const { logout, loadAdmin, admin } = authContext;

  // Admin State
  const [isLoading, setIsLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  const [adminData, setAdminData] = useState({
    _id: admin?.user?._id,
    email: admin?.user?.email,
    contact: admin?.user?.contact,
    address: admin?.user?.address,
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  const handleChangeProfile = async (e) => {
    e.preventDefault();

    const { email, contact, address } = adminData;

    if (email === "") {
      return Swal.fire("Error", "Email must not be empty", "error");
    }

    if (contact === "") {
      return Swal.fire("Error", "Contact must not be empty", "error");
    }

    if (address === "") {
      return Swal.fire("Error", "Address must not be empty", "error");
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${baseURL}immunizer/update-immunizer-profile`,
        {
          email,
          contact,
          address,
          _id: admin.user._id,
        }
      );

      Swal.fire("Success", `Account has been updated!`, "success");
      fetchProfileInfo();
      setIsLoading(false);
    } catch (error) {
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      setIsLoading(false);
    }
  };

  // Fetch Profile Information
  const fetchProfileInfo = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${baseURL}immunizer/immunizer-profile-information`,
        { _id: admin.user._id }
      );

      console.log(data);

      setAdminData({
        ...adminData,
        _id: data._id,
        email: data.email,
        contact: data.contact,
        address: data.address,
      });

      console.log(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.paper}>
          <Grid container>
            <Card className={classes.formContainer}>
              <CardContent>
                <Typography
                  align="center"
                  className={classes.formTitle}
                  gutterBottom
                  variant="h4"
                >
                  My Profile
                </Typography>
                <Typography align="center" paragraph color="textSecondary">
                  Update profile data
                </Typography>
              </CardContent>

              {adminError && (
                <Alert className={classes.errorAlert} severity="error">
                  {adminError}
                </Alert>
              )}

              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.email}
                      onChange={handleOnChange}
                      name="email"
                      label="Enter email address"
                      variant="outlined"
                      type="email"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.contact}
                      onChange={handleOnChange}
                      name="contact"
                      label="Enter Contact Number"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.address}
                      onChange={handleOnChange}
                      name="address"
                      label="Address"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <Button
                      className={classes.formButton}
                      onClick={handleChangeProfile}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default ImmunizerChangeProfile;
