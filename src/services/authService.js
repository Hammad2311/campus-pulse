import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../lib/firebase.js";

const ORGANIZERS_COLLECTION = "organizers";

const VALID_ROLES = ["organizer", "admin"];

export async function getOrganizerProfile(uid) {
  if (!uid) {
    return null;
  }

  const profileRef = doc(db, ORGANIZERS_COLLECTION, uid);
  const profileSnapshot = await getDoc(profileRef);

  if (!profileSnapshot.exists()) {
    return null;
  }

  return {
    uid: profileSnapshot.id,
    ...profileSnapshot.data(),
  };
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

    if (
      !profile ||
      profile.active !== true ||
      !VALID_ROLES.includes(profile.role)
    ) {
      throw new Error(
        "This account does not have an active organizer profile."
      );
    }

    return {
      user: credential.user,
      profile,
    };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function signOutOrganizer() {
  await signOut(auth);
}

export function hasPermission(profile, permission) {
  if (!profile || profile.active !== true) {
    return false;
  }

  const permissions = {
    organizer: [
      "createEvent",
      "updateOwnEvent",
      "cancelOwnEvent",
      "viewOwnEvents",
    ],
    admin: [
      "createEvent",
      "updateOwnEvent",
      "cancelOwnEvent",
      "viewOwnEvents",
      "publishEvent",
      "verifyBenefits",
      "manageAllEvents",
      "manageOrganizers",
    ],
  };

  return permissions[profile.role]?.includes(permission) ?? false;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({
        user: null,
        profile: null,
      });
      return;
    }

    try {
      const profile = await getOrganizerProfile(user.uid);

      callback({
        user,
        profile,
      });
    } catch (error) {
      callback({
        user,
        profile: null,
        error,
      });
    }
  });
}
