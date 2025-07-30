import { useEffect, useCallback } from 'react';
import WebSocketService from '../services/WebSocketService';
import { useChatContext } from '../contexts/ChatContext';

/**
 * Hook for real-time chat functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Real-time chat methods and status
 */
export const useRealTimeChat = ({ 
  sessionId, 
  businessId = null, 
  autoConnect = true 
} = {}) => {
  const { 
    addMessage, 
    setTyping, 
    setError 
  } = useChatContext();

  // Handle agent response
  const handleAgentResponse = useCallback((data) => {
    const { message, agentId, sessionId: responseSessionId } = data;
    
    // Only process messages for this session
    if (responseSessionId !== sessionId) {
      return;
    }

    const agentMessage = {
      id: `msg_${Date.now()}_agent`,
      content: message.content || message,
      sender: 'agent',
      timestamp: new Date().toISOString(),
      agentId,
      type: message.type || 'text',
      agentName: message.agentName || 'BookIt Assistant'
    };

    addMessage(agentMessage);
    setTyping(false);
  }, [sessionId, addMessage, setTyping]);

  // Handle agent typing indicator
  const handleAgentTyping = useCallback((data) => {
    const { isTyping, sessionId: typingSessionId } = data;
    
    // Only process typing indicators for this session
    if (typingSessionId !== sessionId) {
      return;
    }

    setTyping(isTyping);
  }, [sessionId, setTyping]);

  // Handle booking updates
  const handleBookingUpdate = useCallback((data) => {
    const { booking, action, sessionId: updateSessionId } = data;
    
    // Only process updates for this session
    if (updateSessionId !== sessionId) {
      return;
    }

    const updateMessage = {
      id: `msg_${Date.now()}_booking_update`,
      content: `Booking ${action}: ${booking.service} on ${booking.date} at ${booking.time}`,
      sender: 'system',
      timestamp: new Date().toISOString(),
      type: 'booking_update',
      booking,
      action
    };

    addMessage(updateMessage);
  }, [sessionId, addMessage]);

  // Handle reminder notifications
  const handleReminderSent = useCallback((data) => {
    const { reminder, appointmentId } = data;
    
    const reminderMessage = {
      id: `msg_${Date.now()}_reminder`,
      content: `Reminder sent: ${reminder.type} for appointment ${appointmentId}`,
      sender: 'system',
      timestamp: new Date().toISOString(),
      type: 'reminder',
      reminder
    };

    addMessage(reminderMessage);
  }, [addMessage]);

  // Handle connection status changes
  const handleConnectionChange = useCallback((data) => {
    const { status, error } = data;
    
    if (status === 'error' || status === 'failed') {
      setError(`Connection ${status}: ${error || 'Unknown error'}`);
    } else if (status === 'connected') {
      // Join session room when connected
      if (sessionId) {
        WebSocketService.joinRoom(sessionId);
      }
    }
  }, [sessionId, setError]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      WebSocketService.connect();
      
      // Set up event listeners
      WebSocketService.on('agent_response', handleAgentResponse);
      WebSocketService.on('agent_typing', handleAgentTyping);
      WebSocketService.on('booking_update', handleBookingUpdate);
      WebSocketService.on('reminder_sent', handleReminderSent);
      WebSocketService.on('connection', handleConnectionChange);
      
      return true;
    } catch (error) {
      console.error('Failed to connect to real-time chat:', error);
      setError('Failed to connect to real-time chat');
      return false;
    }
  }, [
    handleAgentResponse,
    handleAgentTyping,
    handleBookingUpdate,
    handleReminderSent,
    handleConnectionChange,
    setError
  ]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    try {
      // Leave session room
      if (sessionId) {
        WebSocketService.leaveRoom(sessionId);
      }
      
      // Remove event listeners
      WebSocketService.off('agent_response', handleAgentResponse);
      WebSocketService.off('agent_typing', handleAgentTyping);
      WebSocketService.off('booking_update', handleBookingUpdate);
      WebSocketService.off('reminder_sent', handleReminderSent);
      WebSocketService.off('connection', handleConnectionChange);
      
      WebSocketService.disconnect();
      return true;
    } catch (error) {
      console.error('Failed to disconnect from real-time chat:', error);
      return false;
    }
  }, [
    sessionId,
    handleAgentResponse,
    handleAgentTyping,
    handleBookingUpdate,
    handleReminderSent,
    handleConnectionChange
  ]);

  // Send message via WebSocket
  const sendRealtimeMessage = useCallback((message) => {
    if (!WebSocketService.getStatus().isConnected) {
      console.warn('WebSocket not connected, cannot send real-time message');
      return false;
    }

    const messageData = {
      sessionId,
      businessId,
      message,
      timestamp: new Date().toISOString()
    };

    return WebSocketService.sendMessage(messageData);
  }, [sessionId, businessId]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!WebSocketService.getStatus().isConnected) {
      return false;
    }

    const typingData = {
      sessionId,
      businessId,
      isTyping,
      timestamp: new Date().toISOString()
    };

    return WebSocketService.sendTyping(typingData);
  }, [sessionId, businessId]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && sessionId) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, sessionId, connect, disconnect]);

  // Join room when sessionId changes
  useEffect(() => {
    if (sessionId && WebSocketService.getStatus().isConnected) {
      WebSocketService.joinRoom(sessionId);
    }
  }, [sessionId]);

  return {
    // Connection methods
    connect,
    disconnect,
    
    // Messaging methods
    sendRealtimeMessage,
    sendTypingIndicator,
    
    // Status
    isConnected: WebSocketService.getStatus().isConnected,
    connectionStatus: WebSocketService.getStatus(),
    
    // Utility methods
    ping: WebSocketService.ping.bind(WebSocketService),
    joinRoom: WebSocketService.joinRoom.bind(WebSocketService),
    leaveRoom: WebSocketService.leaveRoom.bind(WebSocketService)
  };
};
