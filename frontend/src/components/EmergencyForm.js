import React, { useState } from 'react';
import { createEmergency } from '../services/api';
import { toast } from 'react-toastify';

const EmergencyForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: 'male',
    patient_phone: '',
    emergency_type: '',
    severity: 'medium',
    description: '',
    pickup_address: '',
    pickup_latitude: '',
    pickup_longitude: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            pickup_latitude: position.coords.latitude.toFixed(6),
            pickup_longitude: position.coords.longitude.toFixed(6),
          });
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createEmergency(formData);
      toast.success('Emergency request created successfully!');
      if (onSuccess) {
        onSuccess(response.data);
      }
      // Reset form
      setFormData({
        patient_name: '',
        patient_age: '',
        patient_gender: 'male',
        patient_phone: '',
        emergency_type: '',
        severity: 'medium',
        description: '',
        pickup_address: '',
        pickup_latitude: '',
        pickup_longitude: '',
      });
    } catch (error) {
      toast.error('Error creating emergency request. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-form-container">
      <h2>Create Emergency Request</h2>
      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="form-group">
          <label>Patient Name *</label>
          <input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            required
            placeholder="Enter patient name"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age *</label>
            <input
              type="number"
              name="patient_age"
              value={formData.patient_age}
              onChange={handleChange}
              required
              min="0"
              max="150"
              placeholder="Age"
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select
              name="patient_gender"
              value={formData.patient_gender}
              onChange={handleChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="patient_phone"
            value={formData.patient_phone}
            onChange={handleChange}
            required
            placeholder="+91 1234567890"
          />
        </div>

        <div className="form-group">
          <label>Emergency Type *</label>
          <input
            type="text"
            name="emergency_type"
            value={formData.emergency_type}
            onChange={handleChange}
            required
            placeholder="e.g., Heart Attack, Accident, etc."
          />
        </div>

        <div className="form-group">
          <label>Severity *</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe the emergency situation"
          />
        </div>

        <div className="form-group">
          <label>Pickup Address *</label>
          <textarea
            name="pickup_address"
            value={formData.pickup_address}
            onChange={handleChange}
            required
            rows="2"
            placeholder="Enter complete pickup address"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="text"
              name="pickup_latitude"
              value={formData.pickup_latitude}
              onChange={handleChange}
              required
              placeholder="28.6139"
            />
          </div>

          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="text"
              name="pickup_longitude"
              value={formData.pickup_longitude}
              onChange={handleChange}
              required
              placeholder="77.2090"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="btn-secondary"
        >
          📍 Get Current Location
        </button>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating Emergency...' : 'Create Emergency Request'}
        </button>
      </form>
    </div>
  );
};

export default EmergencyForm;
