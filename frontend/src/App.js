import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    image: null,
  });
  const [reports, setReports] = useState([]);
  const [geoError, setGeoError] = useState('');

  // Fetch reports from the backend on mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Use the browser's Geolocation API to get the current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error('Error retrieving geolocation:', error);
          setGeoError('Unable to retrieve your location. Please check your permissions.');
        }
      );
    } else {
      setGeoError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:8000/reports');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports. Please try again later.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:8000/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchReports(); // Refresh the list after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again later.');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Accessibility Reporting</h1>
        {geoError && <p style={{ color: 'red' }}>{geoError}</p>}
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-field">
            <input
              type="text"
              name="name"
              placeholder="Name (Real Name)"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="text"
              name="category"
              placeholder="Category (e.g., blocked_sidewalk)"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </div>
          <button type="submit">Submit Report</button>
        </form>
        <h2>Submitted Reports</h2>
        <ul>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <li key={index}>
                <p>
                  <strong>Name:</strong> {report.name}
                </p>
                <p>
                  <strong>Category:</strong> {report.category}
                </p>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Location:</strong> {report.latitude}, {report.longitude}
                </p>
                <img
                  src={`http://localhost:8000/uploads/${report.image_saved_to.split('/').pop()}`}
                  alt="Uploaded"
                  style={{ maxWidth: '200px' }}
                />
              </li>
            ))
          ) : (
            <p>No reports available.</p>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;