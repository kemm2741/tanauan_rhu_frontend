import React, { useState, useEffect } from "react";

// Import Material Table
import MaterialTable from "material-table";

// Import
import axios from "axios";

const ArchievedImmunization = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Immunizations
  const fetchArchieveImmunizations = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        " https://tanuan-backend.herokuapp.com/api/children/get-archived-immunization-stock"
      );

      setData(data.immunizationStock);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchieveImmunizations();
  }, []);

  return (
    <div>
      <MaterialTable
        title="Archieved Immunizations"
        options={{
          sorting: true,
          exportButton: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
        }}
        data={data}
        isLoading={isLoading}
        columns={[
          {
            title: "Immunization Name",
            field: "immunization.vaccineName",
          },
          {
            title: "Stock",
            field: "stock",
          },
          {
            title: "Description",
            field: "description",
          },
          {
            date: "Date",
            field: "date",
            type: "date",
            dateSetting: {
              format: "dd/MM/yyyy",
            },
          },
        ]}
      />
    </div>
  );
};

export default ArchievedImmunization;
