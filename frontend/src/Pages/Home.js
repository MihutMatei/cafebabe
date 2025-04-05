import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import heroImage from '../Images/hero.jpg';
import osmImage from '../Images/Openstreetmap_logo.svg.png'

// Custom color theme variables
const colorTheme = {
  primary: '#2E7D32',  // Deep green
  primaryLight: '#4CAF50',  // Medium green
  primaryDark: '#1B5E20',  // Dark green
  secondary: '#8BC34A',  // Light green
  accent: '#FFC107',  // Amber for accents
  light: '#F5F5F5',
  dark: '#212121'
};

const HomePage = () => {
  return (
    <div className="d-flex flex-column min-vh-100" style={{
      '--bs-primary': colorTheme.primary,
      '--bs-primary-rgb': '46, 125, 50',
      '--bs-primary-light': colorTheme.primaryLight,
      '--bs-primary-dark': colorTheme.primaryDark,
      '--bs-secondary': colorTheme.secondary,
      '--bs-accent': colorTheme.accent
    }}>
      {/* Custom styles */}
      <style>{`
        .btn-primary {
          background-color: var(--bs-primary);
          border-color: var(--bs-primary);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background-color: var(--bs-primary-dark);
          border-color: var(--bs-primary-dark);
          transform: translateY(-2px);
        }
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(90deg, 
            var(--bs-primary) 0%, 
            var(--bs-secondary) 50%, 
            var(--bs-accent) 100%);
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none;
          border-radius: 12px;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .feature-icon {
          background-color: rgba(139, 195, 74, 0.1);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
      `}</style>

      {/* Hero Section */}
      <header
        className="hero-section position-relative text-white"
        style={{
          height: '80vh',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container h-100 d-flex flex-column justify-content-center align-items-center text-center">
          <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Make Your City More Accessible
          </h1>
          <p className="lead mb-5 fs-4" style={{ maxWidth: '700px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            Report accessibility issues to help create barrier-free pathways for everyone
          </p>
          <Link 
            to="/map" 
            className="btn btn-light btn-lg px-4 py-3 rounded-pill shadow"
            style={{ 
              backgroundColor: 'white',
              color: colorTheme.primaryDark,
              fontWeight: '600'
            }}
          >
            Report an Issue Now <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </header>

      {/* Project Purpose Section */}
      <section className="py-5" style={{ backgroundColor: colorTheme.light }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4" style={{ color: colorTheme.primaryDark }}>
                Why Accessibility Matters
              </h2>
              <p className="lead fs-4" style={{ color: colorTheme.primary }}>
                Our platform empowers citizens to report accessibility barriers that affect everyone in the community.
              </p>
              <p style={{ fontSize: '1.1rem' }}>
                By identifying and reporting obstacles like broken sidewalks, missing ramps, or improperly parked vehicles,
                we're creating a collective map of accessibility issues that helps authorities prioritize fixes and helps
                navigation apps suggest accessible routes.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-lg" style={{ 
                backgroundColor: 'white',
                borderLeft: `5px solid ${colorTheme.secondary}`
              }}>
                <div className="card-body p-4">
                  <h3 className="card-title mb-4" style={{ color: colorTheme.primaryDark }}>
                    <i className="bi bi-heart-fill me-2" style={{ color: colorTheme.primary }}></i>
                    Key Benefits
                  </h3>
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3" style={{ 
                        color: colorTheme.secondary,
                        fontSize: '1.5rem'
                      }}></i>
                      <span>Creates safer pathways for wheelchair users</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3" style={{ 
                        color: colorTheme.secondary,
                        fontSize: '1.5rem'
                      }}></i>
                      <span>Helps visually impaired navigate around obstacles</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3" style={{ 
                        color: colorTheme.secondary,
                        fontSize: '1.5rem'
                      }}></i>
                      <span>Makes streets safer for parents with strollers</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-3" style={{ 
                        color: colorTheme.secondary,
                        fontSize: '1.5rem'
                      }}></i>
                      <span>Improves city infrastructure for everyone</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: colorTheme.primaryDark }}>How It Works</h2>
            <p className="lead" style={{ color: colorTheme.primary }}>
              Simple steps to make your community more accessible
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="bi bi-map fs-1" style={{ color: colorTheme.primary }}></i>
                  </div>
                  <h3 className="card-title mb-3" style={{ color: colorTheme.primaryDark }}>Locate the Issue</h3>
                  <p className="card-text">
                    Pinpoint accessibility barriers on our interactive OpenStreetMap with precise location tagging.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="bi bi-chat-dots fs-1" style={{ color: colorTheme.primary }}></i>
                  </div>
                  <h3 className="card-title mb-3" style={{ color: colorTheme.primaryDark }}>Describe the Problem</h3>
                  <p className="card-text">
                    Provide detailed descriptions and upload photos of the accessibility barrier.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="bi bi-shield-check fs-1" style={{ color: colorTheme.primary }}></i>
                  </div>
                  <h3 className="card-title mb-3" style={{ color: colorTheme.primaryDark }}>Submit to Authorities</h3>
                  <p className="card-text">
                    Reports are automatically routed to the appropriate city department or local authority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OpenStreetMap Integration Section */}
      <section className="py-5" style={{ backgroundColor: colorTheme.light }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img 
                src="${osmImage}" 
                alt="OpenStreetMap interface showing accessible routes" 
                className="img-fluid rounded shadow-lg"
                style={{ border: `3px solid ${colorTheme.secondary}` }}
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold mb-4" style={{ color: colorTheme.primaryDark }}>
                <i className="bi bi-map me-2" style={{ color: colorTheme.primary }}></i>
                Powered by OpenStreetMap
              </h2>
              <p className="mb-4" style={{ fontSize: '1.1rem' }}>
                Our platform directly integrates with OpenStreetMap's open data ecosystem to enhance accessibility mapping.
              </p>
              <ul className="list-unstyled">
                {[
                  "Uses OSM's powerful mapping tools for precise issue reporting",
                  "Contributes accessibility data back to the OSM community",
                  "Compatible with OSM-based navigation tools like OsmAnd and Maps.me",
                  "Supports standard OSM tags for accessibility (wheelchair=yes/no/limited)"
                ].map((item, index) => (
                  <li key={index} className="mb-3 d-flex">
                    <i className="bi bi-check-circle-fill me-3 mt-1" style={{ 
                      color: colorTheme.secondary
                    }}></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="alert mt-4" style={{ 
                backgroundColor: 'rgba(139, 195, 74, 0.1)',
                borderLeft: `4px solid ${colorTheme.secondary}`
              }}>
                <i className="bi bi-info-circle-fill me-2" style={{ color: colorTheme.primary }}></i>
                All reports are available in OSM-compatible formats for integration with third-party accessibility tools.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5" style={{ color: colorTheme.primaryDark }}>
            Our Community Impact
          </h2>
          <div className="row g-4">
            {[
              { value: "1,200+", label: "Reports submitted" },
              { value: "85%", label: "Of issues resolved within 30 days" },
              { value: "42", label: "Partner organizations" },
              { value: "3", label: "Navigation apps integrated" }
            ].map((stat, index) => (
              <div key={index} className="col-md-3">
                <div className="p-4 rounded shadow-sm" style={{ 
                  backgroundColor: 'white',
                  borderBottom: `4px solid ${colorTheme.secondary}`
                }}>
                  <h3 style={{ 
                    color: colorTheme.primary,
                    fontSize: '2.5rem',
                    fontWeight: '700'
                  }}>{stat.value}</h3>
                  <p className="mb-0" style={{ color: colorTheme.dark }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ 
        backgroundColor: colorTheme.primaryDark,
        backgroundImage: 'linear-gradient(135deg, rgba(46, 125, 50, 0.9) 0%, rgba(27, 94, 32, 0.95) 100%)'
      }}>
        <div className="container text-center text-white">
          <h2 className="mb-4">Ready to Improve Your Community?</h2>
          <p className="lead mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Join thousands of citizens making their neighborhoods more accessible for everyone
          </p>
          <Link 
            to="/map" 
            className="btn btn-lg px-5 py-3 rounded-pill shadow"
            style={{ 
              backgroundColor: colorTheme.accent,
              color: colorTheme.dark,
              fontWeight: '600'
            }}
          >
            Start Reporting Now <i className="bi bi-geo-alt-fill ms-2"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 style={{ color: colorTheme.secondary }}>CityGuard</h5>
              <p className="small">
                A community-powered platform for identifying and reporting accessibility barriers in public spaces.
              </p>
              <div className="mt-3">
                <a href="#" className="text-white me-3"><i className="bi bi-twitter fs-5"></i></a>
                <a href="#" className="text-white me-3"><i className="bi bi-facebook fs-5"></i></a>
                <a href="#" className="text-white"><i className="bi bi-instagram fs-5"></i></a>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 style={{ color: colorTheme.secondary }}>Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/about" className="text-white">About Us</a></li>
                <li className="mb-2"><a href="/faq" className="text-white">FAQ</a></li>
                <li className="mb-2"><a href="/contact" className="text-white">Contact</a></li>
                <li><a href="/privacy" className="text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 style={{ color: colorTheme.secondary }}>Partners</h5>
              <p className="small mb-3">
                Working with city councils, disability organizations, and navigation services to create more accessible communities.
              </p>
            </div>
          </div>
          <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center small">
            &copy; {new Date().getFullYear()} CityGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;