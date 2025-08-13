import axios from "axios";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  fetchServices,
  transformServicesForSelect,
} from "../../../../services/ServicesService";
import FormField from "./components/FormField";
import FormRow from "./components/FormRow";
import { initialVisitValues, visitSchema } from "./schemas/visitValidation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CreateVisitModal = ({ show, onHide, onVisitCreated }) => {
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesSearch, setServicesSearch] = useState("");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Validate patient selection
      if (!selectedPatient) {
        toast.error("Please select a patient", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Validate services selection
      if (selectedServices.length === 0) {
        toast.error("Please select at least one service", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      // Prepare visit data
      const submitData = {
        ...values,
        patientId: selectedPatient.id || selectedPatient.value,
        patientInfo: {
          uhid: selectedPatient.uhid || selectedPatient.value,
          name: selectedPatient.label,
          fatherOrHusbandName: selectedPatient.fathername,
          mobileNo: selectedPatient.mobileno,
          age: selectedPatient.age,
          gender: selectedPatient.gender === 'M' ? 'Male' : selectedPatient.gender === 'F' ? 'Female' : 'Other',
        },
        services: selectedServices.map((service) => ({
          serviceId: service.id,
          serviceName: service.label,
          serviceCode: service.code,
          rate: service.rate,
          quantity: 1,
          discount: 0,
        })),
      };

      // Remove empty optional fields
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === "" || submitData[key] === null) {
          delete submitData[key];
        }
      });

      const response = await axios.post(`${API_URL}/visits`, submitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Visit created successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        // Reset form and close modal
        resetForm();
        setSelectedPatient(null);
        setSelectedServices([]);
        setSearchPatient("");
        onHide();

        // Callback to parent component if needed
        if (onVisitCreated) {
          onVisitCreated(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error creating visit:", error);

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
          "Failed to create visit. Please try again.";

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
    setSearchPatient(selectedOption);
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

  const handleRemoveService = (serviceToRemove) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceToRemove.id)
    );
  };

  // Fetch services from API
  const loadServices = useCallback(async (searchQuery = "") => {
    setServicesLoading(true);
    try {
      const response = await fetchServices(searchQuery);
      if (response.success) {
        const transformedServices = transformServicesForSelect(response.data);
        setServicesOptions(transformedServices);
      } else {
        toast.error("Failed to load services", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Error loading services. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Handle services search with debouncing
  const handleServicesSearch = useCallback(
    (inputValue) => {
      setServicesSearch(inputValue);

      // Debounce search
      const timeoutId = setTimeout(() => {
        loadServices(inputValue);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [loadServices]
  );

  // Calculate total amount
  const getTotalAmount = () => {
    return selectedServices.reduce(
      (total, service) => total + (service.rate || 0),
      0
    );
  };

  useEffect(() => {
    getPatientOptions();
    loadServices(); // Load services when modal opens
  }, [loadServices]);

  // Reset services when modal closes
  useEffect(() => {
    if (!show) {
      setServicesOptions([]);
      setServicesSearch("");
      setSelectedServices([]);
      setSelectedOption(null);
    }
  }, [show]);

  return (
    <Modal
      className="fade"
      show={show}
      onHide={onHide}
      centered={true}
      size="xl"
      backdropClassName={"role"}
      backdrop={"static"}
    >
      <Modal.Header>
        <Modal.Title>Add New Visit</Modal.Title>
        <Button variant="" className="btn-close" onClick={onHide}></Button>
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
                <div className="col-12 col-md-6 col-lg-3 form-group">
                  <label className="text-black">UHID No</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={
                      selectedPatient
                        ? selectedPatient.uhid || selectedPatient.id || selectedPatient.value
                        : ""
                    }
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-3 form-group">
                  <label className="text-black">Patient Name </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.label : ""}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-2 form-group">
                  <label className="text-black">Father/Husband</label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.fathername : ""}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-2 form-group">
                  <label className="text-black">Mobile No </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control form-control-sm text-black"
                    value={selectedPatient ? selectedPatient.mobileno : ""}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-2 form-group">
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
                  required
                  className="col-12 col-md-6 col-lg-3"
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
                  required
                  className="col-12 col-md-6 col-lg-3"
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
                  required
                  className="col-12 col-md-6 col-lg-3"
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
                  className="col-12 col-md-6 col-lg-3"
                />
              </FormRow>

              <FormRow className="row">
                <FormField
                  name="medicolegal"
                  label="Medico Legal(MLC)"
                  type="radio"
                  required
                  className="col-12 col-md-6 col-lg-4"
                  options={["Yes", "No"]}
                />

                <FormField
                  name="mediclaim_type"
                  label="Mediclaim"
                  type="select"
                  required
                  className="col-12 col-md-6 col-lg-4"
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
                  className="col-12 col-md-6 col-lg-4"
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
                      className="plugins-select-feild"
                      isSearchable
                      isLoading={servicesLoading}
                      name="searchservices"
                      placeholder="Type to search services..."
                      options={servicesOptions}
                      value={selectedOption}
                      onChange={handleAddService}
                      onInputChange={handleServicesSearch}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `No services found for "${inputValue}"`
                          : "Start typing to search services"
                      }
                      loadingMessage={() => "Loading services..."}
                    />
                  </div>
                </div>
              </FormRow>

              <div className="selected-services">
                <Table responsive className="table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Service Code</th>
                      <th>Service Name</th>
                      <th className="text-end">Price (₹)</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          <i className="fas fa-info-circle me-2"></i>
                          No services selected. Please search and add services
                          above.
                        </td>
                      </tr>
                    ) : (
                      selectedServices.map((service, index) => (
                        <tr key={service.id || index}>
                          <td>
                            <strong className="text-primary">
                              {service.code}
                            </strong>
                          </td>
                          <td>
                            <div>
                              <strong>{service.label}</strong>
                              {service.description && (
                                <small className="text-muted d-block">
                                  {service.description}
                                </small>
                              )}
                            </div>
                          </td>
                          <td className="text-end">
                            <strong>
                              ₹{service.rate?.toLocaleString() || "0"}
                            </strong>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveService(service)}
                              className="btn btn-sm btn-outline-danger"
                              title="Remove service"
                            >
                              <i className="fas fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {selectedServices.length > 0 && (
                    <tfoot className="table-secondary">
                      <tr>
                        <td colSpan="2" className="text-end">
                          <strong>Total Amount:</strong>
                        </td>
                        <td className="text-end">
                          <strong className="text-success fs-5">
                            ₹{getTotalAmount().toLocaleString()}
                          </strong>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
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
