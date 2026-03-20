"use client";

/**
 * useCloudData – a useState-compatible hook that syncs data across devices.
 *
 * When Firebase is configured (NEXT_PUBLIC_FIREBASE_* env vars are set) the
 * hook writes to and listens on Firebase Realtime Database, so every family
 * member's device sees updates in real time.
 *
 * When Firebase is NOT configured (e.g. during local development without a
 * .env.local) the hook automatically falls back to localStorage, preserving
 * the original single-device behaviour.
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
import { useLocalStorage } from "./useLocalStorage";

// ─── Firebase-backed implementation ─────────────────────────────────────────

function useFirebasePath<T>(
  path: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setLocalValue] = useState<T>(initialValue);

  // Subscribe to the database path
  useEffect(() => {
    if (!db) return;
    const dbRef = ref(db, `familyPlanner/${path}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setLocalValue(snapshot.val() as T);
      }
    });
    return () => unsubscribe();
  }, [path]);

  // Write updates to the database
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setLocalValue((prev) => {
        const next =
          typeof action === "function"
            ? (action as (prev: T) => T)(prev)
            : action;
        if (db) {
          set(ref(db, `familyPlanner/${path}`), next).catch((err) => {
            console.warn(`[useCloudData] Failed to write "${path}":`, err);
          });
        }
        return next;
      });
    },
    [path]
  );

  return [value, setValue];
}

// ─── Public hook ─────────────────────────────────────────────────────────────

/**
 * Drop-in replacement for useLocalStorage that syncs across devices via
 * Firebase Realtime Database when configured.
 */
export function useCloudData<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Both hooks are called unconditionally (no rules-of-hooks violation).
  // We return the appropriate result based on the module-level constant.
  const firebaseResult = useFirebasePath<T>(key, initialValue);
  const localResult = useLocalStorage<T>(key, initialValue);

  return firebaseReady ? firebaseResult : localResult;
}
