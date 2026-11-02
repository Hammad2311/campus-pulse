import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getSavedEventIds,
  toggleSaveEvent
} from '../services/mockEventService';
import {
  onAuthChange,
  signInOrganizer,
  signOutOrganizer
} from '../services/authService';

const EventContext = createContext();

export function EventProvider({ children }) {
  const [currentView, setCurrentView] = useState('map');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [toast, setToast] = useState(null);
  const [authState, setAuthState] = useState({
    user: null,
    profile: null,
    role: 'guest',
    permissions: ['events:read:published'],
    loading: true
  });

  useEffect(() => {
    const unsubscribe = onAuthChange(setAuthState);
    setSavedEventIds(getSavedEventIds());
    return unsubscribe;
  }, []);

  const organizerUser =
    authState.role === 'organizer' && authState.user
      ? {
          id: authState.user.uid,
          email: authState.user.email,
          name:
            authState.profile?.displayName ||
            authState.profile?.department ||
            authState.user.email ||
            'Organizer'
        }
      : null;

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openEventDetails = (event) => {
    setActiveModalEvent(event);
    setSelectedEventId(event.id);
  };

  const closeEventDetails = () => setActiveModalEvent(null);

  const handleToggleSave = (eventId, eventTitle = 'Event') => {
    const isNowSaved = toggleSaveEvent(eventId);
    setSavedEventIds(getSavedEventIds());
    showToast(
      isNowSaved
        ? `Bookmarked "${eventTitle}" locally`
        : `Removed "${eventTitle}" from bookmarks`,
      isNowSaved ? 'success' : 'info'
    );
    return isNowSaved;
  };

  const handleSelectEvent = (eventId) => setSelectedEventId(eventId);

  const setOrganizerSession = async (email, password) => {
    const session = await signInOrganizer(email, password);

    if (session.role !== 'organizer') {
      await signOutOrganizer();
      throw new Error('This portal is for organizer accounts only.');
    }

    setCurrentView('organizer-dashboard');
    showToast('Successfully signed in to Organizer Workspace', 'success');
    return session;
  };

  const logoutOrganizer = async () => {
    try {
      await signOutOrganizer();
      setCurrentView('map');
      showToast('Signed out of Organizer Workspace', 'info');
    } catch (error) {
      showToast(error.message || 'Unable to sign out.', 'warning');
    }
  };

  const navigateTo = (view, extraState = null) => {
    setCurrentView(view);
    if (extraState?.selectedEventId) {
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
        logoutOrganizer,
        authLoading: authState.loading
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
