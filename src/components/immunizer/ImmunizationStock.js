import React, { useState, useEffect } from "react";

import Swal from "sweetalert2/dist/sweetalert2.js";

// Import axios
import axios from "axios";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
// Material Table
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  paperGrid: {
    padding: theme.spacing(4),
  },
  composedChart: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },

  // Select CSS
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
  },

  //
  vaccineTitle: {
    textTransform: "capitalize",
  },
}));

const ImmunizationStock = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //   Fetch Immunization Stock
  const fetchImmunizationStock = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://tanuan-backend.herokuapp.com/api/children/get-immunization-stock"
      );

      setData(data.immunizationStock);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImmunizationStock();
  }, []);

  return (
    <div>
      {/* End of Modal */}

      <MaterialTable
        title={`Immunization Stock`}
        isLoading={isLoading}
        columns={[
          {
            title: "Stock",
            field: "stock",
          },
          {
            title: "Immunization",
            field: "immunization.vaccineName",
          },
          {
            title: "Description",
            field: "description",
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

export default ImmunizationStock;
