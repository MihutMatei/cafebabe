import React, { useState, useEffect } from 'react';
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

  // Fetch reports from the backend
  useEffect(() => {
    fetch('http://localhost:8000/reports')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setReports(data.reports || []))
      .catch((error) => {
        console.error('Error fetching reports:', error);
        alert('Failed to fetch reports. Please try again later.');
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    await fetch('http://localhost:8000/submit', {
      method: 'POST',
      body: form,
    });

    // Refresh the reports after submission
    const response = await fetch('http://localhost:8000/reports');
    const data = await response.json();
    setReports(data.reports || []);
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          >{formData.description}</textarea>
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <h2>Submitted Reports</h2>
        <ul>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <li key={index}>
                <p><strong>Name:</strong> {report.name}</p>
                <p><strong>Category:</strong> {report.category}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.latitude}, {report.longitude}</p>
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
