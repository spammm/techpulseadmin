import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EditUserForm } from '../../features/editUser';
import { fetchUserById } from '../../shared/model/store/userSlice';
import { RootState, useAppDispatch } from '../../app/appStore';

import styles from './EditUserPage.module.scss';

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const userId = id ? parseInt(id, 10) : null;

  const userProfile = useSelector((state: RootState) =>
    state.user.users.find((user) => user.id === userId)
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId.toString()));
    }
  }, [dispatch, userId]);

  if (!userProfile) {
    return <p>Загрузка данных пользователя...</p>;
  }

  return (
    <div className={styles.editUserPage}>
      <EditUserForm userProfile={userProfile} />
    </div>
  );
};
