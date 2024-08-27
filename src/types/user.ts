export interface IUser {
  id: number;
  username: string;
  role: 'admin' | 'writer' | 'manager' | 'client' | 'user';
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  publicAlias?: string;
  note?: string;
  about?: string;
  contacts?: Array<{ name: string; value: string }>;
  disable: boolean;
  viewCount?: number;
}
