import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function RevenueChart() {
  const { state } = useBooking();

  // Generate sample revenue data for the last 7 days
  const generateRevenueData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayBookings = state.bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayBookings.reduce((sum, booking) => {
        const business = state.businesses.find(b => b.id === booking.businessId);
        const service = business?.services.find(s => s.name === booking.service);
        return sum + (service?.price || 0);
      }, 0);
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue,
        bookings: dayBookings.length
      });
    }
    
    return days;
  };

  const revenueData = generateRevenueData();
  const maxRevenue = Math.max(...revenueData.map(day => day.revenue), 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Last 7 Days</h4>
        <TrendingUp className="h-4 w-4 text-green-600" />
      </div>
      
      <div className="space-y-3">
        {revenueData.map((day, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-8 text-xs text-gray-600">{day.date}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">${day.revenue}</span>
                <span className="text-xs text-gray-500">{day.bookings} bookings</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Revenue</span>
          <span className="font-bold text-blue-600">
            ${revenueData.reduce((sum, day) => sum + day.revenue, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;