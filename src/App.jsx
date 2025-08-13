import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { checkAutoLogin } from "./services/AuthService";
import { isAuthenticated } from "./store/selectors/AuthSelectors";
import "./assets/css/style.css";

const SignUp = lazy(() => import("./jsx/pages/Registration"));
const Login = lazy(() => import("./jsx/pages/Login"));
const Index = lazy(() => import("./jsx"));


const LoadingSpinner = () => (
  <div id="preloader">
    <div className="sk-three-bounce">
      <div className="sk-child sk-bounce1"></div>
      <div className="sk-child sk-bounce2"></div>
      <div className="sk-child sk-bounce3"></div>
    </div>
  </div>
);

const AuthRoutes = () => (
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

const AppRoutes = () => (
  <Routes>
    <Route path="/*" element={<Index />} />
  </Routes>
);

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authenticated = useSelector(isAuthenticated);

  useEffect(() => {
    checkAutoLogin(dispatch, navigate);
  }, [dispatch, navigate]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {authenticated ? <AppRoutes /> : <AuthRoutes />}
    </Suspense>
  );
}

export default App;
