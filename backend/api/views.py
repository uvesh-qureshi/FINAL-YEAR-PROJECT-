from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
import math

from .models import Hospital, Ambulance, Emergency, RouteTracking, Notification
from .serializers import (
    HospitalSerializer, AmbulanceSerializer, EmergencySerializer,
    EmergencyCreateSerializer, RouteTrackingSerializer, NotificationSerializer,
    AmbulanceLocationUpdateSerializer
)
from .notifications import notification_service


class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.filter(is_active=True)
    serializer_class = HospitalSerializer

    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Find nearby hospitals based on location"""
        lat = float(request.query_params.get('latitude', 0))
        lon = float(request.query_params.get('longitude', 0))
        
        hospitals = Hospital.objects.filter(is_active=True)
        hospital_list = []
        
        for hospital in hospitals:
            distance = self.calculate_distance(
                lat, lon,
                float(hospital.latitude), float(hospital.longitude)
            )
            hospital_data = HospitalSerializer(hospital).data
            hospital_data['distance'] = round(distance, 2)
            hospital_list.append(hospital_data)
        
        # Sort by distance
        hospital_list.sort(key=lambda x: x['distance'])
        return Response(hospital_list[:5])  # Return top 5 nearest
    
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """Calculate distance between two points using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        return R * c


class AmbulanceViewSet(viewsets.ModelViewSet):
    queryset = Ambulance.objects.filter(is_active=True)
    serializer_class = AmbulanceSerializer

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available ambulances"""
        ambulances = Ambulance.objects.filter(status='available', is_active=True)
        serializer = self.get_serializer(ambulances, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_location(self, request, pk=None):
        """Update ambulance real-time location"""
        ambulance = self.get_object()
        serializer = AmbulanceLocationUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            ambulance.current_latitude = serializer.validated_data['latitude']
            ambulance.current_longitude = serializer.validated_data['longitude']
            ambulance.save()
            
            # Update route tracking if ambulance is on duty
            if ambulance.status == 'on_duty':
                active_emergency = Emergency.objects.filter(
                    ambulance=ambulance,
                    status='in_progress'
                ).first()
                
                if active_emergency:
                    # Calculate distance and ETA
                    distance = self.calculate_distance(
                        float(ambulance.current_latitude),
                        float(ambulance.current_longitude),
                        float(active_emergency.pickup_latitude),
                        float(active_emergency.pickup_longitude)
                    )
                    
                    # Estimate time (assuming average speed of 40 km/h)
                    estimated_time = int((distance / 40) * 60)  # in minutes
                    
                    RouteTracking.objects.create(
                        emergency=active_emergency,
                        ambulance=ambulance,
                        current_latitude=ambulance.current_latitude,
                        current_longitude=ambulance.current_longitude,
                        distance_remaining=distance,
                        estimated_time=estimated_time,
                        current_speed=40
                    )
            
            return Response({'message': 'Location updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        R = 6371
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        return R * c


class EmergencyViewSet(viewsets.ModelViewSet):
    queryset = Emergency.objects.all()
    serializer_class = EmergencySerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return EmergencyCreateSerializer
        return EmergencySerializer

    def create(self, request, *args, **kwargs):
        """Create emergency and auto-assign nearest ambulance"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        emergency = serializer.save()
        
        # Find nearest available ambulance
        nearest_ambulance = self.find_nearest_ambulance(
            float(emergency.pickup_latitude),
            float(emergency.pickup_longitude)
        )
        
        if nearest_ambulance:
            # Assign ambulance
            emergency.ambulance = nearest_ambulance
            emergency.status = 'assigned'
            emergency.save()
            
            # Update ambulance status
            nearest_ambulance.status = 'on_duty'
            nearest_ambulance.save()
            
            # Find nearest hospital
            nearest_hospital = self.find_nearest_hospital(
                float(emergency.pickup_latitude),
                float(emergency.pickup_longitude)
            )
            
            if nearest_hospital:
                emergency.assigned_hospital = nearest_hospital
                emergency.save()
                
                # Create notification for hospital
                Notification.objects.create(
                    emergency=emergency,
                    hospital=nearest_hospital,
                    notification_type='emergency_alert',
                    message=f"New emergency: {emergency.emergency_type}. Patient: {emergency.patient_name}, Age: {emergency.patient_age}. Severity: {emergency.severity}."
                )
                
                # 📱 SEND SMS & WHATSAPP NOTIFICATIONS
                try:
                    notification_service.send_emergency_alert(emergency)
                    print("✅ SMS & WhatsApp notifications sent successfully!")
                except Exception as e:
                    print(f"⚠️ Notification error (non-critical): {str(e)}")
        
        response_serializer = EmergencySerializer(emergency)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def start_journey(self, request, pk=None):
        """Mark emergency as in progress"""
        emergency = self.get_object()
        emergency.status = 'in_progress'
        emergency.save()
        
        # Send notification
        if emergency.assigned_hospital:
            Notification.objects.create(
                emergency=emergency,
                hospital=emergency.assigned_hospital,
                notification_type='ambulance_assigned',
                message=f"Ambulance {emergency.ambulance.vehicle_number} is on the way. ETA: {emergency.estimated_arrival_time or 'Calculating...'}"
            )
        
        # 📱 SEND SMS & WHATSAPP - Journey Started
        try:
            notification_service.send_journey_started(emergency)
            print("✅ Journey started notifications sent!")
        except Exception as e:
            print(f"⚠️ Notification error: {str(e)}")
        
        serializer = self.get_serializer(emergency)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark emergency as completed"""
        emergency = self.get_object()
        emergency.status = 'completed'
        emergency.completed_at = timezone.now()
        emergency.actual_arrival_time = timezone.now()
        emergency.save()
        
        # Update ambulance status
        if emergency.ambulance:
            emergency.ambulance.status = 'available'
            emergency.ambulance.save()
        
        # Send notification
        if emergency.assigned_hospital:
            Notification.objects.create(
                emergency=emergency,
                hospital=emergency.assigned_hospital,
                notification_type='arrival',
                message=f"Patient {emergency.patient_name} has arrived at the hospital."
            )
        
        # 📱 SEND SMS & WHATSAPP - Arrival Alert
        try:
            notification_service.send_arrival_alert(emergency)
            print("✅ Arrival notifications sent!")
        except Exception as e:
            print(f"⚠️ Notification error: {str(e)}")
        
        serializer = self.get_serializer(emergency)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active emergencies"""
        emergencies = Emergency.objects.filter(
            status__in=['pending', 'assigned', 'in_progress']
        )
        serializer = self.get_serializer(emergencies, many=True)
        return Response(serializer.data)
    
    def find_nearest_ambulance(self, lat, lon):
        """Find nearest available ambulance"""
        ambulances = Ambulance.objects.filter(status='available', is_active=True)
        
        nearest = None
        min_distance = float('inf')
        
        for ambulance in ambulances:
            if ambulance.current_latitude and ambulance.current_longitude:
                distance = self.calculate_distance(
                    lat, lon,
                    float(ambulance.current_latitude),
                    float(ambulance.current_longitude)
                )
                
                if distance < min_distance:
                    min_distance = distance
                    nearest = ambulance
        
        return nearest
    
    def find_nearest_hospital(self, lat, lon):
        """Find nearest hospital with available beds"""
        hospitals = Hospital.objects.filter(
            is_active=True,
            emergency_beds_available__gt=0
        )
        
        nearest = None
        min_distance = float('inf')
        
        for hospital in hospitals:
            distance = self.calculate_distance(
                lat, lon,
                float(hospital.latitude),
                float(hospital.longitude)
            )
            
            if distance < min_distance:
                min_distance = distance
                nearest = hospital
        
        return nearest
    
    def calculate_distance(self, lat1, lon1, lat2, lon2):
        R = 6371
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        return R * c


class RouteTrackingViewSet(viewsets.ModelViewSet):
    queryset = RouteTracking.objects.all()
    serializer_class = RouteTrackingSerializer

    @action(detail=False, methods=['get'])
    def by_emergency(self, request):
        """Get route tracking for specific emergency"""
        emergency_id = request.query_params.get('emergency_id')
        if emergency_id:
            tracking = RouteTracking.objects.filter(emergency_id=emergency_id).order_by('-timestamp')[:20]
            serializer = self.get_serializer(tracking, many=True)
            return Response(serializer.data)
        return Response({'error': 'emergency_id required'}, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    @action(detail=False, methods=['get'])
    def hospital_notifications(self, request):
        """Get notifications for a specific hospital"""
        hospital_id = request.query_params.get('hospital_id')
        if hospital_id:
            notifications = Notification.objects.filter(
                hospital_id=hospital_id,
                is_read=False
            ).order_by('-created_at')
            serializer = self.get_serializer(notifications, many=True)
            return Response(serializer.data)
        return Response({'error': 'hospital_id required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
