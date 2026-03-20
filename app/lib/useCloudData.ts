"use client";

/**
 * useCloudData – a useState-compatible hook that syncs data across devices.
 *
 * When Firebase is configured (NEXT_PUBLIC_FIREBASE_* env vars are set) the
 * hook writes to and listens on Firebase Realtime Database, so every family
 * member's device sees updates in real time.
 *
 * Saves are always written to localStorage first so data persists across
 * page reloads on the same device even when Firebase is unavailable or write
 * permissions are not yet configured.
 *
 * The API is intentionally identical to useLocalStorage so all components can
 * swap the import with zero logic changes.
 */

import {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ref, onValue, set } from "firebase/database";
import { db, firebaseReady } from "./firebase";

/**
 * Drop-in replacement for useLocalStorage that syncs across devices via
 * Firebase Realtime Database when configured.
 *
 * Data is always written to localStorage immediately so saves survive a page
 * reload on the same device. When Firebase is configured the data is also
 * written there for cross-device real-time sync.
 */
export function useCloudData<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue_] = useState<T>(initialValue);

  // Load from localStorage on mount – provides instant initial data before
  // Firebase responds, and acts as a fallback when Firebase is unavailable.
  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(key);
      if (cached !== null) setValue_(JSON.parse(cached) as T); // eslint-disable-line react-hooks/set-state-in-effect
    } catch {
      // localStorage unavailable; proceed with initialValue
    }
  }, [key]);

  // Subscribe to Firebase Realtime Database when it is configured.
  useEffect(() => {
    if (!db || !firebaseReady) return;
    const dbRef = ref(db, `familyPlanner/${key}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const next = snapshot.val() as T;
        setValue_(next);
        // Keep localStorage in sync with the latest Firebase value so it is
        // available immediately on the next page load.
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
    });
    return () => unsubscribe();
  }, [key]); // firebaseReady is a module-level constant; omitting it is intentional

  // Write updates to localStorage (always) and Firebase (when configured).
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setValue_((prev) => {
        const next =
          typeof action === "function"
            ? (action as (prev: T) => T)(prev)
            : action;
        // Always persist locally so saves survive a page reload even if
        // Firebase is unreachable or security rules deny the write.
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        if (db && firebaseReady) {
          set(ref(db, `familyPlanner/${key}`), next).catch((err) => {
            console.warn(`[useCloudData] Failed to write "${key}":`, err);
          });
        }
        return next;
      });
    },
    [key]
  );

  return [value, setValue];
}
