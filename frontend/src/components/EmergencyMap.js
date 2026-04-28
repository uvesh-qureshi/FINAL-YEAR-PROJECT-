import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913620.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const patientIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913163.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const EmergencyMap = ({ emergency, routeTracking }) => {
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default: Delhi
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (emergency) {
      setCenter([
        parseFloat(emergency.pickup_latitude),
        parseFloat(emergency.pickup_longitude),
      ]);
    }
  }, [emergency]);

  useEffect(() => {
    if (routeTracking && routeTracking.length > 0) {
      const routePoints = routeTracking.map((track) => [
        parseFloat(track.current_latitude),
        parseFloat(track.current_longitude),
      ]);
      setRoute(routePoints);
    }
  }, [routeTracking]);

  if (!emergency) {
    return (
      <div className="map-placeholder">
        <p>Select an emergency to view on map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Patient/Pickup Location */}
      <Marker
        position={[
          parseFloat(emergency.pickup_latitude),
          parseFloat(emergency.pickup_longitude),
        ]}
        icon={patientIcon}
      >
        <Popup>
          <strong>Pickup Location</strong>
          <br />
          Patient: {emergency.patient_name}
          <br />
          Type: {emergency.emergency_type}
          <br />
          Severity: {emergency.severity}
        </Popup>
      </Marker>

      {/* Ambulance Location */}
      {emergency.ambulance_details && 
       emergency.ambulance_details.current_latitude && (
        <Marker
          position={[
            parseFloat(emergency.ambulance_details.current_latitude),
            parseFloat(emergency.ambulance_details.current_longitude),
          ]}
          icon={ambulanceIcon}
        >
          <Popup>
            <strong>Ambulance</strong>
            <br />
            Vehicle: {emergency.ambulance_details.vehicle_number}
            <br />
            Driver: {emergency.ambulance_details.driver_name}
            <br />
            Status: {emergency.ambulance_details.status}
          </Popup>
        </Marker>
      )}

      {/* Hospital Location */}
      {emergency.hospital_details && (
        <Marker
          position={[
            parseFloat(emergency.hospital_details.latitude),
            parseFloat(emergency.hospital_details.longitude),
          ]}
          icon={hospitalIcon}
        >
          <Popup>
            <strong>{emergency.hospital_details.name}</strong>
            <br />
            {emergency.hospital_details.address}
            <br />
            Phone: {emergency.hospital_details.phone}
            <br />
            Emergency Beds: {emergency.hospital_details.emergency_beds_available}
          </Popup>
        </Marker>
      )}

      {/* Route Polyline */}
      {route.length > 0 && (
        <Polyline positions={route} color="blue" weight={3} opacity={0.7} />
      )}
    </MapContainer>
  );
};

export default EmergencyMap;
