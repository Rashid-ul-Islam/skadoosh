import { createContext, useContext, useEffect, useMemo, useState } from "react";

// AuthContext stores login state so it survives page navigation.
// It reads/writes localStorage to keep the user logged in after refresh.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` is the logged-in user object (or null if logged out).
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load saved auth state when the app starts.
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        // If storage is corrupted, clear it to prevent false login state.
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
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
