import "./App.css";

// React States
import React, { useEffect, useContext } from "react";

// React Router
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// Layout
import Layout from "../src/components/Layout";
import ImmunizerLayout from "../src/components/ImmunizerLayout";

// Components
import Login from "./components/Login";
import HomePage from "./components/HomePage";

// RHU Components
import Barangay from "./components/rhu/Barangay";
import Vaccinator from "./components/rhu/Vaccinator";
import Vaccine from "./components/rhu/Vaccine";
import Immunization from "./components/rhu/Immunization";
import Schedule from "./components/rhu/Schedule";
import Profile from "./components/rhu/Profile";

// Add Helper Component
import AddVacinator from "./components/helper/AddVacinator";
import EditVacinator from "./components/helper/EditVacinator";

// Page 404 Error
import NotFound from "./components/NotFound";

// Private Route
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

// Immunizations
import ImmunizationStock from "./components/ImmunizationStock";
import ArchivedImmunization from "./components/helper/ArchiveImmunization";
import Immunizer from "./components/rhu/Immunizer";

import Addimmunizer from "./components/helper/Addimmunizer";

// Immunizer Route
import DashboardImmunizer from "./components/immunizer/Dashboard";
import AddChildVaccine from "./components/immunizer/AddChildVaccine";

// Auth Context
import AuthContext from "./context/auth/authContext";
import Dashboard from "./components/rhu/Dashboard";

function App() {
  const authContext = useContext(AuthContext);
  const {
    isAuthenticatedLogin,
    isLoading,
    token,
    admin,
    loadAdmin,
    loadImmunizer,
    logout,
  } = authContext;

  useEffect(() => {
    if (token) {
      if (typeof localStorage.getItem("status") === "undefined") {
        logout();
      } else {
        const value = localStorage.getItem("status");
        if (value === "rhu") {
          return loadAdmin();
        }
        if (value === "immunizer") {
          return loadImmunizer();
        }

        return logout();
      }
    }
  }, []);

  return (
    <>
      <Router>
        {isAuthenticatedLogin &&
        admin?.status === "rhu" &&
        !isLoading &&
        token ? (
          <Layout>
            <Switch>
              <PrivateRoute path="/dashboard">
                <Dashboard />
              </PrivateRoute>
              <PrivateRoute path="/barangay">
                <Barangay />
              </PrivateRoute>
              <PrivateRoute exact path="/vaccinator">
                <Vaccinator />
              </PrivateRoute>
              <PrivateRoute path="/vaccine">
                <Vaccine />
              </PrivateRoute>
              {/* Immunizations */}
              <PrivateRoute path="/immunization">
                <Immunization />
              </PrivateRoute>
              <PrivateRoute path="/immunization-stock">
                <ImmunizationStock />
              </PrivateRoute>
              <PrivateRoute path="/archieve-immunization">
                <ArchivedImmunization />
              </PrivateRoute>
              {/* End of Immunizations */}
              <PrivateRoute path="/schedule">
                <Schedule />
              </PrivateRoute>
              <PrivateRoute path="/profile">
                <Profile />
              </PrivateRoute>
              {/* Immunizer */}
              <PrivateRoute path="/immunizer">
                <Immunizer />
              </PrivateRoute>
              {/*  */}
              <PrivateRoute path="/add-immunizer">
                <Addimmunizer />
              </PrivateRoute>
              {/* Immunizer */}
              {/* Vaccinator Card */}
              <PrivateRoute exact path="/addVaccinator">
                <AddVacinator />
              </PrivateRoute>
              <PrivateRoute path="/editVaccinator/:id">
                <EditVacinator />
              </PrivateRoute>
            </Switch>
          </Layout>
        ) : null}

        {admin?.status === "immunizer" &&
        isAuthenticatedLogin &&
        !isLoading &&
        token ? (
          <ImmunizerLayout>
            <Switch>
              <PrivateRoute path="/dashboard">
                <DashboardImmunizer />
              </PrivateRoute>

              <PrivateRoute path="/vaccine-children">
                <AddChildVaccine />
              </PrivateRoute>
            </Switch>
          </ImmunizerLayout>
        ) : null}

        {/* {!isAuthenticatedLogin && ( */}
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>

          {!isLoading && !token ? (
            <Route page="*">
              <NotFound />
            </Route>
          ) : null}

          <Redirect to="/homepage" />
        </Switch>
        {/* )} */}
      </Router>
    </>
  );
}

export default App;
