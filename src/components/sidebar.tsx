import React from "react";
import Link from "next/link";

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'dashboard':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="3" width="8" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="10" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'detection':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="3" y="10" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="10" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'control':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="3" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="17" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="10" y="17" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'visual':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12c3-6 9-9 9-9s6 3 9 9c-3 6-9 9-9 9s-6-3-9-9z" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case 'access':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="11" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'violations':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2 L2 22h20L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

const NavItem: React.FC<{ icon: string; label: string; href?: string; active?: boolean }> = ({ icon, label, href = '#', active }) => {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-r-xl text-sm font-medium transition-colors duration-150 ${
          active ? 'active text-primary' : 'text-slate-700'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>{/* svg */}
          <Icon name={icon} />
        </span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="app-sidebar w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      <div className="brand">
        <div className="logo-box">ST</div>
        <div>
          <h3 className="text-lg font-semibold">STMS</h3>
          <p className="text-xs text-gray-500">Smart Traffic Management</p>
        </div>
      </div>

      <nav className="px-2 py-6">
        <ul className="space-y-1">
          <NavItem icon="dashboard" label="Dashboard" href="/" active />
          <NavItem icon="detection" label="Vehicle Detection" href="/vehicle-detection" />
          <NavItem icon="control" label="Traffic Control" href="/traffic-control" />
          <NavItem icon="visual" label="Visualization" href="/visualization" />
          <NavItem icon="access" label="Access Control" href="/access-control" />
          <NavItem icon="violations" label="Violations" href="/violations" />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
