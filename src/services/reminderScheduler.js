import smsService from './smsService.js';

class ReminderScheduler {
  constructor() {
    this.scheduledReminders = new Map(); // bookingId -> timeoutId
    this.reminderCallbacks = new Set();
    this.isInitialized = false;
  }

  initialize(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.isInitialized = true;
    
    // Check for pending reminders on initialization
    this.checkPendingReminders();
    
    console.log('Reminder scheduler initialized');
  }

  addReminderCallback(callback) {
    this.reminderCallbacks.add(callback);
  }

  removeReminderCallback(callback) {
    this.reminderCallbacks.delete(callback);
  }

  notifyCallbacks(event, data) {
    this.reminderCallbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in reminder callback:', error);
      }
    });
  }

  calculateReminderTime(appointmentDate, appointmentTime) {
    // Create appointment datetime
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    
    // Calculate reminder time (1 hour before)
    const reminderTime = new Date(appointmentDateTime.getTime() - (60 * 60 * 1000));
    
    return reminderTime;
  }

  scheduleReminder(booking, business) {
    if (!this.isInitialized) {
      console.warn('Reminder scheduler not initialized');
      return false;
    }

    const { id: bookingId, date, time, reminder } = booking;
    
    // Don't schedule if reminders are disabled for this booking
    if (!reminder?.enabled) {
      return false;
    }

    // Don't schedule if already scheduled or sent
    if (reminder?.status === 'scheduled' || reminder?.status === 'sent') {
      return false;
    }

    try {
      const reminderTime = this.calculateReminderTime(date, time);
      const now = new Date();
      
      // Don't schedule if reminder time has already passed
      if (reminderTime <= now) {
        console.log(`Reminder time has passed for booking ${bookingId}`);
        this.dispatch({
          type: 'UPDATE_REMINDER_STATUS',
          payload: {
            bookingId,
            reminderData: {
              status: 'expired',
              lastError: 'Reminder time has passed'
            }
          }
        });
        return false;
      }

      const delay = reminderTime.getTime() - now.getTime();
      
      // Schedule the reminder
      const timeoutId = setTimeout(() => {
        this.sendReminder(booking, business);
      }, delay);

      // Store the timeout ID for potential cancellation
      this.scheduledReminders.set(bookingId, timeoutId);

      // Update booking status
      this.dispatch({
        type: 'SCHEDULE_REMINDER',
        payload: {
          bookingId,
          scheduledTime: reminderTime.toISOString()
        }
      });

      // Store in localStorage for persistence
      this.saveScheduledReminder(bookingId, reminderTime.toISOString());

      console.log(`Reminder scheduled for booking ${bookingId} at ${reminderTime}`);
      
      this.notifyCallbacks('reminder_scheduled', { bookingId, reminderTime });
      
      return true;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      this.dispatch({
        type: 'UPDATE_REMINDER_STATUS',
        payload: {
          bookingId,
          reminderData: {
            status: 'failed',
            lastError: error.message
          }
        }
      });
      return false;
    }
  }

  async sendReminder(booking, business) {
    const { id: bookingId, reminder } = booking;
    
    try {
      // Update status to sending
      this.dispatch({
        type: 'UPDATE_REMINDER_STATUS',
        payload: {
          bookingId,
          reminderData: {
            status: 'sending',
            attempts: (reminder?.attempts || 0) + 1
          }
        }
      });

      // Send the SMS
      const result = await smsService.sendAppointmentReminder(booking, business);
      
      if (result.success) {
        // Update status to sent
        this.dispatch({
          type: 'UPDATE_REMINDER_STATUS',
          payload: {
            bookingId,
            reminderData: {
              status: 'sent',
              sentTime: new Date().toISOString(),
              lastError: null
            }
          }
        });

        console.log(`Reminder sent successfully for booking ${bookingId}`);
        this.notifyCallbacks('reminder_sent', { bookingId, result });
      } else {
        throw new Error(result.error || 'Failed to send SMS');
      }
    } catch (error) {
      console.error(`Failed to send reminder for booking ${bookingId}:`, error);
      
      // Update status to failed
      this.dispatch({
        type: 'UPDATE_REMINDER_STATUS',
        payload: {
          bookingId,
          reminderData: {
            status: 'failed',
            lastError: error.message
          }
        }
      });

      this.notifyCallbacks('reminder_failed', { bookingId, error: error.message });
    } finally {
      // Clean up
      this.scheduledReminders.delete(bookingId);
      this.removeScheduledReminder(bookingId);
    }
  }

  cancelReminder(bookingId) {
    const timeoutId = this.scheduledReminders.get(bookingId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledReminders.delete(bookingId);
      this.removeScheduledReminder(bookingId);
      
      // Update booking status
      if (this.dispatch) {
        this.dispatch({
          type: 'UPDATE_REMINDER_STATUS',
          payload: {
            bookingId,
            reminderData: {
              status: 'cancelled'
            }
          }
        });
      }

      console.log(`Reminder cancelled for booking ${bookingId}`);
      this.notifyCallbacks('reminder_cancelled', { bookingId });
      return true;
    }
    return false;
  }

  // Persistence methods for scheduled reminders
  saveScheduledReminder(bookingId, reminderTime) {
    try {
      const scheduled = JSON.parse(localStorage.getItem('scheduledReminders') || '{}');
      scheduled[bookingId] = reminderTime;
      localStorage.setItem('scheduledReminders', JSON.stringify(scheduled));
    } catch (error) {
      console.error('Error saving scheduled reminder:', error);
    }
  }

  removeScheduledReminder(bookingId) {
    try {
      const scheduled = JSON.parse(localStorage.getItem('scheduledReminders') || '{}');
      delete scheduled[bookingId];
      localStorage.setItem('scheduledReminders', JSON.stringify(scheduled));
    } catch (error) {
      console.error('Error removing scheduled reminder:', error);
    }
  }

  checkPendingReminders() {
    if (!this.isInitialized) return;

    try {
      const scheduled = JSON.parse(localStorage.getItem('scheduledReminders') || '{}');
      const state = this.getState();
      const now = new Date();

      Object.entries(scheduled).forEach(([bookingIdStr, reminderTimeStr]) => {
        const bookingId = parseInt(bookingIdStr);
        const reminderTime = new Date(reminderTimeStr);
        
        // Find the booking
        const booking = state.bookings.find(b => b.id === bookingId);
        if (!booking) {
          // Booking no longer exists, clean up
          this.removeScheduledReminder(bookingId);
          return;
        }

        const business = state.businesses.find(b => b.id === booking.businessId);
        if (!business) {
          console.warn(`Business not found for booking ${bookingId}`);
          return;
        }

        // Check if reminder should be sent now
        if (reminderTime <= now && booking.reminder?.status === 'scheduled') {
          console.log(`Sending overdue reminder for booking ${bookingId}`);
          this.sendReminder(booking, business);
        } else if (reminderTime > now && booking.reminder?.status === 'scheduled') {
          // Reschedule the reminder
          const delay = reminderTime.getTime() - now.getTime();
          const timeoutId = setTimeout(() => {
            this.sendReminder(booking, business);
          }, delay);
          
          this.scheduledReminders.set(bookingId, timeoutId);
          console.log(`Rescheduled reminder for booking ${bookingId}`);
        }
      });
    } catch (error) {
      console.error('Error checking pending reminders:', error);
    }
  }

  // Get reminder statistics
  getReminderStats() {
    if (!this.isInitialized) return null;

    const state = this.getState();
    const stats = {
      total: 0,
      pending: 0,
      scheduled: 0,
      sent: 0,
      failed: 0,
      cancelled: 0
    };

    state.bookings.forEach(booking => {
      if (booking.reminder?.enabled) {
        stats.total++;
        const status = booking.reminder.status || 'pending';
        if (stats[status] !== undefined) {
          stats[status]++;
        }
      }
    });

    return stats;
  }

  // Manual reminder sending (for testing or immediate sending)
  async sendImmediateReminder(bookingId) {
    if (!this.isInitialized) {
      throw new Error('Reminder scheduler not initialized');
    }

    const state = this.getState();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const business = state.businesses.find(b => b.id === booking.businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return await this.sendReminder(booking, business);
  }
}

// Create and export singleton instance
const reminderScheduler = new ReminderScheduler();
export default reminderScheduler;

