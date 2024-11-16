import type { IUser } from '../../../shared/types/user';
import type { FormData } from '../types/editFormTypes';

export const getEditFormDefaultValues = (userProfile: IUser): FormData => ({
  username: userProfile.username || '',
  email: userProfile.email || '',
  firstName: userProfile.firstName || '',
  lastName: userProfile.lastName || '',
  publicAlias: userProfile.publicAlias || '',
  note: userProfile.note || '',
  about: userProfile.about || '',
  contacts: userProfile?.contacts?.length
    ? userProfile.contacts
    : [{ name: '', value: '' }],
  disable: userProfile.disable || false,
  role: userProfile.role || 'user',
  password: '',
  confirmPassword: '',
});
