import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom'

const DEFAULT_GOOGLE_CLIENT_ID =
  '1012721723060-4foenlo1hdq0bu73t6f6ot8bj8vr38kl.apps.googleusercontent.com';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
