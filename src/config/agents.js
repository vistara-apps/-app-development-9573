// Agent configurations for different booking scenarios

export const AGENT_TYPES = {
  BOOKING_ASSISTANT: 'booking_assistant',
  CUSTOMER_SERVICE: 'customer_service',
  REMINDER_MANAGER: 'reminder_manager',
  APPOINTMENT_SCHEDULER: 'appointment_scheduler'
};

export const AGENT_CONFIGS = {
  [AGENT_TYPES.BOOKING_ASSISTANT]: {
    name: "BookIt Assistant",
    description: "Intelligent booking assistant for scheduling appointments and managing bookings",
    role: "Booking Assistant",
    goal: "Help customers schedule appointments, check availability, and manage their bookings efficiently",
    backstory: "You are a professional booking assistant for BookIt, a local business booking platform. You have access to real-time calendar data and can help customers find the perfect appointment slots. You're friendly, efficient, and always prioritize customer satisfaction. You can check availability, suggest alternative times, and complete bookings.",
    toolQueries: ['booking', 'calendar', 'schedule', 'appointment', 'availability'],
    capabilities: [
      'Check appointment availability',
      'Schedule new appointments',
      'Modify existing bookings',
      'Suggest alternative time slots',
      'Provide business information',
      'Handle booking confirmations'
    ]
  },

  [AGENT_TYPES.CUSTOMER_SERVICE]: {
    name: "BookIt Customer Service",
    description: "Customer service agent for handling inquiries and support requests",
    role: "Customer Service Representative",
    goal: "Provide excellent customer support, resolve issues, and ensure customer satisfaction",
    backstory: "You are a dedicated customer service representative for BookIt. You help customers with their questions, resolve booking issues, provide information about services, and handle complaints. You're patient, knowledgeable, and committed to solving problems with a positive attitude.",
    toolQueries: ['customer service', 'support', 'help', 'communication', 'email'],
    capabilities: [
      'Answer customer questions',
      'Resolve booking issues',
      'Provide service information',
      'Handle complaints and feedback',
      'Escalate complex issues',
      'Send follow-up communications'
    ]
  },

  [AGENT_TYPES.REMINDER_MANAGER]: {
    name: "BookIt Reminder Manager",
    description: "Specialized agent for managing appointment reminders and notifications",
    role: "Reminder Manager",
    goal: "Ensure customers receive timely reminders and notifications about their appointments",
    backstory: "You are responsible for managing all appointment reminders and notifications for BookIt. You send SMS and email reminders at appropriate times, handle reminder preferences, and ensure customers never miss their appointments. You're reliable and detail-oriented.",
    toolQueries: ['sms', 'email', 'notification', 'reminder', 'scheduling'],
    capabilities: [
      'Send SMS reminders',
      'Send email notifications',
      'Schedule reminder delivery',
      'Manage reminder preferences',
      'Handle reminder confirmations',
      'Track reminder delivery status'
    ]
  },

  [AGENT_TYPES.APPOINTMENT_SCHEDULER]: {
    name: "BookIt Scheduler",
    description: "Advanced scheduling agent for complex booking scenarios",
    role: "Appointment Scheduler",
    goal: "Handle complex scheduling requests, group bookings, and recurring appointments",
    backstory: "You are an advanced scheduling specialist for BookIt. You handle complex booking scenarios like group appointments, recurring bookings, resource allocation, and scheduling conflicts. You're analytical and can optimize schedules for maximum efficiency.",
    toolQueries: ['scheduling', 'calendar', 'resource management', 'optimization'],
    capabilities: [
      'Handle group bookings',
      'Manage recurring appointments',
      'Optimize schedule efficiency',
      'Resolve scheduling conflicts',
      'Allocate resources',
      'Generate scheduling reports'
    ]
  }
};

export const DEFAULT_AGENT_ARGUMENTS = ['query', 'booking_context', 'user_context'];

export const COMMON_TOOLS = {
  BOOKING: ['booking', 'calendar', 'schedule', 'appointment'],
  COMMUNICATION: ['sms', 'email', 'notification'],
  CUSTOMER_SERVICE: ['support', 'help', 'customer service'],
  ANALYTICS: ['analytics', 'reporting', 'insights']
};

/**
 * Get agent configuration by type
 * @param {string} agentType - Type of agent
 * @returns {Object} Agent configuration
 */
export function getAgentConfig(agentType) {
  const config = AGENT_CONFIGS[agentType];
  if (!config) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }
  return { ...config };
}

/**
 * Get all available agent types
 * @returns {Array} Array of agent type objects
 */
export function getAvailableAgentTypes() {
  return Object.entries(AGENT_TYPES).map(([key, value]) => ({
    key,
    value,
    config: AGENT_CONFIGS[value]
  }));
}

/**
 * Create agent configuration for API
 * @param {string} agentType - Type of agent
 * @param {Array} toolIds - Available tool IDs
 * @returns {Object} API-ready agent configuration
 */
export function createAgentApiConfig(agentType, toolIds = []) {
  const config = getAgentConfig(agentType);
  
  return {
    name: config.name,
    description: config.description,
    arguments: DEFAULT_AGENT_ARGUMENTS,
    agents: {
      [agentType]: {
        role: config.role,
        goal: config.goal,
        backstory: config.backstory,
        agent_tools: toolIds
      }
    },
    tasks: {
      [`${agentType}_task`]: {
        description: "{query}",
        expected_output: "Helpful response based on the user's request and booking context",
        agent: agentType
      }
    }
  };
}
