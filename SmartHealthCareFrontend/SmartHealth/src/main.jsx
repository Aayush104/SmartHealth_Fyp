import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>

<GoogleOAuthProvider clientId = "1042625629196-pdeu5c9qkrsnkcomht5l75gom8t7be2s.apps.googleusercontent.com">
  <App />
   
  </GoogleOAuthProvider>
  
    <ToastContainer 

autoClose={2000}
    />
  </StrictMode>,
)
