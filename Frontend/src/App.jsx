import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ChatAI from './components/dashboard/chat/ChatAI.jsx';
import './App.css'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chatAI' element={<ChatAI />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
};

export default App
