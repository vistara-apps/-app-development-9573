import React, { useState } from 'react';
import { Calendar, Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import BookingCalendar from '../components/BookingCalendar';
import CustomerInsights from '../components/CustomerInsights';
import RevenueChart from '../components/RevenueChart';

function BusinessDashboard() {
  const { state } = useBooking();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate dashboard metrics
  const totalBookings = state.bookings.length;
  const todaysBookings = state.bookings.filter(
    booking => booking.date === new Date().toISOString().split('T')[0]
  ).length;
  const totalRevenue = state.bookings.reduce((sum, booking) => {
    const business = state.businesses.find(b => b.id === booking.businessId);
    const service = business?.services.find(s => s.name === booking.service);
    return sum + (service?.price || 0);
  }, 0);

  if (!state.currentUser || state.userType !== 'business') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in as a business user to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your bookings and track your business performance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="metric-label mb-1">Total Bookings</p>
              <p className="metric-value">{totalBookings}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  +12% from last month
                </span>
              </div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="metric-label mb-1">Today's Bookings</p>
              <p className="metric-value">{todaysBookings}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  +3 from yesterday
                </span>
              </div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-success-100 to-success-200 group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300">
              <Clock className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="metric-label mb-1">Total Customers</p>
              <p className="metric-value">{state.customers.length}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  +8% growth
                </span>
              </div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="metric-label mb-1">Total Revenue</p>
              <p className="metric-value">${totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  +15% this month
                </span>
              </div>
            </div>
            <div className="metric-icon bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="bg-gray-100 p-1 rounded-2xl inline-flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white text-primary-600 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'calendar'
                ? 'bg-white text-primary-600 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'customers'
                ? 'bg-white text-primary-600 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Customers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-primary-600 shadow-soft'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {state.bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.customer.name}</p>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{booking.date}</p>
                    <p className="text-sm text-gray-600">{booking.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <RevenueChart />
          </div>
        </div>
      )}

      {activeTab === 'calendar' && <BookingCalendar />}
      
      {activeTab === 'customers' && <CustomerInsights />}
      
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
            <RevenueChart />
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
            <div className="space-y-4">
              {state.businesses[0]?.services.map((service) => {
                const bookingCount = state.bookings.filter(b => b.service === service.name).length;
                return (
                  <div key={service.id} className="flex justify-between items-center">
                    <span className="font-medium">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{bookingCount} bookings</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((bookingCount / totalBookings) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDashboard;
