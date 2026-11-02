import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";

const eventsRef = collection(db, "events");

function result(data = null, error = null) {
  return { data, error };
}

function normalizeEvent(snapshot) {
  const data = snapshot.data();
  return {
    ...data,
    id: snapshot.id,
    startDateTime: data.startDateTime?.toDate?.() ?? null,
    endDateTime: data.endDateTime?.toDate?.() ?? null,
    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null
  };
}

async function execute(operation) {
  try {
    return result(await operation(), null);
  } catch (error) {
    return result(null, error);
  }
}

export const getPublishedEvents = () => execute(async () => {
  const snapshot = await getDocs(
    query(eventsRef, where("status", "==", "published"), orderBy("startDateTime"))
  );
  return snapshot.docs.map(normalizeEvent);
});

export const getEventById = (id) => execute(async () => {
  const snapshot = await getDoc(doc(db, "events", id));
  return snapshot.exists() ? normalizeEvent(snapshot) : null;
});

export const getOrganizerEvents = (uid) => execute(async () => {
  const snapshot = await getDocs(
    query(eventsRef, where("createdBy", "==", uid), orderBy("createdAt", "desc"))
  );
  return snapshot.docs.map(normalizeEvent);
});

export const createEvent = (eventData, uid) => execute(async () => {
  const ref = await addDoc(eventsRef, {
    ...eventData,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "draft"
  });
  return ref.id;
});

export const updateEvent = (id, eventData) => execute(async () => {
  await updateDoc(doc(db, "events", id), {
    ...eventData,
    updatedAt: serverTimestamp()
  });
  return id;
});

export const publishEvent = (id) => updateEvent(id, { status: "published" });
export const cancelEvent = (id) => updateEvent(id, { status: "cancelled" });
