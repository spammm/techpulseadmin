import { IUser } from '../../../shared/types/user';

export type EditUserFormProps = {
  userProfile: IUser;
};

export type FormData = Omit<IUser, 'id'> & {
  confirmPassword: string;
  password: string;
};
