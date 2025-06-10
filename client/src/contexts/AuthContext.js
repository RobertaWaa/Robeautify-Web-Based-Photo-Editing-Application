import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Add this function to verify token with backend
const verifyToken = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/api/verify-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
      }
      throw new Error("Token verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false };
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");

    if (token && savedUser) {
      verifyToken(token)
        .then((result) => {
          if (result.success) {
            setCurrentUser(result.user);
            localStorage.setItem("currentUser", JSON.stringify(result.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
            setCurrentUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentUser(userData);

    navigate("/my-account");
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    loading,
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fff0f5",
        }}
      >
        <div>Loading application...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
