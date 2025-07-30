import React from 'react';
import { Users, Star, TrendingUp, Calendar } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function CustomerInsights() {
  const { state } = useBooking();

  // Calculate customer metrics
  const totalCustomers = state.customers.length;
  const repeatCustomers = state.customers.filter(customer => 
    state.bookings.filter(booking => booking.customer.email === customer.email).length > 1
  ).length;
  const averageBookingsPerCustomer = totalCustomers > 0 ? 
    (state.bookings.length / totalCustomers).toFixed(1) : 0;

  // Get top customers by booking count
  const topCustomers = state.customers
    .map(customer => ({
      ...customer,
      bookingCount: state.bookings.filter(booking => booking.customer.email === customer.email).length,
      totalSpent: state.bookings
        .filter(booking => booking.customer.email === customer.email)
        .reduce((sum, booking) => {
          const business = state.businesses.find(b => b.id === booking.businessId);
          const service = business?.services.find(s => s.name === booking.service);
          return sum + (service?.price || 0);
        }, 0)
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5);

  // Service popularity
  const serviceStats = state.businesses[0]?.services.map(service => ({
    ...service,
    bookingCount: state.bookings.filter(booking => booking.service === service.name).length
  })).sort((a, b) => b.bookingCount - a.bookingCount) || [];

  return (
    <div className="space-y-8">
      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900">{repeatCustomers}</p>
              <p className="text-xs text-green-600">
                {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0}% retention rate
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Bookings/Customer</p>
              <p className="text-2xl font-bold text-gray-900">{averageBookingsPerCustomer}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
        <div className="space-y-4">
          {topCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.email}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{customer.bookingCount} bookings</div>
                <div className="text-sm text-gray-600">${customer.totalSpent} spent</div>
              </div>
            </div>
          ))}
          {topCustomers.length === 0 && (
            <p className="text-gray-500 text-center py-8">No customer data available</p>
          )}
        </div>
      </div>

      {/* Service Popularity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Service Popularity</h3>
        <div className="space-y-4">
          {serviceStats.map((service) => (
            <div key={service.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-gray-600">${service.price} • {service.duration} mins</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{service.bookingCount} bookings</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${state.bookings.length > 0 ? (service.bookingCount / state.bookings.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Feedback */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Customer Feedback</h3>
        <div className="space-y-4">
          {/* Sample feedback data */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">Sarah Johnson</span>
            </div>
            <p className="text-gray-700 text-sm">
              "Excellent service! The booking process was so easy and the staff was very professional."
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <Star className="h-4 w-4 text-gray-300" />
              </div>
              <span className="ml-2 text-sm font-medium">Mike Chen</span>
            </div>
            <p className="text-gray-700 text-sm">
              "Great experience overall. Would recommend to others. Only minor issue was the wait time."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerInsights;