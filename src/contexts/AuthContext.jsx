
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../hooks/ApiService';

const AuthContext = createContext({});


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password, fullName, phoneNumber, role) => {
  
    try {
      const response = await ApiService.post(`/auth/register`,{ fullName, phoneNumber, email, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log("Registration response:", response);
  
      if (response?.token && response?.client) {
        // Save client/token to state/localStorage
        setUser(response.client);
        localStorage.setItem('token', response?.token);
        localStorage.setItem('clientDetails', JSON.stringify(response?.client));
  
        return { data:response, error: null };
      } else {
        return { data: null, error: { message: 'Invalid response from server' } };
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      return { data: null, error: { message } };
    }
  };
  
  const signIn = async (email, password) => {
    try {
      const response = await ApiService.post(`/auth/login/client`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response?.token && response?.client) {
        // Store token and user
        setUser(response?.client);
        localStorage.setItem('token', response?.token);
        localStorage.setItem('isLogin',true);
        localStorage.setItem('clientDetails', JSON.stringify(response?.client));
  
        return { data:response, error: null };
      } else {
        return { data: null, error: { message: 'Invalid response from server' } };
      }
    } catch (err) {
      console.error('Login failed:', err);
  
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
  
      return { data: null, error: { message } };
    }
  };
    
  const signOut = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.clear();
    return { error: null };
  };

  const createUserProfile = async (userId, email, userType, fullName, phone) => {
    const updatedProfile = {
      id: userId,
      email,
      userType,
      fullName,
      phone
    };

    setUserProfile(updatedProfile);
    const userData = { ...user, ...updatedProfile };
    setUser(userData);
    localStorage.setItem('clientDetails', JSON.stringify(userData));

    return { data: updatedProfile, error: null };
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    createUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
