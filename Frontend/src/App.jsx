import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider, useAuth } from "./components/auth/AuthContext.jsx";
import { Theme } from './theme/theme.jsx';
import { CssBaseline } from '@mui/material';
import Login from "./components/auth/Login.jsx";
import InformacionUsuarios from './components/UserInformation/informacionUsuario.jsx';
import Register from './components/auth/Register.jsx';
import ChatAI from './components/dashboard/chat/paginaChatAI.jsx';
import PanelFamiliar from './components/dashboard/chat/paginaFamiliar.jsx';
import PanelCuidador from './components/dashboard/chat/paginaCuidador.jsx';
import './App.css'

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
                <ChatAI />
                <div className="background"></div>
              </PrivateRoute>}
            />
            <Route path='/paginaFamiliar' element={
              <PrivateRoute>
                <PanelFamiliar />
                <div className="backgroundFamiliar"></div>
              </PrivateRoute>}
            />
            <Route path='/paginaCuidador' element={
              <PrivateRoute>
                <PanelCuidador />
                <div className="backgroundFamiliar"></div>
              </PrivateRoute>}
            />
          </Routes>
      </ThemeProvider>
    </AuthProvider>
  )
};

export default App;
