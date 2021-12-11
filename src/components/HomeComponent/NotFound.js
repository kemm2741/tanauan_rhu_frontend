import React from "react";
import Button from "@material-ui/core/Button";

import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  return (
    <div
      style={{
        width: "50%",
        marginInline: "auto",
        height: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        404 Page Not Found
      </h1>
      <Button
        onClick={() => {
          history.push("/");
        }}
        variant="contained"
        color="primary"
      >
        Go to home
      </Button>
    </div>
  );
};

export default NotFound;
