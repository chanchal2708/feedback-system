import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, Users, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const managerLinks = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/feedback/new', icon: Plus, label: 'New Feedback' },
    { to: '/feedback/history', icon: MessageSquare, label: 'Feedback History' },
  ];

  const employeeLinks = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/feedback/received', icon: MessageSquare, label: 'My Feedback' },
  ];

  const links = user?.role === 'manager' ? managerLinks : employeeLinks;

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {links.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};