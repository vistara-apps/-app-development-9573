// SMS Service for sending appointment reminders
class SMSService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TWILIO_API_KEY;
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
    this.baseUrl = 'https://api.twilio.com/2010-04-01';
  }

  /**
   * Send SMS reminder
   * @param {Object} reminderData - Reminder information
   * @returns {Promise<Object>} SMS sending result
   */
  async sendReminder(reminderData) {
    const { phoneNumber, message, appointmentId } = reminderData;

    try {
      // For demo purposes, we'll simulate SMS sending
      // In production, you would integrate with Twilio or another SMS provider
      console.log('Sending SMS reminder:', {
        to: phoneNumber,
        message,
        appointmentId
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const response = {
        sid: `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        status: 'sent',
        to: phoneNumber,
        from: this.fromNumber,
        body: message,
        dateCreated: new Date().toISOString(),
        appointmentId
      };

      return response;
    } catch (error) {
      console.error('Failed to send SMS reminder:', error);
      throw new Error('Failed to send SMS reminder');
    }
  }

  /**
   * Send appointment confirmation SMS
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async sendConfirmation(appointment) {
    const { customerPhone, businessName, service, date, time, location } = appointment;

    const message = `✅ Booking Confirmed!\n\nBusiness: ${businessName}\nService: ${service}\nDate: ${date}\nTime: ${time}${location ? `\nLocation: ${location}` : ''}\n\nReply CANCEL to cancel or RESCHEDULE to reschedule.`;

    return this.sendReminder({
      phoneNumber: customerPhone,
      message,
      appointmentId: appointment.id
    });
  }

  /**
   * Send 1-hour reminder SMS
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async sendHourlyReminder(appointment) {
    const { customerPhone, businessName, service, time, location } = appointment;

    const message = `⏰ Reminder: Your appointment is in 1 hour!\n\nBusiness: ${businessName}\nService: ${service}\nTime: ${time}${location ? `\nLocation: ${location}` : ''}\n\nSee you soon!`;

    return this.sendReminder({
      phoneNumber: customerPhone,
      message,
      appointmentId: appointment.id
    });
  }

  /**
   * Send day-before reminder SMS
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async sendDayBeforeReminder(appointment) {
    const { customerPhone, businessName, service, date, time, location } = appointment;

    const message = `📅 Reminder: You have an appointment tomorrow!\n\nBusiness: ${businessName}\nService: ${service}\nDate: ${date}\nTime: ${time}${location ? `\nLocation: ${location}` : ''}\n\nReply CONFIRM to confirm or RESCHEDULE to reschedule.`;

    return this.sendReminder({
      phoneNumber: customerPhone,
      message,
      appointmentId: appointment.id
    });
  }

  /**
   * Send cancellation SMS
   * @param {Object} appointment - Appointment details
   * @returns {Promise<Object>} SMS result
   */
  async sendCancellation(appointment) {
    const { customerPhone, businessName, service, date, time } = appointment;

    const message = `❌ Appointment Cancelled\n\nYour appointment with ${businessName} for ${service} on ${date} at ${time} has been cancelled.\n\nTo book a new appointment, visit our booking page.`;

    return this.sendReminder({
      phoneNumber: customerPhone,
      message,
      appointmentId: appointment.id
    });
  }

  /**
   * Send reschedule confirmation SMS
   * @param {Object} appointment - New appointment details
   * @param {Object} oldAppointment - Previous appointment details
   * @returns {Promise<Object>} SMS result
   */
  async sendRescheduleConfirmation(appointment, oldAppointment) {
    const { customerPhone, businessName, service, date, time, location } = appointment;

    const message = `🔄 Appointment Rescheduled!\n\nBusiness: ${businessName}\nService: ${service}\nNew Date: ${date}\nNew Time: ${time}${location ? `\nLocation: ${location}` : ''}\n\nPrevious appointment (${oldAppointment.date} at ${oldAppointment.time}) has been cancelled.`;

    return this.sendReminder({
      phoneNumber: customerPhone,
      message,
      appointmentId: appointment.id
    });
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Whether phone number is valid
   */
  validatePhoneNumber(phoneNumber) {
    // Basic phone number validation (US format)
    const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164 format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    return phoneNumber; // Return as-is if already formatted or invalid
  }

  /**
   * Get SMS delivery status
   * @param {string} messageSid - Twilio message SID
   * @returns {Promise<Object>} Message status
   */
  async getMessageStatus(messageSid) {
    try {
      // In production, you would query Twilio's API for message status
      // For demo, return mock status
      return {
        sid: messageSid,
        status: 'delivered',
        dateUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get message status:', error);
      throw new Error('Failed to retrieve message status');
    }
  }
}

export default new SMSService();
