import React, { useState, useEffect } from "react";

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
      title: "Immunization Use",
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
    // {
    //   title: "Vaccination Barangay",
    //   field: "barangay",
    //   lookup: {
    //     Ada: "Ada",
    //     Amanluran: "Amanluran",
    //     Arado: "Arado",
    //     Atipolo: "Atipolo",
    //     Balud: "Balud",
    //     Bangon: "Bangon",
    //     Bantagan: "Bantagan",
    //     Baras: "Baras",
    //     Binolo: "Binolo",
    //     Binongto: "Binongto-an",
    //     Bislig: "Bislig",
    //     "Buntay (Poblacion)": "Buntay (Poblacion)",
    //     Cabalagnan: "Cabalagnan",
    //     "Cabarasan Guti": "Cabarasan Guti",
    //     "Cabonga-an": "Cabonga-an",
    //     Cabuynan: "Cabuynan",
    //     Cahumayhumayan: "Cahumayhumayan",
    //     Calogcog: "Calogcog",
    //     Calsadahay: "Calsadahay",
    //     Camire: "Camire",
    //     Canbalisara: "Canbalisara",
    //     "Canramos (Poblacion)": "Canramos (Poblacion)",
    //     Catigbian: "Catigbian",
    //     Catmon: "Catmon",
    //     Cogon: "Cogon",
    //     "Guindag-an": "Guindag-an",
    //     Guingauan: "Guingauan",
    //     Hilagpad: "Hilagpad",
    //     Lapay: "Lapay",
    //     "Licod (Poblacion)": "Licod (Poblacion)",
    //     "Limbuhan Daku": "Limbuhan Daku",
    //     "Limbuhan Guti": "Limbuhan Guti",
    //     Linao: "Linao",
    //     Kiling: "Kiling",
    //     Magay: "Magay",
    //     Maghulod: "Maghulod",
    //     Malaguicay: "Malaguicay",
    //     Maribi: "Maribi",
    //     Mohon: "Mohon",
    //     Pago: "Pago",
    //     Pasil: "Pasil",
    //     Picas: "Picas",
    //     Sacme: "Sacme",
    //     "San Miguel (Poblacion)": "San Miguel (Poblacion)",
    //     Salvador: "Salvador",
    //     "San Isidro": "San Isidro",
    //     "San Roque (Poblacion)": "San Roque (Poblacion)",
    //     "San Victor": "San Victor",
    //     "Santa Cruz": "Santa Cruz",
    //     "Santa Elena": "Santa Elena",
    //     "Santo Niño (Haclagan) (Poblacion)":
    //       "Santo Niño (Haclagan) (Poblacion)",
    //     Solano: "Solano",
    //     Talolora: "Talolora",
    //     Tugop: "Tugop",
    //   },
    // },
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

      console.log(data);

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
            new Promise((resolve, reject) => {
              axios
                .post(
                  `https://tanuan-backend.herokuapp.com/api/children`,
                  newData
                )
                .then(({ data }) => {
                  setTimeout(() => {
                    setDatas([data.savedVaccine, ...datas]);
                    resolve();
                  }, 1000);
                });
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
