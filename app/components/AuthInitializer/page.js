"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/app/redux/slice/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuthState = localStorage.getItem('authState');
      if (savedAuthState) {
        dispatch(setAuthState(JSON.parse(savedAuthState)));
      }
    }
  }, [dispatch]);

  return null; 
};

export default AuthInitializer;
