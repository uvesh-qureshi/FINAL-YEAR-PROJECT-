import React from 'react';
import EmergencyForm from '../components/EmergencyForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Home = () => {
  const navigate = useNavigate();

  const handleEmergencyCreated = (emergency) => {
    toast.success(`Emergency #${emergency.id} created successfully!`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>🚑 Smart Ambulance System</h1>
        <p>Emergency Route Optimization & Real-time Tracking</p>
      </div>

      <div className="home-content">
        <div className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Route Optimization</h3>
              <p>AI-powered route selection for fastest ambulance dispatch</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Real-time Tracking</h3>
              <p>Live GPS tracking of ambulance location and ETA</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Hospital Notification</h3>
              <p>Automatic alerts to nearest hospitals with patient details</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Response</h3>
              <p>Automated ambulance assignment based on proximity</p>
            </div>
          </div>
        </div>

        <div className="emergency-form-section">
          <EmergencyForm onSuccess={handleEmergencyCreated} />
        </div>
      </div>
    </div>
  );
};

export default Home;
