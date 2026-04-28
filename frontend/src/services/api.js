import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hospital APIs
export const getHospitals = () => api.get('/hospitals/');
export const getNearbyHospitals = (latitude, longitude) => 
  api.get(`/hospitals/nearby/?latitude=${latitude}&longitude=${longitude}`);

// Ambulance APIs
export const getAmbulances = () => api.get('/ambulances/');
export const getAvailableAmbulances = () => api.get('/ambulances/available/');
export const updateAmbulanceLocation = (id, latitude, longitude) =>
  api.post(`/ambulances/${id}/update_location/`, { latitude, longitude });

// Emergency APIs
export const createEmergency = (data) => api.post('/emergencies/', data);
export const getEmergencies = () => api.get('/emergencies/');
export const getActiveEmergencies = () => api.get('/emergencies/active/');
export const getEmergency = (id) => api.get(`/emergencies/${id}/`);
export const startJourney = (id) => api.post(`/emergencies/${id}/start_journey/`);
export const completeEmergency = (id) => api.post(`/emergencies/${id}/complete/`);

// Route Tracking APIs
export const getRouteTracking = (emergencyId) =>
  api.get(`/route-tracking/by_emergency/?emergency_id=${emergencyId}`);

// Notification APIs
export const getHospitalNotifications = (hospitalId) =>
  api.get(`/notifications/hospital_notifications/?hospital_id=${hospitalId}`);
export const markNotificationRead = (id) =>
  api.post(`/notifications/${id}/mark_read/`);

export default api;
