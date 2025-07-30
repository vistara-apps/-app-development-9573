import apiClient from './api.js';

class AgentService {
  constructor() {
    this.agentCache = new Map();
  }

  /**
   * Search for available tools based on query
   * @param {string} query - Search query for tools
   * @returns {Promise<Array>} Array of available tools
   */
  async searchTools(query) {
    try {
      const response = await apiClient.get('/tool_search', { query });
      return response || [];
    } catch (error) {
      console.error('Failed to search tools:', error);
      throw new Error('Unable to search for tools. Please try again.');
    }
  }

  /**
   * Search for existing agents based on query
   * @param {string} query - Search query for agents
   * @returns {Promise<Array>} Array of available agents
   */
  async searchAgents(query) {
    try {
      const response = await apiClient.get('/agent_search', { query });
      return response || [];
    } catch (error) {
      console.error('Failed to search agents:', error);
      throw new Error('Unable to search for agents. Please try again.');
    }
  }

  /**
   * Create and save a new agent
   * @param {Object} agentConfig - Agent configuration
   * @returns {Promise<Object>} Created agent with ID
   */
  async createAgent(agentConfig) {
    try {
      const response = await apiClient.post('/save_agent', agentConfig);
      
      if (response.agent_id) {
        // Cache the agent for future use
        this.agentCache.set(response.agent_id, {
          ...agentConfig,
          agent_id: response.agent_id,
          created_at: new Date().toISOString()
        });
      }
      
      return response;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw new Error('Unable to create agent. Please check your configuration.');
    }
  }

  /**
   * Call an agent with specific arguments
   * @param {string} agentId - Agent ID
   * @param {Object} args - Arguments to pass to the agent
   * @returns {Promise<Object>} Agent response
   */
  async callAgent(agentId, args) {
    try {
      const response = await apiClient.post(`/agent_call?agent_id=${agentId}`, args);
      return response;
    } catch (error) {
      console.error('Failed to call agent:', error);
      throw new Error('Unable to communicate with agent. Please try again.');
    }
  }

  /**
   * Get cached agent information
   * @param {string} agentId - Agent ID
   * @returns {Object|null} Cached agent data
   */
  getCachedAgent(agentId) {
    return this.agentCache.get(agentId) || null;
  }

  /**
   * Create a booking assistant agent with predefined configuration
   * @returns {Promise<Object>} Created booking agent
   */
  async createBookingAgent() {
    try {
      // First, search for booking-related tools
      const bookingTools = await this.searchTools('booking calendar schedule appointment');
      const communicationTools = await this.searchTools('email sms notification');
      
      const allTools = [...bookingTools, ...communicationTools];
      const toolIds = allTools.map(tool => tool.id || tool.payload?.id).filter(Boolean);

      const agentConfig = {
        name: "BookIt Assistant",
        description: "Intelligent booking assistant for scheduling appointments and managing bookings",
        arguments: ["query", "booking_context"],
        agents: {
          booking_agent: {
            role: "Booking Assistant",
            goal: "Help customers schedule appointments, check availability, and manage their bookings efficiently",
            backstory: "You are a professional booking assistant for BookIt, a local business booking platform. You have access to real-time calendar data and can help customers find the perfect appointment slots. You're friendly, efficient, and always prioritize customer satisfaction.",
            agent_tools: toolIds
          }
        },
        tasks: {
          booking_task: {
            description: "{query}",
            expected_output: "Helpful response with booking information, available slots, or confirmation details",
            agent: "booking_agent"
          }
        }
      };

      return await this.createAgent(agentConfig);
    } catch (error) {
      console.error('Failed to create booking agent:', error);
      throw new Error('Unable to create booking assistant. Please try again.');
    }
  }

  /**
   * Create a customer service agent
   * @returns {Promise<Object>} Created customer service agent
   */
  async createCustomerServiceAgent() {
    try {
      const serviceTools = await this.searchTools('customer service support help');
      const toolIds = serviceTools.map(tool => tool.id || tool.payload?.id).filter(Boolean);

      const agentConfig = {
        name: "BookIt Customer Service",
        description: "Customer service agent for handling inquiries and support requests",
        arguments: ["query", "customer_context"],
        agents: {
          service_agent: {
            role: "Customer Service Representative",
            goal: "Provide excellent customer support, resolve issues, and ensure customer satisfaction",
            backstory: "You are a dedicated customer service representative for BookIt. You help customers with their questions, resolve booking issues, and provide information about services. You're patient, knowledgeable, and committed to solving problems.",
            agent_tools: toolIds
          }
        },
        tasks: {
          service_task: {
            description: "{query}",
            expected_output: "Helpful customer service response with solutions or next steps",
            agent: "service_agent"
          }
        }
      };

      return await this.createAgent(agentConfig);
    } catch (error) {
      console.error('Failed to create customer service agent:', error);
      throw new Error('Unable to create customer service agent. Please try again.');
    }
  }

  /**
   * Get or create a default booking agent
   * @returns {Promise<string>} Agent ID
   */
  async getDefaultBookingAgent() {
    // Check if we have a cached default agent
    const cachedAgents = Array.from(this.agentCache.values());
    const defaultAgent = cachedAgents.find(agent => agent.name === "BookIt Assistant");
    
    if (defaultAgent) {
      return defaultAgent.agent_id;
    }

    // Create a new default agent
    const agent = await this.createBookingAgent();
    return agent.agent_id;
  }
}

export default new AgentService();
