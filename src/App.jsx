import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './contexts/BookingContext';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import BusinessDashboard from './pages/BusinessDashboard';
import CustomerBooking from './pages/CustomerBooking';
import BusinessOnboarding from './pages/BusinessOnboarding';
import AgentChat from './pages/AgentChat';

function App() {
  return (
    <BookingProvider>
      <ChatProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<BusinessDashboard />} />
              <Route path="/book/:businessId" element={<CustomerBooking />} />
              <Route path="/onboarding" element={<BusinessOnboarding />} />
              <Route path="/chat" element={<AgentChat />} />
              <Route path="/chat/:businessId" element={<AgentChat />} />
            </Routes>
          </div>
        </Router>
      </ChatProvider>
    </BookingProvider>
  );
}

export default App;
