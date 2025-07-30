import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BookingContext = createContext();

const initialState = {
  businesses: [
    {
      id: 1,
      name: "Bella's Hair Salon",
      description: "Premium hair styling and beauty services",
      location: "123 Main St, Downtown",
      industry: "Beauty & Wellness",
      size: "Small",
      services: [
        { id: 1, name: "Haircut & Style", duration: 60, price: 65 },
        { id: 2, name: "Hair Coloring", duration: 120, price: 120 },
        { id: 3, name: "Manicure", duration: 45, price: 35 }
      ],
      availability: {
        monday: { start: "09:00", end: "18:00" },
        tuesday: { start: "09:00", end: "18:00" },
        wednesday: { start: "09:00", end: "18:00" },
        thursday: { start: "09:00", end: "18:00" },
        friday: { start: "09:00", end: "19:00" },
        saturday: { start: "08:00", end: "17:00" },
        sunday: { start: "10:00", end: "16:00" }
      }
    },
    {
      id: 2,
      name: "TechFix Repair Shop",
      description: "Professional device repair services",
      location: "456 Tech Ave, Silicon Valley",
      industry: "Technology",
      size: "Medium",
      services: [
        { id: 1, name: "Phone Screen Repair", duration: 30, price: 80 },
        { id: 2, name: "Laptop Diagnostic", duration: 45, price: 50 },
        { id: 3, name: "Data Recovery", duration: 120, price: 150 }
      ],
      availability: {
        monday: { start: "10:00", end: "19:00" },
        tuesday: { start: "10:00", end: "19:00" },
        wednesday: { start: "10:00", end: "19:00" },
        thursday: { start: "10:00", end: "19:00" },
        friday: { start: "10:00", end: "19:00" },
        saturday: { start: "09:00", end: "17:00" },
        sunday: null
      }
    }
  ],
  bookings: [
    {
      id: 1,
      businessId: 1,
      customerId: 1,
      date: "2024-01-15",
      time: "10:00",
      duration: 60,
      service: "Haircut & Style",
      status: "confirmed",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 123-4567"
      },
      reminder: {
        enabled: true,
        status: "pending", // pending, sent, failed, cancelled
        scheduledTime: null,
        sentTime: null,
        attempts: 0,
        lastError: null
      }
    }
  ],
  customers: [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      bookingHistory: [1]
    }
  ],
  currentUser: null,
  userType: null // 'business' or 'customer'
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload.user,
        userType: action.payload.userType
      };
    
    case 'ADD_BUSINESS':
      return {
        ...state,
        businesses: [...state.businesses, { ...action.payload, id: Date.now() }]
      };
    
    case 'ADD_BOOKING':
      const newBooking = { ...action.payload, id: Date.now() };
      return {
        ...state,
        bookings: [...state.bookings, newBooking]
      };
    
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? { ...booking, ...action.payload } : booking
        )
      };
    
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, { ...action.payload, id: Date.now() }]
      };
    
    case 'UPDATE_REMINDER_STATUS':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.bookingId 
            ? { 
                ...booking, 
                reminder: { 
                  ...booking.reminder, 
                  ...action.payload.reminderData 
                } 
              } 
            : booking
        )
      };
    
    case 'SCHEDULE_REMINDER':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.bookingId 
            ? { 
                ...booking, 
                reminder: { 
                  ...booking.reminder, 
                  status: 'scheduled',
                  scheduledTime: action.payload.scheduledTime
                } 
              } 
            : booking
        )
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        [action.payload.key]: action.payload.data
      };
    
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('bookitData');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      Object.keys(parsedState).forEach(key => {
        if (key !== 'currentUser' && key !== 'userType') {
          dispatch({ type: 'LOAD_DATA', payload: { key, data: parsedState[key] } });
        }
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('bookitData', JSON.stringify(state));
  }, [state]);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
