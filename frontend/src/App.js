import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import MapPage from './Pages/Map';

function App() {
  return (
    <Router>
      <div className="container my-4">

        <header className="hero bg-primary text-white text-center py-5">
          <div className="container">
            <h1 className="display-4">Welcome to My Map App!</h1>
            <p className="lead">Explore the world using OpenStreetMap and Leaflet.</p>
            <Link to="/map" className="btn btn-light btn-lg">Go to the Map</Link>
          </div>
        </header>

        <Routes>
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
