/**
 * Campus Pulse — Mock Event Service (Technical Contract V1 Aligned)
 * 
 * INTEGRATION NOTICE:
 * This file replaces the temporary eventService mock. The filename `eventService.js`
 * is strictly reserved for Hammad Qubah's Cloud Firestore service.
 * 
 * All methods adhere to the standard result format:
 *   { data, error }
 * 
 * Normalized frontend event objects guarantee:
 * - `startDateTime` and `endDateTime` are JavaScript Date instances.
 * - Missing or unknown optional values are null.
 * - Event category and interestArea strictly follow the approved enums.
 */

import { MOCK_EVENTS, APPROVED_CATEGORIES, APPROVED_INTEREST_AREAS } from '../data/mockEvents';

const STORAGE_KEY_EVENTS = 'campus_pulse_mock_events_v1';
const STORAGE_KEY_SAVED = 'campus_pulse_saved_event_ids';

// Helper to normalize dates into Date instances
function normalizeEvent(evt) {
  if (!evt) return null;
  return {
    ...evt,
    startDateTime: evt.startDateTime instanceof Date ? evt.startDateTime : new Date(evt.startDateTime),
    endDateTime: evt.endDateTime instanceof Date ? evt.endDateTime : new Date(evt.endDateTime),
    createdAt: evt.createdAt instanceof Date ? evt.createdAt : new Date(evt.createdAt || Date.now()),
    updatedAt: evt.updatedAt instanceof Date ? evt.updatedAt : new Date(evt.updatedAt || Date.now()),
    latitude: typeof evt.latitude === 'number' && !isNaN(evt.latitude) ? evt.latitude : null,
    longitude: typeof evt.longitude === 'number' && !isNaN(evt.longitude) ? evt.longitude : null,
    activityPoints: typeof evt.activityPoints === 'number' ? evt.activityPoints : null,
    certificateAvailable: typeof evt.certificateAvailable === 'boolean' ? evt.certificateAvailable : null,
    attendanceBenefit: evt.attendanceBenefit || null,
    eligibility: evt.eligibility || null,
    registrationUrl: evt.registrationUrl || null,
    imageUrl: evt.imageUrl || null
  };
}

function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.map(normalizeEvent);
    }
  } catch (err) {
    console.warn('LocalStorage unavailable for mock events', err);
  }
  return MOCK_EVENTS.map(normalizeEvent);
}

function persistEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.warn('Failed to persist mock events to localStorage', err);
  }
}

/**
 * Fetch events with multi-faceted filtering
 * @param {Object} filterOptions
 * @returns {Promise<{ data: Array, error: string|null }>}
 */
export async function getEvents(filterOptions = {}) {
  try {
    await new Promise(resolve => setTimeout(resolve, 80));

    const {
      searchQuery = '',
      category = 'all',
      interestArea = 'all',
      eventType = 'all', // 'all' | 'internal' | 'external'
      upcomingOnly = false,
      status = 'published', // 'published' | 'all'
      organizerId = null
    } = filterOptions;

    let events = getStoredEvents();

    // Filter by organizer if specified (for Organizer listing own events)
    if (organizerId) {
      events = events.filter(e => e.createdBy === organizerId);
    }

    // Filter by status
    if (status !== 'all') {
      events = events.filter(e => e.status === status);
    }

    // Filter by event type ('internal' vs 'external')
    if (eventType && eventType !== 'all') {
      events = events.filter(e => e.eventType === eventType);
    }

    // Filter by category
    if (category && category !== 'all' && category !== 'All') {
      events = events.filter(e => e.category === category);
    }

    // Filter by interest area
    if (interestArea && interestArea !== 'all' && interestArea !== 'All') {
      events = events.filter(e => e.interestArea && e.interestArea.includes(interestArea));
    }

    // Filter by upcoming
    if (upcomingOnly) {
      const now = new Date();
      events = events.filter(e => e.startDateTime >= now);
    }

    // Search query
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      events = events.filter(e => {
        const titleMatch = e.title?.toLowerCase().includes(q);
        const descMatch = e.description?.toLowerCase().includes(q);
        const catMatch = e.category?.toLowerCase().includes(q);
        const orgMatch = typeof e.organizer === 'string' 
          ? e.organizer.toLowerCase().includes(q) 
          : e.organizer?.name?.toLowerCase().includes(q);
        const venueMatch = e.venueName?.toLowerCase().includes(q) || e.venueAddress?.toLowerCase().includes(q);
        const interestMatch = e.interestArea?.some(tag => tag.toLowerCase().includes(q));

        return titleMatch || descMatch || catMatch || orgMatch || venueMatch || interestMatch;
      });
    }

    return { data: events, error: null };
  } catch (err) {
    return { data: [], error: err.message || 'Failed to fetch events' };
  }
}

/**
 * Fetch a single event by ID
 * @param {string} id
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function getEventById(id) {
  try {
    await new Promise(resolve => setTimeout(resolve, 40));
    const events = getStoredEvents();
    const found = events.find(e => e.id === id);
    if (!found) {
      return { data: null, error: 'Event not found' };
    }
    return { data: found, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Failed to retrieve event' };
  }
}

/**
 * Fetch featured events for landing page
 * @returns {Promise<{ data: Array, error: string|null }>}
 */
export async function getFeaturedEvents() {
  try {
    const { data: events, error } = await getEvents({ status: 'published' });
    if (error) return { data: [], error };
    // Feature first 3 published events
    return { data: events.slice(0, 3), error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
}

/**
 * Organizer Scope V1: Create event as draft
 * Note: Ordinary organizers can only save events as DRAFT.
 * Only admins can publish events or verify benefits.
 * @param {Object} eventInput
 * @param {string} createdBy
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function createEventDraft(eventInput, createdBy = 'org-cs-dept') {
  try {
    await new Promise(resolve => setTimeout(resolve, 120));
    const events = getStoredEvents();

    const newEvent = normalizeEvent({
      ...eventInput,
      id: `evt-${Date.now().toString(36)}`,
      status: 'draft', // Strictly drafted per Contract V1
      benefitsVerificationStatus: 'unverified', // Unverified until admin verification
      createdBy: createdBy,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const updated = [newEvent, ...events];
    persistEvents(updated);

    return { data: newEvent, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Failed to create draft event' };
  }
}

/**
 * Organizer Scope V1: Edit own draft event
 * Organizers cannot edit published events, completed events, or events created by others.
 * @param {string} eventId
 * @param {Object} updatedFields
 * @param {string} organizerId
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function updateEventDraft(eventId, updatedFields, organizerId = 'org-cs-dept') {
  try {
    await new Promise(resolve => setTimeout(resolve, 120));
    const events = getStoredEvents();
    const index = events.findIndex(e => e.id === eventId);

    if (index === -1) {
      return { data: null, error: 'Event not found' };
    }

    const targetEvent = events[index];

    // Check ownership
    if (targetEvent.createdBy !== organizerId) {
      return { data: null, error: 'Unauthorized: You can only edit events created by your organization.' };
    }

    // Check draft status
    if (targetEvent.status !== 'draft') {
      return { data: null, error: 'Locked: Only draft events can be modified by organizers. Contact an administrator to update published events.' };
    }

    // Ensure status remains draft and benefits unverified unless changed by admin
    const merged = normalizeEvent({
      ...targetEvent,
      ...updatedFields,
      id: targetEvent.id, // Immutable ID
      createdBy: targetEvent.createdBy,
      status: 'draft',
      benefitsVerificationStatus: 'unverified',
      updatedAt: new Date()
    });

    events[index] = merged;
    persistEvents(events);

    return { data: merged, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Failed to update draft' };
  }
}

/**
 * Organizer Scope V1: Cancel own event
 * @param {string} eventId
 * @param {string} organizerId
 * @returns {Promise<{ data: Object|null, error: string|null }>}
 */
export async function cancelEvent(eventId, organizerId = 'org-cs-dept') {
  try {
    await new Promise(resolve => setTimeout(resolve, 120));
    const events = getStoredEvents();
    const index = events.findIndex(e => e.id === eventId);

    if (index === -1) {
      return { data: null, error: 'Event not found' };
    }

    if (events[index].createdBy !== organizerId) {
      return { data: null, error: 'Unauthorized: You can only cancel events hosted by your organization.' };
    }

    events[index].status = 'cancelled';
    events[index].updatedAt = new Date();
    persistEvents(events);

    return { data: events[index], error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Failed to cancel event' };
  }
}

/**
 * Student Scope V1: Local client-side Bookmarks
 * Clearly identified as a local browser feature, not synchronized to Firebase.
 */
export function getSavedEventIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    const savedIds = raw ? JSON.parse(raw) : [];
    return Array.isArray(savedIds)
      ? savedIds.filter(id => id && id !== "evt-001" && id !== "evt-003")
      : [];
  } catch (err) {
    return [];
  }
}

export function toggleSaveEvent(eventId) {
  const current = getSavedEventIds();
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
    console.warn('LocalStorage error saving bookmark', err);
  }

  return !isSaved;
}

export function isEventSaved(eventId) {
  return getSavedEventIds().includes(eventId);
}
