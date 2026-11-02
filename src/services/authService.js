import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase.js";

export async function getOrganizerProfile(uid) {
  if (!uid) return null;

  const snapshot = await getDoc(doc(db, "organizers", uid));
  if (!snapshot.exists()) return null;

  return { uid: snapshot.id, ...snapshot.data() };
}

export async function getAdminProfile(uid) {
  if (!uid) return null;

  const snapshot = await getDoc(doc(db, "admins", uid));
  if (!snapshot.exists()) return null;

  return { uid: snapshot.id, ...snapshot.data() };
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function signInOrganizer(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  try {
    const profile = await getOrganizerProfile(credential.user.uid);

    if (!profile || profile.status !== "active") {
      throw new Error("Organizer account is missing or disabled.");
    }

    return { user: credential.user, profile };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function signInAdmin(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  try {
    const profile = await getAdminProfile(credential.user.uid);

    if (!profile || profile.active !== true) {
      throw new Error("Admin account is missing or disabled.");
    }

    return { user: credential.user, profile };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export function signOutOrganizer() {
  return signOut(auth);
}

export function hasPermission(profile, permission) {
  if (!profile) return false;

  const organizerPermissions = [
    "createEvent",
    "updateOwnEvent",
    "cancelOwnEvent",
    "viewOwnEvents",
    "deleteOwnDraft",
  ];

  const adminPermissions = [
    ...organizerPermissions,
    "publishEvent",
    "verifyBenefits",
    "manageAllEvents",
    "manageOrganizers",
  ];

  if (profile.role === "organizer" && profile.status === "active") {
    return organizerPermissions.includes(permission);
  }

  if (profile.role === "admin" && profile.active === true) {
    return adminPermissions.includes(permission);
  }

  return false;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    try {
      const adminProfile = await getAdminProfile(user.uid);

      if (adminProfile?.active === true) {
        callback({ user, profile: { ...adminProfile, role: "admin" } });
        return;
      }

      const organizerProfile = await getOrganizerProfile(user.uid);

      if (organizerProfile?.status === "active") {
        callback({
          user,
          profile: { ...organizerProfile, role: "organizer" },
        });
        return;
      }

      callback({ user, profile: null });
    } catch (error) {
      callback({ user, profile: null, error });
    }
  });
}
