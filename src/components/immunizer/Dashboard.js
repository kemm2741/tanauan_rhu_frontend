import React, { useState, useEffect } from "react";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// Rechart
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
  immunizedChart: {
    marginTop: "20px",
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const [barangayVaccinated, setBarangayVaccinated] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [barangaysData, setBarangaysData] = useState([]);
  const [immunizedBrgy, setImmunizedBrgy] = useState([]);

  // Fetch Immunization
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/immunizer/get-daily-vaccinated-children-by-immunizer`
      );

      const barangayResponse = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/barangay`
      );

      console.log(data.VaccineData);

      setVaccineData(data.VaccineData);
      setBarangayVaccinated(data.brgyVaccinated);

      // Filter
      const vaccinatedBarangays = data.brgyVaccinated.map((data) => {
        return {
          brgy: data.brgy,
          total: data.total,
        };
      });

      // Immunizer Vaccinated Barangays
      const barangaysData = barangayResponse.data;
      const barangaysOnly = barangaysData.map((barangay) => {
        return {
          brgy: barangay.barangay.barangayName,
          total: 0,
        };
      });
      setBarangaysData(barangaysOnly);

      //! Merge Arrays
      var brgys = new Set(vaccinatedBarangays.map((d) => d.brgy));
      var merged = [
        ...vaccinatedBarangays,
        ...barangaysOnly.filter((d) => !brgys.has(d.brgy)),
      ].sort(function (a, b) {
        if (a.brgy < b.brgy) {
          return -1;
        }
        if (a.brgy > b.brgy) {
          return 1;
        }
        return 0;
      });
      setImmunizedBrgy(merged);

      setIsLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
      setIsLoading(false);
    }
  };

  // Call All Functions
  useEffect(() => {
    fetchData();
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

        <Grid className={classes.immunizedChart} xs={12} md={12} lg={12}>
          <Typography variant="h6"> Immunized Barangays </Typography>
          <ResponsiveContainer
            className={classes.lineChart}
            width="100%"
            height={400}
          >
            <LineChart
              width={500}
              height={200}
              data={immunizedBrgy}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brgy" />
              <YAxis />
              <Tooltip />
              <Line
                connectNulls
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
