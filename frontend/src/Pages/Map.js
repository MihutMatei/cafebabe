import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, InputGroup, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReportForm from '../Form'; // Import the ReportForm component
import axios from 'axios';

// Define custom red and blue icons
const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const icons = {
  blocked_sidewalk: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25], // Smaller size
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_bike_lane: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25], // Smaller size
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_crosswalk: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25], // Smaller size
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_entrance: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-purple.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25], // Smaller size
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
};

// Map Controls UI
const MapControls = ({ onReportClick, toggleReports, onSearch, onNavigateClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        onSearch([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert('Location not found. Please try a different search query.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      alert('Failed to search location. Please try again later.');
    }
  };

  return (
    <div className="map-controls position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
      <div className="d-flex flex-column gap-3">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Search location..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>

        <Button variant="danger" className="d-flex align-items-center gap-2" onClick={onReportClick}>
          <i className="bi bi-exclamation-triangle"></i>
          Report Issue
        </Button>

        <Button 
          variant="success" 
          className="d-flex align-items-center gap-2"
          onClick={onNavigateClick}
        >
          <i className="bi bi-geo-alt"></i>
          Navigate
        </Button>

        <Button variant="secondary" className="d-flex align-items-center gap-2" onClick={toggleReports}>
          <i className="bi bi-eye"></i>
          Toggle Reports
        </Button>
      </div>
    </div>
  );
};

// Main Map Page
const MapPage = () => {
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]); // State to store navigation route
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [showReports, setShowReports] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
        },
        (err) => {
          setError("Please enable location permissions to use navigation");
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reports');
        setReports(response.data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const handleSearch = (location) => {
    setMarker(location);
  };

  const handleNavigateClick = async () => {
    if (!userLocation || !marker) {
      setError("Please select both your current location and a destination marker");
      return;
    }

    try {
      // Using the walking profile for foot navigation (OSRM expects "walking" for foot navigation)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/walking/` +
          `${userLocation[1]},${userLocation[0]};` +
          `${marker[1]},${marker[0]}?overview=full&geometries=geojson&steps=true`
      );

      const data = await response.json();

      if (data.routes?.[0]) {
        // Convert coordinates to [lat, lng] format
        const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(routeCoords);
        setError(null);
      }
    } catch (err) {
      setError("Failed to calculate route. Please try again.");
      console.error("Routing error:", err);
    }
  };

  // Click handler to place a marker using map events
  const LocationClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
        setError(null);
      },
    });
    return null;
  };

  const handleReportClick = () => {
    setShowForm(true); // Show the form when the "Report Issue" button is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide the form when the form is closed
  };

  const toggleReports = () => {
    setShowReports((prev) => !prev);
  };

  return (
    <div className="position-relative" style={{ height: '100vh' }}>
      <MapContainer
        center={userLocation || [44.4432, 26.0931]}
        zoom={20}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationClickHandler />

        {userLocation && (
          <Marker position={userLocation} icon={blueIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {marker && (
          <Marker position={marker} icon={redIcon}>
            <Popup>Selected location</Popup>
          </Marker>
        )}

        {showReports &&
          reports.map((report, index) => (
            <Marker
              key={index}
              position={[report.latitude, report.longitude]}
              icon={icons[report.category] || redIcon}
            >
              <Popup>
                <strong>{report.name}</strong>
                <br />
                {report.category}
                <br />
                {report.description}
              </Popup>
            </Marker>
          ))}

        {route.length > 0 && (
          <Polyline 
            positions={route}
            color="blue"
            weight={5}
            opacity={0.7}
          />
        )}
      </MapContainer>

      <MapControls
        onReportClick={handleReportClick}
        toggleReports={toggleReports}
        onSearch={handleSearch}
        onNavigateClick={handleNavigateClick}
      />

      {error && (
        <Alert variant="danger" className="position-absolute top-0 start-0 m-3">
          {error}
        </Alert>
      )}

      {showForm && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 1000 }}>
          <ReportForm fetchReports={() => {}} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
};

export default MapPage;
