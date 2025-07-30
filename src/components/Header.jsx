import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Calendar, Users, BarChart, MessageCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function Header() {
  const location = useLocation();
  const { state } = useBooking();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-soft border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-200">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                BookIt
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === '/' ? 'nav-link-active' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`nav-link ${
                location.pathname === '/dashboard' ? 'nav-link-active' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              className={`nav-link ${
                location.pathname.startsWith('/chat') ? 'nav-link-active' : ''
              }`}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Chat Assistant
            </Link>
            {state.userType === 'business' && (
              <Link
                to="/onboarding"
                className={`nav-link ${
                  location.pathname === '/onboarding' ? 'nav-link-active' : ''
                }`}
              >
                Business Setup
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
            {state.currentUser && (
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-900">{state.currentUser.name}</span>
                  <div className="text-xs text-gray-500 capitalize">{state.userType}</div>
                </div>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
