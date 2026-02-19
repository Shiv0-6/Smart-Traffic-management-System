# Welcome to Project
Application Link URL
    URL:https://smart-traffic-management-system-rfgjfa8mm.vercel.app

# 🚦 Smart Traffic Management System

An AI-driven intelligent traffic management system with real-time vehicle detection, traffic flow visualization, signal control, and violation detection. Features Google Maps integration for live traffic data and advanced analytics.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ecf8e)

## ✨ Key Features

### 🎨 Modern UI/UX
- **Dark Mode Toggle**: Switch between Light, Dark, and System themes with persistent preferences
- **Professional Design**: Monitoring system aesthetic with deep blue and cyan accents
- **Gradient Effects**: Smooth color transitions and glass morphism
- **Animated Components**: Pulsing traffic lights, floating elements, smooth transitions
- **Responsive Design**: Seamless experience from mobile to desktop
- **Real-time Updates**: Live data refresh with visual indicators

### 🗺️ Interactive Mapping
- **Custom SVG Map**: Interactive traffic visualization with signal markers
- **Google Maps Integration**: Real-time traffic layer with live conditions
- **Clickable Markers**: Detailed information on signal status and timing
- **Congestion Overlay**: Color-coded traffic density visualization
- **Route Planning**: AI-optimized route suggestions

### 📊 Advanced Analytics
- **Traffic Intelligence**: Route optimization and travel time predictions
- **Congestion Forecasting**: AI-powered future traffic pattern analysis
- **Performance Metrics**: System efficiency and response time tracking
- **Incident Tracking**: Real-time alerts for accidents and roadwork
- **Historical Analysis**: Trend identification and peak hour detection

### 🚦 Traffic Signal Control
- **AI Auto Mode**: Adaptive signal timing based on real-time traffic
- **Manual Override**: Operator control for special situations
- **Live Status**: Real-time signal state monitoring (Red/Yellow/Green)
- **Timing Configuration**: Customizable phase durations
- **Bulk Operations**: Control multiple signals simultaneously

### 🚗 Vehicle Detection
- **Multi-type Recognition**: Cars, buses, motorcycles, trucks
- **Real-time Counting**: Live vehicle statistics per intersection
- **Historical Data**: Trend analysis and pattern identification
- **Export Reports**: Download detection data

### ⚠️ Violation Management
- **Automated Detection**: AI-powered violation identification
- **Multiple Types**: Red light running, illegal turns, speeding
- **Video Snapshots**: Visual evidence capture
- **Workflow System**: Pending → Reviewed → Resolved
- **Filtering & Search**: Advanced violation management

### 🔐 Authentication & Access Control
- **Public Access**: Anyone can view traffic data without logging in
- **Admin Login**: Secure authentication for system administrators
- **Role-based Permissions**: Admin, Operator, and User roles
- **Visual Indicators**: Shield icon for admins, Eye icon for viewers
- **First User Admin**: First registered user automatically becomes administrator
- **Session Management**: Secure token-based authentication

### 👥 User Roles
- **Public Users**: View all traffic data, signals, violations, and analytics (no login required)
- **Administrator**: Full system control, user management, and all editing capabilities
- **Operator**: Traffic control and violation review (same as admin for traffic operations)

## 🔑 Getting Started with Admin Access

### For First-Time Setup

1. **Access the Application**
   - Open the application in your browser
   - Browse as a public user (no login required)

2. **Create Admin Account**
   - Click **"Admin Login"** button in the top-right corner
   - Click **"Create Account"**
   - Enter a username (letters, numbers, underscores only)
   - Enter a password (minimum 6 characters)
   - Click **"Create Account"**

3. **Automatic Admin Privileges**
   - First registered user becomes administrator automatically
   - You'll see a **Shield icon** badge indicating admin status
   - All edit controls are now enabled

### For Existing Admins

1. **Login**
   - Click **"Admin Login"** in the header
   - Enter your username and password
   - Click **"Sign In"**

2. **Verify Admin Status**
   - Look for the **Shield icon** badge in the header
   - Badge should display "Admin Access"
   - All controls should be enabled

3. **Start Managing**
   - Control traffic signals
   - Review violations
   - Manage system settings

📖 **For detailed admin instructions, see [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)**

## 🚀 Quick Start

### Prerequisites
```
Node.js ≥ 20
npm or pnpm (pnpm 9.12.0 recommended)
```

### 3️⃣ Run Development Server

```bash
pnpm run dev
# or: npm run dev
```

Then open **http://localhost:5174** (or shown port in terminal).

### 4️⃣ View the App

- 📊 **Dashboard**: Real-time traffic overview with maps and alerts
- 🚗 **Vehicle Detection**: Count and classify vehicles by type
- 🚦 **Traffic Simulation**: SUMO-based flow visualization
- 🔴 **Signal Control**: Manage traffic light timing and status
- ⚠️ **Violations**: Review detected traffic violations
- 📈 **Data Analysis**: Analytics and trend reports
- ⚙️ **Settings**: System configuration

**No login required** — all features are accessible publicly! Admin controls appear after login.

## 🏗️ Production Build

```bash
# Build for production
pnpm run build

# Output goes to: dist/
# Built files are optimized and minified (~1.5 MB gzipped)
```




### Available Scripts

```bash
pnpm run dev       # Start dev server
pnpm run build     # Production build
pnpm run lint      # Run linter (Biome)
pnpm run preview   # Test production build locally
```

## 🔐 Features Included

- ✅ **Real-time Dashboard** with live traffic maps
- ✅ **Mock Data Layer** (zero-setup demo mode)
- ✅ **Supabase Integration** (for production)
- ✅ **Dark Mode** with theme persistence
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **shadcn/ui** components
- ✅ **React Router v7** for navigation
- ✅ **Socket.io Support** for WebSocket updates
- ✅ **Chart.js & Recharts** for analytics

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Supabase connection failing
```env
# Switch to mock mode temporarily
VITE_MOCK_MODE=1
```

### Port 5174 already in use
Vite will auto-select next available port (5175, 5176, etc.)

### Google Maps not loading
- Check `VITE_GOOGLE_MAPS_API_KEY` in `.env`
- Verify API is enabled in Google Cloud Console
- Maps will gracefully degrade without the key

## 📚 Additional Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

## 🤝 Support

For issues, check:
1. **Environment Variables** — Verify `.env` is configured
2. **Dependencies** — Run `pnpm install` again
3. **Node Version** — Ensure Node ≥ 20
4. **Browser Console** — Check for error messages
5. **Network Tab** — Verify API calls (or mock mode is active)

---


Start with `pnpm run dev` and access http://localhost:5174


## 📖 Documentation

### User Guides
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Complete user guide for public users and admins
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Comprehensive admin login and control guide
- **[DARK_MODE_GUIDE.md](./DARK_MODE_GUIDE.md)** - Dark mode and theme switching guide
- **[QUICK_START.md](./QUICK_START.md)** - Step-by-step getting started guide

### Technical Documentation
- **[FEATURES.md](./FEATURES.md)** - Comprehensive feature documentation
- **[GOOGLE_MAPS_SETUP.md](./GOOGLE_MAPS_SETUP.md)** - Google Maps integration guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Recent implementation details
- **[TODO.md](./TODO.md)** - Development progress and roadmap

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Reusable components
│   │   │   ├── GoogleTrafficMap.tsx    # Google Maps integration
│   │   │   ├── TrafficMap.tsx          # Custom SVG map
│   │   │   ├── TrafficAnalytics.tsx    # Analytics dashboard
│   │   │   ├── Header.tsx              # Navigation header
│   │   │   └── StatCard.tsx            # Statistics card
│   │   └── ui/                # shadcn/ui components
│   ├── pages/
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── VehicleDetection.tsx
│   │   ├── TrafficSimulation.tsx
│   │   ├── AdvancedTraffic.tsx    # Google Maps + Analytics
│   │   ├── SignalControl.tsx
│   │   ├── ViolationManagement.tsx
│   │   ├── DataAnalysis.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── db/
│   │   ├── supabase.ts        # Supabase client
│   │   └── api.ts             # Database API functions
│   ├── types/
│   │   └── types.ts           # TypeScript interfaces
│   ├── routes.tsx             # Route configuration
│   ├── App.tsx                # Main app component
│   └── index.css              # Global styles + design system
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── .env.example               # Environment template
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication

### APIs & Services
- **Google Maps JavaScript API** - Live traffic data (optional)
- **Google Places API** - Location services (optional)
- **Google Directions API** - Route planning (optional)


### Tables
- **profiles** - User accounts and roles
- **vehicles** - Vehicle detection records
- **traffic_signals** - Traffic light status and configuration
- **violations** - Traffic violation records
- **traffic_flow** - Traffic flow measurements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Supabase** - Excellent backend platform
- **Google Maps** - Real-time traffic data
- **Lucide** - Clean, consistent icons
- **Tailwind CSS** - Powerful styling framework

## 📞 Support

For questions or issues:
1. Check the [QUICK_START.md](./QUICK_START.md) guide
2. Review [FEATURES.md](./FEATURES.md) documentation
3. Check existing GitHub issues
4. Create a new issue with detailed information

---

**Built with ❤️ using React, TypeScript, and Supabase**

2025 Smart Traffic Management System
