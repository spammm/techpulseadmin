import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/appStore';
import { createUser as createUserAction } from '../../../shared/model/store/userSlice';
import { checkUsernameExists } from '../../../shared/api/usersApi';
import { IUser } from '../../../shared/types/user';

export const useCreateUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' as IUser['role'],
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Сброс ошибки при изменении поля
  };

  const validateForm = async () => {
    let valid = true;
    const newErrors = { username: '', password: '', role: '' };
    setLoading(true);
    if (!formData.username) {
      newErrors.username = 'Логин обязателен';
      valid = false;
    } else if (await checkUsernameExists(formData.username)) {
      newErrors.username = 'Логин уже существует';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
      valid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Роль обязательна';
      valid = false;
    }

    setErrors(newErrors);
    setLoading(false);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const resultAction = await dispatch(createUserAction(formData));

      if (createUserAction.fulfilled.match(resultAction)) {
        navigate('/users');
      } else {
        console.error('Ошибка:', resultAction.payload);
      }
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  return { handleChange, handleSubmit, formData, errors, loading };
};
