import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function BusinessOnboarding() {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  const [step, setStep] = useState(1);
  const [businessData, setBusinessData] = useState({
    name: '',
    description: '',
    location: '',
    industry: '',
    size: '',
    services: [],
    availability: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: null
    }
  });

  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: ''
  });

  const industries = ['Beauty & Wellness', 'Healthcare', 'Professional Services', 'Automotive', 'Technology', 'Other'];
  const sizes = ['Small (1-10 employees)', 'Medium (11-50 employees)', 'Large (50+ employees)'];

  const handleBasicInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAddService = () => {
    if (newService.name && newService.duration && newService.price) {
      setBusinessData({
        ...businessData,
        services: [...businessData.services, { ...newService, id: Date.now() }]
      });
      setNewService({ name: '', duration: '', price: '' });
    }
  };

  const handleRemoveService = (serviceId) => {
    setBusinessData({
      ...businessData,
      services: businessData.services.filter(service => service.id !== serviceId)
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setBusinessData({
      ...businessData,
      availability: {
        ...businessData.availability,
        [day]: value === null ? null : {
          ...businessData.availability[day],
          [field]: value
        }
      }
    });
  };

  const handleFinish = () => {
    dispatch({ type: 'ADD_BUSINESS', payload: businessData });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Set Up Your Business</h1>
        <p className="text-gray-600 mt-2">Let's get your booking system configured</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Building className="h-6 w-6 mr-2" />
            Business Information
          </h2>
          
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                required
                value={businessData.name}
                onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                className="input"
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={businessData.description}
                onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                className="input h-24 resize-none"
                placeholder="Describe your business and services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                required
                value={businessData.location}
                onChange={(e) => setBusinessData({...businessData, location: e.target.value})}
                className="input"
                placeholder="Your business address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  required
                  value={businessData.industry}
                  onChange={(e) => setBusinessData({...businessData, industry: e.target.value})}
                  className="input"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Size
                </label>
                <select
                  required
                  value={businessData.size}
                  onChange={(e) => setBusinessData({...businessData, size: e.target.value})}
                  className="input"
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Continue to Services
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Services & Pricing
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Add a Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="input"
                placeholder="Service name"
              />
              <input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                className="input"
                placeholder="Duration (minutes)"
              />
              <div className="flex">
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="input rounded-r-none"
                  placeholder="Price"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="btn btn-primary rounded-l-none"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {businessData.services.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Services</h3>
              <div className="space-y-3">
                {businessData.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{service.name}</span>
                      <span className="text-gray-600 ml-2">• {service.duration} mins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-600">${service.price}</span>
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              Back
            </button>
            <button 
              onClick={() => setStep(3)} 
              className="btn btn-primary flex-1"
              disabled={businessData.services.length === 0}
            >
              Continue to Availability
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Availability */}
      {step === 3 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Clock className="h-6 w-6 mr-2" />
            Business Hours
          </h2>

          <div className="space-y-4 mb-6">
            {Object.entries(businessData.availability).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="font-medium capitalize">{day}</span>
                </div>
                
                <div className="flex items-center space-x-4 flex-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours !== null}
                      onChange={(e) => handleAvailabilityChange(day, null, e.target.checked ? { start: '09:00', end: '17:00' } : null)}
                      className="mr-2"
                    />
                    Open
                  </label>

                  {hours && (
                    <>
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="input w-32"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="input w-32"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              Back
            </button>
            <button onClick={handleFinish} className="btn btn-primary flex-1">
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessOnboarding;