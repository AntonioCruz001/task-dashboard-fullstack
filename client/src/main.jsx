//import { StrictMode } from 'react'
import React from 'react'

// importa apenas o método createRoot,
// por isso não é necessário ReactDOM.createRoot
// ReactDOM seria um objeto
//import { createRoot } from 'react-dom/client' 

import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Componente principal
import './index.css'

// 1. Encontra o ponto de montagem no DOM (index.html)
const container = document.getElementById('root');

// 2. Cria a raiz da aplicação React
// 3. Monta o componente principal (<App />) no ponto de montagem
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

        