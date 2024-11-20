import { useMemo, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import { updateUserProfile } from '../model/userSlice';
import { IUser } from '../../../shared/types/user';
import { getEditFormDefaultValues } from '../utils/editFormUtils';
import { FormData } from '../types/editFormTypes';
import { selectUsersError, selectUsersStatus } from './selectors';

export const useEditUser = (userProfile: IUser) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectUsersStatus);
  const error = useAppSelector(selectUsersError);
  const isLoading = status === 'loading';

  const defaultValues = useMemo(
    () => getEditFormDefaultValues(userProfile),
    [userProfile]
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, password, ...restData } = data;

      const profileData: Partial<IUser> = {
        ...restData,
        password: password ? password.trim() : undefined,
      };

      try {
        const resultAction = await dispatch(
          updateUserProfile({
            id: userProfile.id.toString(),
            profileData,
          })
        );

        if (updateUserProfile.fulfilled.match(resultAction)) {
          setNotification({
            message: 'Профиль обновлен успешно',
            type: 'success',
          });
        } else {
          console.error(
            'Ошибка при обновлении профиля',
            resultAction.payload?.message
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Ошибка при обновлении профиля: ', error.message);
        } else {
          console.error('Неизвестная ошибка при обновлении профиля');
        }
      }
    },
    [dispatch, userProfile.id]
  );

  if (error) {
    setNotification({ message: error, type: 'error' });
  }

  return {
    defaultValues,
    status,
    isLoading,
    notification,
    setNotification,
    onSubmit,
  };
};
