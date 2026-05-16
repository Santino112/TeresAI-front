import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "teresai.browserLocation";
const CACHE_TTL_MS = 10 * 60 * 1000;
const WATCH_SAFETY_TIMEOUT_MS = 45000;
const WATCH_OPTIONS = {
  enableHighAccuracy: false,
  maximumAge: 300000,
};

const readCachedLocation = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.lat !== "number" ||
      typeof parsed?.lng !== "number" ||
      typeof parsed?.timestamp !== "number"
    ) {
      return null;
    }

    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      return null;
    }

    return {
      lat: parsed.lat,
      lng: parsed.lng,
      accuracy: typeof parsed.accuracy === "number" ? parsed.accuracy : null,
      timestamp: parsed.timestamp,
      source: parsed.source || "cache",
    };
  } catch {
    return null;
  }
};

const saveCachedLocation = (location) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // ignore storage failures
  }
};

const formatGeoError = (error) => {
  switch (error?.code) {
    case 1:
      return "The browser blocked location access.";
    case 2:
      return "The device could not determine a location.";
    case 3:
      return "The location took too long to resolve.";
    default:
      return "The browser could not obtain a location.";
  }
};

export const useBrowserLocation = () => {
  const cachedLocation = useRef(readCachedLocation());
  const [location, setLocation] = useState(cachedLocation.current);
  const [isResolving, setIsResolving] = useState(!cachedLocation.current);
  const [error, setError] = useState("");
  const watchIdRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const pendingResolversRef = useRef([]);
  const watchStartedRef = useRef(false);
  const loggedPendingRef = useRef(false);

  const settlePending = (value) => {
    if (!pendingResolversRef.current.length) return;

    const resolvers = pendingResolversRef.current.splice(0);
    resolvers.forEach((resolve) => resolve(value));
  };

  const stopWatch = () => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = null;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    watchStartedRef.current = false;
    loggedPendingRef.current = false;
    setIsResolving(false);
  };

  const commitLocation = (coords, source) => {
    const next = {
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: typeof coords.accuracy === "number" ? coords.accuracy : null,
      timestamp: Date.now(),
      source,
    };

    cachedLocation.current = next;
    setLocation(next);
    setError("");
    setIsResolving(false);
    saveCachedLocation(next);
    settlePending(next);
    stopWatch();

    return next;
  };

  const startWatch = () => {
    if (cachedLocation.current) {
      return Promise.resolve(cachedLocation.current);
    }

    if (watchStartedRef.current) {
      return new Promise((resolve) => {
        pendingResolversRef.current.push(resolve);
      });
    }

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Your browser does not support geolocation.");
      setIsResolving(false);
      return Promise.resolve(null);
    }

    watchStartedRef.current = true;
    setIsResolving(true);
    setError("");
    return new Promise((resolve) => {
      pendingResolversRef.current.push(resolve);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          commitLocation(position.coords, "browser");
        },
        (geoError) => {
          if (geoError?.code === 1) {
            setError(formatGeoError(geoError));
            settlePending(null);
            stopWatch();
            return;
          }

          if (!loggedPendingRef.current) {
            loggedPendingRef.current = true;
          }
        },
        WATCH_OPTIONS
      );

      safetyTimerRef.current = setTimeout(() => {
        if (cachedLocation.current) {
          settlePending(cachedLocation.current);
        } else {
          settlePending(null);
        }
        stopWatch();
      }, WATCH_SAFETY_TIMEOUT_MS);
    });
  };

  const refreshLocation = async () => startWatch();

  useEffect(() => {
    void refreshLocation();

    return () => {
      stopWatch();
      settlePending(cachedLocation.current);
    };
  }, []);

  return {
    location,
    isResolving,
    error,
    refreshLocation,
  };
};
