import { useEffect, useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import reminderScheduler from '../services/reminderScheduler';

export function useReminderScheduler() {
  const { state, dispatch } = useBooking();
  const [reminderStats, setReminderStats] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the reminder scheduler
  useEffect(() => {
    if (!isInitialized) {
      reminderScheduler.initialize(dispatch, () => state);
      setIsInitialized(true);
      
      // Set up callback to update stats when reminders change
      const updateStats = () => {
        const stats = reminderScheduler.getReminderStats();
        setReminderStats(stats);
      };

      reminderScheduler.addReminderCallback(updateStats);
      updateStats(); // Initial stats

      return () => {
        reminderScheduler.removeReminderCallback(updateStats);
      };
    }
  }, [dispatch, state, isInitialized]);

  // Update stats when bookings change
  useEffect(() => {
    if (isInitialized) {
      const stats = reminderScheduler.getReminderStats();
      setReminderStats(stats);
    }
  }, [state.bookings, isInitialized]);

  const scheduleReminder = (booking) => {
    const business = state.businesses.find(b => b.id === booking.businessId);
    if (business) {
      return reminderScheduler.scheduleReminder(booking, business);
    }
    return false;
  };

  const cancelReminder = (bookingId) => {
    return reminderScheduler.cancelReminder(bookingId);
  };

  const sendImmediateReminder = async (bookingId) => {
    return await reminderScheduler.sendImmediateReminder(bookingId);
  };

  const scheduleAllPendingReminders = () => {
    let scheduled = 0;
    state.bookings.forEach(booking => {
      if (booking.reminder?.enabled && booking.reminder?.status === 'pending') {
        const business = state.businesses.find(b => b.id === booking.businessId);
        if (business && reminderScheduler.scheduleReminder(booking, business)) {
          scheduled++;
        }
      }
    });
    return scheduled;
  };

  return {
    reminderStats,
    scheduleReminder,
    cancelReminder,
    sendImmediateReminder,
    scheduleAllPendingReminders,
    isInitialized
  };
}

