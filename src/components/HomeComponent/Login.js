import React, { useState, useEffect, useContext } from "react";

// Material Ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import CircularProgress from "@material-ui/core/CircularProgress";

import Swal from "sweetalert2";
import Alert from "@material-ui/lab/Alert";

import { useHistory } from "react-router-dom";

// Auth Context
import AuthContext from "../../context/auth/authContext";

// Footer
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    marginTop: "10px",
  },
  containerBox: {
    width: "100%",
    paddingInline: "30px",
    marginTop: "20px",
  },

  titleLoginText: {
    paddingRight: "10px",
    cursor: "pointer",
  },

  logoContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  logoImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "10px",
  },

  bannerImage: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  titleText: {
    marginTop: "50px",
    marginBottom: "30px",
  },
  circularContainer: {
    width: "100%",
    height: "20vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textField: {
    paddingBottom: "13px",
  },
  errorAlert: {
    marginBottom: "15px",
  },
}));

function ElevationScroll(props) {
  const { children, window } = props;

  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Login(props) {
  const classes = useStyles();
  const history = useHistory();

  const authContext = useContext(AuthContext);
  const { isAuthenticatedLogin, isLoading, errorLogin, login, loginImmunizer } =
    authContext;

  const initialState = {
    email: "",
    password: "",
    loginAs: "",
  };

  const [loginData, setLoginData] = useState(initialState);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginData.email === "" && loginData.password === "") {
      return Swal.fire(
        "Error Login",
        "Please provide valid email and password",
        "error"
      );
    }

    if (loginData.email === "") {
      return Swal.fire("Error Login", "Email must not be empty!", "error");
    }

    if (loginData.password === "") {
      return Swal.fire("Error Login", "Password must not be empty", "error");
    }

    if (loginData.loginAs === "") {
      return Swal.fire("Error Login", "Login as must be set", "error");
    }

    // Login Immunizer
    if (loginData.loginAs === "immunizer") {
      loginImmunizer(loginData);
      return setLoginData(initialState);
    }

    // Login AS RHU Admin
    login(loginData);

    // Reset Input
    setLoginData(initialState);
  };

  useEffect(() => {
    if (isAuthenticatedLogin) {
      history.push("/dashboard");
    }
  }, [isAuthenticatedLogin]);

  return (
    <>
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar>
            <div
              onClick={() => {
                history.push("/");
              }}
              className={classes.logoContainer}
            >
              <img
                className={classes.logoImage}
                src="data:image/jpeg;base64,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"
                alt="tanauanLogo"
              />
              <h3> Tanauan QR Scanner</h3>
            </div>

            {/*  */}
            <Typography
              onClick={() => {
                history.push("/login");
              }}
              className={classes.titleLoginText}
              variant="h6"
            >
              Login
            </Typography>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />

      <Container component="main" maxWidth="xs">
        {isLoading ? (
          <div className={classes.circularContainer}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar color="primary" className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography align="center" component="h1" variant="h5">
                Tanauan RHU Vaccination and Immunization QR Code Scheduling
                System
              </Typography>
              <form className={classes.form} noValidate>
                {errorLogin && (
                  <Alert className={classes.errorAlert} severity="error">
                    {errorLogin}
                  </Alert>
                )}

                <TextField
                  className={classes.textField}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  onChange={handleOnChange}
                  value={loginData.email}
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={handleOnChange}
                  value={loginData.password}
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />

                <TextField
                  variant="outlined"
                  onChange={handleOnChange}
                  name="loginAs"
                  value={loginData.loginAS}
                  label="Login As"
                  fullWidth
                  select
                >
                  <MenuItem value="rhu"> RHU </MenuItem>
                  <MenuItem value="immunizer"> Immunizer </MenuItem>
                </TextField>

                <Button
                  required
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      onClick={async () => {
                        const { value: email } = await Swal.fire({
                          title: "Input email address",
                          input: "email",
                          inputLabel: "Your email address",
                          inputPlaceholder: "Enter your email address",
                        });

                        if (email) {
                          Swal.fire(`Entered email: ${email}`);
                        }
                      }}
                      variant="body2"
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item></Grid>
                </Grid>
              </form>
            </div>
            <Box mt={8}>
              <Footer />
            </Box>
          </>
        )}
      </Container>
    </>
  );
}
