import React, { useState, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
import { AiOutlineUser, AiOutlineSchedule } from "react-icons/ai";
import { GiLoveInjection } from "react-icons/gi";
import { BsFillHouseFill } from "react-icons/bs";
import { FaUserNurse } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    display: "flex",
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
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const classes = useStyles();
  const [immunizationData, setImmunizationData] = useState({
    isLoading: false,
    immunizationArray: [],
  });

  const [vaccinatorData, setVaccinatorData] = useState({
    isLoading: false,
    vaccinatorArray: [],
  });

  const [barangayData, setBarangayData] = useState({
    isLoading: false,
    barangayArray: [],
  });

  const [vaccineData, setVaccineData] = useState({
    isLoading: false,
    vaccineArray: [],
  });

  const [mostUsedVaccine, setMostUsedVaccine] = useState({
    isLoading: false,
    branchName: "",
  });

  const [scheduleData, setScheduleData] = useState({
    isLoading: false,
    scheduleArray: [],
  });

  // Fetch Immunization
  const fetchImmunization = async () => {
    try {
      setImmunizationData({
        ...immunizationData,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/children`
      );

      setImmunizationData({
        ...immunizationData,
        immunizationArray: data,
        isLoading: false,
      });
    } catch (error) {
      alert(error.response.data.msg);
      setImmunizationData({
        ...immunizationData,
        isLoading: false,
      });
    }
  };

  // Fetch Vaccine length
  const fetchVaccines = async () => {
    try {
      setVaccineData({
        ...vaccineData,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/vaccine`
      );

      setVaccineData({
        ...vaccineData,
        vaccineArray: data.vaccines,
        isLoading: false,
      });
    } catch (error) {
      alert(error.response.data.msg);
      setVaccineData({
        ...vaccineData,
        isLoading: false,
      });
    }
  };

  // Fetch Most Used Vaccine
  const fetchMostUsedVaccine = async () => {
    try {
      setMostUsedVaccine({
        ...mostUsedVaccine,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/vaccine/mostUsedVaccine`
      );
      setMostUsedVaccine({
        ...mostUsedVaccine,
        branchName: data.vaccineName,
        isLoading: false,
      });
    } catch (error) {
      alert(error.response.data.msg);
      setMostUsedVaccine({
        ...mostUsedVaccine,
        isLoading: false,
      });
    }
  };

  // Fetch All Schedule
  const fetchSchedule = async () => {
    try {
      setScheduleData({
        ...scheduleData,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/schedule`
      );
      setScheduleData({
        scheduleArray: data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error.response.data.msg);
      setScheduleData({
        ...scheduleData,
        isLoading: false,
      });
    }
  };

  //   Fetch Barangay
  const fetchBarangay = async () => {
    try {
      setBarangayData({
        ...barangayData,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/barangay`
      );

      setBarangayData({
        ...barangayData,
        barangayArray: data,
        isLoading: false,
      });
    } catch (error) {
      alert(error.response.data.msg);
      setBarangayData({
        ...barangayData,
        isLoading: false,
      });
    }
  };

  //   Fetch Vaccinator
  const fetchVaccinator = async () => {
    try {
      setVaccinatorData({
        ...vaccinatorData,
        isLoading: true,
      });
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/vaccinator/get-all-vaccinator`
      );

      setVaccinatorData({
        ...vaccinatorData,
        vaccinatorArray: data.vaccinator,
        isLoading: false,
      });
    } catch (error) {
      alert(error.response.data.msg);
      setVaccinatorData({
        ...vaccinatorData,
        isLoading: false,
      });
    }
  };

  // Call All Functions
  const callFunctions = () => {
    fetchImmunization();
    fetchVaccines();
    fetchMostUsedVaccine();
    fetchSchedule();
    fetchBarangay();
    fetchVaccinator();
  };

  useEffect(() => {
    callFunctions();
  }, []);

  return (
    <Container maxWidth="xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <Grid container spacing={4}>
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography className={classes.title} variant="h5">
                  Daily Vaccine
                </Typography>
                {immunizationData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={immunizationData.immunizationArray.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <AiOutlineSchedule size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography className={classes.title} variant="h5">
                  Vaccine Types
                </Typography>
                {vaccineData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={vaccineData.vaccineArray.length}
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
      <Grid container spacing={4} align="center">
        <Grid xs={12} md={6} lg={6} item>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography className={classes.title} variant="h5">
                  Most Used Vaccine
                </Typography>
                {mostUsedVaccine.isLoading ? (
                  <CircularProgress />
                ) : (
                  <Typography className={classes.title} paragraph>
                    {mostUsedVaccine.branchName
                      ? mostUsedVaccine.branchName
                      : "No Vaccine is used"}
                  </Typography>
                )}
              </Grid>
              <Grid lg={6} item>
                <AiOutlineUser size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Vaccine Schedules
                </Typography>

                {scheduleData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={scheduleData.scheduleArray.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <AiOutlineSchedule size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} align="center">
        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Vaccinators
                </Typography>

                {vaccinatorData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={vaccinatorData.vaccinatorArray.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <FaUserNurse size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={6} item align="center">
          <Paper className={classes.paper}>
            <Grid container>
              <Grid lg={6} item>
                <Typography variant="h5" className={classes.title}>
                  Barangays
                </Typography>

                {barangayData.isLoading ? (
                  <CircularProgress />
                ) : (
                  <CountUp
                    className={classes.dataNumber}
                    start={0}
                    end={barangayData.barangayArray.length}
                    duration={1.5}
                    separator=","
                  />
                )}
              </Grid>
              <Grid lg={6} item>
                <BsFillHouseFill size={50} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
