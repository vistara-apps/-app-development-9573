import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, User, CreditCard, MapPin, Star } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useReminderScheduler } from '../hooks/useReminderScheduler';

function CustomerBooking() {
  const { businessId } = useParams();
  const { state, dispatch } = useBooking();
  const { createSession } = usePaymentContext();
  const { scheduleReminder } = useReminderScheduler();
  
  const [step, setStep] = useState(1); // 1: service, 2: time, 3: details, 4: payment
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [smsReminderEnabled, setSmsReminderEnabled] = useState(true);
  const [paymentCompleted, setPlatementCompleted] = useState(false);

  const business = state.businesses.find(b => b.id === parseInt(businessId));

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <p className="text-gray-600">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Generate available time slots
  const generateTimeSlots = (date) => {
    const dayName = new Date(date).toLocaleLowerName('en-US', { weekday: 'lowercase' });
    const availability = business.availability[dayName];
    
    if (!availability) return [];
    
    const slots = [];
    const start = parseInt(availability.start.split(':')[0]);
    const end = parseInt(availability.end.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(4);
  };

  const handlePayment = async () => {
    try {
      await createSession();
      setPlatementCompleted(true);
      
      // Create the booking
      const newBooking = {
        businessId: business.id,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
        service: selectedService.name,
        status: 'confirmed',
        customer: customerDetails,
        reminder: {
          enabled: smsReminderEnabled,
          status: 'pending',
          scheduledTime: null,
          sentTime: null,
          attempts: 0,
          lastError: null
        }
      };

      dispatch({ type: 'ADD_BOOKING', payload: newBooking });
      
      // Schedule reminder if enabled
      if (smsReminderEnabled) {
        // We need to get the booking with the generated ID
        setTimeout(() => {
          const createdBooking = state.bookings.find(b => 
            b.businessId === business.id &&
            b.date === selectedDate &&
            b.time === selectedTime &&
            b.customer.email === customerDetails.email
          );
          if (createdBooking) {
            scheduleReminder(createdBooking);
          }
        }, 100); // Small delay to ensure booking is added to state
      }
      
      // Add customer if new
      const existingCustomer = state.customers.find(c => c.email === customerDetails.email);
      if (!existingCustomer) {
        dispatch({ type: 'ADD_CUSTOMER', payload: customerDetails });
      }

      setStep(5); // Success step
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Business Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
            <p className="text-gray-600 mb-4">{business.description}</p>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{business.location}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              <span className="ml-1 text-sm text-gray-600">4.8 (127 reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {business.services.map((service) => (
              <div
                key={service.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => handleServiceSelect(service)}
              >
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {service.duration} mins
                  </span>
                  <span className="font-bold text-blue-600">${service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>

            {selectedDate && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Times</h3>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm border rounded ${
                        selectedTime === time
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedDate && selectedTime && (
            <div className="mt-8">
              <button onClick={handleTimeSelect} className="btn btn-primary">
                Continue to Details
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Your Details</h2>
          
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                className="input"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="smsReminder"
                checked={smsReminderEnabled}
                onChange={(e) => setSmsReminderEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smsReminder" className="text-sm text-gray-700">
                <span className="font-medium">Send me SMS reminders</span>
                <br />
                <span className="text-gray-500">Get a text message 1 hour before your appointment</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Continue to Payment
            </button>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Booking Summary & Payment</h2>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Service:</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{selectedService.duration} minutes</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-blue-600">${selectedService.price}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{customerDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium">{customerDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{customerDetails.phone}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            className="btn btn-primary w-full"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ${selectedService.price} & Confirm Booking
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="card text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been confirmed. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Location:</strong> {business.location}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default CustomerBooking;
