import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, InputGroup, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReportForm from '../Form'; // Import the ReportForm component

// Define custom red and blue icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Map Controls UI
const MapControls = ({ onReportClick }) => (
  <div className="map-controls position-absolute top-0 end-0 p-3" style={{ zIndex: 1000 }}>
    <div className="d-flex flex-column gap-3">
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Search location..."
          aria-label="Search"
        />
        <Button variant="primary">
          <i className="bi bi-search"></i>
        </Button>
      </InputGroup>

      <Button variant="danger" className="d-flex align-items-center gap-2" onClick={onReportClick}>
        <i className="bi bi-exclamation-triangle"></i>
        Report Issue
      </Button>

      <Button variant="success" className="d-flex align-items-center gap-2">
        <i className="bi bi-geo-alt"></i>
        Navigate
      </Button>
    </div>
  </div>
);

// Main Map Page
const MapPage = () => {
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]); // Optional route line
  const [showForm, setShowForm] = useState(false); // State to toggle the form visibility

  // Fetch user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  // Click handler to place red marker
  const LocationClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker([lat, lng]);
      }
    });
    return null;
  };

  const handleReportClick = () => {
    setShowForm(true); // Show the form when the "Report Issue" button is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide the form when the "X" button is clicked or the form is submitted
  };

  const fetchReports = async () => {
    console.log('Fetching reports...');
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

        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>

      <MapControls onReportClick={handleReportClick} />

      {showForm && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 1000 }}>
          <ReportForm fetchReports={fetchReports} onClose={handleCloseForm} />
        </div>
      )}
    </div>
  );
};

export default MapPage;