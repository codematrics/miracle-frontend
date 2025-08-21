import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../store/hooks';
import { clearError, loginUser } from '../../store/slices/authSlice';
import { showErrorToast, showSuccessToast } from '../../utils/errorHandler';

const LoginForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, successMessage, dispatch } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      showSuccessToast('Login successful! Welcome back.');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle success messages
  useEffect(() => {
    if (successMessage) {
      showSuccessToast(successMessage);
    }
  }, [successMessage]);

  // Handle error messages
  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
          navigate,
        })
      ).unwrap();
    } catch {
      // Error is already handled by the slice and error handler
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Header className="bg-primary text-white text-center">
          <h4 className="mb-0">
            <i className="fas fa-user-md me-2"></i>
            Hospital Login
          </h4>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-envelope me-2"></i>
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                isInvalid={!!formErrors.email}
                disabled={loading}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-lock me-2"></i>
                Password
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  isInvalid={!!formErrors.password}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </Button>
                <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Remember me" id="rememberMe" disabled={loading} />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate('/forgot-password')}
                disabled={loading}
                className="text-decoration-none"
              >
                Forgot Password?
              </Button>
            </div>

            <hr />

            <div className="text-center">
              <p className="mb-2">Don&apos;t have an account?</p>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/register')}
                disabled={loading}
              >
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
