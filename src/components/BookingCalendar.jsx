import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { state } = useBooking();

  const getReminderIcon = (booking) => {
    if (!booking.reminder?.enabled) return null;
    
    const status = booking.reminder.status;
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-3 w-3 text-green-500" title="Reminder sent" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" title="Reminder failed" />;
      case 'scheduled':
        return <Clock className="h-3 w-3 text-blue-500" title="Reminder scheduled" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 text-gray-500" title="Reminder cancelled" />;
      default:
        return <AlertCircle className="h-3 w-3 text-yellow-500" title="Reminder pending" />;
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dayBookings = state.bookings.filter(booking => 
        isSameDay(new Date(booking.date), day)
      );

      days.push(
        <div
          className={`p-2 border border-gray-200 min-h-24 ${
            !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : 'bg-white'
          } ${isToday(day) ? 'bg-blue-50' : ''}`}
          key={day}
        >
          <div className={`text-sm mb-1 ${isToday(day) ? 'font-bold text-blue-600' : ''}`}>
            {formattedDate}
          </div>
          <div className="space-y-1">
            {dayBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate"
                title={`${booking.time} - ${booking.customer.name} - ${booking.service}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{booking.time}</div>
                  {getReminderIcon(booking)}
                </div>
                <div className="truncate">{booking.customer.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentDate(addDays(currentDate, 31));
  };

  const prevMonth = () => {
    setCurrentDate(addDays(currentDate, -31));
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="btn btn-secondary p-2">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="btn btn-secondary p-2">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50 border">
              {day}
            </div>
          ))}
        </div>
        {rows}
      </div>

      {/* Today's Bookings */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
        <div className="space-y-3">
          {state.bookings
            .filter(booking => isSameDay(new Date(booking.date), new Date()))
            .map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{booking.time}</div>
                    <div className="text-sm text-gray-600">{booking.service}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{booking.customer.name}</span>
                  </div>
                  {getReminderIcon(booking)}
                </div>
              </div>
            ))}
          {state.bookings.filter(booking => isSameDay(new Date(booking.date), new Date())).length === 0 && (
            <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCalendar;
