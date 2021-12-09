import React, { useState, useEffect } from "react";

// Import axios
import axios from "axios";

// Material Table
import MaterialTable from "material-table";

const VaccinatorHelper = ({ rowData }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getVaccinatedUsers = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.post(
        "https://tanuan-backend.herokuapp.com/api/schedule/get-totol-vaccinated-person-and-vaccinator",
        { vaccinator: rowData._id }
      );

      setData(data.yourVaccinated);

      console.log(data.yourVaccinated);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVaccinatedUsers();
  }, []);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        isLoading={isLoading}
        title={`Vaccinated users by ${rowData.firstname}`}
        columns={[
          {
            title: "First Name",
            field: "user.name",
          },
          {
            title: "Middle Name",
            field: "user.middleName",
          },
          {
            title: "Last Name",
            field: "user.lastName",
          },
          {
            title: "User",
            field: "user.age",
          },
          {
            title: "Email",
            field: "user.email",
          },

          {
            title: "Vaccine Type Used",
            field: "vaccine.vaccineName",
          },

          {
            title: "Contact Number",
            field: "user.phoneNumber",
          },
        ]}
        data={data}
        options={{ sorting: true, exportButton: true, search: true }}
      />
    </div>
  );
};

export default VaccinatorHelper;
