import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/authApi';
import { Button } from '../shared/Button';

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return <Button onClick={handleLogout} text="Выйти" />;
};
