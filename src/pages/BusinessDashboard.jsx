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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{todaysBookings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{state.customers.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Customer Insights
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </nav>
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