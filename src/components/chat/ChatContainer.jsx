import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../hooks/useChat';

const ChatContainer = ({ 
  isOpen = false, 
  onToggle, 
  businessId = null,
  bookingContext = null,
  className = '' 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const chatRef = useRef(null);
  
  const {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    clearChat,
    agentInfo
  } = useChat({ businessId, bookingContext });

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setHasUnreadMessages(false);
    }
  }, [isOpen, isMinimized]);

  // Set unread indicator when new messages arrive and chat is closed/minimized
  useEffect(() => {
    if (messages.length > 0 && (!isOpen || isMinimized)) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'agent') {
        setHasUnreadMessages(true);
      }
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setHasUnreadMessages(false);
    }
  };

  const handleClose = () => {
    setIsMinimized(false);
    setHasUnreadMessages(false);
    onToggle();
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={onToggle}
          className={`
            bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg 
            transition-all duration-200 transform hover:scale-105 relative
            ${hasUnreadMessages ? 'animate-pulse' : ''}
          `}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div 
        ref={chatRef}
        className={`
          bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300
          ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'}
        `}
      >
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} />
            <div>
              <h3 className="font-semibold text-sm">
                {agentInfo?.name || 'BookIt Assistant'}
              </h3>
              {!isMinimized && (
                <p className="text-blue-100 text-xs">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleMinimize}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={handleClose}
              className="text-blue-100 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 flex flex-col h-[400px]">
              <MessageList 
                messages={messages} 
                isLoading={isLoading}
                className="flex-1"
              />
              
              {isTyping && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <TypingIndicator />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200">
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                placeholder="Ask about appointments, availability, or booking..."
              />
            </div>
          </>
        )}

        {/* Minimized State */}
        {isMinimized && hasUnreadMessages && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
