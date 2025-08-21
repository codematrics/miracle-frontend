import { Suspense, lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import './assets/css/style.css';
import { checkAutoLogin } from './services/AuthService';
import { isAuthenticated } from './store/selectors/AuthSelectors';

const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => import('./jsx/pages/Login'));
const Index = lazy(() => import('./jsx'));

const LoadingSpinner = () => (
  <div id="preloader">
    <div className="sk-three-bounce">
      <div className="sk-child sk-bounce1"></div>
      <div className="sk-child sk-bounce2"></div>
      <div className="sk-child sk-bounce3"></div>
    </div>
  </div>
);

const AuthRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if on any other path
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/page-register' &&
      location.pathname !== '/register'
    ) {
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="vh-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/page-register" element={<SignUp />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/*" element={<Index />} />
  </Routes>
);

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useSelector(isAuthenticated);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isLoggedIn = await checkAutoLogin(dispatch, navigate);

        // Only redirect if we're on login page and user is authenticated
        if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/')) {
          navigate('/dashboard', { replace: true });
        }
      } catch {
        return;
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, navigate, location.pathname]);

  // Show loading spinner while initializing authentication
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {authenticated ? <AppRoutes /> : <AuthRoutes />}
    </Suspense>
  );
}

export default App;
