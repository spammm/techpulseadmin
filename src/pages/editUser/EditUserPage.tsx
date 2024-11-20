import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  EditUserForm,
  fetchUserById,
  selectUserById,
} from '../../entities/users';
import { useAppSelector, useAppDispatch } from '../../shared/model';
import styles from './EditUserPage.module.scss';

export const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const userId = id || '';
  const userProfile = useAppSelector((state) => selectUserById(state, userId));

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
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
