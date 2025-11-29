import Dashboard from './pages/Dashboard';
import VehicleDetection from './pages/VehicleDetection';
import TrafficSimulation from './pages/TrafficSimulation';
import SignalControl from './pages/SignalControl';
import ViolationManagement from './pages/ViolationManagement';
import DataAnalysis from './pages/DataAnalysis';
import Settings from './pages/Settings';
import Login from './pages/Login';
import AdvancedTraffic from './pages/AdvancedTraffic';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: <Dashboard />
  },
  {
    name: 'Vehicle Detection',
    path: '/detection',
    element: <VehicleDetection />
  },
  {
    name: 'Traffic Simulation',
    path: '/simulation',
    element: <TrafficSimulation />
  },
  {
    name: 'Advanced Traffic',
    path: '/advanced',
    element: <AdvancedTraffic />
  },
  {
    name: 'Signal Control',
    path: '/signals',
    element: <SignalControl />
  },
  {
    name: 'Violations',
    path: '/violations',
    element: <ViolationManagement />
  },
  {
    name: 'Data Analysis',
    path: '/analysis',
    element: <DataAnalysis />
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <Settings />
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false
  }
];

export default routes;