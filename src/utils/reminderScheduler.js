import SMSService from '../services/SMSService';

class ReminderScheduler {
  constructor() {
    this.scheduledReminders = new Map();
    this.reminderTypes = {
      CONFIRMATION: 'confirmation',
      DAY_BEFORE: 'day_before',
      HOUR_BEFORE: 'hour_before',
      CANCELLATION: 'cancellation',
      RESCHEDULE: 'reschedule'
    };
  }

  /**
   * Schedule all reminders for an appointment
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Array>} Array of scheduled reminder IDs
   */
  async scheduleAppointmentReminders(appointment) {
    const scheduledIds = [];

    try {
      // Send immediate confirmation
      await this.scheduleConfirmationReminder(appointment);
      
      // Schedule day-before reminder
      const dayBeforeId = await this.scheduleDayBeforeReminder(appointment);
      if (dayBeforeId) scheduledIds.push(dayBeforeId);

      // Schedule 1-hour reminder
      const hourBeforeId = await this.scheduleHourBeforeReminder(appointment);
      if (hourBeforeId) scheduledIds.push(hourBeforeId);

      return scheduledIds;
    } catch (error) {
      console.error('Failed to schedule appointment reminders:', error);
      throw error;
    }
  }

  /**
   * Send immediate confirmation reminder
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async scheduleConfirmationReminder(appointment) {
    try {
      const result = await SMSService.sendConfirmation(appointment);
      console.log('Confirmation SMS sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send confirmation SMS:', error);
      throw error;
    }
  }

  /**
   * Schedule day-before reminder
   * @param {Object} appointment - Appointment details
   * @returns {Promise<string|null>} Scheduled reminder ID
   */
  async scheduleDayBeforeReminder(appointment) {
    const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
    const reminderTime = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    
    return this.scheduleReminder({
      appointment,
      reminderTime,
      type: this.reminderTypes.DAY_BEFORE,
      action: () => SMSService.sendDayBeforeReminder(appointment)
    });
  }

  /**
   * Schedule 1-hour reminder
   * @param {Object} appointment - Appointment details
   * @returns {Promise<string|null>} Scheduled reminder ID
   */
  async scheduleHourBeforeReminder(appointment) {
    const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
    const reminderTime = new Date(appointmentDate.getTime() - 60 * 60 * 1000); // 1 hour before
    
    return this.scheduleReminder({
      appointment,
      reminderTime,
      type: this.reminderTypes.HOUR_BEFORE,
      action: () => SMSService.sendHourlyReminder(appointment)
    });
  }

  /**
   * Schedule a reminder
   * @param {Object} reminderConfig - Reminder configuration
   * @returns {Promise<string|null>} Scheduled reminder ID
   */
  async scheduleReminder({ appointment, reminderTime, type, action }) {
    const now = new Date();
    
    // Don't schedule reminders for past times
    if (reminderTime <= now) {
      console.log(`Skipping ${type} reminder for appointment ${appointment.id} - time has passed`);
      return null;
    }

    const delay = reminderTime.getTime() - now.getTime();
    const reminderId = `${appointment.id}_${type}_${Date.now()}`;

    // Schedule the reminder
    const timeoutId = setTimeout(async () => {
      try {
        console.log(`Executing ${type} reminder for appointment ${appointment.id}`);
        await action();
        this.scheduledReminders.delete(reminderId);
      } catch (error) {
        console.error(`Failed to execute ${type} reminder:`, error);
      }
    }, delay);

    // Store the scheduled reminder
    this.scheduledReminders.set(reminderId, {
      timeoutId,
      appointment,
      type,
      scheduledTime: reminderTime,
      createdAt: now
    });

    console.log(`Scheduled ${type} reminder for appointment ${appointment.id} at ${reminderTime.toISOString()}`);
    return reminderId;
  }

  /**
   * Cancel scheduled reminders for an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {number} Number of cancelled reminders
   */
  cancelAppointmentReminders(appointmentId) {
    let cancelledCount = 0;

    for (const [reminderId, reminder] of this.scheduledReminders.entries()) {
      if (reminder.appointment.id === appointmentId) {
        clearTimeout(reminder.timeoutId);
        this.scheduledReminders.delete(reminderId);
        cancelledCount++;
      }
    }

    console.log(`Cancelled ${cancelledCount} reminders for appointment ${appointmentId}`);
    return cancelledCount;
  }

  /**
   * Send cancellation SMS and cancel reminders
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async handleAppointmentCancellation(appointment) {
    try {
      // Cancel all scheduled reminders
      this.cancelAppointmentReminders(appointment.id);

      // Send cancellation SMS
      const result = await SMSService.sendCancellation(appointment);
      console.log('Cancellation SMS sent:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to handle appointment cancellation:', error);
      throw error;
    }
  }

  /**
   * Handle appointment reschedule
   * @param {Object} newAppointment - New appointment details
   * @param {Object} oldAppointment - Previous appointment details
   * @returns {Promise<Array>} Array of new scheduled reminder IDs
   */
  async handleAppointmentReschedule(newAppointment, oldAppointment) {
    try {
      // Cancel old reminders
      this.cancelAppointmentReminders(oldAppointment.id);

      // Send reschedule confirmation
      await SMSService.sendRescheduleConfirmation(newAppointment, oldAppointment);

      // Schedule new reminders
      const scheduledIds = await this.scheduleAppointmentReminders(newAppointment);
      
      return scheduledIds;
    } catch (error) {
      console.error('Failed to handle appointment reschedule:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled reminders
   * @returns {Array} Array of scheduled reminders
   */
  getScheduledReminders() {
    return Array.from(this.scheduledReminders.entries()).map(([id, reminder]) => ({
      id,
      ...reminder,
      timeoutId: undefined // Don't expose timeout ID
    }));
  }

  /**
   * Get scheduled reminders for a specific appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Array} Array of scheduled reminders for the appointment
   */
  getAppointmentReminders(appointmentId) {
    return this.getScheduledReminders().filter(
      reminder => reminder.appointment.id === appointmentId
    );
  }

  /**
   * Clear all scheduled reminders (useful for cleanup)
   */
  clearAllReminders() {
    for (const [reminderId, reminder] of this.scheduledReminders.entries()) {
      clearTimeout(reminder.timeoutId);
    }
    this.scheduledReminders.clear();
    console.log('All scheduled reminders cleared');
  }

  /**
   * Get reminder statistics
   * @returns {Object} Reminder statistics
   */
  getStats() {
    const reminders = this.getScheduledReminders();
    const stats = {
      total: reminders.length,
      byType: {},
      upcoming: 0
    };

    const now = new Date();
    
    reminders.forEach(reminder => {
      // Count by type
      stats.byType[reminder.type] = (stats.byType[reminder.type] || 0) + 1;
      
      // Count upcoming (within next 24 hours)
      if (reminder.scheduledTime > now && 
          reminder.scheduledTime <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
        stats.upcoming++;
      }
    });

    return stats;
  }
}

export default new ReminderScheduler();
