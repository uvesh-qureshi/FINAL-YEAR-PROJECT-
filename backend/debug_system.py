#!/usr/bin/env python
"""Debug script to check Smart Ambulance System status"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ambulance_system.settings')
django.setup()

from api.models import Hospital, Ambulance, Emergency

print("=" * 50)
print("SMART AMBULANCE SYSTEM - DEBUG INFO")
print("=" * 50)

# Check Hospitals
hospitals = Hospital.objects.all()
print(f"\n✅ Total Hospitals: {hospitals.count()}")
for h in hospitals:
    print(f"   - {h.name} (Active: {h.is_active})")

# Check Ambulances
ambulances = Ambulance.objects.all()
available = Ambulance.objects.filter(status='available', is_active=True)
print(f"\n✅ Total Ambulances: {ambulances.count()}")
print(f"✅ Available Ambulances: {available.count()}")
for a in ambulances:
    print(f"   - {a.vehicle_number} (Status: {a.status}, Active: {a.is_active})")
    if a.current_latitude and a.current_longitude:
        print(f"     Location: {a.current_latitude}, {a.current_longitude}")
    else:
        print(f"     ⚠️ WARNING: No location set!")

# Check Emergencies
emergencies = Emergency.objects.all()
active = Emergency.objects.filter(status__in=['pending', 'assigned', 'in_progress'])
print(f"\n✅ Total Emergencies: {emergencies.count()}")
print(f"✅ Active Emergencies: {active.count()}")
for e in emergencies[:5]:
    print(f"   - Emergency #{e.id}: {e.patient_name} (Status: {e.status})")

print("\n" + "=" * 50)
print("RECOMMENDATIONS:")
print("=" * 50)

if hospitals.count() == 0:
    print("⚠️ No hospitals found! Add hospitals via admin panel")

if available.count() == 0:
    print("⚠️ No available ambulances! Check:")
    print("   - Ambulances exist in database")
    print("   - Status is 'available'")
    print("   - is_active is True")
    print("   - current_latitude and current_longitude are set")

if hospitals.count() > 0 and available.count() > 0:
    print("✅ System is ready to create emergencies!")

print("=" * 50)
