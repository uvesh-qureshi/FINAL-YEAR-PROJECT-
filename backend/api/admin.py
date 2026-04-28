from django.contrib import admin
from .models import Hospital, Ambulance, Emergency, RouteTracking, Notification


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'emergency_beds_available', 'icu_beds_available', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'address', 'phone']


@admin.register(Ambulance)
class AmbulanceAdmin(admin.ModelAdmin):
    list_display = ['vehicle_number', 'ambulance_type', 'driver_name', 'status', 'is_active']
    list_filter = ['status', 'ambulance_type', 'is_active']
    search_fields = ['vehicle_number', 'driver_name']


@admin.register(Emergency)
class EmergencyAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_name', 'emergency_type', 'severity', 'status', 'created_at']
    list_filter = ['status', 'severity', 'created_at']
    search_fields = ['patient_name', 'patient_phone', 'emergency_type']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(RouteTracking)
class RouteTrackingAdmin(admin.ModelAdmin):
    list_display = ['emergency', 'ambulance', 'distance_remaining', 'estimated_time', 'timestamp']
    list_filter = ['timestamp']
    readonly_fields = ['timestamp']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['emergency', 'hospital', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    readonly_fields = ['created_at']
