import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase.js";

const ORGANIZER_PERMISSIONS = [
  "events:read:published",
  "events:read:own",
  "events:create",
  "events:update:draft",
  "events:cancel:own",
  "events:delete:draft",
];

const ADMIN_PERMISSIONS = [
  "events:read:published",
  "events:read:own",
  "events:read:all",
  "events:create",
  "events:update:draft",
  "events:cancel:own",
  "events:delete:draft",
  "events:publish",
  "events:verify_benefits",
];

function mapUser(user) {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
  };
}

async function getAdminProfile(uid) {
  if (!uid) return null;

  const snapshot = await getDoc(doc(db, "admins", uid));

  if (!snapshot.exists()) return null;

  return { uid: snapshot.id, ...snapshot.data() };
}

export async function getOrganizerProfile(uid = getCurrentUser()?.uid) {
  if (!uid) return null;

  const snapshot = await getDoc(doc(db, "organizers", uid));

  if (!snapshot.exists()) return null;

  return { uid: snapshot.id, ...snapshot.data() };
}

export function getCurrentUser() {
  return mapUser(auth.currentUser);
}

export async function signInOrganizer(email, password) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  try {
    const uid = credential.user.uid;

    const adminProfile = await getAdminProfile(uid);

    if (adminProfile?.active === true) {
      return {
        user: mapUser(credential.user),
        profile: adminProfile,
        role: "admin",
        permissions: ADMIN_PERMISSIONS,
      };
    }

    const profile = await getOrganizerProfile(uid);

    if (!profile || profile.status !== "active") {
      throw new Error("Organizer account is missing or disabled.");
    }

    return {
      user: mapUser(credential.user),
      profile,
      role: "organizer",
      permissions: ORGANIZER_PERMISSIONS,
    };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function signOutOrganizer() {
  await signOut(auth);
  return true;
}

export function hasPermission(permission, context = {}) {
  const { role = "guest", profile = null } = context;

  if (role === "admin" && profile?.active === true) {
    return ADMIN_PERMISSIONS.includes(permission);
  }

  if (role === "organizer" && profile?.status === "active") {
    return ORGANIZER_PERMISSIONS.includes(permission);
  }

  return permission === "events:read:published";
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback({
        user: null,
        profile: null,
        role: "guest",
        permissions: ["events:read:published"],
        loading: false,
      });
      return;
    }

    try {
      const adminProfile = await getAdminProfile(firebaseUser.uid);

      if (adminProfile?.active === true) {
        callback({
          user: mapUser(firebaseUser),
          profile: adminProfile,
          role: "admin",
          permissions: ADMIN_PERMISSIONS,
          loading: false,
        });
        return;
      }

      const profile = await getOrganizerProfile(firebaseUser.uid);

      if (profile?.status === "active") {
        callback({
          user: mapUser(firebaseUser),
          profile,
          role: "organizer",
          permissions: ORGANIZER_PERMISSIONS,
          loading: false,
        });
        return;
      }

      await signOut(auth);

      callback({
        user: null,
        profile: null,
        role: "guest",
        permissions: ["events:read:published"],
        loading: false,
      });
    } catch (error) {
      callback({
        user: mapUser(firebaseUser),
        profile: null,
        role: "guest",
        permissions: ["events:read:published"],
        loading: false,
        error,
      });
    }
  });
}
