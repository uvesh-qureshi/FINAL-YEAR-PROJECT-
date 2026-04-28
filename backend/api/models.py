from django.db import models
from django.utils import timezone

class Hospital(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    emergency_beds_available = models.IntegerField(default=0)
    icu_beds_available = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Ambulance(models.Model):
    AMBULANCE_TYPES = [
        ('basic', 'Basic Life Support'),
        ('advanced', 'Advanced Life Support'),
        ('air', 'Air Ambulance'),
        ('neonatal', 'Neonatal Ambulance'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('on_duty', 'On Duty'),
        ('maintenance', 'Under Maintenance'),
    ]

    vehicle_number = models.CharField(max_length=50, unique=True)
    ambulance_type = models.CharField(max_length=20, choices=AMBULANCE_TYPES)
    driver_name = models.CharField(max_length=100)
    driver_phone = models.CharField(max_length=15)
    paramedic_name = models.CharField(max_length=100, blank=True, null=True)
    paramedic_phone = models.CharField(max_length=15, blank=True, null=True)
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle_number}"

    class Meta:
        ordering = ['-created_at']


class Emergency(models.Model):
    SEVERITY_LEVELS = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    patient_name = models.CharField(max_length=100)
    patient_age = models.IntegerField()
    patient_gender = models.CharField(max_length=10)
    patient_phone = models.CharField(max_length=15)
    emergency_type = models.CharField(max_length=100)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    description = models.TextField()
    
    pickup_address = models.TextField()
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    ambulance = models.ForeignKey(Ambulance, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_hospital = models.ForeignKey(Hospital, on_delete=models.SET_NULL, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    estimated_arrival_time = models.DateTimeField(null=True, blank=True)
    actual_arrival_time = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Emergency #{self.id} - {self.patient_name}"

    class Meta:
        ordering = ['-created_at']


class RouteTracking(models.Model):
    emergency = models.ForeignKey(Emergency, on_delete=models.CASCADE, related_name='route_tracking')
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE)
    
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    distance_remaining = models.FloatField(help_text="Distance in kilometers")
    estimated_time = models.IntegerField(help_text="Time in minutes")
    current_speed = models.FloatField(help_text="Speed in km/h", default=0)
    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tracking #{self.emergency.id}"

    class Meta:
        ordering = ['-timestamp']


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('emergency_alert', 'Emergency Alert'),
        ('ambulance_assigned', 'Ambulance Assigned'),
        ('eta_update', 'ETA Update'),
        ('arrival', 'Arrival Notification'),
    ]

    emergency = models.ForeignKey(Emergency, on_delete=models.CASCADE, related_name='notifications')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.notification_type} - {self.created_at}"

    class Meta:
        ordering = ['-created_at']
