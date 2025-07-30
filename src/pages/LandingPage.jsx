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
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8 animate-bounce-subtle">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
              Trusted by 1000+ local businesses
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Revolutionize Your 
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> Booking Experience</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Streamline your operations with BookIt's seamless booking system. 
              Real-time availability, centralized management, and data-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={handleBusinessLogin}
                className="btn btn-primary btn-xl group"
              >
                Start as Business
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={handleCustomerLogin}
                className="btn btn-secondary btn-xl"
              >
                Book a Service
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm font-medium">Join 1000+ businesses</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-6">
              ✨ Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to 
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your booking process and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 transition-all duration-300">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Seamless Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Frictionless, intuitive booking process that converts visitors into customers with ease
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-success-100 to-success-200 group-hover:from-success-200 group-hover:to-success-300 transition-all duration-300">
                <Clock className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Real-time Availability</h3>
              <p className="text-gray-600 leading-relaxed">
                Display live availability to help customers make informed booking decisions instantly
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Centralized Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Single platform to manage all bookings, customers, and business operations efficiently
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <BarChart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Customer Insights</h3>
              <p className="text-gray-600 leading-relaxed">
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
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              💰 Pricing Plans
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, 
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"> Transparent Pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your business. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="pricing-card">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small businesses</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Up to 100 bookings/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic calendar management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic support</span>
                </li>
              </ul>
              <button className="btn btn-secondary w-full">Get Started</button>
            </div>

            <div className="pricing-card pricing-card-featured">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600 mb-6">Best for growing businesses</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">$79</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Up to 500 bookings/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">SMS notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Payment processing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <button className="btn btn-primary w-full">Get Started</button>
            </div>

            <div className="pricing-card">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">$199</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited bookings</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">White-label solution</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Multi-location support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
              </ul>
              <button className="btn btn-secondary w-full">Contact Sales</button>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                Cancel anytime
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                No setup fees
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
