SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
SMART AMBULANCE ROUTE OPTIMIZATION & EMERGENCY NOTIFICATION SYSTEM
________________________________________
Document Version: 1.0
Project Report on 
Smart Ambulance Route 
Optimization & Emergency Notifacation 
in  
Submitted as a partial fulfillment of the requirements for the award of the degree 
of 
Bachelor of Technology 
in 
Computer Science & Engineering  
Submitted By 
	Name: Uvesh 	 	 	 	 	        Roll No. 2202200100123  
	Name: Sunny Mishra    	 	 	        Roll No.2102200100105 
	Name: Vandana Sharma 	 	 	        Roll No. 2202200100124 
 
Under the Guidance of Asst. Prof. Ram Singh 

________________________________________
TABLE OF CONTENTS
1.	Introduction 1.1 Purpose 1.2 Scope 1.3 Definitions, Acronyms, and Abbreviations 1.4 References 1.5 Overview
2.	Overall Description 2.1 Product Perspective 2.2 Product Functions 2.3 User Characteristics 2.4 Constraints 2.5 Assumptions and Dependencies
3.	Specific Requirements 3.1 Functional Requirements 3.2 Non-Functional Requirements 3.3 Interface Requirements 3.4 Performance Requirements 3.5 Security Requirements
4.	System Features 4.1 Emergency Request Management 4.2 Ambulance Assignment 4.3 Real-time Tracking 4.4 Notification System 4.5 Analytics Dashboard
5.	External Interface Requirements 5.1 User Interfaces 5.2 Hardware Interfaces 5.3 Software Interfaces 5.4 Communication Interfaces
6.	System Models 6.1 Use Case Diagrams 6.2 Data Flow Diagrams 6.3 Entity Relationship Diagram
7.	Appendices 7.1 Technology Stack 7.2 API Documentation 7.3 Database Schema
________________________________________
1. INTRODUCTION
1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a comprehensive description of the Smart Ambulance Route Optimization & Emergency Notification System. This document specifies the functional and non-functional requirements, system architecture, and interfaces of the proposed system. It is intended for stakeholders including developers, project supervisors, end-users, and future maintenance teams.
1.2 Scope
The Smart Ambulance Route Optimization System is a web-based application designed to revolutionize emergency medical services through intelligent automation and real-time tracking. The system aims to reduce emergency response times by 40-50% through automated ambulance dispatch, route optimization, and instant hospital notifications.
Key Capabilities:
•	Automated ambulance assignment using proximity-based algorithms
•	Real-time GPS tracking of ambulances
•	Instant hospital notifications with patient details
•	Voice-activated emergency management
•	QR code generation for family tracking
•	Comprehensive analytics dashboard
•	PDF report generation
•	SMS/WhatsApp notification integration
Benefits:
•	Faster emergency response (reduced from 15 to 8 minutes average)
•	Improved patient outcomes through advance hospital preparation
•	Better resource utilization and coordination
•	Enhanced communication between all stakeholders
•	Data-driven decision making through analytics
1.3 Definitions, Acronyms, and Abbreviations
API - Application Programming Interface
GPS - Global Positioning System
REST - Representational State Transfer
SRS - Software Requirements Specification
UI - User Interface
UX - User Experience
CRUD - Create, Read, Update, Delete
SMS - Short Message Service
QR - Quick Response (code)
PDF - Portable Document Format
ETA - Estimated Time of Arrival
CORS - Cross-Origin Resource Sharing
JSON - JavaScript Object Notation
1.4 References
1.	IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
2.	Django Documentation (https://docs.djangoproject.com/)
3.	React.js Documentation (https://react.dev/)
4.	RESTful API Design Guidelines
5.	Web Speech API Specification
1.5 Overview
This SRS document is organized into seven major sections. Section 2 provides an overall description of the system including product perspective, functions, and user characteristics. Section 3 details specific functional and non-functional requirements. Section 4 describes individual system features. Section 5 outlines external interface requirements. Section 6 presents system models and diagrams. Section 7 contains appendices with technical details.
________________________________________
2. OVERALL DESCRIPTION
2.1 Product Perspective
The Smart Ambulance Route Optimization System is an independent, self-contained web application that operates within the emergency medical services ecosystem. The system interfaces with:
External Systems:
•	GPS/Location Services for real-time tracking
•	SMS/WhatsApp Gateway (Twilio) for notifications
•	Web browsers for user interface delivery
•	OpenStreetMap for mapping services
System Context: The application serves as a central coordination platform connecting patients, ambulance services, and hospitals. It operates independently but can integrate with existing hospital management systems through its RESTful API architecture.
2.2 Product Functions
Primary Functions:
1.	Emergency Request Management
o	Create emergency requests via form or Quick SOS button
o	Capture patient details and location
o	Automatic validation and processing
2.	Intelligent Ambulance Assignment
o	Calculate distances using Haversine algorithm
o	Select nearest available ambulance automatically
o	Update ambulance status in real-time
3.	Real-time GPS Tracking
o	Display ambulance locations on interactive maps
o	Show route from current location to patient to hospital
o	Calculate and display ETA
4.	Hospital Notification System
o	Send instant alerts to assigned hospitals
o	Provide complete patient and emergency details
o	Enable hospital preparation before patient arrival
5.	Voice Command Interface
o	Accept spoken commands for navigation
o	Hands-free emergency creation
o	Voice-activated dashboard controls
6.	QR Code Generation
o	Generate unique QR codes per emergency
o	Enable family tracking without app installation
o	Shareable via WhatsApp/SMS
7.	Analytics & Reporting
o	Performance metrics dashboard
o	Trend analysis and charts
o	PDF report generation
2.3 User Characteristics
User Categories:
1.	Emergency Callers/Patients
o	Technical Expertise: Basic smartphone/computer usage
o	Responsibilities: Report emergencies, provide accurate information
o	Access: Web interface (desktop/mobile)
2.	Hospital Staff
o	Technical Expertise: Moderate computer proficiency
o	Responsibilities: Receive notifications, prepare for incoming patients
o	Access: Web dashboard, email/SMS notifications
3.	Ambulance Drivers/Paramedics
o	Technical Expertise: Basic to moderate
o	Responsibilities: Respond to assignments, update location
o	Access: Mobile web interface
4.	System Administrators
o	Technical Expertise: High (IT professionals)
o	Responsibilities: Manage hospitals, ambulances, monitor system
o	Access: Admin panel, full system access
5.	Family Members
o	Technical Expertise: Basic smartphone usage
o	Responsibilities: Track ambulance via QR code
o	Access: Mobile web interface (via QR scan)
2.4 Constraints
Technical Constraints:
•	Must support modern web browsers (Chrome, Firefox, Safari, Edge)
•	Requires stable internet connectivity for real-time features
•	GPS accuracy dependent on device capabilities
•	SMS delivery dependent on Twilio service availability
Regulatory Constraints:
•	Must comply with data protection regulations
•	Patient information must be handled securely
•	System must maintain audit trails for emergencies
Business Constraints:
•	Development completed within academic timeline
•	Limited budget for third-party services
•	SMS/WhatsApp in simulation mode for demonstration
Implementation Constraints:
•	Built using open-source technologies
•	Deployed on local development servers for demonstration
•	Database limited to SQLite for portability
2.5 Assumptions and Dependencies
Assumptions:
•	Users have access to internet-enabled devices
•	GPS services are available and accurate
•	Ambulances are equipped with GPS-enabled devices
•	Hospitals have staff monitoring notification systems
•	Emergency phone numbers are valid and reachable
Dependencies:
•	Django framework and Python runtime
•	Node.js and React.js libraries
•	OpenStreetMap/Leaflet.js for mapping
•	Web Speech API browser support
•	Twilio API for messaging (optional)
•	Modern web browser with JavaScript enabled
________________________________________
3. SPECIFIC REQUIREMENTS
3.1 Functional Requirements
FR-1: Emergency Request Management
FR-1.1: System shall allow users to create emergency requests via form
•	Input: Patient details, location, emergency type, severity
•	Output: Emergency ID, confirmation message
•	Processing: Validation, database storage, ambulance assignment trigger
FR-1.2: System shall provide Quick SOS button for instant emergencies
•	Input: GPS location (automatic)
•	Output: Emergency created with minimal information
•	Processing: Auto-fill default values, immediate ambulance dispatch
FR-1.3: System shall validate all emergency request inputs
•	Patient name: Required, minimum 2 characters
•	Age: Required, 1-120 range
•	Phone: Required, valid format
•	Location: Required, valid GPS coordinates
FR-1.4: System shall support voice-activated emergency creation
•	Input: Voice command "create emergency"
•	Output: Emergency form displayed
•	Processing: Web Speech API recognition
FR-2: Ambulance Assignment
FR-2.1: System shall automatically assign nearest available ambulance
•	Input: Patient location, ambulance locations
•	Algorithm: Haversine formula for distance calculation
•	Output: Assigned ambulance ID, status update
FR-2.2: System shall calculate distance between all available ambulances and patient
•	Formula: d = 2r × arcsin(√(sin²((φ₂-φ₁)/2) + cos(φ₁)cos(φ₂)sin²((λ₂-λ₁)/2)))
•	Output: Distance in kilometers for each ambulance
FR-2.3: System shall update ambulance status automatically
•	Available → On Duty (when assigned)
•	On Duty → Available (when emergency completed)
FR-2.4: System shall assign nearest hospital to emergency
•	Same Haversine algorithm applied
•	Consider hospital bed availability
•	Update hospital in emergency record
FR-3: Real-time Tracking
FR-3.1: System shall display ambulance locations on interactive map
•	Technology: Leaflet.js with OpenStreetMap
•	Update frequency: Every 5 seconds
•	Display: Markers with ambulance details
FR-3.2: System shall show route from ambulance to patient to hospital
•	Polylines connecting locations
•	Route distance and ETA calculation
•	Color-coded by emergency severity
FR-3.3: System shall support route simulation for demonstration
•	Interpolate positions along route
•	Update at realistic intervals
•	Show progressive movement
FR-3.4: System shall calculate and display ETA
•	Formula: ETA = (distance / average_speed) × 60 minutes
•	Average speed: 40 km/h (city traffic)
•	Update as ambulance moves
FR-4: Notification System
FR-4.1: System shall send notifications to assigned hospitals
•	Trigger: When ambulance assigned
•	Content: Patient details, emergency type, ETA
•	Channel: API call, SMS (simulation), Email
FR-4.2: System shall generate QR codes for each emergency
•	Unique URL per emergency
•	Contains emergency ID
•	Scannable by any smartphone camera
FR-4.3: System shall support manual hospital notifications
•	Button click triggers notification
•	Confirmation toast displayed
•	Backend logs notification event
FR-4.4: System shall track notification delivery status
•	Sent timestamp
•	Read/Unread status
•	Failed delivery alerts
FR-5: Voice Commands
FR-5.1: System shall recognize predefined voice commands
•	"Create emergency" → Open emergency form
•	"Show dashboard" → Navigate to dashboard
•	"Show analytics" → Open analytics page
•	"Go home" → Return to home page
•	"Help" → Display command list
FR-5.2: System shall provide voice command help
•	"Help me" → Open detailed voice guide
•	List all available commands
•	Show usage examples
FR-5.3: System shall store voice command history
•	LocalStorage persistence
•	Command timestamp
•	Success/failure status
FR-6: Analytics Dashboard
FR-6.1: System shall display key performance metrics
•	Total emergencies count
•	Average response time
•	Success rate percentage
•	Active ambulances count
FR-6.2: System shall generate trend charts
•	7-day emergency trend (bar chart)
•	Severity distribution (horizontal bars)
•	Status breakdown (horizontal bars)
•	Emergency type distribution (cards with progress)
FR-6.3: System shall calculate performance statistics
•	Response time: (completed_at - created_at) in minutes
•	Success rate: (completed / total) × 100
•	Real-time data updates
FR-7: Report Generation
FR-7.1: System shall generate PDF reports for emergencies
•	Include patient details, emergency timeline
•	Ambulance and hospital information
•	Route tracking data
•	Professional formatting with logo
FR-7.2: System shall provide download functionality
•	One-click download button
•	Filename: Emergency-{id}-Report.pdf
•	Automatic browser download
FR-8: User Authentication (Admin)
FR-8.1: System shall provide secure admin login
•	Username/password authentication
•	Session management
•	CSRF protection
FR-8.2: System shall provide admin dashboard
•	Manage hospitals (CRUD operations)
•	Manage ambulances (CRUD operations)
•	View all emergencies
•	System configuration
3.2 Non-Functional Requirements
NFR-1: Performance
NFR-1.1: System shall respond to API requests within 200ms NFR-1.2: Emergency creation shall complete within 2 seconds NFR-1.3: Dashboard shall load within 3 seconds NFR-1.4: Map rendering shall complete within 2 seconds NFR-1.5: System shall support 100+ concurrent users
NFR-2: Reliability
NFR-2.1: System uptime shall be 99.5% NFR-2.2: Database shall maintain data integrity NFR-2.3: System shall handle network interruptions gracefully NFR-2.4: Failed notifications shall be logged for retry
NFR-3: Usability
NFR-3.1: Interface shall be intuitive requiring no training NFR-3.2: Emergency creation shall be completable in under 1 minute NFR-3.3: Quick SOS shall work in under 10 seconds NFR-3.4: Voice commands shall have 90%+ recognition accuracy NFR-3.5: System shall be accessible on mobile devices
NFR-4: Scalability
NFR-4.1: System shall support addition of unlimited hospitals NFR-4.2: System shall support addition of unlimited ambulances NFR-4.3: System shall handle 500+ emergencies per day NFR-4.4: Database shall scale to millions of records
NFR-5: Maintainability
NFR-5.1: Code shall follow PEP 8 (Python) and Airbnb (JavaScript) style guides NFR-5.2: System shall have comprehensive documentation NFR-5.3: API endpoints shall be RESTful and well-documented NFR-5.4: Database schema shall be normalized (3NF)
NFR-6: Security
NFR-6.1: All API communications shall use HTTPS (production) NFR-6.2: User passwords shall be hashed (PBKDF2) NFR-6.3: System shall implement CSRF protection NFR-6.4: Patient data shall be protected per privacy regulations NFR-6.5: SQL injection prevention via ORM
NFR-7: Compatibility
NFR-7.1: System shall work on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ NFR-7.2: System shall be responsive (desktop, tablet, mobile) NFR-7.3: Voice commands shall work on browsers supporting Web Speech API NFR-7.4: System shall work on Windows, Linux, macOS
3.3 Interface Requirements
User Interface Requirements:
•	Clean, modern design with gradient themes
•	Responsive layout (Bootstrap-style grid)
•	Intuitive navigation with clear call-to-action buttons
•	Real-time updates without page refresh
•	Toast notifications for user feedback
•	Loading indicators for async operations
•	Error messages displayed inline
•	Accessibility features (ARIA labels, keyboard navigation)
Hardware Interface Requirements:
•	GPS receiver (smartphone/tablet built-in)
•	Microphone (for voice commands)
•	Camera (for QR code scanning)
•	Internet connectivity (WiFi/Mobile data)
•	Minimum screen resolution: 320×568 (mobile)
Software Interface Requirements:
•	Operating System: Any modern OS with web browser
•	Web Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
•	JavaScript: ES6+ support required
•	LocalStorage: For voice command history
•	Geolocation API: For GPS features
3.4 Performance Requirements
Response Time:
•	API calls: < 200ms average
•	Page load: < 3 seconds
•	Map rendering: < 2 seconds
•	Emergency creation: < 2 seconds
•	Voice command processing: < 1 second
Throughput:
•	100+ concurrent users
•	500+ emergency requests per day
•	50+ ambulances tracked simultaneously
Resource Usage:
•	Backend memory: < 512 MB
•	Frontend memory: < 100 MB per session
•	Database size: < 100 MB per year
3.5 Security Requirements
Authentication:
•	Admin panel requires username/password
•	Session timeout: 30 minutes of inactivity
•	Password minimum length: 8 characters
Authorization:
•	Role-based access control (Admin vs. User)
•	Admin-only access to CRUD operations
•	Public access to emergency creation
Data Protection:
•	Patient data encrypted in transit (HTTPS)
•	Passwords hashed using PBKDF2
•	SQL injection prevention via Django ORM
•	XSS prevention via React escaping
Audit Trail:
•	All emergency creations logged with timestamp
•	Ambulance status changes logged
•	Notification events tracked
•	Admin actions recorded
________________________________________
4. SYSTEM FEATURES
4.1 Emergency Request Management
Description: Core feature allowing users to report emergencies through a web form or Quick SOS button. System captures patient details, emergency type, severity, and GPS location.
Functional Requirements:
•	FR-1.1, FR-1.2, FR-1.3, FR-1.4 (as defined in Section 3.1)
Priority: Critical
Inputs:
•	Patient name, age, gender, phone number
•	Emergency type (Heart Attack, Road Accident, Stroke, etc.)
•	Severity level (Low, Medium, High, Critical)
•	Description of emergency
•	Pickup address and GPS coordinates
Processing:
•	Input validation (required fields, format checks)
•	GPS coordinate validation
•	Database insertion
•	Trigger ambulance assignment algorithm
Outputs:
•	Emergency ID (unique identifier)
•	Confirmation message
•	Ambulance assignment notification
•	Hospital notification trigger
Error Handling:
•	Invalid inputs: Display error messages
•	GPS unavailable: Prompt manual entry
•	Database error: Retry with exponential backoff
•	Network failure: Queue request for retry
4.2 Ambulance Assignment
Description: Automated selection of the nearest available ambulance using the Haversine distance formula. System calculates distances to all available ambulances and assigns the closest one.
Functional Requirements:
•	FR-2.1, FR-2.2, FR-2.3, FR-2.4
Priority: Critical
Algorithm:
FOR each available ambulance:
    distance = haversine(patient_location, ambulance_location)
    store distance with ambulance_id
END FOR

selected_ambulance = ambulance with minimum distance
UPDATE ambulance SET status='on_duty'
UPDATE emergency SET ambulance_id=selected_ambulance
RETURN selected_ambulance
Haversine Formula:
a = sin²(Δφ/2) + cos φ₁ × cos φ₂ × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c

where:
φ = latitude in radians
λ = longitude in radians
R = Earth's radius (6,371 km)
Performance:
•	Calculation time: < 100ms for 100 ambulances
•	Accuracy: ±50 meters
4.3 Real-time Tracking
Description: Live GPS tracking of ambulances displayed on interactive maps using Leaflet.js and OpenStreetMap. Shows current location, route, and ETA.
Functional Requirements:
•	FR-3.1, FR-3.2, FR-3.3, FR-3.4
Priority: High
Components:
•	Map display: Leaflet.js with OpenStreetMap tiles
•	Markers: Custom ambulance icons with popups
•	Polylines: Route visualization
•	ETA calculation: Distance/speed formula
Update Mechanism:
•	Polling interval: 5 seconds
•	WebSocket (future enhancement)
•	Optimistic UI updates
4.4 Notification System
Description: Automated and manual notifications to hospitals with complete emergency details. Supports QR code generation for family tracking.
Functional Requirements:
•	FR-4.1, FR-4.2, FR-4.3, FR-4.4
Priority: High
Notification Channels:
•	In-app: API call to hospital dashboard
•	SMS: Twilio integration (simulation mode)
•	WhatsApp: Twilio integration (simulation mode)
•	QR Code: Unique URL generation
Message Template:
🚨 EMERGENCY ALERT
Emergency ID: #{id}
Patient: {name}, {age}Y, {gender}
Type: {emergency_type}
Severity: {severity}
Ambulance: {vehicle_number}
ETA: {estimated_time}
Location: {address}
4.5 Analytics Dashboard
Description: Comprehensive performance metrics and visualizations showing emergency trends, response times, success rates, and system utilization.
Functional Requirements:
•	FR-6.1, FR-6.2, FR-6.3
Priority: Medium
Metrics:
•	Total emergencies: COUNT(*)
•	Average response time: AVG(completed_at - created_at)
•	Success rate: (COUNT(status='completed') / COUNT(*)) × 100
•	Active ambulances: COUNT(status='on_duty')
Visualizations:
•	Bar chart: 7-day trend
•	Horizontal bars: Severity distribution
•	Horizontal bars: Status breakdown
•	Cards with progress: Emergency types
Data Refresh:
•	Real-time: On page load
•	Auto-refresh: Every 30 seconds (optional)
________________________________________
5. EXTERNAL INTERFACE REQUIREMENTS
5.1 User Interfaces
Home Page:
•	Header with navigation (Home, Dashboard, Analytics, Voice Command)
•	Quick SOS button (prominent, red, circular)
•	Emergency request form (patient details, location)
•	Feature cards (Route Optimization, Real-time Tracking, Hospital Notification, Quick Response)
Dashboard Page:
•	Emergency list (left panel, scrollable)
•	Interactive map (right panel, full height)
•	Emergency details display on selection
•	Action buttons (Notify Hospital, QR Code, Download PDF, Simulate Movement)
•	Real-time status updates
Analytics Page:
•	Key metrics cards (4 cards at top)
•	Trend chart (full width)
•	Severity and status charts (side by side)
•	Emergency types grid
•	Performance metrics summary
Color Scheme:
•	Primary: Purple gradient (#667eea to #764ba2)
•	Secondary: Blue gradient (#4facfe to #00f2fe)
•	Success: Green (#28a745)
•	Warning: Yellow (#ffc107)
•	Danger: Red (#e74c3c)
•	Background: White (#ffffff)
•	Text: Dark gray (#333333)
5.2 Hardware Interfaces
GPS Receiver:
•	Interface: Geolocation API
•	Accuracy: High accuracy mode enabled
•	Timeout: 5 seconds
•	Error handling: Fallback to manual entry
Microphone:
•	Interface: Web Speech API
•	Language: English (US)
•	Continuous: False
•	Interim results: True
Camera:
•	Interface: Browser native camera access
•	Purpose: QR code scanning
•	Fallback: Manual URL entry
5.3 Software Interfaces
Backend API:
•	Protocol: HTTP/HTTPS
•	Format: JSON
•	Base URL: http://localhost:8000/api/
•	Authentication: Session-based (admin), None (public endpoints)
Mapping Service:
•	Provider: OpenStreetMap
•	Library: Leaflet.js 1.9.4
•	Tile Server: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
Notification Service:
•	Provider: Twilio
•	API Version: 2010-04-01
•	Endpoints: SMS, WhatsApp
•	Mode: Simulation (development)
QR Code Service:
•	Provider: QRServer.com
•	API: https://api.qrserver.com/v1/create-qr-code/
•	Parameters: size=300x300, data={url}
5.4 Communication Interfaces
HTTP/HTTPS:
•	RESTful API design
•	Methods: GET, POST, PUT, DELETE
•	Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
•	Headers: Content-Type: application/json, CORS headers
WebSocket (Future):
•	For real-time ambulance location updates
•	Reduces polling overhead
•	Improves scalability
________________________________________
6. SYSTEM MODELS
6.1 Use Case Diagrams
Primary Actors:
•	Patient/Caller
•	Hospital Staff
•	Ambulance Driver
•	System Administrator
Use Cases:
1.	Create Emergency
o	Actor: Patient/Caller
o	Precondition: User has internet access
o	Flow: Enter details → Submit → System assigns ambulance → Notification sent
o	Postcondition: Emergency created, ambulance dispatched
2.	Track Ambulance
o	Actor: Patient/Family
o	Precondition: Emergency created, QR code available
o	Flow: Scan QR → View map → See ambulance location → View ETA
o	Postcondition: Real-time location visible
3.	Receive Notification
o	Actor: Hospital Staff
o	Precondition: Emergency assigned to hospital
o	Flow: Notification received → View details → Prepare emergency room
o	Postcondition: Hospital prepared
4.	Manage System
o	Actor: Administrator
o	Precondition: Admin logged in
o	Flow: Access admin panel → Manage hospitals/ambulances → View reports
o	Postcondition: System configured
6.2 Data Flow Diagrams
Level 0 DFD (Context Diagram):
[Patient] --Emergency Request--> [Smart Ambulance System] --Ambulance Assignment--> [Ambulance]
                                         |
                                         v
                            Hospital Notification
                                         |
                                         v
                                    [Hospital]
Level 1 DFD:
[Patient] --> [Emergency Management] --> [Database]
                      |
                      v
            [Ambulance Assignment] --> [Haversine Algorithm]
                      |
                      v
            [Notification System] --> [SMS/WhatsApp Gateway]
                      |
                      v
            [Tracking System] --> [GPS Service]
6.3 Entity Relationship Diagram
Entities and Relationships:
Hospital (1) ----< (M) Emergency
  |
  - id (PK)
  - name
  - address
  - latitude
  - longitude
  - phone
  - beds_available

Ambulance (1) ----< (M) Emergency
  |
  - id (PK)
  - vehicle_number (UNIQUE)
  - driver_name
  - driver_phone
  - status
  - current_latitude
  - current_longitude

Emergency (1) ----< (M) RouteTracking
  |                (1) ----< (M) Notification
  - id (PK)
  - patient_name
  - patient_age
  - emergency_type
  - severity
  - status
  - pickup_latitude
  - pickup_longitude
  - ambulance_id (FK)
  - hospital_id (FK)

RouteTracking
  |
  - id (PK)
  - emergency_id (FK)
  - current_latitude
  - current_longitude
  - distance_remaining
  - timestamp

Notification
  |
  - id (PK)
  - emergency_id (FK)
  - hospital_id (FK)
  - message
  - is_read
  - created_at
Cardinality:
•	One Hospital can have Many Emergencies
•	One Ambulance can handle Many Emergencies (over time)
•	One Emergency has One Ambulance (at a time)
•	One Emergency has One Hospital
•	One Emergency has Many RouteTracking records
•	One Emergency has Many Notifications
________________________________________
7. APPENDICES
7.1 Technology Stack
Backend:
•	Language: Python 3.8+
•	Framework: Django 4.2.7
•	API: Django REST Framework 3.14.0
•	Database: SQLite 3 (Development), PostgreSQL (Production)
•	CORS: django-cors-headers 4.3.1
•	Messaging: Twilio 8.10.0
Frontend:
•	Library: React.js 18.2.0
•	Routing: React Router DOM 6.20.0
•	HTTP Client: Axios 1.6.2
•	Maps: Leaflet.js 1.9.4, React-Leaflet
•	PDF: jsPDF 2.5.1
•	Notifications: React-Toastify
•	Voice: Web Speech API (Browser native)
Development Tools:
•	Version Control: Git
•	Code Editor: VS Code
•	API Testing: Postman
•	Browser DevTools: Chrome DevTools
7.2 API Documentation
Base URL: http://localhost:8000/api/
Endpoints:
1.	GET /hospitals/
o	Description: List all hospitals
o	Response: Array of hospital objects
o	Status: 200 OK
2.	GET /ambulances/
o	Description: List all ambulances
o	Response: Array of ambulance objects
o	Status: 200 OK
3.	POST /emergencies/
o	Description: Create new emergency
o	Request Body: Emergency object
o	Response: Created emergency with ID
o	Status: 201 Created
4.	GET /emergencies/
o	Description: List all emergencies
o	Response: Array of emergency objects
o	Status: 200 OK
5.	POST /ambulances/{id}/update_location/
o	Description: Update ambulance GPS location
o	Request Body: {latitude, longitude}
o	Response: Updated ambulance object
o	Status: 200 OK
6.	GET /route-tracking/by_emergency/?emergency_id={id}
o	Description: Get route tracking for emergency
o	Response: Array of route tracking points
o	Status: 200 OK
7.	POST /notifications/send-hospital-alert/
o	Description: Send notification to hospital
o	Request Body: Notification details
o	Response: Success confirmation
o	Status: 200 OK
7.3 Database Schema
Table: api_hospital
CREATE TABLE api_hospital (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(254),
    emergency_beds_available INTEGER DEFAULT 0,
    icu_beds_available INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
Table: api_ambulance
CREATE TABLE api_ambulance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    ambulance_type VARCHAR(20) DEFAULT 'basic',
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    paramedic_name VARCHAR(100),
    paramedic_phone VARCHAR(20),
    current_latitude DECIMAL(9,6),
    current_longitude DECIMAL(9,6),
    status VARCHAR(20) DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
Table: api_emergency
CREATE TABLE api_emergency (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name VARCHAR(100) NOT NULL,
    patient_age INTEGER NOT NULL,
    patient_gender VARCHAR(10) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    emergency_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    description TEXT,
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(9,6) NOT NULL,
    pickup_longitude DECIMAL(9,6) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    ambulance_id INTEGER REFERENCES api_ambulance(id),
    assigned_hospital_id INTEGER REFERENCES api_hospital(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);
Table: api_routetracking
CREATE TABLE api_routetracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emergency_id INTEGER REFERENCES api_emergency(id),
    current_latitude DECIMAL(9,6) NOT NULL,
    current_longitude DECIMAL(9,6) NOT NULL,
    distance_remaining DECIMAL(10,2),
    estimated_arrival_time DATETIME,
    speed DECIMAL(5,2),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
Table: api_notification
CREATE TABLE api_notification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emergency_id INTEGER REFERENCES api_emergency(id),
    hospital_id INTEGER REFERENCES api_hospital(id),
    notification_type VARCHAR(50),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
________________________________________
CONCLUSION
This Software Requirements Specification document provides a comprehensive description of the Smart Ambulance Route Optimization & Emergency Notification System. The system addresses critical needs in emergency medical services through intelligent automation, real-time tracking, and effective communication.
Key achievements of this specification include:
•	Clear definition of functional and non-functional requirements
•	Detailed description of system features and capabilities
•	Comprehensive interface specifications
•	Well-defined system models and database schema
The proposed system demonstrates practical application of:
•	Full-stack web development (Django + React)
•	Algorithm implementation (Haversine formula)
•	Real-time systems and GPS tracking
•	Third-party API integration
•	Data visualization and analytics
•	Voice recognition technology
This SRS serves as the foundation for development, testing, and maintenance of the system, ensuring all stakeholders have a clear understanding of system requirements and functionality.
________________________________________


