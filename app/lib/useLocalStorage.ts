"use client";

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";

/**
 * A useState-compatible hook that persists state to localStorage.
 * Initializes from localStorage on mount; writes to localStorage only when
 * the setter is explicitly called (no race-condition with the load effect).
 *
 * @param key - The localStorage key under which the value is stored.
 * @param initialValue - Fallback value used when nothing is stored yet.
 * @returns A [value, setValue] tuple matching the useState API.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to read key "${key}":`, error);
    }
  }, [key]);

  // Setter that persists to localStorage at the same time as updating state
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next =
          typeof value === "function"
            ? (value as (prev: T) => T)(prev)
            : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch (error) {
          console.warn(`[useLocalStorage] Failed to write key "${key}":`, error);
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
