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
        " https://tanuan-backend.herokuapp.com/api/children/get-archived-children-vaccine"
      );

      setData(data);
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
            title: "Vaccine Name",
            field: "vaccineName",
          },
          {
            title: "Vaccine Use",
            field: "vaccineUse",
          },
          {
            title: "Immunization Label",
            field: "immunizationLabel",
          },
          // {
          //   date: "Date",
          //   field: "date",
          //   type: "date",
          //   dateSetting: {
          //     format: "dd/MM/yyyy",
          //   },
          // },
        ]}
      />
    </div>
  );
};

export default ArchievedImmunization;
