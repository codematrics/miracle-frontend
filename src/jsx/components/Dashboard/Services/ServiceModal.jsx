import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { createService, updateService } from "../../../../services/ServicesService";

const serviceSchema = Yup.object({
  name: Yup.string()
    .min(2, "Service name must be at least 2 characters")
    .max(100, "Service name must be less than 100 characters")
    .required("Service name is required"),
  code: Yup.string()
    .min(2, "Service code must be at least 2 characters")
    .max(20, "Service code must be less than 20 characters")
    .matches(/^[A-Z0-9_]+$/, "Service code must contain only uppercase letters, numbers, and underscores")
    .required("Service code is required"),
  description: Yup.string()
    .max(500, "Description must be less than 500 characters"),
  category: Yup.string()
    .required("Category is required"),
  rate: Yup.number()
    .min(0, "Rate must be 0 or greater")
    .required("Rate is required"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Status must be either active or inactive")
    .required("Status is required"),
});

const initialValues = {
  name: "",
  code: "",
  description: "",
  category: "",
  rate: "",
  status: "active",
};

const ServiceModal = ({ show, onHide, service = null, onServiceSaved }) => {
  const isEditing = Boolean(service);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const serviceData = {
        ...values,
        rate: parseFloat(values.rate),
      };

      let response;
      if (isEditing) {
        response = await updateService(service.id, serviceData);
      } else {
        response = await createService(serviceData);
      }

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || `Service ${isEditing ? "updated" : "created"} successfully`,
          showConfirmButton: false,
          timer: 1500,
        });

        resetForm();
        onHide();

        if (onServiceSaved) {
          onServiceSaved(response.data);
        }
      } else {
        throw new Error(response.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error saving service:", error);

      if (error.response?.status === 400 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.length > 0) {
          const firstError = validationErrors[0];
          toast.error(firstError.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} service. Please try again.`;

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialValues = () => {
    if (isEditing && service) {
      return {
        name: service.name || service.serviceName || "",
        code: service.code || service.serviceCode || "",
        description: service.description || "",
        category: service.category || "",
        rate: service.rate || service.price || "",
        status: service.status || "active",
      };
    }
    return initialValues;
  };

  const categories = [
    { value: "", label: "Select Category" },
    { value: "consultation", label: "Consultation" },
    { value: "diagnostic", label: "Diagnostic" },
    { value: "laboratory", label: "Laboratory" },
    { value: "radiology", label: "Radiology" },
    { value: "procedure", label: "Procedure" },
    { value: "surgery", label: "Surgery" },
    { value: "pharmacy", label: "Pharmacy" },
    { value: "emergency", label: "Emergency" },
    { value: "other", label: "Other" },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
      className="service-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5 mb-0">
          {isEditing ? "Edit Service" : "Add New Service"}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={serviceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Modal.Body className="px-4">
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <div className="form-group">
                    <label className="form-label">
                      Service Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className={`form-control ${
                        errors.name && touched.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter service name"
                      style={{ fontSize: "16px" }}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      Service Code <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="code"
                      type="text"
                      className={`form-control ${
                        errors.code && touched.code ? "is-invalid" : ""
                      }`}
                      placeholder="e.g., CON001"
                      style={{ fontSize: "16px", textTransform: "uppercase" }}
                    />
                    <ErrorMessage
                      name="code"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="3"
                      className={`form-control ${
                        errors.description && touched.description ? "is-invalid" : ""
                      }`}
                      placeholder="Enter service description (optional)"
                      style={{ fontSize: "16px" }}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className={`form-control ${
                        errors.category && touched.category ? "is-invalid" : ""
                      }`}
                      style={{ fontSize: "16px" }}
                    >
                      {categories.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      Rate (₹) <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="rate"
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${
                        errors.rate && touched.rate ? "is-invalid" : ""
                      }`}
                      placeholder="0.00"
                      style={{ fontSize: "16px" }}
                    />
                    <ErrorMessage
                      name="rate"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-3">
                  <div className="form-group">
                    <label className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className={`form-control ${
                        errors.status && touched.status ? "is-invalid" : ""
                      }`}
                      style={{ fontSize: "16px" }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="d-flex flex-column flex-sm-row gap-2 px-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onHide}
                disabled={isSubmitting}
                className="order-2 order-sm-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="order-1 order-sm-2"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Service" : "Create Service"}</>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ServiceModal;