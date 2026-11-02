/**
 * Campus Pulse - Event Service Data Layer
 * 
 * INTEGRATION NOTICE:
 * This service acts as an abstraction layer between the UI components and the backend.
 * Currently backed by in-memory mock data and browser local storage for stateful client interactions.
 * 
 * WHEN CONNECTING HAMMAD'S FIREBASE BACKEND:
 * Replace the internal mock calls below with calls to Cloud Firestore (`collection('events')`, etc.)
 * and Firebase Authentication (`auth.currentUser`). The function signatures are intentionally designed
 * to match asynchronous Firestore client SDK patterns.
 */

import { MOCK_EVENTS } from '../data/mockEvents';

const STORAGE_KEY_EVENTS = 'campus_pulse_events_data';
const STORAGE_KEY_SAVED = 'campus_pulse_saved_events';
const STORAGE_KEY_REGISTERED = 'campus_pulse_registered_events';

// Initialize mock events in localStorage if not already present to allow create/edit persistence in demo
function getStoredEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('LocalStorage unavailable, using default mock dataset', err);
  }
  return [...MOCK_EVENTS];
}

function persistEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.warn('Failed to persist events to localStorage', err);
  }
}

function getStoredSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? JSON.parse(raw) : ["evt-001", "evt-003"]; // Default some saved items for demo
  } catch (err) {
    return ["evt-001", "evt-003"];
  }
}

function getStoredRegisteredIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTERED);
    return raw ? JSON.parse(raw) : ["evt-002"]; // Default registered item for demo
  } catch (err) {
    return ["evt-002"];
  }
}

/**
 * Fetch all events with optional multi-faceted filtering
 * @param {Object} filterOptions
 * @returns {Promise<Array>}
 */
export async function fetchEvents(filterOptions = {}) {
  // Simulate network latency (100ms) for realistic UX transitions
  await new Promise(resolve => setTimeout(resolve, 80));

  const {
    searchQuery = '',
    category = 'All',
    interest = 'All',
    eventType = 'all', // 'all' | 'university' | 'external'
    upcomingOnly = false,
    status = 'published', // 'published' | 'all'
    includeDrafts = false
  } = filterOptions;

  let events = getStoredEvents();

  // Filter by status (unless includeDrafts is specified for organizer dashboard)
  if (!includeDrafts && status !== 'all') {
    events = events.filter(e => e.status === status);
  }

  // Filter by event type (University vs External)
  if (eventType && eventType !== 'all') {
    events = events.filter(e => e.eventType === eventType);
  }

  // Filter by category
  if (category && category !== 'All') {
    events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by interest tag
  if (interest && interest !== 'All') {
    events = events.filter(e => e.interests && e.interests.includes(interest));
  }

  // Filter by upcoming
  if (upcomingOnly) {
    const now = new Date();
    events = events.filter(e => new Date(e.startDate) >= now);
  }

  // Filter by search query across name, description, category, organizer, and venue
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.trim().toLowerCase();
    events = events.filter(e => {
      const titleMatch = e.title?.toLowerCase().includes(query);
      const descMatch = (e.shortDescription?.toLowerCase().includes(query) || e.description?.toLowerCase().includes(query));
      const catMatch = e.category?.toLowerCase().includes(query);
      const orgMatch = e.organizer?.name?.toLowerCase().includes(query);
      const venueMatch = e.venue?.toLowerCase().includes(query);
      const interestMatch = e.interests?.some(i => i.toLowerCase().includes(query));

      return titleMatch || descMatch || catMatch || orgMatch || venueMatch || interestMatch;
    });
  }

  return events;
}

/**
 * Fetch a single event by its ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function fetchEventById(id) {
  await new Promise(resolve => setTimeout(resolve, 50));
  const events = getStoredEvents();
  return events.find(e => e.id === id) || null;
}

/**
 * Fetch featured events for landing page
 */
export async function fetchFeaturedEvents() {
  await new Promise(resolve => setTimeout(resolve, 50));
  const events = getStoredEvents();
  return events.filter(e => e.featured && e.status === 'published');
}

/**
 * Bookmark / Save events management
 */
export function getSavedEventIds() {
  return getStoredSavedIds();
}

export function toggleSaveEvent(eventId) {
  const current = getStoredSavedIds();
  let updated;
  const isSaved = current.includes(eventId);

  if (isSaved) {
    updated = current.filter(id => id !== eventId);
  } else {
    updated = [...current, eventId];
  }

  try {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage error', err);
  }

  return !isSaved;
}

export function isEventSaved(eventId) {
  const current = getStoredSavedIds();
  return current.includes(eventId);
}

/**
 * Registration management
 */
export function getRegisteredEventIds() {
  return getStoredRegisteredIds();
}

export function registerForEvent(eventId) {
  const current = getStoredRegisteredIds();
  if (!current.includes(eventId)) {
    const updated = [...current, eventId];
    try {
      localStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage error', err);
    }
  }
  return true;
}

export function cancelRegistration(eventId) {
  const current = getStoredRegisteredIds();
  const updated = current.filter(id => id !== eventId);
  try {
    localStorage.setItem(STORAGE_KEY_REGISTERED, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage error', err);
  }
  return true;
}

export function isEventRegistered(eventId) {
  return getStoredRegisteredIds().includes(eventId);
}

/**
 * Fetch events for student "My Events" view
 */
export async function fetchUserEvents() {
  await new Promise(resolve => setTimeout(resolve, 80));
  const events = getStoredEvents();
  const savedIds = getStoredSavedIds();
  const registeredIds = getStoredRegisteredIds();

  return {
    saved: events.filter(e => savedIds.includes(e.id)),
    registered: events.filter(e => registeredIds.includes(e.id)),
    upcoming: events.filter(e => {
      const isUserInvolved = savedIds.includes(e.id) || registeredIds.includes(e.id);
      const isUpcoming = new Date(e.startDate) >= new Date();
      return isUserInvolved && isUpcoming;
    })
  };
}

/**
 * Organizer operations (Simulated frontend demo state)
 * Note: These changes update local state only until Hammad provides Firestore integration.
 */
export async function createEventMock(eventData) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const events = getStoredEvents();
  const newEvent = {
    ...eventData,
    id: `evt-${Date.now().toString(36)}`,
    registeredCount: 0,
    status: eventData.status || 'published'
  };
  const updated = [newEvent, ...events];
  persistEvents(updated);
  return newEvent;
}

export async function updateEventMock(eventId, updatedFields) {
  await new Promise(resolve => setTimeout(resolve, 150));
  const events = getStoredEvents();
  const index = events.findIndex(e => e.id === eventId);
  if (index === -1) throw new Error('Event not found');

  events[index] = { ...events[index], ...updatedFields };
  persistEvents(events);
  return events[index];
}

export async function updateEventStatusMock(eventId, newStatus) {
  return updateEventMock(eventId, { status: newStatus });
}

export async function resetMockEventsToDefault() {
  localStorage.removeItem(STORAGE_KEY_EVENTS);
  localStorage.removeItem(STORAGE_KEY_SAVED);
  localStorage.removeItem(STORAGE_KEY_REGISTERED);
  return [...MOCK_EVENTS];
}
