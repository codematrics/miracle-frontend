import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import login from '../../assets/images/login.jpg';
import { loadingToggleAction, loginAction } from '../../store/actions/AuthActions';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Login() {
  const { errorMessage, successMessage, showLoading } = useSelector(state => ({
    errorMessage: state.auth.errorMessage,
    successMessage: state.auth.successMessage,
    showLoading: state.auth.showLoading,
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogin(values) {
    dispatch(loadingToggleAction(true));
    dispatch(loginAction(values.email, values.password, navigate));
  }

  return (
    <div className="page-wraper">
      <div className="authincation ">
        <div className="container ">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-12 h-100 d-flex align-items-center">
              <div className="authincation-content style-1">
                <div className="row h-100">
                  <div className="col-md-6 h-100">
                    <div className="img-bx">
                      <img src={login} alt="" className="img-fluid" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="auth-form">
                      <h4 className="main-title">Sign in </h4>

                      <Formik
                        initialValues={{ email: 'demo@example.com', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={(values, { setSubmitting }) => {
                          onLogin(values);
                          setSubmitting(false);
                        }}
                      >
                        {() => (
                          <Form>
                            <div className="form-group mb-3 pb-3">
                              <label className="font-w600">
                                Email<span className="required"> *</span>
                              </label>
                              <Field type="email" name="email" className="form-control solid" />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger fs-12"
                              />
                            </div>

                            <div className="form-group mb-3 pb-3">
                              <label className="font-w600">
                                Password<span className="required"> *</span>
                              </label>
                              <Field
                                type="password"
                                name="password"
                                className="form-control solid"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger fs-12"
                              />
                            </div>

                            <div className="text-center">
                              <button
                                type="submit"
                                className="btn btn-primary btn-block rounded"
                                disabled={showLoading}
                              >
                                {showLoading ? 'Signing in...' : 'Sign Me In'}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>

                      <Link to={'/page-register'} className="text-primary d-block text-center mt-3">
                        Don't have an account? Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
