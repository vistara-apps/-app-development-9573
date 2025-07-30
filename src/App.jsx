import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './contexts/BookingContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import BusinessDashboard from './pages/BusinessDashboard';
import CustomerBooking from './pages/CustomerBooking';
import BusinessOnboarding from './pages/BusinessOnboarding';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<BusinessDashboard />} />
            <Route path="/book/:businessId" element={<CustomerBooking />} />
            <Route path="/onboarding" element={<BusinessOnboarding />} />
          </Routes>
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;