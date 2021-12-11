import React, { useState, useEffect } from "react";

import Container from "@material-ui/core/Container";

// Import axios
import axios from "axios";

// Material Table
import MaterialTable from "material-table";

// Vaccine Helper Component
import ImmunizedChild from "../immunizer/ImmunizedChild";

const Immunizations = () => {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState([]);

  const [columns, setColumns] = useState([
    {
      title: "Name of Used Immunization",
      field: "vaccineName",
    },
    {
      title: "Description",
      field: "vaccineUse",
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

  const fetchImmunizedChildrenByImmunizer = async () => {
    try {
      const { data } = await axios.get(
        `https://tanuan-backend.herokuapp.com/api/immunizer/get-immunize-children-immunizer`
      );
      setDatas(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImmunizedChildrenByImmunizer();
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
          return <ImmunizedChild rowData={rowData} />;
        }}
      />
    </Container>
  );
};

export default Immunizations;
