import React, { useEffect, useState } from 'react';
import { getActiveEmergencies, startJourney, completeEmergency } from '../services/api';
import { toast } from 'react-toastify';

const EmergencyList = ({ onSelectEmergency }) => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await getActiveEmergencies();
      setEmergencies(response.data);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartJourney = async (id) => {
    try {
      await startJourney(id);
      toast.success('Journey started!');
      fetchEmergencies();
    } catch (error) {
      toast.error('Error starting journey');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeEmergency(id);
      toast.success('Emergency completed!');
      fetchEmergencies();
    } catch (error) {
      toast.error('Error completing emergency');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'assigned':
        return '#17a2b8';
      case 'in_progress':
        return '#007bff';
      case 'completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading emergencies...</div>;
  }

  return (
    <div className="emergency-list-container">
      <h2>Active Emergencies ({emergencies.length})</h2>
      {emergencies.length === 0 ? (
        <div className="no-emergencies">
          <p>No active emergencies at the moment</p>
        </div>
      ) : (
        <div className="emergency-list">
          {emergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="emergency-card"
              onClick={() => onSelectEmergency(emergency)}
              style={{ cursor: 'pointer' }}
            >
              <div className="emergency-header">
                <h3>Emergency #{emergency.id}</h3>
                <span
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(emergency.severity) }}
                >
                  {emergency.severity.toUpperCase()}
                </span>
              </div>

              <div className="emergency-body">
                <div className="info-row">
                  <strong>Patient:</strong> {emergency.patient_name} ({emergency.patient_age}Y, {emergency.patient_gender})
                </div>
                <div className="info-row">
                  <strong>Type:</strong> {emergency.emergency_type}
                </div>
                <div className="info-row">
                  <strong>Phone:</strong> {emergency.patient_phone}
                </div>
                <div className="info-row">
                  <strong>Address:</strong> {emergency.pickup_address}
                </div>
                <div className="info-row">
                  <strong>Status:</strong>{' '}
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(emergency.status) }}
                  >
                    {emergency.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {emergency.ambulance_details && (
                  <div className="info-row">
                    <strong>Ambulance:</strong> {emergency.ambulance_details.vehicle_number}
                  </div>
                )}

                {emergency.hospital_details && (
                  <div className="info-row">
                    <strong>Hospital:</strong> {emergency.hospital_details.name}
                  </div>
                )}

                <div className="info-row">
                  <strong>Created:</strong> {new Date(emergency.created_at).toLocaleString()}
                </div>
              </div>

              <div className="emergency-actions">
                {emergency.status === 'assigned' && (
                  <button
                    className="btn-action btn-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartJourney(emergency.id);
                    }}
                  >
                    Start Journey
                  </button>
                )}

                {emergency.status === 'in_progress' && (
                  <button
                    className="btn-action btn-complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete(emergency.id);
                    }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyList;
