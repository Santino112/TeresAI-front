import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./components/auth/AuthContext.jsx";
import { useAuth } from "./components/auth/useAuth.jsx";
import { Theme } from './theme/theme.jsx';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import './App.css'

const Login = lazy(() => import("./components/auth/Login.jsx"));
const InformacionUsuarios = lazy(() => import('./components/UserInformation/informacionUsuario.jsx'));
const Register = lazy(() => import('./components/auth/Register.jsx'));
const ChatAI = lazy(() => import('./components/dashboard/chat/paginaChatAI.jsx'));
const PanelFamiliar = lazy(() => import('./components/dashboard/chat/paginaFamiliar.jsx'));
const PanelCuidador = lazy(() => import('./components/dashboard/chat/paginaCuidador.jsx'));
const EmergencyFab = lazy(() => import('./components/common/EmergencyFab.jsx'));

const RouteLoader = () => (
  <Box
    sx={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f2e8",
    }}
  >
    <CircularProgress size={34} />
  </Box>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to='/' />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return !user ? children : <Navigate to="/infoUser" />;
};

function App() {

  return (
    <AuthProvider>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
              <Route path='/' element={
                <PublicRoute>
                  <Login />
                  <div className="backgroundLogin"></div>
                </PublicRoute>} />
              <Route path='/register' element={<Register />} />
              <Route path='/infoUser' element={<InformacionUsuarios />} />
              <Route path='/paginaChatAI' element={
                <PrivateRoute>
                  <EmergencyFab />
                  <ChatAI />
                  <div className="background"></div>
                </PrivateRoute>}
              />
              <Route path='/paginaFamiliar' element={
                <PrivateRoute>
                  <EmergencyFab />
                  <PanelFamiliar />
                  <div className="backgroundFamiliar"></div>
                </PrivateRoute>}
              />
              <Route path='/paginaCuidador' element={
                <PrivateRoute>
                  <EmergencyFab />
                  <PanelCuidador />
                  <div className="backgroundFamiliar"></div>
                </PrivateRoute>}
              />
            </Routes>
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  )
};

export default App;
