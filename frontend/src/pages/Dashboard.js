import React, { useState, useEffect, useCallback } from 'react';
import EmergencyList from '../components/EmergencyList';
import EmergencyMap from '../components/EmergencyMap';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { getRouteTracking, updateAmbulanceLocation } from '../services/api';
import { toast } from 'react-toastify';
import pdfService from '../services/pdfService';

const Dashboard = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [routeTracking, setRouteTracking] = useState([]);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(null);

  const fetchRouteTracking = useCallback(async () => {
    if (selectedEmergency) {
      try {
        const response = await getRouteTracking(selectedEmergency.id);
        if (response.data && response.data.length > 0) {
          setRouteTracking(response.data);
          setTrackingInfo(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching route tracking:', error);
      }
    }
  }, [selectedEmergency]);

  useEffect(() => {
    if (selectedEmergency) {
      fetchRouteTracking();
      const interval = setInterval(fetchRouteTracking, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedEmergency, fetchRouteTracking]);

  const startSimulation = async () => {
    if (!selectedEmergency?.ambulance_details) {
      alert('No ambulance assigned!');
      return;
    }
    if (isSimulating) {
      clearInterval(simulationInterval);
      setIsSimulating(false);
      setSimulationInterval(null);
      return;
    }
    setIsSimulating(true);
    const ambulanceId = selectedEmergency.ambulance_details.id;
    const targetLat = parseFloat(selectedEmergency.pickup_latitude);
    const targetLon = parseFloat(selectedEmergency.pickup_longitude);
    let currentLat = parseFloat(selectedEmergency.ambulance_details.current_latitude) || targetLat + 0.05;
    let currentLon = parseFloat(selectedEmergency.ambulance_details.current_longitude) || targetLon + 0.05;
    const stepLat = (targetLat - currentLat) / 10;
    const stepLon = (targetLon - currentLon) / 10;
    let steps = 0;
    const interval = setInterval(async () => {
      if (steps >= 10) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
        return;
      }
      currentLat += stepLat;
      currentLon += stepLon;
      steps++;
      try {
        await updateAmbulanceLocation(ambulanceId, currentLat.toFixed(6), currentLon.toFixed(6));
        await fetchRouteTracking();
      } catch (error) {
        console.error('Simulation error:', error);
      }
    }, 3000);
    setSimulationInterval(interval);
  };

  const handleSelectEmergency = (emergency) => {
    setSelectedEmergency(emergency);
    setRouteTracking([]);
    setTrackingInfo(null);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setIsSimulating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedEmergency) {
      toast.error('Please select an emergency first!');
      return;
    }

    try {
      const fileName = pdfService.generateEmergencyReport(selectedEmergency, routeTracking);
      toast.success(`PDF Report generated: ${fileName}`);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🚑 Smart Ambulance Dashboard</h1>
        <p>Real-time Emergency Tracking & Route Optimization</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <EmergencyList onSelectEmergency={handleSelectEmergency} />
        </div>

        <div className="dashboard-right">
          <div className="map-section">
            <div className="map-header">
              <h2>🗺️ Live Tracking</h2>
              <div className="map-actions">
                {selectedEmergency && (
                  <>
                    <QRCodeGenerator emergency={selectedEmergency} />
                    <button
                      className="btn-download-pdf"
                      onClick={handleDownloadPDF}
                      title="Download PDF Report"
                    >
                      📄 Download Report
                    </button>
                  </>
                )}
                {selectedEmergency && selectedEmergency.status === 'in_progress' && (
                  <button
                    className={`btn-simulate ${isSimulating ? 'btn-stop' : 'btn-start-sim'}`}
                    onClick={startSimulation}
                  >
                    {isSimulating ? '⏹ Stop Simulation' : '▶ Simulate Movement'}
                  </button>
                )}
              </div>
            </div>

            {selectedEmergency ? (
              <>
                {/* Emergency Info Badges */}
                <div className="selected-emergency-info">
                  <div className="info-badge">
                    <span className="info-label">👤 Patient</span>
                    <span className="info-value">{selectedEmergency.patient_name}</span>
                  </div>
                  <div className="info-badge">
                    <span className="info-label">🚨 Type</span>
                    <span className="info-value">{selectedEmergency.emergency_type}</span>
                  </div>
                  <div className="info-badge">
                    <span className="info-label">⚠️ Severity</span>
                    <span className={`severity-pill severity-${selectedEmergency.severity}`}>
                      {selectedEmergency.severity?.toUpperCase()}
                    </span>
                  </div>
                  <div className="info-badge">
                    <span className="info-label">📋 Status</span>
                    <span className={`status-pill status-${selectedEmergency.status}`}>
                      {selectedEmergency.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Map Component */}
                <EmergencyMap
                  emergency={selectedEmergency}
                  routeTracking={routeTracking}
                />

                {/* Live Tracking Stats */}
                <div className="tracking-stats">
                  <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-info">
                      <span className="stat-label">Distance Remaining</span>
                      <span className="stat-value">
                        {trackingInfo ? `${parseFloat(trackingInfo.distance_remaining).toFixed(2)} km` : '-- km'}
                      </span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <span className="stat-label">ETA</span>
                      <span className="stat-value">
                        {trackingInfo ? `${trackingInfo.estimated_time} min` : '-- min'}
                      </span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🚀</div>
                    <div className="stat-info">
                      <span className="stat-label">Speed</span>
                      <span className="stat-value">
                        {trackingInfo ? `${trackingInfo.current_speed} km/h` : '-- km/h'}
                      </span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                      <span className="stat-label">GPS Updates</span>
                      <span className="stat-value">{routeTracking.length} points</span>
                    </div>
                  </div>
                </div>

                {/* Ambulance & Hospital Cards */}
                <div className="assignment-info">
                  {selectedEmergency.ambulance_details && (
                    <div className="assignment-card ambulance-card">
                      <h4>🚑 Assigned Ambulance</h4>
                      <p><strong>Vehicle:</strong> {selectedEmergency.ambulance_details.vehicle_number}</p>
                      <p><strong>Driver:</strong> {selectedEmergency.ambulance_details.driver_name}</p>
                      <p><strong>Phone:</strong> {selectedEmergency.ambulance_details.driver_phone}</p>
                      <p><strong>Type:</strong> {selectedEmergency.ambulance_details.ambulance_type}</p>
                      <p><strong>Status:</strong> <span className="on-duty-badge">{selectedEmergency.ambulance_details.status?.toUpperCase()}</span></p>
                      {trackingInfo && (
                        <p><strong>Last GPS:</strong> {parseFloat(trackingInfo.current_latitude).toFixed(4)}, {parseFloat(trackingInfo.current_longitude).toFixed(4)}</p>
                      )}
                    </div>
                  )}

                  {selectedEmergency.hospital_details && (
                    <div className="assignment-card hospital-card">
                      <h4>🏥 Assigned Hospital</h4>
                      <p><strong>Name:</strong> {selectedEmergency.hospital_details.name}</p>
                      <p><strong>Address:</strong> {selectedEmergency.hospital_details.address}</p>
                      <p><strong>Phone:</strong> {selectedEmergency.hospital_details.phone}</p>
                      <p><strong>Emergency Beds:</strong> <span className="beds-badge">{selectedEmergency.hospital_details.emergency_beds_available}</span></p>
                      <p><strong>ICU Beds:</strong> <span className="beds-badge">{selectedEmergency.hospital_details.icu_beds_available}</span></p>
                    </div>
                  )}
                </div>

                {/* Route Tracking History Table */}
                {routeTracking.length > 0 && (
                  <div className="route-history">
                    <h4>📊 Route Tracking History ({routeTracking.length} updates)</h4>
                    <div className="history-table-wrapper">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Distance</th>
                            <th>ETA</th>
                            <th>Speed</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routeTracking.slice(0, 10).map((track, index) => (
                            <tr key={track.id} className={index === 0 ? 'latest-row' : ''}>
                              <td>{index === 0 ? '🔴 Live' : index + 1}</td>
                              <td>{parseFloat(track.current_latitude).toFixed(4)}</td>
                              <td>{parseFloat(track.current_longitude).toFixed(4)}</td>
                              <td>{parseFloat(track.distance_remaining).toFixed(2)} km</td>
                              <td>{track.estimated_time} min</td>
                              <td>{track.current_speed} km/h</td>
                              <td>{new Date(track.timestamp).toLocaleTimeString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* No tracking yet message */}
                {routeTracking.length === 0 && selectedEmergency.status === 'in_progress' && (
                  <div className="no-tracking">
                    <p>🔄 Waiting for GPS updates... Click "Simulate Movement" to see live tracking!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="map-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">🗺️</div>
                  <h3>Select an Emergency</h3>
                  <p>Click any emergency from the list to view live tracking</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
