import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {API_BASE_URL} from "../config/api.js";

// AuthContext stores login state so it survives page navigation.
// It reads/writes localStorage to keep the user logged in after refresh.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` is the logged-in user object (or null if logged out).
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load saved auth state when the app starts.
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    // Validate the stored token against the server on every app load
    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        // Token is valid — hydrate state with fresh user data from DB
        setUser(data.user);
        setToken(savedToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        // Token expired, account deactivated, or network error — force logout
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      });
  }, []);

  // Call this after a successful login.
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Call this to log out and clear all auth data.
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(user && token),
      login,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
