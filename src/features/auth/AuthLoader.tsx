import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/store';
import { fetchUserProfile } from '../../store/userSlice';

const AuthLoader: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return null;
};

export default AuthLoader;
