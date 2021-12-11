import React, { useState, useEffect } from "react";

import Swal from "sweetalert2/dist/sweetalert2.js";

// Import axios
import axios from "axios";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// Material UI Modal
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";

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

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Mdal CSS
  paperModal: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 3, 3),
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
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

  //   Immunization Menu
  const [immunizationMenu, setImmunizationMenu] = useState();
  // Fetch Immunizations
  const fetchAvailableImmunization = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://tanuan-backend.herokuapp.com/api/children"
      );
      setImmunizationMenu(data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

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

  // States
  const initialState = {
    immunization_id: "",
    stock: "",
    description: "",
  };

  const [immunizationStock, setImmunizationStock] = useState(initialState);
  const [editImmunization, setEditImmunization] = useState(false);
  const [editId, setEditId] = useState("");

  // Modal Settings
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setImmunizationStock(initialState);
    setEditImmunization(false);
    setEditId("");
  };

  const addImmunizationStock = async (e) => {
    e.preventDefault();

    const { immunization_id, stock, description } = immunizationStock;

    if (immunization_id === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please select immunization", "error");
    }

    if (stock === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please provide stock", "error");
    }

    if (description === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please provide description", "error");
    }

    try {
      const res = await axios.post(
        "https://tanuan-backend.herokuapp.com/api/children/create-immunization-stock",
        immunizationStock
      );

      if (res.status === 200) {
        return console.log(res);
      } else {
        Swal.fire("Warning", `${res.data.msg}`, "warning");
      }

      fetchImmunizationStock();
    } catch (error) {
      console.log(error);
    }

    // Reset State
    handleCloseModal();
  };

  const updateImmnunizationStock = async (e) => {
    e.preventDefault();
    const { immunization_id, stock, description } = immunizationStock;

    if (immunization_id === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please select immunization", "error");
    }

    if (stock === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please provide stock", "error");
    }

    if (description === "") {
      handleCloseModal();
      return Swal.fire("Error", "Please provide description", "error");
    }

    try {
      const { data } = await axios.post(
        "https://tanuan-backend.herokuapp.com/api/children/update-immunization-stock",
        {
          immunization_id,
          stock,
          description,
          _id: editId,
        }
      );

      console.log(data);
      fetchImmunizationStock();
    } catch (error) {
      console.log(error);
    }

    // Reset State
    handleCloseModal();
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setImmunizationStock({
      ...immunizationStock,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchAvailableImmunization();
    fetchImmunizationStock();
  }, []);

  return (
    <div>
      {/* Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Container component="main" maxWidth="md">
            <div className={classes.paperModal}>
              {!editImmunization ? (
                <Typography component="h1" variant="h5">
                  Create Immunization Stock
                </Typography>
              ) : (
                <Typography component="h1" variant="h5">
                  Update Immunization Stock
                </Typography>
              )}

              <form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={immunizationStock.immunization_id}
                      name="immunization_id"
                      onChange={handleOnChange}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Immunization Name"
                      select
                    >
                      {immunizationMenu?.map((menu) => (
                        <MenuItem value={menu._id}>{menu.vaccineName}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={immunizationStock.stock}
                      onChange={handleOnChange}
                      name="stock"
                      variant="outlined"
                      margin="normal"
                      label="Immunization Stock"
                      type="number"
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={12} sm={12} item>
                    <TextField
                      value={immunizationStock.description}
                      name="description"
                      onChange={handleOnChange}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      label="Desciption"
                      multiline
                      rows={4}
                    />
                  </Grid>

                  <Button
                    onClick={
                      !editImmunization
                        ? addImmunizationStock
                        : updateImmnunizationStock
                    }
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    {!editImmunization ? "Add" : "Update"}
                  </Button>
                </Grid>
              </form>
            </div>
          </Container>
        </Fade>
      </Modal>

      {/* End of Modal */}
      <MaterialTable
        isLoading={isLoading}
        title={`Immunization Stock`}
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
        actions={[
          {
            icon: "add",
            tooltip: "Add Immunization Stock",
            isFreeAction: true,
            onClick: (event) => {
              handleOpenModal();
            },
          },
          {
            icon: "edit",
            tooltip: "Edit User",
            onClick: async (event, rowData) => {
              setEditId(rowData._id);
              setEditImmunization(true);
              setImmunizationStock({
                immunization_id: rowData.immunization._id,
                stock: rowData.stock,
                description: rowData.description,
              });
              handleOpenModal();
            },
          },
        ]}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              axios
                .post(
                  `https://tanuan-backend.herokuapp.com/api/children/archived-immunization-stock`,
                  {
                    _id: oldData._id,
                  }
                )
                .then((res) => {
                  if (res.status === 200) {
                    fetchImmunizationStock();
                    resolve();
                    return console.log(res);
                  } else {
                    Swal.fire("Warning", `${res.data.msg}`, "warning");
                  }

                  fetchImmunizationStock();
                  resolve();
                })
                .catch((err) => {
                  console.log(err);
                  resolve();
                });
            }),
        }}
      />
    </div>
  );
};

export default ImmunizationStock;
