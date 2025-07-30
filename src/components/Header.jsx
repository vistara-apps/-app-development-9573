import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Calendar, Users, BarChart } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function Header() {
  const location = useLocation();
  const { state } = useBooking();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookIt</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm font-medium ${
                location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            {state.userType === 'business' && (
              <Link
                to="/onboarding"
                className={`text-sm font-medium ${
                  location.pathname === '/onboarding' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Business Setup
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectButton />
            {state.currentUser && (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{state.currentUser.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;