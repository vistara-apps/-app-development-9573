import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, BarChart, ArrowRight, CheckCircle } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

function LandingPage() {
  const { state, dispatch } = useBooking();

  const handleBusinessLogin = () => {
    dispatch({
      type: 'SET_USER',
      payload: {
        user: { name: 'Business Owner', email: 'business@example.com' },
        userType: 'business'
      }
    });
  };

  const handleCustomerLogin = () => {
    dispatch({
      type: 'SET_USER',
      payload: {
        user: { name: 'Customer', email: 'customer@example.com' },
        userType: 'customer'
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionize Your 
              <span className="text-blue-600"> Booking Experience</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your operations with BookIt's seamless booking system. 
              Real-time availability, centralized management, and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleBusinessLogin}
                className="btn btn-primary text-lg px-8 py-3"
              >
                Start as Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={handleCustomerLogin}
                className="btn btn-secondary text-lg px-8 py-3"
              >
                Book a Service
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage bookings efficiently and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Booking</h3>
              <p className="text-gray-600">
                Frictionless, intuitive booking process that converts visitors into customers
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
              <p className="text-gray-600">
                Display live availability to help customers make informed booking decisions
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Centralized Management</h3>
              <p className="text-gray-600">
                Single platform to manage all bookings, customers, and business operations
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Insights</h3>
              <p className="text-gray-600">
                Data-driven insights to optimize your offerings and improve customer experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Businesses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Try booking with our sample businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {state.businesses.map((business) => (
              <div key={business.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{business.name}</h3>
                    <p className="text-gray-600 mt-1">{business.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{business.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {business.industry}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Services:</h4>
                  <div className="space-y-1">
                    {business.services.slice(0, 2).map((service) => (
                      <div key={service.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{service.name}</span>
                        <span className="text-gray-900 font-medium">${service.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/book/${business.id}`}
                  className="btn btn-primary w-full"
                  onClick={handleCustomerLogin}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Dynamic pricing based on your business size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$29/month</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Up to 100 bookings/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Basic calendar management
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Email notifications
                </li>
              </ul>
              <button className="btn btn-secondary w-full">Get Started</button>
            </div>

            <div className="card border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$79/month</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Up to 500 bookings/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  SMS notifications
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Payment processing
                </li>
              </ul>
              <button className="btn btn-primary w-full">Get Started</button>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$199/month</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Unlimited bookings
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Multi-location support
                </li>
              </ul>
              <button className="btn btn-secondary w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;