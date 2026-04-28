from rest_framework import serializers
from .models import Hospital, Ambulance, Emergency, RouteTracking, Notification


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'


class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = '__all__'


class EmergencySerializer(serializers.ModelSerializer):
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    hospital_details = HospitalSerializer(source='assigned_hospital', read_only=True)
    
    class Meta:
        model = Emergency
        fields = '__all__'


class EmergencyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergency
        fields = ['patient_name', 'patient_age', 'patient_gender', 'patient_phone',
                  'emergency_type', 'severity', 'description', 'pickup_address',
                  'pickup_latitude', 'pickup_longitude']


class RouteTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteTracking
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class AmbulanceLocationUpdateSerializer(serializers.Serializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
