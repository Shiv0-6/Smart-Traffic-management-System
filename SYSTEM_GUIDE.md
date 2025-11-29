# Smart Traffic Management System - User Guide

## Overview

The Smart Traffic Management System is an AI-driven web application designed for traffic management personnel and regular users. It provides real-time vehicle detection, traffic flow visualization, signal control, and violation management capabilities.

## Getting Started

### First Time Setup

1. **Create Your Account**
   - Navigate to the login page
   - Click "Create Account"
   - Enter a username (letters, numbers, and underscores only)
   - Enter a password (minimum 6 characters)
   - The first registered user automatically becomes an administrator

2. **User Roles**
   - **Admin**: Full system access including user management and system settings
   - **Operator**: Can control traffic signals and manage violations
   - **User**: Read-only access to view traffic data and reports

## Main Features

### 1. Dashboard (Home)
Your central hub for monitoring traffic system status:
- **Real-time Statistics**: View total vehicles detected, active signals, pending violations, and average speed
- **Signal Status**: Monitor current state of all traffic lights
- **Recent Violations**: Quick overview of latest traffic violations
- **Traffic Flow**: Real-time conditions by location with congestion levels

### 2. Vehicle Detection
YOLO-based vehicle detection and monitoring:
- **Video Upload**: Upload traffic video files for analysis
- **Live Stream**: Connect to real-time CCTV traffic monitoring feeds
- **Vehicle Statistics**: View breakdown by vehicle type (cars, buses, motorcycles, trucks)
- **Detection History**: Browse recent detections with timestamps and locations
- **Filter by Location**: Focus on specific intersections or road segments

### 3. Traffic Simulation
SUMO-based traffic flow visualization:
- **Interactive Map**: Visual representation of traffic flow and vehicle movements
- **Real-time Updates**: Live traffic conditions with signal states
- **Flow Data**: Average speed, vehicle count, and congestion levels by location
- **Signal Timing**: View current timing configurations for each intersection
- **Historical Playback**: Review past traffic patterns (feature placeholder)

### 4. Signal Control
Manage traffic light timing and modes:
- **Control Modes**:
  - **AI Auto**: Adaptive signal timing based on traffic conditions
  - **Manual**: Direct operator control of signal states
- **Status Control**: Change signals between red, yellow, and green (manual mode only)
- **Timing Configuration**: Adjust duration for each signal phase
- **Real-time Monitoring**: View last update time and current configuration

**Note**: Only Admins and Operators can control signals. Regular users have read-only access.

### 5. Violation Management
Review and manage traffic violations:
- **Violation Dashboard**: View pending, reviewed, and resolved violations
- **Filter Options**: Sort by status (all, pending, reviewed, resolved)
- **Violation Details**: 
  - Location and type (red light, illegal turn, speeding, etc.)
  - Timestamp and vehicle plate information
  - Snapshot images (when available)
- **Review Actions** (Operators/Admins only):
  - Add review notes
  - Mark as reviewed or resolved
  - Track review history

### 6. Data Analysis
Statistical insights and trends:
- **Vehicle Type Distribution**: Pie chart showing breakdown of detected vehicles
- **Traffic Flow Charts**: Bar charts comparing speed and vehicle count by location
- **Violation Analysis**: Distribution of violation types
- **Time Range Selection**: View data for last 24 hours, 7 days, or 30 days
- **Data Export**: Export reports for further analysis (feature placeholder)
- **Congestion Heatmap**: Visual representation of traffic intensity (feature placeholder)

### 7. System Settings (Admin Only)
User and system management:
- **User Management**:
  - View all registered users
  - Change user roles (user, operator, admin)
  - View user registration dates
- **System Configuration**:
  - Detection refresh interval
  - Signal update interval
  - Maximum violations display limit

## Tips for Effective Use

### For Regular Users
- Check the Dashboard regularly for traffic overview
- Use Vehicle Detection to monitor specific locations
- Review Data Analysis for traffic patterns and trends
- Filter violations by location to track problem areas

### For Operators
- Monitor Signal Control page for signal status
- Switch between Auto and Manual modes as needed
- Review pending violations promptly
- Use Traffic Simulation to identify congestion patterns
- Adjust signal timing based on traffic flow data

### For Administrators
- Regularly review user roles in Settings
- Monitor system performance metrics
- Ensure operators are assigned to appropriate users
- Review violation resolution rates
- Export data for reporting and analysis

## Technical Notes

### Data Refresh Rates
- Dashboard: Updates every 30 seconds
- Vehicle Detection: Updates every 10 seconds
- Traffic Simulation: Updates every 15 seconds
- Signal Control: Updates every 10 seconds
- Violations: Updates every 15 seconds

### Browser Compatibility
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design for tablet and smartphone access

### Security
- All data is encrypted in transit
- Role-based access control enforced
- Session management with automatic timeout
- Secure authentication via Supabase

## Support and Troubleshooting

### Common Issues

**Cannot log in**
- Verify username and password are correct
- Ensure username contains only letters, numbers, and underscores
- Password must be at least 6 characters

**Data not loading**
- Check your internet connection
- Refresh the page
- Clear browser cache if issues persist

**Cannot control signals**
- Verify you have Operator or Admin role
- Check if signal is in Manual mode (required for manual control)
- Ensure you're not trying to change your own role in Settings

**Violations not appearing**
- Check filter settings (may be set to specific status)
- Verify date range if applicable
- Refresh the page to load latest data

### Best Practices
- Log out when finished using the system
- Don't share login credentials
- Report any suspicious violations immediately
- Keep signal timing configurations documented
- Regularly export data for backup purposes

## Future Enhancements

The system is designed to integrate with:
- YOLO vehicle detection service (backend API)
- SUMO traffic simulation engine (backend API)
- Real-time CCTV camera feeds
- Advanced heatmap visualization
- Predictive traffic analytics
- Automated violation detection
- Mobile application companion

---

For technical support or feature requests, please contact your system administrator.
