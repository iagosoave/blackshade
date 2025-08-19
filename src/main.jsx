// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// REMOVIDO React.StrictMode para melhor performance
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)