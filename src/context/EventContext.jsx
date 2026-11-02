import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSavedEventIds, 
  toggleSaveEvent 
} from '../services/mockEventService';

const EventContext = createContext();

export function EventProvider({ children }) {
  // Navigation / View State
  const [currentView, setCurrentView] = useState('landing'); 

  // Map & Event selection state (Parent owns selectedEventId per Section 5)
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Modal State for Full Event Details
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  // Client-side saved / bookmarked events (Frontend-only, explicitly not synced with Firebase)
  const [savedEventIds, setSavedEventIds] = useState([]);

  // Toast notification state
  const [toast, setToast] = useState(null); // { message, type: 'info' | 'success' | 'warning' }

  // Organizer session state for testing V1 organizer dashboard
  // Default demo organizer identity: 'org-cs-dept' (matches mock events createdBy)
  const [organizerUser, setOrganizerUser] = useState(null);

  useEffect(() => {
    // Load local bookmarks
    setSavedEventIds(getSavedEventIds());
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
      showToast(`Bookmarked "${eventTitle}" locally`, 'success');
    } else {
      showToast(`Removed "${eventTitle}" from bookmarks`, 'info');
    }
    return isNowSaved;
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
  };

  const setOrganizerSession = (email) => {
    setOrganizerUser({ 
      email, 
      id: 'org-cs-dept',
      name: 'Dept. of Computer Science & Engineering'
    });
    showToast(`Organizer workspace loaded (V1 Scope)`, 'info');
    setCurrentView('organizer-dashboard');
  };

  const logoutOrganizer = () => {
    setOrganizerUser(null);
    showToast(`Signed out of Organizer Workspace`, 'info');
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
        toast,
        showToast,
        organizerUser,
        setOrganizerSession,
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
