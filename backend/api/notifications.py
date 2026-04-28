# backend/api/notifications.py
"""
SMS & WhatsApp Notification Service using Twilio
Sign up at: https://www.twilio.com/try-twilio (Free trial)
"""

from twilio.rest import Client
from django.conf import settings
import os

class NotificationService:
    def __init__(self):
        # Twilio credentials (add to settings.py)
        self.account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', os.getenv('TWILIO_ACCOUNT_SID'))
        self.auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', os.getenv('TWILIO_AUTH_TOKEN'))
        self.twilio_phone = getattr(settings, 'TWILIO_PHONE_NUMBER', os.getenv('TWILIO_PHONE_NUMBER'))
        self.whatsapp_from = getattr(settings, 'TWILIO_WHATSAPP_NUMBER', os.getenv('TWILIO_WHATSAPP_NUMBER'))
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            print("⚠️ Twilio credentials not configured. Using simulation mode.")

    def send_sms(self, to_number, message):
        """
        Send SMS to phone number
        
        Args:
            to_number: Phone number with country code (e.g., '+919876543210')
            message: Text message to send
        
        Returns:
            dict: Status and message_sid
        """
        if not self.client:
            return self._simulate_sms(to_number, message)
        
        try:
            message_obj = self.client.messages.create(
                body=message,
                from_=self.twilio_phone,
                to=to_number
            )
            return {
                'success': True,
                'message_sid': message_obj.sid,
                'status': message_obj.status
            }
        except Exception as e:
            print(f"❌ SMS Error: {str(e)}")
            return {'success': False, 'error': str(e)}

    def send_whatsapp(self, to_number, message):
        """
        Send WhatsApp message
        
        Args:
            to_number: Phone number with country code (e.g., '+919876543210')
            message: Text message to send
        
        Returns:
            dict: Status and message_sid
        """
        if not self.client:
            return self._simulate_whatsapp(to_number, message)
        
        try:
            # WhatsApp requires 'whatsapp:' prefix
            if not to_number.startswith('whatsapp:'):
                to_number = f'whatsapp:{to_number}'
            
            message_obj = self.client.messages.create(
                body=message,
                from_=self.whatsapp_from,  # e.g., 'whatsapp:+14155238886'
                to=to_number
            )
            return {
                'success': True,
                'message_sid': message_obj.sid,
                'status': message_obj.status
            }
        except Exception as e:
            print(f"❌ WhatsApp Error: {str(e)}")
            return {'success': False, 'error': str(e)}

    def send_emergency_alert(self, emergency):
        """
        Send SMS & WhatsApp alerts for new emergency
        
        Args:
            emergency: Emergency object from database
        """
        # SMS to patient/caller
        patient_message = f"""
🚑 SMART AMBULANCE ALERT

Emergency Confirmed!
Patient: {emergency.patient_name}
Type: {emergency.emergency_type}
Severity: {emergency.severity.upper()}

Ambulance Assigned: {emergency.ambulance.vehicle_number if emergency.ambulance else 'Pending'}
Driver: {emergency.ambulance.driver_name if emergency.ambulance else 'N/A'}
Driver Phone: {emergency.ambulance.driver_phone if emergency.ambulance else 'N/A'}

Hospital: {emergency.assigned_hospital.name if emergency.assigned_hospital else 'Finding...'}

Stay calm. Help is on the way!
Emergency ID: #{emergency.id}
        """.strip()
        
        # Format phone number (add +91 if not present)
        patient_phone = emergency.patient_phone
        if not patient_phone.startswith('+'):
            patient_phone = f'+91{patient_phone}'
        
        # Send SMS to patient
        sms_result = self.send_sms(patient_phone, patient_message)
        print(f"📱 SMS to patient: {sms_result}")
        
        # Send WhatsApp to patient
        whatsapp_result = self.send_whatsapp(patient_phone, patient_message)
        print(f"💬 WhatsApp to patient: {whatsapp_result}")
        
        # Hospital notification
        if emergency.assigned_hospital:
            hospital_message = f"""
🏥 NEW EMERGENCY INCOMING

Patient: {emergency.patient_name}
Age: {emergency.patient_age} | Gender: {emergency.patient_gender}
Emergency Type: {emergency.emergency_type}
Severity: {emergency.severity.upper()}

Ambulance: {emergency.ambulance.vehicle_number if emergency.ambulance else 'Pending'}
ETA: Calculating...

Address: {emergency.pickup_address}
Contact: {emergency.patient_phone}

Emergency ID: #{emergency.id}
Status: {emergency.status.upper()}

⚠️ Please prepare emergency room!
            """.strip()
            
            hospital_phone = emergency.assigned_hospital.phone
            if not hospital_phone.startswith('+'):
                hospital_phone = f'+91{hospital_phone}'
            
            hospital_sms = self.send_sms(hospital_phone, hospital_message)
            print(f"📱 SMS to hospital: {hospital_sms}")

    def send_journey_started(self, emergency):
        """Notify when ambulance journey starts"""
        message = f"""
🚑 AMBULANCE ON THE WAY!

Emergency ID: #{emergency.id}
Patient: {emergency.patient_name}

Ambulance {emergency.ambulance.vehicle_number} has started journey.
Driver: {emergency.ambulance.driver_name}

Track live location on dashboard.
Help arriving soon!
        """.strip()
        
        patient_phone = emergency.patient_phone
        if not patient_phone.startswith('+'):
            patient_phone = f'+91{patient_phone}'
        
        self.send_sms(patient_phone, message)
        self.send_whatsapp(patient_phone, message)

    def send_arrival_alert(self, emergency):
        """Notify when ambulance arrives"""
        message = f"""
✅ AMBULANCE ARRIVED!

Emergency ID: #{emergency.id}
Patient: {emergency.patient_name}

Ambulance has reached your location.
Please cooperate with medical team.

Hospital: {emergency.assigned_hospital.name if emergency.assigned_hospital else 'N/A'}
        """.strip()
        
        patient_phone = emergency.patient_phone
        if not patient_phone.startswith('+'):
            patient_phone = f'+91{patient_phone}'
        
        self.send_sms(patient_phone, message)
        self.send_whatsapp(patient_phone, message)

    # Simulation methods for demo/testing
    def _simulate_sms(self, to_number, message):
        """Simulate SMS sending for demo"""
        print(f"""
╔═══════════════════════════════════════╗
║       📱 SIMULATED SMS SENT           ║
╠═══════════════════════════════════════╣
║ To: {to_number:<30} ║
║ Message:                              ║
║ {message[:35]:<35} ║
╚═══════════════════════════════════════╝
        """)
        return {
            'success': True,
            'message_sid': 'SIM' + str(hash(message))[:10],
            'status': 'simulated'
        }

    def _simulate_whatsapp(self, to_number, message):
        """Simulate WhatsApp sending for demo"""
        print(f"""
╔═══════════════════════════════════════╗
║      💬 SIMULATED WHATSAPP SENT       ║
╠═══════════════════════════════════════╣
║ To: {to_number:<30} ║
║ Message:                              ║
║ {message[:35]:<35} ║
╚═══════════════════════════════════════╝
        """)
        return {
            'success': True,
            'message_sid': 'WSIM' + str(hash(message))[:10],
            'status': 'simulated'
        }


# Singleton instance
notification_service = NotificationService()
