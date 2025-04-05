import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import './App.css';

function ReportForm({ fetchReports, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    image: [],
  });
  const [geoError, setGeoError] = useState('');
  const [geoLocation, setGeoLocation] = useState({
    latitude: '',
    longitude: '',
  });

  // Use the browser's Geolocation API to get the current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        () => {
          setGeoError('Unable to retrieve your location. Please check your permissions.');
        }
      );
    } else {
      setGeoError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Sync geolocation data with formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude,
    }));
  }, [geoLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    const submissionData = {
      ...formData,
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude,
    };

    Object.keys(submissionData).forEach((key) => {
      if (key === 'image') {
        submissionData.image.forEach((file) => {
          data.append('image', file);
        });
      } else {
        data.append(key, submissionData[key]);
      }
    });

    try {
      await axios.post('http://localhost:8000/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchReports();
      alert('Report submitted successfully!');
      onClose(); // Close the form after submission
    } catch (error) {
      alert('Failed to submit report. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({
        ...prev,
        image: files ? Array.from(files) : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="form-container position-relative">
      <div className="close-button-container">
        <Button className="close-button" onClick={onClose}>
          &times;
        </Button>
      </div>
      <Form onSubmit={handleSubmit}>
        <h2>Submit Report</h2>
        {geoError && <Alert variant="danger">{geoError}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select obstruction type</option>
            <option value="blocked_sidewalk">Blocked Sidewalk</option>
            <option value="blocked_bike_lane">Blocked Bike Lane</option>
            <option value="blocked_crosswalk">Blocked Crosswalk</option>
            <option value="blocked_entrance">Blocked Entrance</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Enter a description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            multiple
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Report
        </Button>
      </Form>
    </div>
  );
}

export default ReportForm;
