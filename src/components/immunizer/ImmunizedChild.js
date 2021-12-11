import React, { useState, useEffect, useContext } from "react";

// ! Base URL
import { baseURL } from "../../utils/baseURL";

import axios from "axios";

// Context
import AuthContext from "../../context/auth/authContext";

// Material Table
import MaterialTable from "material-table";

const ImmunizationHelper = ({ rowData }) => {
  // Global Context
  const authContext = useContext(AuthContext);
  const { admin } = authContext;

  const [data, setData] = useState(rowData.vaccinatedUser);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        title={`Immunized Children by ${admin.user?.firstname} `}
        columns={[
          {
            title: "First Name",
            field: "firstName",
          },
          {
            title: "Middle Name",
            field: "middleName",
          },
          {
            title: "Last Name",
            field: "lastName",
          },
          {
            title: "Gender",
            field: "gender",
          },
          {
            title: "Age",
            field: "age",
          },
          {
            title: "Birth Day",
            field: "birthday",
            type: "date",
            dateSetting: {
              format: "dd/MM/yyyy",
            },
          },
          {
            title: "Barangay",
            field: "brgy.barangayName",
          },
        ]}
        data={data}
        options={{
          search: true,
          sorting: true,
          exportButton: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
      />
    </div>
  );
};

export default ImmunizationHelper;
