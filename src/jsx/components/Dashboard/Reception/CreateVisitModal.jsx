import axios from "axios";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import DummyData from "../DummyData";
import FormField from "./components/FormField";
import FormRow from "./components/FormRow";
import { initialVisitValues, visitSchema } from "./schemas/visitValidation";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CreateVisitModal = ({ show, onHide, onPatientCreated }) => {
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Transform age to number and filter out empty optional fields
      const submitData = {
        ...values,
        age: parseInt(values.age, 10),
      };

      // Validate age is a valid number
      if (isNaN(submitData.age) || submitData.age <= 0) {
        toast.error("Please enter a valid age", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Remove empty optional fields
      if (!submitData.maritalStatus || submitData.maritalStatus === "") {
        delete submitData.maritalStatus;
      }
      if (!submitData.religion || submitData.religion === "") {
        delete submitData.religion;
      }
      if (!submitData.occupation || submitData.occupation === "") {
        delete submitData.occupation;
      }
      if (!submitData.emailId || submitData.emailId === "") {
        delete submitData.emailId;
      }

      const response = await axios.post(
        `${API_URL}/patients`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Patient created successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form and close modal
        resetForm();
        onHide();

        // Callback to parent component if needed
        if (onPatientCreated) {
          onPatientCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error creating patient:", error);

      // Handle validation errors from backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;

        // Show only the first validation error as a toast
        if (validationErrors.length > 0) {
          const firstError = validationErrors[0];
          toast.error(`${firstError.message}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        // Handle other types of errors
        const errorMessage =
          error.response?.data?.message ||
          "Failed to create patient. Please try again.";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientOptions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/patients/dropdown-data`
      );
      if (response.data.success) {
        setPatientOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching patient options:", error);
    }
  };

  const handleSearchPatient = (selectedOption) => {
    setSelectedPatient(selectedOption);
  };

  const handleAddService = (aSelectedOption) => {
    if (
      aSelectedOption &&
      !selectedServices.some((service) => service.id === aSelectedOption.id)
    ) {
      setSelectedServices([...selectedServices, aSelectedOption]);
    }
    setSelectedOption(null); // Clear the selected option
  };

  useEffect(() => {
    getPatientOptions();
  }, []);

  return (
    <Modal
      className="fade"
      show={show}
      onHide={onHide}
      centered={true}
      size={"xl"}
      backdropClassName={"role"}
      backdrop={"static"}
    >
      <Modal.Header>
        <Modal.Title>Add New Visit</Modal.Title>
        <Button
          variant=""
          className="btn-close"
          onClick={() => setVisitModal(false)}
        ></Button>
      </Modal.Header>
      <Formik
        initialValues={initialVisitValues}
        validationSchema={visitSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <FormRow className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="text-black font-w500">
                      Search Patient <span className="text-danger">*</span>
                    </label>
                    <Select
                      isClearable
                      // components={{ NoOptionsMessage }}
                      // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                      className="plugins-select-feild"
                      isSearchable
                      name="searchPatient"
                      id="searchPatient"
                      value={searchPatient}
                      options={patientOptions}
                      onChange={handleSearchPatient}
                    />
                  </div>
                </div>
              </FormRow>

              <FormRow className="row">
                <FormField
                  name="uhid"
                  label="UHID No"
                  required
                  className="col-md-2"
                  readOnly
                />
                <div className="col-md-3 form-group">
                  <label className="text-black">Patient Name </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.label : ""}
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label className="text-black">Father/Husband</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.fathername : ""}
                  />
                </div>
                <div className="col-md-2 form-group">
                  <label className="text-black">Mobile No </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.mobileno : ""}
                  />
                </div>
                <div className="col-md-2 form-group">
                  <label className="text-black">Sex/Age</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={
                      selectedPatient
                        ? `${selectedPatient.gender}/${selectedPatient.age}`
                        : ""
                    }
                  />
                </div>
              </FormRow>

              <FormRow className="row">
                <FormField
                  name="refby"
                  label="Ref By"
                  type="select"
                  className="col-md-3"
                  options={[
                    { value: "", label: "Select Ref By" },
                    { value: "1", label: "Self" },
                    { value: "2", label: "Dr. Kailash Garg" },
                    { value: "3", label: "Dr. Manohar Menariya" },
                    { value: "4", label: "Dr. Vishal Khutwal" },
                  ]}
                />

                <FormField
                  name="visitingdoctor"
                  label="Visiting Doctor"
                  type="select"
                  className="col-md-3"
                  options={[
                    { value: "", label: "Select Visiting Doctor" },
                    { value: "1", label: "Dr. Kailash Garg" },
                    { value: "2", label: "Dr. Manohar Menariya" },
                    { value: "3", label: "Dr. Vishal Khutwal" },
                  ]}
                />

                <FormField
                  name="visittype"
                  label="Visit Type"
                  type="select"
                  className="col-md-2"
                  options={[
                    { value: "", label: "Select Visit Type" },
                    { value: "1", label: "OPD" },
                    { value: "2", label: "IPD" },
                    { value: "3", label: "Camp" },
                  ]}
                />

                <FormField
                  name="visitdetail"
                  label="Visit Description"
                  className="col-md-4"
                />
              </FormRow>

              <FormRow className="row">
                <FormField
                  name="medicolegal"
                  label="Medico Legal(MLC)"
                  type="radio"
                  required
                  className="col-md-3"
                  options={["Yes", "No"]}
                />

                <FormField
                  name="mediclaim_type"
                  label="Mediclaim"
                  type="select"
                  className="col-md-3"
                  options={[
                    { value: "", label: "Select Mediclaim" },
                    { value: "1", label: "Not Applicable" },
                    { value: "2", label: "Ayushman" },
                    { value: "3", label: "Healthcare" },
                    { value: "4", label: "National Insurance" },
                  ]}
                />

                <FormField
                  name="mediclaim_id"
                  label="Mediclaim ID / Policy No"
                  className="col-md-3"
                />
              </FormRow>

              <FormRow className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="text-black font-w500">
                      Search Service <span className="text-danger">*</span>
                    </label>
                    <Select
                      isClearable
                      // components={{ NoOptionsMessage }}
                      // styles={{ NoOptionsMessage: base => ({ ...base, ...msgStyles }) }}
                      className="plugins-select-feild"
                      isSearchable
                      name="searchservices"
                      options={DummyData.servicesList}
                      value={selectedOption}
                      onChange={handleAddService}
                    />
                  </div>
                </div>
              </FormRow>

              <div className="selected-services">
                <Table>
                  <thead>
                    <tr>
                      <th>Service Code</th>
                      <th>Service Name</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map((service, index) => (
                      <tr key={index}>
                        <td>{service.code}</td>
                        <td>{service.label}</td>
                        <td>{service.rate}</td>
                        <td>
                          {
                            <button
                              onClick={() => handleRemoveService(service)}
                              className="delete-icon"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                className="btn btn-danger btn-sm light"
                onClick={onHide}
                disabled={isSubmitting}
              >
                Close
              </Button>
              <Button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Visit"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateVisitModal;
