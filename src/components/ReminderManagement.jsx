import React, { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useReminderScheduler } from '../hooks/useReminderScheduler';

function ReminderManagement() {
  const { state } = useBooking();
  const { reminderStats, sendImmediateReminder, cancelReminder, scheduleAllPendingReminders } = useReminderScheduler();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'failed':
        return 'Failed';
      case 'scheduled':
        return 'Scheduled';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const handleSendImmediate = async (bookingId) => {
    setLoading(true);
    try {
      await sendImmediateReminder(bookingId);
      setMessage('Reminder sent successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`Failed to send reminder: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReminder = (bookingId) => {
    if (cancelReminder(bookingId)) {
      setMessage('Reminder cancelled successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to cancel reminder');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleScheduleAllPending = () => {
    const scheduled = scheduleAllPendingReminders();
    setMessage(`Scheduled ${scheduled} pending reminders`);
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get bookings with reminders enabled
  const bookingsWithReminders = state.bookings.filter(booking => booking.reminder?.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">SMS Reminders</h2>
        </div>
        <button
          onClick={handleScheduleAllPending}
          className="btn btn-primary"
          disabled={loading}
        >
          Schedule All Pending
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Failed') || message.includes('error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      {reminderStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{reminderStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{reminderStats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{reminderStats.scheduled}</div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{reminderStats.sent}</div>
            <div className="text-sm text-gray-600">Sent</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{reminderStats.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reminder Status</h3>
        </div>
        
        {bookingsWithReminders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No bookings with SMS reminders enabled
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookingsWithReminders.map((booking) => {
              const business = state.businesses.find(b => b.id === booking.businessId);
              const reminderStatus = booking.reminder?.status || 'pending';
              
              return (
                <div key={booking.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(reminderStatus)}
                        <span className="font-medium text-gray-900">
                          {booking.customer.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getStatusText(reminderStatus)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Service:</span> {booking.service}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {booking.date} at {booking.time}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {booking.customer.phone}
                        </div>
                        {booking.reminder?.scheduledTime && (
                          <div>
                            <span className="font-medium">Reminder scheduled for:</span>{' '}
                            {formatDateTime(booking.reminder.scheduledTime)}
                          </div>
                        )}
                        {booking.reminder?.sentTime && (
                          <div>
                            <span className="font-medium">Sent at:</span>{' '}
                            {formatDateTime(booking.reminder.sentTime)}
                          </div>
                        )}
                        {booking.reminder?.lastError && (
                          <div className="text-red-600">
                            <span className="font-medium">Error:</span> {booking.reminder.lastError}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {(reminderStatus === 'pending' || reminderStatus === 'failed') && (
                        <button
                          onClick={() => handleSendImmediate(booking.id)}
                          disabled={loading}
                          className="btn btn-sm btn-primary flex items-center space-x-1"
                        >
                          <Send className="h-4 w-4" />
                          <span>Send Now</span>
                        </button>
                      )}
                      
                      {reminderStatus === 'scheduled' && (
                        <button
                          onClick={() => handleCancelReminder(booking.id)}
                          className="btn btn-sm btn-secondary"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReminderManagement;

