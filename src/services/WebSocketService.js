import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  /**
   * Connect to WebSocket server
   * @param {string} url - WebSocket server URL
   * @param {Object} options - Connection options
   */
  connect(url = process.env.REACT_APP_WS_URL || 'ws://localhost:3001', options = {}) {
    if (this.socket && this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        ...options
      });

      this.setupEventListeners();
      console.log('WebSocket connection initiated');
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  /**
   * Setup WebSocket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection', { status: 'disconnected', reason });
      
      // Auto-reconnect logic
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        return;
      }
      
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.emit('connection', { status: 'error', error: error.message });
      this.handleReconnect();
    });

    // Chat-specific events
    this.socket.on('agent_response', (data) => {
      this.emit('agent_response', data);
    });

    this.socket.on('agent_typing', (data) => {
      this.emit('agent_typing', data);
    });

    this.socket.on('booking_update', (data) => {
      this.emit('booking_update', data);
    });

    this.socket.on('reminder_sent', (data) => {
      this.emit('reminder_sent', data);
    });
  }

  /**
   * Handle reconnection attempts
   */
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      this.emit('connection', { status: 'failed', reason: 'max_attempts_reached' });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      if (!this.isConnected && this.socket) {
        this.socket.connect();
      }
    }, delay);
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket disconnected manually');
    }
  }

  /**
   * Send message to agent
   * @param {Object} messageData - Message data
   */
  sendMessage(messageData) {
    if (!this.isConnected || !this.socket) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      this.socket.emit('chat_message', messageData);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * Join a chat room
   * @param {string} roomId - Room ID to join
   */
  joinRoom(roomId) {
    if (!this.isConnected || !this.socket) {
      console.warn('WebSocket not connected, cannot join room');
      return false;
    }

    try {
      this.socket.emit('join_room', { roomId });
      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  }

  /**
   * Leave a chat room
   * @param {string} roomId - Room ID to leave
   */
  leaveRoom(roomId) {
    if (!this.isConnected || !this.socket) {
      return false;
    }

    try {
      this.socket.emit('leave_room', { roomId });
      return true;
    } catch (error) {
      console.error('Failed to leave room:', error);
      return false;
    }
  }

  /**
   * Send typing indicator
   * @param {Object} typingData - Typing indicator data
   */
  sendTyping(typingData) {
    if (!this.isConnected || !this.socket) {
      return false;
    }

    try {
      this.socket.emit('typing', typingData);
      return true;
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
      return false;
    }
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Emit event to listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   * @returns {Object} Connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id || null
    };
  }

  /**
   * Send ping to server
   */
  ping() {
    if (!this.isConnected || !this.socket) {
      return false;
    }

    try {
      this.socket.emit('ping', { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('Failed to send ping:', error);
      return false;
    }
  }
}

export default new WebSocketService();
