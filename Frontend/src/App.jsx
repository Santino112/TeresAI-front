import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ChatAI from './components/dashboard/chat/ChatAI.jsx';
import { useAuth } from './components/auth/AuthContext.jsx';
import './App.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? children : <Navigate to='/' />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return !user ? children : <Navigate to="/chatAI" />;
};

function App() {

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path='/' element={
            <PublicRoute>
              <Login />
              <div className="backgroundLogin"></div>
            </PublicRoute>} />
          <Route path='/register' element={<Register />} />
          <Route path='/chatAI' element={
            <PrivateRoute>
              <ChatAI />
              <div className="background"></div>
            </PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
};

export default App