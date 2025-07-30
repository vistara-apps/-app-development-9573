import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Settings, RefreshCw } from 'lucide-react';
import ChatContainer from '../components/chat/ChatContainer';
import { useChat } from '../hooks/useChat';
import { useBooking } from '../contexts/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';

const AgentChat = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { businesses } = useBooking();
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const business = businesses.find(b => b.id === businessId);
  
  const {
    messages,
    isLoading,
    error,
    clearError,
    initializeAgent,
    clearChat
  } = useChat({
    businessId,
    bookingContext: { business },
    autoInitialize: true
  });

  useEffect(() => {
    if (error) {
      setToast({
        type: 'error',
        message: error,
        duration: 5000
      });
    }
  }, [error]);

  const handleClearChat = () => {
    clearChat();
    setToast({
      type: 'success',
      message: 'Chat cleared successfully',
      duration: 3000
    });
  };

  const handleRefreshAgent = async () => {
    try {
      await initializeAgent();
      setToast({
        type: 'success',
        message: 'Agent refreshed successfully',
        duration: 3000
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to refresh agent',
        duration: 5000
      });
    }
  };

  const handleCloseToast = () => {
    setToast(null);
    clearError();
  };

  if (!business && businessId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <MessageCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600 mb-6">
            The business you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MessageCircle size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    BookIt Assistant
                  </h1>
                  <p className="text-sm text-gray-500">
                    {business ? `Chat for ${business.name}` : 'General booking assistance'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefreshAgent}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Refresh agent"
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors"
                aria-label="Chat settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Chat Settings</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClearChat}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Clear Chat
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-900">Messages</div>
                <div className="text-gray-600">{messages.length} total</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-900">Status</div>
                <div className="text-gray-600">
                  {isLoading ? 'Processing...' : 'Ready'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-900">Business</div>
                <div className="text-gray-600">
                  {business?.name || 'General'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/book/${businessId}`)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  📅 Book Appointment
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  📊 View Dashboard
                </button>
                
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  🗑️ Clear Chat
                </button>
              </div>

              {business && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Business Info
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Name:</span> {business.name}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {business.category}
                    </div>
                    {business.location && (
                      <div>
                        <span className="font-medium">Location:</span> {business.location}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
              <div className="flex-1 p-6">
                {isLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <LoadingSpinner size="lg" />
                      <p className="mt-4 text-gray-600">Initializing your assistant...</p>
                    </div>
                  </div>
                ) : (
                  <ChatContainer
                    isOpen={true}
                    onToggle={() => {}}
                    businessId={businessId}
                    bookingContext={{ business }}
                    className="relative h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleCloseToast}
          duration={toast.duration}
        />
      )}
    </div>
  );
};

export default AgentChat;
