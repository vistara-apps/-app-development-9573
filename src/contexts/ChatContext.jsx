import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AgentService from '../services/AgentService';
import { AGENT_TYPES } from '../config/agents';

// Initial state
const initialState = {
  messages: [],
  currentAgent: null,
  agentInfo: null,
  isLoading: false,
  isTyping: false,
  error: null,
  sessionId: null,
  bookingContext: null,
  userContext: null
};

// Action types
const CHAT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TYPING: 'SET_TYPING',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_MESSAGES: 'SET_MESSAGES',
  SET_AGENT: 'SET_AGENT',
  SET_AGENT_INFO: 'SET_AGENT_INFO',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_BOOKING_CONTEXT: 'SET_BOOKING_CONTEXT',
  SET_USER_CONTEXT: 'SET_USER_CONTEXT',
  SET_SESSION_ID: 'SET_SESSION_ID',
  CLEAR_CHAT: 'CLEAR_CHAT'
};

// Reducer function
function chatReducer(state, action) {
  switch (action.type) {
    case CHAT_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case CHAT_ACTIONS.SET_TYPING:
      return { ...state, isTyping: action.payload };
    
    case CHAT_ACTIONS.ADD_MESSAGE:
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case CHAT_ACTIONS.SET_MESSAGES:
      return { ...state, messages: action.payload };
    
    case CHAT_ACTIONS.SET_AGENT:
      return { ...state, currentAgent: action.payload };
    
    case CHAT_ACTIONS.SET_AGENT_INFO:
      return { ...state, agentInfo: action.payload };
    
    case CHAT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false, isTyping: false };
    
    case CHAT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case CHAT_ACTIONS.SET_BOOKING_CONTEXT:
      return { ...state, bookingContext: action.payload };
    
    case CHAT_ACTIONS.SET_USER_CONTEXT:
      return { ...state, userContext: action.payload };
    
    case CHAT_ACTIONS.SET_SESSION_ID:
      return { ...state, sessionId: action.payload };
    
    case CHAT_ACTIONS.CLEAR_CHAT:
      return { 
        ...initialState, 
        currentAgent: state.currentAgent,
        agentInfo: state.agentInfo,
        sessionId: state.sessionId,
        bookingContext: state.bookingContext,
        userContext: state.userContext
      };
    
    default:
      return state;
  }
}

// Create context
const ChatContext = createContext();

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Generate session ID on mount
  useEffect(() => {
    const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: CHAT_ACTIONS.SET_SESSION_ID, payload: sessionId });
  }, []);

  // Initialize default agent
  const initializeAgent = async (agentType = AGENT_TYPES.BOOKING_ASSISTANT) => {
    try {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: true });
      
      let agentId;
      if (agentType === AGENT_TYPES.BOOKING_ASSISTANT) {
        agentId = await AgentService.getDefaultBookingAgent();
      } else {
        // Create other agent types as needed
        const agent = await AgentService.createAgent(agentType);
        agentId = agent.agent_id;
      }
      
      const agentInfo = AgentService.getCachedAgent(agentId);
      
      dispatch({ type: CHAT_ACTIONS.SET_AGENT, payload: agentId });
      dispatch({ type: CHAT_ACTIONS.SET_AGENT_INFO, payload: agentInfo });
      
      // Add welcome message
      const welcomeMessage = {
        id: `msg_${Date.now()}`,
        content: "Hello! I'm your BookIt assistant. How can I help you with your booking today?",
        sender: 'agent',
        timestamp: new Date().toISOString(),
        agentName: agentInfo?.name || 'BookIt Assistant'
      };
      
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: welcomeMessage });
      
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Send message to agent
  const sendMessage = async (content) => {
    if (!content.trim() || !state.currentAgent) {
      return;
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: userMessage });
    dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: true });

    try {
      // Prepare context for agent
      const context = {
        query: content,
        booking_context: state.bookingContext,
        user_context: state.userContext,
        session_id: state.sessionId,
        message_history: state.messages.slice(-10) // Last 10 messages for context
      };

      const response = await AgentService.callAgent(state.currentAgent, context);
      
      const agentMessage = {
        id: `msg_${Date.now()}_agent`,
        content: response.output || response.result || 'I apologize, but I encountered an issue processing your request.',
        sender: 'agent',
        timestamp: new Date().toISOString(),
        agentName: state.agentInfo?.name || 'BookIt Assistant',
        agentResponse: response
      };

      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: agentMessage });
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'agent',
        timestamp: new Date().toISOString(),
        type: 'error',
        agentName: state.agentInfo?.name || 'BookIt Assistant'
      };
      
      dispatch({ type: CHAT_ACTIONS.ADD_MESSAGE, payload: errorMessage });
      dispatch({ type: CHAT_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: CHAT_ACTIONS.SET_TYPING, payload: false });
    }
  };

  // Clear chat history
  const clearChat = () => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_CHAT });
  };

  // Set booking context
  const setBookingContext = (context) => {
    dispatch({ type: CHAT_ACTIONS.SET_BOOKING_CONTEXT, payload: context });
  };

  // Set user context
  const setUserContext = (context) => {
    dispatch({ type: CHAT_ACTIONS.SET_USER_CONTEXT, payload: context });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    messages: state.messages,
    currentAgent: state.currentAgent,
    agentInfo: state.agentInfo,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    error: state.error,
    sessionId: state.sessionId,
    bookingContext: state.bookingContext,
    userContext: state.userContext,
    
    // Actions
    initializeAgent,
    sendMessage,
    clearChat,
    setBookingContext,
    setUserContext,
    clearError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
