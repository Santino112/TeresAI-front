import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/auth/Login.jsx';
import ChatAI from './components/dashboard/chat/ChatAI.jsx';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chatAI' element={<ChatAI />} />
      </Routes> 
    </Router>
  )
};

export default App
