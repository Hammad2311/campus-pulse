import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSavedEventIds, 
  toggleSaveEvent, 
  getRegisteredEventIds, 
  registerForEvent, 
  cancelRegistration 
} from '../services/eventService';

const EventContext = createContext();

export function EventProvider({ children }) {
  // Navigation / View State
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'explore' | 'map' | 'external' | 'my-events' | 'organizer-dashboard' | 'organizer-login'

  // Map & Event selection state (Frontend owns selectedEventId per Section 5E)
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Modal State for Full Event Details
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  // User engagement state
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState(null); // { message, type: 'info' | 'success' | 'warning' }

  // Organizer auth demo state (clearly identifies it will connect to Hammad's Firebase Auth)
  const [organizerUser, setOrganizerUser] = useState(null);

  useEffect(() => {
    // Load initial bookmarks and registered IDs
    setSavedEventIds(getSavedEventIds());
    setRegisteredEventIds(getRegisteredEventIds());
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const openEventDetails = (event) => {
    setActiveModalEvent(event);
    setSelectedEventId(event.id);
  };

  const closeEventDetails = () => {
    setActiveModalEvent(null);
  };

  const handleToggleSave = (eventId, eventTitle = 'Event') => {
    const isNowSaved = toggleSaveEvent(eventId);
    setSavedEventIds(getSavedEventIds());
    if (isNowSaved) {
      showToast(`Saved "${eventTitle}" to your bookmarks`, 'success');
    } else {
      showToast(`Removed "${eventTitle}" from bookmarks`, 'info');
    }
    return isNowSaved;
  };

  const handleRegister = (eventId, eventTitle = 'Event') => {
    registerForEvent(eventId);
    setRegisteredEventIds(getRegisteredEventIds());
    showToast(`Successfully registered for "${eventTitle}"!`, 'success');
  };

  const handleCancelRegistration = (eventId, eventTitle = 'Event') => {
    cancelRegistration(eventId);
    setRegisteredEventIds(getRegisteredEventIds());
    showToast(`Cancelled registration for "${eventTitle}"`, 'info');
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
  };

  const loginOrganizer = (email) => {
    setOrganizerUser({ email, role: 'organizer' });
    showToast(`Organizer workspace loaded (Demo Mode)`, 'success');
    setCurrentView('organizer-dashboard');
  };

  const logoutOrganizer = () => {
    setOrganizerUser(null);
    showToast(`Logged out from Organizer Hub`, 'info');
    setCurrentView('landing');
  };

  const navigateTo = (view, extraState = null) => {
    setCurrentView(view);
    if (extraState && extraState.selectedEventId) {
      setSelectedEventId(extraState.selectedEventId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <EventContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        selectedEventId,
        setSelectedEventId,
        handleSelectEvent,
        activeModalEvent,
        openEventDetails,
        closeEventDetails,
        savedEventIds,
        handleToggleSave,
        registeredEventIds,
        handleRegister,
        handleCancelRegistration,
        toast,
        showToast,
        organizerUser,
        loginOrganizer,
        logoutOrganizer
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
