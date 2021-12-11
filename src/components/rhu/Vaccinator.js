import React, { useState, useEffect } from "react";

import { useHistory, useParams } from "react-router-dom";

import html2canvas from "html2canvas";

// Material Table
import MaterialTable from "material-table";

// QR Code Generator
import QRCode from "qrcode.react";

// Material UI
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

// Helper Components
import VaccinatorHelper from "../helper/VaccinatorHelper";
import axios from "axios";
import { Typography } from "@material-ui/core";

// React Icons
import { AiOutlineQrcode } from "react-icons/ai";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #111",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  qrDiv: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
  },
  barChart: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  vaccinatedUsersTable: {
    marginTop: theme.spacing(5),
  },
  qrcodeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(1.5),
    border: "2px #111 solid",
  },
  qrCodeVaccinator: {
    marginTop: "5px",
    textAlign: "center",
    fontWeight: "bold",
  },
  qrButton: {
    marginTop: "10px",
  },
}));

const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date); // create a date object directly from dob1 argument
  let age_now = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};

const Vaccinator = () => {
  const { id } = useParams();

  const classes = useStyles();
  const history = useHistory();
  const [columns, setColumns] = useState([
    {
      title: "First Name",
      field: "firstname",
    },

    {
      title: "Profile",
      field: "profile.url",
      render: (rowData) => (
        <img
          src={rowData.profile.url}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },

    {
      title: "Birth Date",
      field: "birthday",
      render: (rowData) => (
        <Typography>
          {new Date(rowData.birthday).toLocaleString().split(",")[0]}
        </Typography>
      ),
    },
    {
      title: "Age",
      field: "age",
    },

    {
      title: "Address",
      field: "address",
    },
    {
      title: "Sex",
      field: "sex",
    },
    {
      title: "Civil Status",
      field: "civilStatus",
    },
    {
      title: "Contact Number",
      field: "contact",
    },
    {
      title: "Email",
      field: "email",
    },
  ]);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // download QR code
  const [qrCode, setQrCode] = useState("");
  const downloadQrcode = () => {
    html2canvas(document.querySelector("#react-qrcode-logo-div")).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = `${qrCode.firstname} ${qrCode.lastname}-tanauan-vaccinator.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    );
    setOpenModal(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Fetch Vaccinator Function
  const fetchVaccinator = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://tanuan-backend.herokuapp.com/api/vaccinator/get-all-vaccinator"
      );

      const withAge = data.vaccinator.map((data) => {
        return {
          ...data,
          age: calculateAge(data.birthday),
        };
      });

      setData(withAge);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccinator();
  }, []);

  return (
    <div>
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
          <div className={classes.paper}>
            <div className={classes.qrDiv}>
              <div
                className={classes.qrcodeContainer}
                id="react-qrcode-logo-div"
              >
                <QRCode
                  value={qrCode ? qrCode._id : "no-data-found"}
                  size={170}
                />
                <label className={classes.qrCodeVaccinator}>
                  {qrCode
                    ? `${qrCode.firstname}  ${qrCode.lastname}`
                    : "No Data Found"}
                </label>
              </div>
            </div>

            <Button
              className={classes.qrButton}
              onClick={downloadQrcode}
              variant="contained"
              color="primary"
              fullWidth
            >
              Download
            </Button>
          </div>
        </Fade>
      </Modal>

      <MaterialTable
        isLoading={isLoading}
        title="Vaccinators"
        columns={columns}
        data={data}
        actions={[
          {
            icon: "add",
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event) => history.push("/addVaccinator"),
          },

          {
            icon: () => <AiOutlineQrcode />,
            tooltip: "Download QR Code",
            onClick: (event, rowData) => {
              handleOpenModal();
              const { _id, firstname, lastname } = rowData;
              const qrData = {
                _id,
                firstname,
                lastname,
              };
              setQrCode(qrData);
            },
          },

          {
            icon: "edit",
            tooltip: "Edit User",
            onClick: (event, rowData) =>
              history.push(`/editVaccinator/${rowData._id}`),
          },
        ]}
        // Detail Panel Drop Down
        detailPanel={(rowData) => {
          return <VaccinatorHelper rowData={rowData} />;
        }}
        options={{
          sorting: true,
          exportButton: true,
          actionsColumnIndex: -1,
          addRowPosition: "first",
          pageSize: 10,
        }}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve();
              }, 1000);
            }),
        }}
      />
    </div>
  );
};

export default Vaccinator;
