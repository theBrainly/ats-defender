// src/lib/token.js

// Token management utility for authentication
const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export /**
 * Active: 2026-01-05
 * Function: removeToken
 */
function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
