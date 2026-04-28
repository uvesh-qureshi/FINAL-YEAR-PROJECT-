#!/usr/bin/env python
"""Add sample data for Smart Ambulance System"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ambulance_system.settings')
django.setup()

from api.models import Hospital, Ambulance

print("Adding sample data...")
print("=" * 50)

# Add Hospitals
print("\n📍 Adding Hospitals...")

h1, created = Hospital.objects.get_or_create(
    name="AIIMS Delhi",
    defaults={
        'address': 'Ansari Nagar, New Delhi, Delhi 110029',
        'latitude': 28.5672,
        'longitude': 77.2100,
        'phone': '011-26588500',
        'email': 'aiims@example.com',
        'emergency_beds_available': 50,
        'icu_beds_available': 20,
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {h1.name}")

h2, created = Hospital.objects.get_or_create(
    name="Max Hospital Saket",
    defaults={
        'address': 'Press Enclave Road, Saket, New Delhi',
        'latitude': 28.5244,
        'longitude': 77.2066,
        'phone': '011-26515050',
        'email': 'max@example.com',
        'emergency_beds_available': 30,
        'icu_beds_available': 15,
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {h2.name}")

h3, created = Hospital.objects.get_or_create(
    name="Fortis Escorts Delhi",
    defaults={
        'address': 'Okhla Road, New Delhi',
        'latitude': 28.5355,
        'longitude': 77.2659,
        'phone': '011-46206200',
        'email': 'fortis@example.com',
        'emergency_beds_available': 40,
        'icu_beds_available': 18,
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {h3.name}")

# Add Ambulances
print("\n🚑 Adding Ambulances...")

a1, created = Ambulance.objects.get_or_create(
    vehicle_number="DL01AB1234",
    defaults={
        'ambulance_type': 'advanced',
        'driver_name': 'Rajesh Kumar',
        'driver_phone': '9876543210',
        'paramedic_name': 'Amit Singh',
        'paramedic_phone': '9876543211',
        'current_latitude': 28.6000,
        'current_longitude': 77.2000,
        'status': 'available',
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {a1.vehicle_number}")

a2, created = Ambulance.objects.get_or_create(
    vehicle_number="DL02CD5678",
    defaults={
        'ambulance_type': 'basic',
        'driver_name': 'Suresh Sharma',
        'driver_phone': '9876543212',
        'paramedic_name': 'Vijay Kumar',
        'paramedic_phone': '9876543213',
        'current_latitude': 28.5500,
        'current_longitude': 77.1800,
        'status': 'available',
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {a2.vehicle_number}")

a3, created = Ambulance.objects.get_or_create(
    vehicle_number="DL03EF9012",
    defaults={
        'ambulance_type': 'advanced',
        'driver_name': 'Ramesh Gupta',
        'driver_phone': '9876543214',
        'paramedic_name': 'Sanjay Verma',
        'paramedic_phone': '9876543215',
        'current_latitude': 28.6500,
        'current_longitude': 77.2500,
        'status': 'available',
        'is_active': True
    }
)
print(f"   {'Created' if created else 'Already exists'}: {a3.vehicle_number}")

print("\n" + "=" * 50)
print("✅ Sample data added successfully!")
print("=" * 50)

# Verify
print("\nVerifying data...")
print(f"Total Hospitals: {Hospital.objects.count()}")
print(f"Total Ambulances: {Ambulance.objects.count()}")
print(f"Available Ambulances: {Ambulance.objects.filter(status='available').count()}")

print("\n✅ System is ready!")
print("Now try creating an emergency from the frontend.")
