import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import heroImage from '../Images/hero.jpg';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <header className="hero-section position-relative text-white" 
              style={{ 
                height: '80vh',
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
        <div className="container h-100 d-flex flex-column justify-content-center align-items-center text-center">
          <h1 className="display-4 fw-bold mb-4">Make Your City Safer</h1>
          <p className="lead mb-5">Report local issues directly to authorities through our interactive map platform</p>
          <Link to="/map" className="btn btn-light btn-lg position-absolute bottom-0 mb-5">
            Report an Issue Now <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center">
                  <i className="bi bi-map fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Locate the Issue</h3>
                  <p className="card-text">Use our interactive map to pinpoint exactly where the problem is located.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center">
                  <i className="bi bi-chat-dots fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Describe the Problem</h3>
                  <p className="card-text">Provide details about the issue you're reporting with photos and descriptions.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Submit to Authorities</h3>
                  <p className="card-text">Your report gets directly routed to the appropriate local authorities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Make a Difference?</h2>
          <Link to="/map" className="btn btn-primary btn-lg">
            Start Reporting Now <i className="bi bi-geo-alt ms-2"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;