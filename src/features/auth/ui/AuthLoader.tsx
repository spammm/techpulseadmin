import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/appStore';
import { fetchUserProfile } from '../../profile';

export const AuthLoader: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return null;
};
