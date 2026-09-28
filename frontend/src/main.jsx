import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ToastProvider from "./components/ToastProvider.jsx";
//import './index.css'
import App from './App.jsx'

import './styles/formStyle.css' //Scar: Coloqué este para importarlo de una vez desde el main

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
    <App />
    </ToastProvider>
  </StrictMode>,
)
