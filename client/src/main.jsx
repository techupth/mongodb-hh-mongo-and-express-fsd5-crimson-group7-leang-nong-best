import React from 'react'
import ReactDOM from 'react-dom/client'
import MovieList from "./components/movieList";
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <MovieList /> */}
  </React.StrictMode>,
)
