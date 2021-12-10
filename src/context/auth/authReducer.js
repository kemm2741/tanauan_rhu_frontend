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

export default (state, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOAD_RHU_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("status", action.payload.status);

      return {
        ...state,
        status: action.payload.status,
        isLoading: false,
        admin: action.payload.admin,
        isAuthenticatedLogin: true,
        token: action.payload.token,
        errorLogin: null,
      };
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        isLoading: false,
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: action.payload,
      };
    case LOAD_RHU_FAIL:
      return {
        ...state,
        isLoading: false,
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: null,
      };
    case LOAD_RHU_SUCCESS:
      return {
        ...state,
        isAuthenticatedLogin: true,
        isLoading: false,
        admin: action.payload,
        errorLogin: null,
        status: action.payload.status,
      };
    case LOG_OUT:
      localStorage.removeItem("token");
      localStorage.removeItem("status");

      return {
        token: null,
        isAuthenticatedLogin: false,
        admin: null,
        errorLogin: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
