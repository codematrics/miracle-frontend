import axios from "axios";
import { Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AgeField from "./components/AgeField";
import FormField from "./components/FormField";
import FormRow from "./components/FormRow";
import {
  initialPatientValues,
  patientSchema,
} from "./schemas/patientValidation";

const CreatePatientModal = ({ show, onHide, onPatientCreated }) => {
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
        `${import.meta.env.VITE_API_URL}/patients`,
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

  return (
    <Modal show={show} onHide={onHide} centered size="xl" backdrop="static">
      <Modal.Header>
        <Modal.Title>New Patient</Modal.Title>
        <Button variant="" className="btn-close" onClick={onHide} />
      </Modal.Header>

      <Formik
        initialValues={initialPatientValues}
        validationSchema={patientSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <FormRow>
                <FormField
                  name="patientName"
                  label="Patient Name"
                  required
                  className="col-md-4"
                />
                <FormField
                  name="relation"
                  label="Relation"
                  type="select"
                  required
                  className="col-md-2"
                  options={["S/O", "W/O", "D/O", "Other"]}
                />
                <FormField
                  name="fatherOrHusbandName"
                  label="F/H Name"
                  required
                  className="col-md-4"
                />
                <AgeField />
              </FormRow>

              {/* Gender and Personal Information Row */}
              <FormRow>
                <FormField
                  name="gender"
                  label="Gender"
                  type="radio"
                  required
                  className="col-md-4"
                  options={["Male", "Female", "Other"]}
                />
                <FormField
                  name="maritalStatus"
                  label="Marital Status"
                  type="select"
                  className="col-md-2"
                  options={[
                    { value: "", label: "Select Marital" },
                    { value: "Divorced", label: "Divorced" },
                    { value: "Married", label: "Married" },
                    { value: "Separated", label: "Separated" },
                    { value: "Unmarried", label: "Unmarried" },
                    { value: "Widowed", label: "Widowed" },
                  ]}
                />
                <FormField
                  name="religion"
                  label="Religion"
                  type="select"
                  className="col-md-2"
                  options={[
                    { value: "", label: "Select Religion" },
                    { value: "Hindu", label: "Hindu" },
                    { value: "Buddhist", label: "Buddhist" },
                    { value: "Christian", label: "Christian" },
                    { value: "Jain", label: "Jain" },
                    { value: "Muslim", label: "Muslim" },
                    { value: "Parsi", label: "Parsi" },
                    { value: "Sikh", label: "Sikh" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <FormField
                  name="occupation"
                  label="Occupation"
                  type="select"
                  className="col-md-4"
                  options={[
                    { value: "", label: "Select Occupation" },
                    { value: "SELF EMPLOYED", label: "SELF EMPLOYED" },
                    { value: "GOVT. SERVICE", label: "GOVT. SERVICE" },
                    { value: "PVT. SERVICE", label: "PVT. SERVICE" },
                    { value: "BUSINESS", label: "BUSINESS" },
                    { value: "HOUSE WORK", label: "HOUSE WORK" },
                    { value: "STUDY", label: "STUDY" },
                    { value: "UN-EMPLOYED", label: "UN-EMPLOYED" },
                    { value: "OTHER", label: "OTHER" },
                  ]}
                />
              </FormRow>

              {/* Contact and ID Information Row */}
              <FormRow>
                <FormField
                  name="mobileNo"
                  label="Mobile No"
                  type="text"
                  required
                  maxLength="10"
                  className="col-md-2"
                />
                <FormField
                  name="emailId"
                  label="Email Id"
                  type="email"
                  className="col-md-5"
                />
                <FormField
                  name="idType"
                  label="ID Type"
                  type="select"
                  required
                  className="col-md-2"
                  options={[
                    "Aadhar Card",
                    "Pancard",
                    "Driving license",
                    "Voter ID",
                    "Passport",
                  ]}
                />
                <FormField
                  name="idNo"
                  label="ID No"
                  required
                  className="col-md-3"
                />
              </FormRow>

              {/* Patient Type and Address Row 1 */}
              <FormRow>
                <FormField
                  name="patientType"
                  label="Patient Type"
                  type="select"
                  className="col-md-3"
                  options={["General", "VIP", "Staff"]}
                />
                <FormField
                  name="address.village"
                  label="Village/Colony"
                  required
                  className="col-md-6"
                />
                <FormField
                  name="address.state"
                  label="State"
                  placeholder="Enter state name"
                  required
                  className="col-md-3"
                />
              </FormRow>

              {/* Address Row 2 */}
              <FormRow>
                <FormField
                  name="address.district"
                  label="District"
                  placeholder="Enter district name"
                  required
                  className="col-md-3"
                />
                <FormField
                  name="address.tehsil"
                  label="Tehsil"
                  required
                  className="col-md-3"
                />
                <FormField
                  name="address.postOffice"
                  label="Post"
                  required
                  className="col-md-3"
                />
                <FormField
                  name="address.pincode"
                  label="Pincode"
                  maxLength="6"
                  required
                  className="col-md-2"
                />
              </FormRow>
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
                {isSubmitting ? "Saving..." : "Save Patient"}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreatePatientModal;
