import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
  useMapEvents,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Form, InputGroup, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReportForm from '../Form'; // Import the ReportForm component
import axios from 'axios';
import polyline from '@mapbox/polyline'; // Import polyline decoder

// Use the literal API key directly (or load from env)
const API_KEY = process.env.REACT_APP_ORS_API_KEY;

// Define custom red and blue icons
const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Icons for different report categories
const icons = {
  blocked_sidewalk: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25],
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_bike_lane: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25],
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_crosswalk: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25],
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
  blocked_entrance: new L.Icon({
    iconUrl:
      'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [15, 25],
    iconAnchor: [7, 25],
    popupAnchor: [1, -20],
    shadowSize: [25, 25],
  }),
};

/**
 * Helper function to generate an approximated circle polygon around a center.
 * The center is [lat, lon] and the radius is in meters.
 * Returns a GeoJSON Polygon with coordinates in [lon, lat] order.
 */
function generateCirclePolygon(center, radius, numPoints = 16) {
  const [lat, lon] = center;
  const R = 6371000; // Earth's radius in meters
  const coordinates = [];
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i * 360) / numPoints;
    const bearing = (angle * Math.PI) / 180;
    const lat2 = Math.asin(
      Math.sin(latRad) * Math.cos(radius / R) +
        Math.cos(latRad) * Math.sin(radius / R) * Math.cos(bearing)
    );
    const lon2 =
      lonRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(radius / R) * Math.cos(latRad),
        Math.cos(radius / R) - Math.sin(latRad) * Math.sin(lat2)
      );
    coordinates.push([lon2 * (180 / Math.PI), lat2 * (180 / Math.PI)]);
  }
  return {
    type: "Polygon",
    coordinates: [coordinates],
  };
}

/**
 * Given an array of report objects (each with latitude and longitude),
 * generate a GeoJSON MultiPolygon of avoid zones (default radius 30 meters).
 */
function getAvoidPolygons(reports, radius = 30) {
  const multiPolyCoords = [];
  reports.forEach((report) => {
    const lat = parseFloat(report.latitude);
    const lon = parseFloat(report.longitude);
    const circlePoly = generateCirclePolygon([lat, lon], radius);
    multiPolyCoords.push(circlePoly.coordinates);
  });
  if (multiPolyCoords.length === 0) return null;
  return {
    type: "MultiPolygon",
    coordinates: multiPolyCoords,
  };
}

// Map Controls UI component
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
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={onNavigateClick}>
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

// Main Map Page component
const MapPage = () => {
  const [marker, setMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState([]); // Array of [lat, lon] for the route
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

  // Call the OpenRouteService API via the proxy to get a foot-walking route, avoiding user-reported zones.
  const handleNavigateClick = async () => {
    if (!userLocation || !marker) {
      setError("Please select both your current location and a destination marker");
      return;
    }

    // Build request body; note ORS expects coordinates in [lon, lat] order.
    const body = {
      coordinates: [
        [userLocation[1], userLocation[0]],
        [marker[1], marker[0]],
      ],
      format: "geojson",
      profile: "foot-walking",
      options: {},
    };

    // Add avoid polygons from reports if available
    const avoidPolygons = getAvoidPolygons(reports, 30);
    if (avoidPolygons) {
      body.options.avoid_polygons = avoidPolygons;
    }

    try {
      const response = await fetch("http://localhost:8000/proxy/ors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.detail}`);
        return;
      }

      const data = await response.json();
      console.log("ORS API response:", data);
      
      // Check if the response is in GeoJSON format (with a "features" array)
      if (data.features && data.features[0]) {
        const coords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(coords);
        setError(null);
      } else if (data.routes && data.routes[0] && data.routes[0].geometry) {
        // If the response is in the "routes" format with an encoded geometry, decode it.
        const decodedCoords = polyline.decode(data.routes[0].geometry);
        console.log("Decoded route coordinates:", decodedCoords);
        setRoute(decodedCoords);
        setError(null);
      } else {
        setError("No route found.");
      }
    } catch (err) {
      setError("Failed to calculate route. Please try again.");
      console.error("Routing error:", err);
    }
  };

  // Component to handle map clicks to set a marker.
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
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
            <React.Fragment key={index}>
              <Marker
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
              <Circle
                center={[report.latitude, report.longitude]}
                radius={10} // 10 meters red zone for display
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
              />
            </React.Fragment>
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
