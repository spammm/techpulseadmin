import { useNavigate } from 'react-router-dom';
import { logoutUser } from '..';
import { Button } from '../../../shared/ui';

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return <Button onClick={handleLogout} text="Выйти" />;
};
