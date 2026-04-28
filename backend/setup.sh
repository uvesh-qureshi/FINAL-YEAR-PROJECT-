#!/bin/bash

echo "==================================="
echo "Smart Ambulance System - Backend Setup"
echo "==================================="

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create sample data
echo "Creating sample data..."
python manage.py shell << EOF
from api.models import Hospital, Ambulance

# Create sample hospital
Hospital.objects.get_or_create(
    name="AIIMS Delhi",
    defaults={
        'address': 'Ansari Nagar, New Delhi',
        'latitude': 28.5672,
        'longitude': 77.2100,
        'phone': '011-26588500',
        'email': 'aiims@example.com',
        'emergency_beds_available': 50,
        'icu_beds_available': 20
    }
)

Hospital.objects.get_or_create(
    name="Max Hospital Saket",
    defaults={
        'address': 'Saket, New Delhi',
        'latitude': 28.5244,
        'longitude': 77.2066,
        'phone': '011-26515050',
        'email': 'max@example.com',
        'emergency_beds_available': 30,
        'icu_beds_available': 15
    }
)

# Create sample ambulances
Ambulance.objects.get_or_create(
    vehicle_number="DL01AB1234",
    defaults={
        'ambulance_type': 'advanced',
        'driver_name': 'Rajesh Kumar',
        'driver_phone': '9876543210',
        'paramedic_name': 'Amit Singh',
        'paramedic_phone': '9876543211',
        'current_latitude': 28.6000,
        'current_longitude': 77.2000,
        'status': 'available'
    }
)

Ambulance.objects.get_or_create(
    vehicle_number="DL02CD5678",
    defaults={
        'ambulance_type': 'basic',
        'driver_name': 'Suresh Sharma',
        'driver_phone': '9876543212',
        'current_latitude': 28.5500,
        'current_longitude': 77.1800,
        'status': 'available'
    }
)

print("Sample data created successfully!")
EOF

echo ""
echo "==================================="
echo "Setup completed successfully!"
echo "==================================="
echo ""
echo "To create superuser, run:"
echo "python manage.py createsuperuser"
echo ""
echo "To start the server, run:"
echo "python manage.py runserver"
echo ""



name uvesh
email uvesh@gmail.com
password 12345678