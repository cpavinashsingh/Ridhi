import { createContext, useContext, useEffect, useState } from 'react';

import http from '../api/http';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'chat-user';
const TOKEN_STORAGE_KEY = 'chat-token';
const PENDING_SIGNUP_KEY = 'chat-pending-signup';

const readStoredValue = (key) => {
  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredValue(USER_STORAGE_KEY));
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_STORAGE_KEY));
  const [pendingSignup, setPendingSignup] = useState(() => readStoredValue(PENDING_SIGNUP_KEY));

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (pendingSignup) {
      window.localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(pendingSignup));
    } else {
      window.localStorage.removeItem(PENDING_SIGNUP_KEY);
    }
  }, [pendingSignup]);

  const login = async (credentials) => {
    const { data } = await http.post('/auth/login', credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const sendOtp = async (signupData) => {
    const { data } = await http.post('/auth/sendOTP', signupData);
    setPendingSignup({
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      otpVerified: false
    });
    return data;
  };

  const verifyOtp = async ({ email, otp }) => {
    const { data } = await http.post('/auth/verifyOTP', { email, otp });
    setPendingSignup((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        otpVerified: true
      };
    });
    return data;
  };

  const completeSignup = async (emailOverride) => {
    const email = emailOverride || pendingSignup?.email;
    if (!email) {
      throw new Error('Email is required to complete signup');
    }

    const { data } = await http.post('/auth/signup', { email });

    setUser(data.user);
    setToken(data.token);
    setPendingSignup(null);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPendingSignup(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(PENDING_SIGNUP_KEY);
  };

  const value = {
    user,
    token,
    pendingSignup,
    isAuthenticated: Boolean(user && token),
    login,
    sendOtp,
    verifyOtp,
    completeSignup,
    logout,
    setPendingSignup
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
