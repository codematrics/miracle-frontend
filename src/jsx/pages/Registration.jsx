import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  loadingToggleAction,
  signupAction,
} from "../../store/actions/AuthActions";
import logo from "../../assets/images/logo-full.png";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required")
    .trim(),
  email: Yup.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(255, "Email too long")
    .required("Email is required")
    .lowercase(),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password too long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
});

const initialValues = {
  username: "",
  email: "",
  password: "",
};

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errorMessage, successMessage, showLoading } = useSelector((state) => ({
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  }));

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loadingToggleAction(true));
    dispatch(signupAction(values.username, values.email, values.password, navigate));
    setSubmitting(false);
  };

  return (
    <>
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form bg-primary">
                      <div className="text-center mb-3">
                        <Link to="#">
                          <img src={logo} alt="" className="" />
                        </Link>
                      </div>
                      <h4 className="text-center text-white mb-4">
                        Sign up your account
                      </h4>
                      {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      )}
                      {successMessage && (
                        <div className="alert alert-success" role="alert">
                          {successMessage}
                        </div>
                      )}
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, errors, touched }) => (
                          <Form>
                            <div className="mb-3">
                              <label className="form-label">
                                <strong className="text-white">Username</strong>
                                <span className="required"> *</span>
                              </label>
                              <Field
                                name="username"
                                type="text"
                                className={`form-control ${
                                  errors.username && touched.username ? "is-invalid" : ""
                                }`}
                                placeholder="Enter username"
                              />
                              <ErrorMessage
                                name="username"
                                component="div"
                                className="text-danger fs-12 mt-1"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">
                                <strong className="text-white">Email</strong>
                                <span className="required"> *</span>
                              </label>
                              <Field
                                name="email"
                                type="email"
                                className={`form-control ${
                                  errors.email && touched.email ? "is-invalid" : ""
                                }`}
                                placeholder="hello@example.com"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger fs-12 mt-1"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">
                                <strong className="text-white">Password</strong>
                                <span className="required"> *</span>
                              </label>
                              <Field
                                name="password"
                                type="password"
                                className={`form-control ${
                                  errors.password && touched.password ? "is-invalid" : ""
                                }`}
                                placeholder="Enter password"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger fs-12 mt-1"
                              />
                            </div>
                            <div className="text-center mt-4">
                              <button
                                type="submit"
                                className="btn btn-secondary btn-block"
                                disabled={isSubmitting || showLoading}
                              >
                                {showLoading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Signing up...
                                  </>
                                ) : (
                                  "Sign me up"
                                )}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                      <div className="new-account mt-3">
                        <p className="text-white">
                          Already have an account?{" "}
                          <Link to={"/login"} className="text-secondary">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
