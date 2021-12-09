import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  //
  LOAD_RHU_REQUEST,
  LOAD_RHU_SUCCESS,
  LOAD_RHU_FAIL,
  //
  LOG_OUT,
} from "../constants";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticatedLogin: false,
    admin: null,
    errorLogin: null,
    isLoading: false,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadAdmin = async () => {
    setAuthToken(localStorage.token);

    try {
      dispatch({
        type: LOAD_RHU_REQUEST,
      });

      const { data } = await axios.get(
        "https://tanuan-backend.herokuapp.com/api/rhu/is-authenticated-rhu"
      );

      dispatch({
        type: LOAD_RHU_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({ type: LOAD_RHU_FAIL });
    }
  };

  const login = async (loginData) => {
    try {
      dispatch({
        type: LOGIN_REQUEST,
      });

      const { data } = await axios.post(
        "https://tanuan-backend.herokuapp.com/api/rhu/login-rhu-facilitator",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      console.log(data);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data,
      });

      loadAdmin();
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response.data.msg,
      });
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOG_OUT });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticatedLogin: state.isAuthenticatedLogin,
        isLoading: state.isLoading,
        admin: state.admin,
        errorLogin: state.errorLogin,
        loadAdmin,
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
