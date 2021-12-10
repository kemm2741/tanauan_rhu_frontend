import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";

// Import moment
import moment from "moment";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

// Import axios
import axios from "axios";

// Material Table
import MaterialTable from "material-table";

// Vaccine Helper Component
import ImmunizationHelper from "../helper/ImmunizationHelper";

const Immunizations = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState([]);

  const [columns, setColumns] = useState([
    {
      title: "Name of Immunization",
      field: "vaccineName",
    },
    {
      title: "Description",
      field: "vaccineUse",
    },
    {
      title: "Immunization Label",
      field: "immunizationLabel",
      lookup: {
        birth: "Birth",
        "1month": "1 month",
        "2months": "2 months",
        "4months": " 4 months",
        "6months ": " 6 months",
        "12months": "12months",
        "15 months": "15 months",
        "18 months": "18 months",
        "2-3 years": "2-3 years",
        "4-6 years": "4-6 years",
      },
    },

    {
      title: "Scheduled Date",
      type: "date",
      field: "schedule",
      filtering: false,
      dateSetting: {
        format: "dd/MM/yyyy",
      },
    },
  ]);

  // Fetch Available Vaccine Data
  const fetchVaccine = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/children`
      );
      setDatas(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccine();
  }, []);

  return (
    <Container maxWidth="xl">
      <MaterialTable
        isLoading={isLoading}
        title="Children Immunization Table"
        columns={columns}
        data={datas}
        options={{
          sorting: true,
          exportButton: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        detailPanel={(rowData) => {
          return (
            <ImmunizationHelper
              id={rowData._id}
              title={rowData.vaccineName}
              usersArray={rowData.vaccinatedUser}
            />
          );
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise(async (resolve, reject) => {
              try {
                const { data } = await axios.post(
                  "https://tanuan-backend.herokuapp.com/api/children",
                  newData
                );
                resolve();
              } catch (error) {
                Swal.fire("Error", `${error.response.data.msg}`, "error");
                reject();
              }

              // axios
              //   .post(``)
              //   .then(({ data }) => {
              //     fetchVaccine();
              //   })
              //   .catch((err) => {
              //     resolve();
              //   });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              axios
                .put(
                  `https://tanuan-backend.herokuapp.com/api/children/${oldData._id}`,
                  {
                    vaccineName: newData.vaccineName,
                    vaccineUse: newData.vaccineUse,
                    immunizationLabel: newData.immunizationLabel,
                    schedule: newData.schedule,
                  }
                )
                .then(({ data }) => {
                  console.log("Vaccine Updated Successfully");
                })
                .catch((err) => {
                  Swal.fire("Error", `${err.response.data.msg}`, "error");
                  resolve();
                });

              setTimeout(() => {
                const dataUpdate = [...datas];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setDatas([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .delete(
                  `https://tanuan-backend.herokuapp.com/api/children/${oldData._id}`
                )
                .then((response) => {
                  console.log("Deleted Successfully");
                });

              setTimeout(() => {
                const dataDelete = [...datas];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setDatas([...dataDelete]);
                resolve();
              }, 1000);
            }),
        }}
      />
    </Container>
  );
};

export default Immunizations;
