import React, { useState, useContext } from "react";

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
}));

const ImmunizerChangePassword = () => {
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
    oldPassword: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { oldPassword, password } = adminData;

    if (oldPassword === "") {
      return Swal.fire("Error", "Old password must not be empty", "error");
    }

    if (password === "") {
      return Swal.fire("Error", "Password must not be empty", "error");
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        `${baseURL}immunizer/change-password-immunizer`,
        {
          _id: admin.user._id,
          oldpassword: oldPassword,
          newpassword: password,
        }
      );

      setAdminData({
        ...adminData,
        oldPassword: "",
        password: "",
      });

      Swal.fire("Success", `New password has been set`, "success");
      setIsLoading(false);
    } catch (error) {
      setAdminData({
        ...adminData,
        oldPassword: "",
        password: "",
      });
      Swal.fire("Error", `${error.response.data.msg}`, "error");
      setIsLoading(false);
    }
  };

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
                  Change password
                </Typography>
                {/* <Typography align="center" paragraph color="textSecondary">
            
                </Typography> */}
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
                      value={adminData.oldPassword}
                      onChange={handleOnChange}
                      name="oldPassword"
                      label="Enter old Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={adminData.password}
                      onChange={handleOnChange}
                      name="password"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <Button
                      className={classes.formButton}
                      onClick={handleChangePassword}
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

export default ImmunizerChangePassword;
