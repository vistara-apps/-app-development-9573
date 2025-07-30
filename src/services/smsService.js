import twilio from 'twilio';

class SMSService {
  constructor() {
    this.client = null;
    this.fromNumber = null;
    this.isConfigured = false;
    this.initializeTwilio();
  }

  initializeTwilio() {
    try {
      const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
      const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
      const fromNumber = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

      if (accountSid && authToken && fromNumber) {
        this.client = twilio(accountSid, authToken);
        this.fromNumber = fromNumber;
        this.isConfigured = true;
        console.log('Twilio SMS service initialized successfully');
      } else {
        console.warn('Twilio credentials not found. SMS service will be disabled.');
        this.isConfigured = false;
      }
    } catch (error) {
      console.error('Failed to initialize Twilio:', error);
      this.isConfigured = false;
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming US)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('+')) {
      return phoneNumber;
    }
    
    return phoneNumber; // Return as-is if format is unclear
  }

  validatePhoneNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Basic validation for international format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(formatted);
  }

  async sendSMS(to, message, options = {}) {
    if (!this.isConfigured) {
      throw new Error('SMS service is not configured. Please check Twilio credentials.');
    }

    if (!this.validatePhoneNumber(to)) {
      throw new Error(`Invalid phone number format: ${to}`);
    }

    const formattedTo = this.formatPhoneNumber(to);
    
    try {
      const messageOptions = {
        body: message,
        from: this.fromNumber,
        to: formattedTo,
        ...options
      };

      const result = await this.client.messages.create(messageOptions);
      
      console.log(`SMS sent successfully to ${formattedTo}. SID: ${result.sid}`);
      
      return {
        success: true,
        sid: result.sid,
        to: formattedTo,
        status: result.status,
        dateCreated: result.dateCreated
      };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      
      return {
        success: false,
        error: error.message,
        code: error.code,
        to: formattedTo
      };
    }
  }

  async sendAppointmentReminder(booking, business) {
    const { customer, date, time, service } = booking;
    const { name: businessName, location } = business;
    
    const appointmentDate = new Date(`${date}T${time}`);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = `Hi ${customer.name}! This is a reminder that you have an appointment for ${service} at ${businessName} tomorrow at ${formattedTime}. Location: ${location}. See you soon!`;

    return await this.sendSMS(customer.phone, message);
  }

  async sendBookingConfirmation(booking, business) {
    const { customer, date, time, service } = booking;
    const { name: businessName, location } = business;
    
    const appointmentDate = new Date(`${date}T${time}`);
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const message = `Booking confirmed! Your ${service} appointment at ${businessName} is scheduled for ${formattedDate} at ${formattedTime}. Location: ${location}. We'll send you a reminder 1 hour before your appointment.`;

    return await this.sendSMS(customer.phone, message);
  }

  // Method to test SMS service configuration
  async testConnection(testPhoneNumber) {
    if (!this.isConfigured) {
      return { success: false, error: 'SMS service not configured' };
    }

    const testMessage = 'This is a test message from BookIt SMS service.';
    return await this.sendSMS(testPhoneNumber, testMessage);
  }
}

// Create and export a singleton instance
const smsService = new SMSService();
export default smsService;

