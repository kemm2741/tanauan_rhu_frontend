import React, { useState } from "react";

// Material Table
import MaterialTable from "material-table";

const ImmunizationHelper = ({ usersArray, id, title }) => {
  const withImmunizer = usersArray.map((user) => {
    return {
      ...user,
      immunizerDetails: `${user.immunizer.firstname} ${user.immunizer.middlename} ${user.immunizer.lastname}`,
    };
  });

  const [data, setData] = useState(withImmunizer);

  return (
    <div style={{ padding: "50px 40px", backgroundColor: "#ebe9e9" }}>
      <MaterialTable
        title={`Immunized Children with ${title}`}
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
          {
            title: "Immunizer Details",
            field: "immunizerDetails",
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
