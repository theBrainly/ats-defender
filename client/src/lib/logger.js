// src/lib/logger.js

export function logError(...args) {
  if (typeof window !== 'undefined' && window.atsLogger && typeof window.atsLogger.error === 'function') {
    window.atsLogger.error(...args);
  } else {
    // Fallback to console.error in dev
    console.error(...args);
  }
}

export function logInfo(...args) {
  if (typeof window !== 'undefined' && window.atsLogger && typeof window.atsLogger.info === 'function') {
    window.atsLogger.info(...args);
  } else {
    // Fallback to console.info in dev
    console.info(...args);
  }
}
