# Smart Traffic Management System Frontend Requirements Document

## 1. Website Name
Smart Traffic Management System (智能交通管理系统)\n
## 2. Website Description
An AI-driven intelligent traffic management system frontend application built with free and open-source technologies. It supports real-time vehicle detection with DeepSORT tracking, adaptive traffic signal control using Webster's Method, geofencing-based violation detection, and traffic flow simulation visualization using OpenStreetMap and Leaflet.js. The system provides intuitive data display and operation interfaces for traffic management personnel and general users.

## 3. Core Functional Modules

### 3.1 User Authentication & Login Module
- **Login Page**: Secure login interface for administrators and general users
- **Authentication Methods**:
  - Email/Username + Password login
  - OSS Google Login integration for quick access
  - Remember me option with secure token storage
- **Role-based Access**: Automatic role detection and permission assignment upon login
- **Session Management**: Secure session handling with auto-logout after inactivity
- **Password Recovery**: Forgot password functionality with email verification
- **Account Security**: Failed login attempt tracking and temporary account lockout
- **Login Activity Log**: Track all login attempts with timestamp and IP address
\n### 3.2 Enhanced YOLO + DeepSORT Vehicle Detection Module
- **Video Upload**: Support users to upload traffic video files\n- **Real-time Monitoring Access**: Support connection to live CCTV traffic monitoring streams
- **DeepSORT Tracking**: Implement DeepSORT algorithm to assign unique IDs to each detected vehicle, preventing double-counting across frames
- **Vehicle Classification**: Categorize vehicles into three classes:\n  - Heavy (Bus/Truck)
  - Medium (Car)
  - Light (Bike/Motorcycle)
- **PCU Calculation**: Calculate Passenger Car Units (PCU) based on vehicle classification for accurate traffic density measurement
- **Statistical Data Panel**: Display vehicle count, type distribution, and PCU metrics for each intersection or road segment
- **Multi-camera View**: Support simultaneous display of multiple camera feeds in grid layout
- **Tracking Visualization**: Display vehicle trajectories with unique ID labels on video overlay
\n### 3.3 Traffic Flow Visualization Module with OpenStreetMap
- **Map Framework**: Leaflet.js with OpenStreetMap tiles as base layer
- **Map Style**: CartoDB Dark Matter tiles for high-contrast control room aesthetic
- **Traffic Data Overlay**: TomTom Traffic Flow tile layer integration (API Key configurable)
- **Geospatial Library**: Turf.js for all geospatial calculations and analysis
- **Real-time Dynamic Display**: Show vehicle movement trajectories, signal light status, and congestion conditions on the map
- **Historical Data Playback**: Support viewing historical traffic flow data and simulation replay
- **Heat Map Overlay**: Traffic density heat map based on vehicle detection and TomTom traffic data
- **Custom Markers**: Animated vehicle markers with unique IDs and classification indicators
- **Interactive Controls**: Pan, zoom, layer toggle, and time-based filtering\n\n### 3.4 Adaptive Traffic Signal Control Module (Webster's Method)
- **Webster's Method Implementation**: Adaptive signal timing algorithm based on traffic flow\n- **Cycle Length Calculation**: \n  - Formula: Cycle_Length = (1.5 × Loss_Time + 5) / (1 - Sum_of_Flow_Ratios)
  - Dynamic calculation based on real-time traffic data
- **Adaptive Logic**: \n  - Monitor queue length in each lane
  - If queue length exceeds 10 vehicles, automatically extend Green timer by 10 seconds
  - Recalculate cycle length when traffic patterns change significantly
- **AI Automatic Control Interface**: Display AI-adaptive signal light timing status with Webster's algorithm parameters
- **Manual Control Panel**: Provide operators with manual intervention and signal light adjustment interface (Administrator access only)
- **Mode Switching**: Clear automatic/manual mode toggle buttons (Administrator access only)
- **Real-time Status Display**: Current signal light status, timing plan, queue lengths, and flow ratios
- **Predictive Analytics**: Display predicted optimal timing based on current traffic conditions
- **Control Access Restriction**: All control functions require administrator authentication
\n### 3.5 Geofencing-Based Violation Detection Module
- **Red Light Violation Detection (RLVD)**:
  - Define Stop Line using coordinate array for each intersection
  - Logic: IF Signal == RED AND Vehicle_ID crosses Stop Line THEN trigger alert
  - Record violation timestamp, vehicle ID, and snapshot
- **Wrong Way Detection**:
  - Use Turf.js bearing calculation to compare vehicle direction vs. lane direction
  - Logic: IF angle difference > 160 degrees THEN trigger wrong-way alert
  - Mark wrong-way vehicle on map with distinct color
- **Violation Event List**: Display detected violations with type, location, time, and vehicle ID
- **Video Snapshot Display**: Provide video screenshots for each violation event
- **Violation Dashboard**: Independent violation management page with filtering and detail viewing (Administrator access only for management actions)
- **AI Confidence Score**: Display detection confidence level for each violation
- **Map Location Display**: Show violation locations on OpenStreetMap with custom markers
- **Export Reports**: Generate violation reports in PDF/Excel format with embedded map snapshots (Administrator only)

### 3.6 Enhanced User Permission Management
- **Login System**: Secure authentication system with role-based access control
- **User Roles**:
  - **General Users**: \n    - View-only access to data, reports, and statistical information
    - Access to vehicle detection displays and traffic visualization
    - View violation records (without management capabilities)
    - No access to control functions
  - **Administrators/Operators**: 
    - Full access to all system features
    - Control signal lights and adjust timing parameters
    - Review, manage, and export violation records
    - System configuration and settings management
    - User management capabilities
    - Access to all control panels and administrative tools
- **Permission Matrix**: Clear definition of accessible features per role
- **Activity Logs**: Track all user operations and system changes with user identification
- **User Profile Management**: Allow users to update profile information and change passwords
- **Admin Dashboard**: Dedicated dashboard for administrators showing system health and user activity

### 3.7 Traffic Simulation Module with OpenStreetMap Data
- **Network Topology**: Use OpenStreetMap export data to generate road network (nodes and edges)
- **Simulation Engine**: Traffic flow simulation based on real detection data and historical patterns
- **Time-of-Day Logic**: Simulate traffic density changes based on time periods:\n  - Morning Peak (7:00-9:00)\n  - Midday (9:00-17:00)
  - Evening Peak (17:00-19:00)
  - Night (19:00-7:00)
- **Dynamic Visualization**: Display simulated vehicle movement on Leaflet map\n- **Scenario Testing**: Allow administrators to test different signal timing strategies
- **Predictive Modeling**: Forecast traffic conditions based on historical patterns and current trends
\n### 3.8 Data Analytics & Visualization Module
- **Visualization Library**: Chart.js for all data visualizations
- **Required Charts**:
  - **Peak Hour Heatmap** (Bar Chart): Traffic density per hour (0-23), color-coded by intensity
  - **Violation Types** (Pie Chart): Percentage breakdown of Red Light vs. Wrong Way violations
  - **Vehicle Classification** (Stacked Bar Chart): Distribution of Heavy/Medium/Light vehicles over time
  - **PCU Trends** (Line Chart): Passenger Car Units over time for capacity analysis
  - **Signal Efficiency** (Gauge Chart): Average wait time and throughput metrics
- **Real-time Analysis Panel**:
  - Vehicle count and type distribution
  - Average speed statistics
  - Congestion heat map
  - Historical traffic trend charts
  - Peak hour predictions
- **Interactive Features**: Time range selection, data filtering, and export functionality
- **Customizable Widgets**: Allow users to personalize dashboard layout\n\n### 3.9 Real-time Connectivity Module
- **WebSocket Integration**: Socket.io-client for real-time event streaming
- **Event Listeners**:
  - `traffic_update`: Real-time traffic flow data updates
  - `violation_alert`: Instant violation detection notifications
  - `signal_change`: Signal light status changes
  - `system_alert`: System health and error notifications
- **Auto-reconnection**: Automatic reconnection logic with exponential backoff
- **Data Synchronization**: Ensure all connected clients receive synchronized updates
\n### 3.10 Alert & Notification System
- **Real-time Alerts**: Push notifications for critical events (accidents, severe congestion, violations, system failures)
- **Alert Priority Levels**: Color-coded alerts (red for critical, yellow for warning, blue for info)
- **Alert History**: Searchable log of all past alerts\n- **Custom Alert Rules**: Allow administrators to configure custom alert triggers
- **Role-based Notifications**: Different alert levels for general users vs administrators
- **Sound Notifications**: Optional audio alerts for critical events

## 4. User Interaction Flow

### 4.1 Login & Authentication Flow
- User accesses login page
- User enters credentials (email/username + password) or uses OSS Google Login
- System validates credentials and determines user role
- Upon successful authentication, user is redirected to role-appropriate dashboard
- Failed login attempts are logged and user is notified
- Session is maintained with secure token, auto-logout after 30 minutes of inactivity

### 4.2 Enhanced Vehicle Detection Flow
- User uploads video or selects real-time monitoring source
- System applies YOLO detection + DeepSORT tracking to assign unique vehicle IDs
- Vehicles are classified into Heavy/Medium/Light categories
- System calculates PCU values and displays real-time statistics
- Vehicle trajectories are displayed on OpenStreetMap with unique ID labels
- Alert notifications for unusual traffic patterns\n
### 4.3 Traffic Simulation Visualization Flow
- System loads OpenStreetMap road network topology
- Simulation runs based on real detection data and time-of-day parameters
- Vehicle movement trajectories are displayed on Leaflet map with TomTom traffic overlay
- Real-time update of traffic flow status and signal light timing
- Users can toggle between different time periods and scenarios
\n### 4.4 Adaptive Signal Control Flow (Administrator Only)
- Administrator logs in with valid credentials
- System calculates optimal signal timing using Webster's Method
- Queue lengths are monitored in real-time
- If queue exceeds 10 vehicles, Green timer is automatically extended by 10 seconds
- Interface displays cycle length, flow ratios, and timing adjustments in real-time
- Administrators can manually override automatic control through control panel
- System records all control operations with administrator identification

### 4.5 Violation Detection & Management Flow
- System continuously monitors vehicle positions relative to Stop Lines and lane directions
- Red Light Violation: Triggered when vehicle crosses Stop Line during RED signal
- Wrong Way Detection: Triggered when vehicle bearing differs from lane direction by >160 degrees
- Violation events appear in dashboard with map location (viewable by all users)
- Administrators can view details, video snapshots, and take follow-up actions
- Administrators can generate and export violation reports\n- General users have read-only access to violation list\n
## 5. Page Structure\n
### 5.1 Main Navigation
- Login/Logout\n- Home/Overview
- Vehicle Detection
- Traffic Simulation (OpenStreetMap)
- Signal Control (Administrator only)
- Violation Management
- Data Analytics
- Alerts & Notifications
- User Profile
- System Settings (Administrator only)

### 5.2 Core Pages
- **Login Page**: Clean authentication interface with email/password fields, OSS Google Login button, remember me checkbox, forgot password link, and role-based redirect
- **Home Page**: Key metrics overview, real-time traffic status on OpenStreetMap, quick action shortcuts, role-appropriate feature highlights
- **Vehicle Detection Page**: Video upload/monitoring access area, real-time detection display with DeepSORT tracking, vehicle classification panel, PCU statistics, multi-camera grid view\n- **Traffic Simulation Page**: Leaflet.js interactive map with OpenStreetMap tiles, TomTom traffic overlay, time-of-day simulation controls, scenario testing interface
- **Signal Control Page** (Administrator only): Signal light status display, Webster's Method parameters, queue length monitoring, AI/manual mode toggle, control panel, access restricted message for general users
- **Violation Management Page**: Violation event list with type filters (Red Light/Wrong Way), map location display, detail popup with video snapshot, export options (Administrator only), read-only view for general users
- **Data Analytics Page**: Chart.js visualizations (Peak Hour Heatmap, Violation Types Pie Chart, Vehicle Classification, PCU Trends, Signal Efficiency), data export (Administrator only), customizable widgets
- **Alerts Page**: Real-time alert feed, alert history, custom rule configuration (Administrator only)\n- **User Profile Page**: View and edit profile information, change password, view login history\n- **Admin Dashboard** (Administrator only): System health metrics, user activity logs, permission management, system configuration\n
## 6. Technical Requirements

### 6.1 Frontend Technology Stack
- **Framework**: React or Vue.js
- **Authentication**: JWT token-based authentication with secure storage
- **Map Framework**: Leaflet.js (open-source)\n- **Base Map Tiles**: OpenStreetMap with CartoDB Dark Matter style
- **Traffic Data Overlay**: TomTom Traffic Flow tile layer (API Key configurable)
- **Geospatial Library**: Turf.js for all geospatial calculations (bearing, distance, point-in-polygon, etc.)
- **Chart Library**: Chart.js for data visualization
- **Video Player**: Support multi-format video playback and real-time stream access
- **Responsive Design**: Support desktop and mobile adaptive layout
- **Animation Library**: Framer Motion or GSAP for smooth transitions
- **State Management**: Redux or Vuex for managing user authentication state and permissions

### 6.2 API Integration
- **RESTful API**: Data interaction with backend YOLO + DeepSORT detection service and traffic simulation engine
- **Authentication API**: User login, logout, token refresh, and password recovery endpoints
- **WebSocket**: Socket.io-client for real-time data push (traffic_update, violation_alert, signal_change, system_alert)
- **TomTom Traffic API**: Traffic flow tile layer integration (API Key: ${TOMTOM_API_KEY})
- **OpenStreetMap API**: Road network data export for simulation topology
\n### 6.3 Algorithm Implementation
- **DeepSORT Tracking**: Implement DeepSORT logic for unique vehicle ID assignment and tracking across frames
- **Vehicle Classification**: ML-based classification into Heavy/Medium/Light categories
- **PCU Calculation**: Weighted calculation based on vehicle type (Heavy=3.0, Medium=1.0, Light=0.5)
- **Webster's Method**: Adaptive signal timing algorithm with cycle length calculation
- **Geofencing Logic**: \n  - Stop Line violation detection using coordinate arrays
  - Wrong-way detection using Turf.js bearing comparison
- **Traffic Simulation**: Time-of-day based density modeling using OpenStreetMap network topology
\n### 6.4 Performance Requirements
- Real-time data refresh latency less than 2 seconds
- Support simultaneous display of multiple video streams
- Smooth rendering of large data volume charts
- Optimized Leaflet map rendering for smooth pan and zoom
- Efficient WebSocket connection management
- Fast login response time (less than 1 second)
\n### 6.5 Security Requirements
- HTTPS encryption for all data transmission
- Secure password hashing (bcrypt or similar)
- JWT token expiration and refresh mechanism
- Protection against common vulnerabilities (XSS, CSRF, SQL injection)
- Rate limiting on login attempts
- Secure session management with httpOnly cookies
- Role-based access control enforcement on both frontend and backend

## 7. Enhanced Design Style

### 7.1 Color Scheme
- **Primary Color**: Deep Blue (#1E3A8A) for main navigation and headers
- **Secondary Color**: Vibrant Cyan (#06B6D4) for interactive elements and highlights
- **Accent Color**: Electric Purple (#8B5CF6) for alerts and important notifications
- **Success Color**: Emerald Green (#10B981) for positive indicators\n- **Warning Color**: Amber (#F59E0B) for warnings\n- **Danger Color**: Red (#EF4444) for critical alerts and violations
- **Background**: Dark Gradient (from #0F172A to #1E293B) for main background
- **Card Background**: Semi-transparent Dark (#1F2937 with 95% opacity) with subtle backdrop blur
- **Text Primary**: White (#FFFFFF)\n- **Text Secondary**: Light Gray (#D1D5DB)
\n### 7.2 Background & Visual Effects
- **Animated Gradient Background**: Subtle animated gradient overlay on main background for dynamic feel
- **Glass Morphism Cards**: Semi-transparent cards with backdrop blur effect for modern look
- **Particle Effects**: Subtle animated particles in background for tech atmosphere
- **Mesh Gradient**: Use mesh gradient patterns in hero sections and empty states
- **Glow Effects**: Neon glow on hover for interactive elements
\n### 7.3 Contrast & Readability
- **High Contrast Mode**: Toggle option for enhanced accessibility
- **Text Shadows**: Subtle text shadows on light text over dark backgrounds for improved readability
- **Color-coded Data**: Use distinct colors for different data categories with sufficient contrast ratios (WCAG AA compliant)
- **Border Highlights**: Bright colored borders (cyan/purple) on active cards and focused elements
\n### 7.4 Visual Details
- **Border Radius**: Medium rounded corners (12px for cards, 8px for buttons, 6px for inputs)
- **Shadows**: Multi-layer shadows for depth (small shadow: 0 2px 8px rgba(0,0,0,0.3), medium: 0 4px 16px rgba(0,0,0,0.4))
- **Borders**: 1px borders with gradient colors for premium feel
- **Icons**: Line-style icons with gradient fills on hover
- **Animations**: Smooth transitions (300ms ease-in-out), micro-interactions on all clickable elements, loading skeleton screens
- **Typography**: Modern sans-serif font (Inter or Poppins), clear hierarchy with varied font weights

### 7.5 Layout & Spacing
- **Overall Layout**: Left sidebar navigation with collapsible option + main content area\n- **Card-based Design**: Modular card layout with consistent spacing (16px internal padding, 24px gaps)
- **Grid System**: Responsive grid layout for data-dense areas (12-column grid)
- **Whitespace**: Generous whitespace for visual breathing room
- **Sticky Elements**: Sticky navigation and key metric bars for easy access

### 7.6 Interactive Feedback
- **Button States**: Clear hover (scale1.05, glow effect), active (scale 0.98), and disabled states
- **Loading States**: Animated skeleton screens and progress indicators
- **Success/Error Feedback**: Toast notifications with icons and animations
- **Real-time Updates**: Pulse animation on data refresh, subtle flash on new violations
- **Tooltips**: Informative tooltips with smooth fade-in on hover
- **Drag & Drop**: Visual feedback for draggable dashboard widgets

### 7.7 OpenStreetMap & Leaflet Styling
- **Custom Dark Map Theme**: CartoDB Dark Matter tiles for high-contrast control room aesthetic
- **Custom Markers**: Branded custom markers for vehicles (color-coded by type), violations (red forRLVD, orange for wrong-way), and signals with animated effects
- **Animated Routes**: Animated vehicle movement paths with gradient trails using Leaflet Polyline
- **Cluster Visualization**: Leaflet marker clustering for dense vehicle areas
- **Custom Popups**: Custom-designed popups matching card design with glass morphism effect
- **Traffic Layer Styling**: TomTom traffic overlay with opacity adjustment to harmonize with overall color scheme

### 7.8 Login Page Design
- **Centered Card Layout**: Login form in centered glass morphism card with subtle glow\n- **Gradient Background**: Animated mesh gradient background with particle effects
- **Input Fields**: Modern input fields with floating labels and focus glow effects
- **Login Button**: Prominent gradient button with hover animation
- **Google Login Button**: Branded OSS Google Login button with icon\n- **Visual Hierarchy**: Clear separation between login options and secondary actions (forgot password)\n- **Loading State**: Smooth loading animation during authentication

### 7.9 Accessibility & User-Friendliness
- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Reader Support**: Proper ARIA labels and semantic HTML\n- **Font Scaling**: Support for user font size preferences
- **Reduced Motion**: Respect prefers-reduced-motion settings
- **Help Tooltips**: Contextual help icons throughout interface
- **Onboarding Tour**: Interactive tutorial for first-time users highlighting key features and role-specific capabilities
- **Role Indicators**: Clear visual indicators showing current user role and permissions

## 8. Open-Source Technology Stack Summary

### 8.1 Core Technologies (All Free & Open-Source)
- **Map Rendering**: Leaflet.js (BSD2-Clause License)
- **Base Map Tiles**: OpenStreetMap (Open Data Commons Open Database License)
- **Map Style**: CartoDB Dark Matter tiles (CC BY 3.0)\n- **Geospatial Calculations**: Turf.js (MIT License)
- **Traffic Data**: TomTom Traffic Flow API (Free tier available, API Key required)
- **Vehicle Tracking**: DeepSORT algorithm (open-source implementation)
- **Data Visualization**: Chart.js (MIT License)
- **Real-time Communication**: Socket.io-client (MIT License)
\n### 8.2 Algorithm Implementations
- **DeepSORT**: Object tracking with unique ID assignment\n- **Webster's Method**: Adaptive signal timing calculation
- **Turf.js Geofencing**: Stop line violation and wrong-way detection
- **OpenStreetMap Network**: Road topology for traffic simulation
\n### 8.3 Configuration Variables
- `TOMTOM_API_KEY`: TomTom Traffic Flow API key (user-configurable)
- `OSM_TILE_SERVER`: OpenStreetMap tile server URL
- `CARTODB_STYLE`: CartoDB Dark Matter tile URL
- `WEBSOCKET_URL`: Backend WebSocket server endpoint
- `API_BASE_URL`: Backend REST API base URL