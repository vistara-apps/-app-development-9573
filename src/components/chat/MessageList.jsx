import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Bot, User, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const MessageList = ({ messages = [], isLoading = false, className = '' }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch (error) {
      return '';
    }
  };

  const getMessageIcon = (sender, messageType) => {
    if (sender === 'user') {
      return <User size={16} className="text-blue-600" />;
    }
    
    switch (messageType) {
      case 'booking':
        return <Calendar size={16} className="text-green-600" />;
      case 'reminder':
        return <Clock size={16} className="text-orange-600" />;
      case 'confirmation':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Bot size={16} className="text-gray-600" />;
    }
  };

  const renderMessageContent = (message) => {
    // Handle different message types
    if (message.type === 'booking_confirmation') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="font-semibold text-green-800">Booking Confirmed</span>
          </div>
          <div className="text-sm text-green-700">
            <p><strong>Service:</strong> {message.booking?.service}</p>
            <p><strong>Date:</strong> {message.booking?.date}</p>
            <p><strong>Time:</strong> {message.booking?.time}</p>
            {message.booking?.location && (
              <p><strong>Location:</strong> {message.booking.location}</p>
            )}
          </div>
        </div>
      );
    }

    if (message.type === 'availability') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar size={16} className="text-blue-600" />
            <span className="font-semibold text-blue-800">Available Times</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {message.availableSlots?.map((slot, index) => (
              <button
                key={index}
                className="bg-white border border-blue-300 rounded px-2 py-1 text-blue-700 hover:bg-blue-100 transition-colors"
                onClick={() => message.onSlotSelect?.(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Default text message
    return (
      <div className="whitespace-pre-wrap break-words">
        {message.content}
      </div>
    );
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full text-gray-500 ${className}`}>
        <Bot size={48} className="mb-4 text-gray-300" />
        <p className="text-center">
          Hi! I'm your BookIt assistant. 👋<br />
          Ask me about appointments, availability, or any booking questions!
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-2 shadow-sm
                ${message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                }
              `}
            >
              {/* Message Header */}
              <div className="flex items-center space-x-2 mb-1">
                {getMessageIcon(message.sender, message.type)}
                <span className="text-xs opacity-75">
                  {message.sender === 'user' ? 'You' : (message.agentName || 'Assistant')}
                </span>
                {message.timestamp && (
                  <span className="text-xs opacity-50">
                    {formatMessageTime(message.timestamp)}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="text-sm">
                {renderMessageContent(message)}
              </div>

              {/* Message Status */}
              {message.status && (
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-50">
                    {message.status}
                  </span>
                  {message.status === 'delivered' && (
                    <CheckCircle size={12} className="opacity-50" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-gray-600" />
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-600">Assistant is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
