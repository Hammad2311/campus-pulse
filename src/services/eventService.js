import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase.js";

const eventsRef = collection(db, "events");

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeEvent(snapshot) {
  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    startDateTime: toDate(data.startDateTime),
    endDateTime: toDate(data.endDateTime),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function normalizeError(error) {
  return {
    code: error?.code || "unknown",
    message: error?.message || "An unexpected error occurred.",
  };
}

async function execute(operation) {
  try {
    return { data: await operation(), error: null };
  } catch (error) {
    return { data: null, error: normalizeError(error) };
  }
}

function requireUserId() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("You must be signed in to perform this action.");
  }

  return uid;
}

function validDate(value, fieldName) {
  const parsed = toDate(value);

  if (!parsed) {
    throw new Error(`${fieldName} must be a valid date and time.`);
  }

  return parsed;
}

function optionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function prepareEventData(input, uid) {
  const startDateTime = validDate(input.startDateTime, "Start date");
  const endDateTime = validDate(input.endDateTime, "End date");

  if (endDateTime <= startDateTime) {
    throw new Error("End date and time must be after the start date and time.");
  }

  return {
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    category: input.category || "other",
    interestArea: Array.isArray(input.interestArea)
      ? input.interestArea
      : [],
    eventType: input.eventType || "internal",
    startDateTime,
    endDateTime,
    venueName: input.venueName || "",
    venueAddress: input.venueAddress || "",
    latitude: optionalNumber(input.latitude),
    longitude: optionalNumber(input.longitude),
    organizer: input.organizer || "",
    eligibility: input.eligibility || null,
    registrationRequired: Boolean(input.registrationRequired),
    registrationUrl: input.registrationUrl || null,
    certificateAvailable: Boolean(input.certificateAvailable),
    attendanceBenefit: input.attendanceBenefit || null,
    activityPoints: optionalNumber(input.activityPoints),
    benefitsVerificationStatus: "unverified",
    imageUrl: input.imageUrl || null,
    status: "draft",
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function prepareUpdates(updates) {
  const safeUpdates = { ...updates };

  // These fields are immutable after event creation.
  delete safeUpdates.id;
  delete safeUpdates.createdBy;
  delete safeUpdates.createdAt;

  if (safeUpdates.startDateTime !== undefined) {
    safeUpdates.startDateTime = validDate(
      safeUpdates.startDateTime,
      "Start date"
    );
  }

  if (safeUpdates.endDateTime !== undefined) {
    safeUpdates.endDateTime = validDate(
      safeUpdates.endDateTime,
      "End date"
    );
  }

  if (safeUpdates.latitude !== undefined) {
    safeUpdates.latitude = optionalNumber(safeUpdates.latitude);
  }

  if (safeUpdates.longitude !== undefined) {
    safeUpdates.longitude = optionalNumber(safeUpdates.longitude);
  }

  if (safeUpdates.activityPoints !== undefined) {
    safeUpdates.activityPoints = optionalNumber(safeUpdates.activityPoints);
  }

  Object.keys(safeUpdates).forEach((key) => {
    if (safeUpdates[key] === undefined) {
      delete safeUpdates[key];
    }
  });

  return {
    ...safeUpdates,
    updatedAt: serverTimestamp(),
  };
}

/**
 * Get events using the V1 filter options.
 * Public queries default to published events.
 */
export const getEvents = (filters = {}) =>
  execute(async () => {
    const {
      searchQuery = "",
      category = "all",
      interestArea = "all",
      eventType = "all",
      upcomingOnly = false,
      status = "published",
      organizerId = null,
    } = filters;

    const constraints = [];

    if (organizerId) {
      constraints.push(where("createdBy", "==", organizerId));
      constraints.push(orderBy("createdAt", "desc"));
    } else if (status === "all") {
      constraints.push(orderBy("createdAt", "desc"));
    } else {
      constraints.push(where("status", "==", status));
      constraints.push(orderBy("startDateTime", "asc"));
    }

    const snapshot = await getDocs(query(eventsRef, ...constraints));
    let events = snapshot.docs.map(normalizeEvent);

    if (status !== "all") {
      events = events.filter((event) => event.status === status);
    }

    if (eventType !== "all") {
      events = events.filter((event) => event.eventType === eventType);
    }

    if (category !== "all" && category !== "All") {
      events = events.filter((event) => event.category === category);
    }

    if (interestArea !== "all" && interestArea !== "All") {
      events = events.filter((event) =>
        Array.isArray(event.interestArea) &&
        event.interestArea.includes(interestArea)
      );
    }

    if (upcomingOnly) {
      const now = new Date();
      events = events.filter(
        (event) => event.startDateTime && event.startDateTime >= now
      );
    }

    if (searchQuery.trim()) {
      const term = searchQuery.trim().toLowerCase();

      events = events.filter((event) => {
        const organizerName =
          typeof event.organizer === "string"
            ? event.organizer
            : event.organizer?.name || "";

        const searchable = [
          event.title,
          event.description,
          event.category,
          organizerName,
          event.venueName,
          event.venueAddress,
          ...(event.interestArea || []),
        ];

        return searchable.some((value) =>
          String(value || "").toLowerCase().includes(term)
        );
      });
    }

    return events;
  });

export const getPublishedEvents = () =>
  getEvents({ status: "published" });

export const getInternalEvents = () =>
  getEvents({ status: "published", eventType: "internal" });

export const getExternalEvents = () =>
  getEvents({ status: "published", eventType: "external" });

export const getEventsByType = (type) =>
  getEvents({ status: "published", eventType: type });

export const getEventsByCategory = (category) =>
  getEvents({ status: "published", category });

export const getEventsByInterest = (interest) =>
  getEvents({ status: "published", interestArea: interest });

export const getOrganizerEvents = (uid = auth.currentUser?.uid) =>
  execute(async () => {
    if (!uid) {
      throw new Error("Organizer ID is required.");
    }

    const snapshot = await getDocs(
      query(
        eventsRef,
        where("createdBy", "==", uid),
        orderBy("createdAt", "desc")
      )
    );

    return snapshot.docs.map(normalizeEvent);
  });

export const getEventById = (id) =>
  execute(async () => {
    if (!id) throw new Error("Event ID is required.");

    const snapshot = await getDoc(doc(db, "events", id));

    return snapshot.exists() ? normalizeEvent(snapshot) : null;
  });

/**
 * Organizers can create drafts only.
 * Firestore rules enforce the authenticated organizer identity.
 */
export const createEvent = (eventData) =>
  execute(async () => {
    const uid = requireUserId();
    const payload = prepareEventData(eventData, uid);

    if (!payload.title || !payload.description || !payload.organizer) {
      throw new Error("Title, description, and organizer are required.");
    }

    const created = await addDoc(eventsRef, payload);
    return created.id;
  });

export const updateEvent = (id, eventData) =>
  execute(async () => {
    if (!id) throw new Error("Event ID is required.");

    await updateDoc(
      doc(db, "events", id),
      prepareUpdates(eventData)
    );

    return id;
  });

export const saveEventAsDraft = (eventData, eventId = null) => {
  if (eventId) {
    return updateEvent(eventId, {
      ...eventData,
      status: "draft",
    });
  }

  return createEvent(eventData);
};

export const publishEvent = (id) =>
  updateEvent(id, { status: "published" });

export const cancelEvent = (id) =>
  updateEvent(id, { status: "cancelled" });

export const deleteEvent = (id) =>
  execute(async () => {
    if (!id) throw new Error("Event ID is required.");

    await deleteDoc(doc(db, "events", id));
    return id;
  });
