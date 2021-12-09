import React, { useState } from "react";

// ! Base URL
import { baseURL } from "../../utils/baseURL";

import axios from "axios";

// Material Table
import MaterialTable from "material-table";

const ImmunizationHelper = ({ usersArray, id, title }) => {
  const [data, setData] = useState([usersArray]);

  console.log(id, usersArray);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        title={`Immunized Children`}
        columns={[
          {
            title: "Stock",
            field: "firstName",
          },
          {
            title: "Description",
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
          },
          {
            title: "Barangay",
            field: "brgy",
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
        editable={{
          onRowAdd: (newData, oldData) =>
            new Promise((resolve, reject) => {
              axios
                .put(
                  `https://tanuan-backend.herokuapp.com/api/children/`,
                  newData
                )
                .then(({ data }) => {
                  console.log(data);
                })
                .catch((err) => {
                  console.log(err);
                  resolve();
                });
            }),
          // onRowUpdate: (newData, oldData) =>
          //   new Promise((resolve, reject) => {
          //     console.log(oldData);
          //     axios
          //       .put(
          //         `https://tanuan-backend.herokuapp.com/api/children/updateVaccinatedChild/${id}`,
          //         {
          //           _id: oldData._id,
          //           ...newData,
          //         }
          //       )
          //       .then(({ data }) => {
          //         console.log(data);
          //         // console.log(`Child updated successfully`);
          //         // console.log(data.child);
          //         setTimeout(() => {
          //           const dataUpdate = [...users];
          //           const index = oldData.tableData.id;
          //           dataUpdate[index] = newData;
          //           setUsers([...dataUpdate]);
          //           resolve();
          //         }, 1000);
          //       })
          //       .catch((err) => {
          //         console.log(err);
          //         resolve();
          //       });
          //   }),
          // onRowDelete: (oldData) =>
          //   new Promise((resolve, reject) => {
          //     axios
          //       .put(
          //         `https://tanuan-backend.herokuapp.com/api/children/deleteVaccinatedChild/${id}`,
          //         oldData
          //       )
          //       .then((response) => {
          //         console.log("Deleted Successfully");
          //       });

          //     setTimeout(() => {
          //       const dataDelete = [...users];
          //       const index = oldData.tableData.id;
          //       dataDelete.splice(index, 1);
          //       setUsers([...dataDelete]);

          //       resolve();
          //     }, 1000);
          //   }),
        }}
      />
    </div>
  );
};

export default ImmunizationHelper;
