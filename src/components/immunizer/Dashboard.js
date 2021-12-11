import React, { useState, useEffect } from "react";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// Count UP
import CountUp from "react-countup";

// Import Axios
import axios from "axios";

// React Icons
import { AiOutlineSchedule } from "react-icons/ai";
import { GiLoveInjection } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
    display: "flex",
    height: "180px",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing(1),
    textTransform: "capitalize",
  },
  dataNumber: {
    fontSize: "20px",
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [barangayVaccinated, setBarangayVaccinated] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Immunization
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/immunizer/get-daily-vaccinated-children-by-immunizer`
      );

      setVaccineData(data.VaccineData);
      setBarangayVaccinated(data.brgyVaccinated);

      console.log(data.VaccineData);

      setIsLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
      setIsLoading(false);
    }
  };
  // Call All Functions
  const callFunctions = () => {
    fetchData();
  };

  useEffect(() => {
    callFunctions();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography className={classes.title} variant="h5">
                  Barangays Vaccinated
                </Typography>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={barangayVaccinated.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <GiLoveInjection size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography className={classes.title} variant="h5">
                  Vaccine Type Used
                </Typography>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={vaccineData.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <GiLoveInjection size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
