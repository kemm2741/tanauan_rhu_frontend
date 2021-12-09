import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// AUTH State
import AuthState from "./context/auth/AuthState";

ReactDOM.render(
  <AuthState>
    <App />
  </AuthState>,
  document.getElementById("root")
);
