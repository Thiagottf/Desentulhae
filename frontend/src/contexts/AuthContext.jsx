// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

// Decodifica o payload de um JWT sem dependência externa
function parseJwt(token) {
  try {
    const [, base64Payload] = token.split('.');
    const json = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (saved) {
      api.defaults.headers.common.Authorization = `Bearer ${saved}`;
      setToken(saved);

      const decoded = parseJwt(saved);
      setUser({
        email: decoded.email,
        apelido: decoded.apelido || decoded.name,
        cpf: decoded.cpf
      });
    }
  }, []);

  const login = async ({ email, senha, remember }) => {
    try {
      const resp = await api.post('/auth/login', { email, senha });
      const jwt = resp.data.token;

      if (remember) localStorage.setItem('token', jwt);
      else sessionStorage.setItem('token', jwt);

      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      setToken(jwt);

      const decoded = parseJwt(jwt);
      setUser({
        email: decoded.email,
        apelido: decoded.apelido || decoded.name,
        cpf: decoded.cpf
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Não foi possível fazer login.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
