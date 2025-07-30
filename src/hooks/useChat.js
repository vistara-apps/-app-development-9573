import { useEffect } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useBooking } from '../contexts/BookingContext';

/**
 * Custom hook for chat functionality
 * @param {Object} options - Configuration options
 * @param {string} options.businessId - Business ID for context
 * @param {Object} options.bookingContext - Additional booking context
 * @param {boolean} options.autoInitialize - Whether to auto-initialize agent
 * @returns {Object} Chat state and methods
 */
export const useChat = ({ 
  businessId = null, 
  bookingContext = null, 
  autoInitialize = true 
} = {}) => {
  const chatContext = useChatContext();
  const bookingCtx = useBooking();

  const {
    messages,
    currentAgent,
    agentInfo,
    isLoading,
    isTyping,
    error,
    sessionId,
    initializeAgent,
    sendMessage,
    clearChat,
    setBookingContext,
    setUserContext,
    clearError
  } = chatContext;

  // Initialize agent on mount
  useEffect(() => {
    if (autoInitialize && !currentAgent) {
      initializeAgent();
    }
  }, [autoInitialize, currentAgent, initializeAgent]);

  // Update booking context when it changes
  useEffect(() => {
    if (bookingContext || bookingCtx) {
      const context = {
        ...bookingCtx,
        ...bookingContext,
        businessId,
        timestamp: new Date().toISOString()
      };
      setBookingContext(context);
    }
  }, [bookingContext, bookingCtx, businessId, setBookingContext]);

  // Set user context based on available data
  useEffect(() => {
    const userContext = {
      businessId,
      sessionId,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    setUserContext(userContext);
  }, [businessId, sessionId, setUserContext]);

  return {
    // State
    messages,
    currentAgent,
    agentInfo,
    isLoading,
    isTyping,
    error,
    sessionId,
    
    // Methods
    sendMessage,
    clearChat,
    clearError,
    initializeAgent,
    
    // Computed properties
    hasMessages: messages.length > 0,
    isInitialized: !!currentAgent,
    lastMessage: messages[messages.length - 1] || null
  };
};
