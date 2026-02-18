import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
import API from "../Api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (data) => {
    const res = await API.post("/users/registerUser", data);
    setUser(res.data.data);
  };

  const login = async (data) => {
    const res = await API.post("/users/login", data);
    setUser(res.data.data);
  };

  const logout = async () => {
    await API.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
