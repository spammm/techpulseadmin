import { IComment } from './comment';
import { IPost } from './post';

export interface IUser {
  id: number;
  username?: string;
  password?: string;
  role: 'admin' | 'writer' | 'manager' | 'client' | 'user' | 'guest';
  avatar?: string;
  email?: string;
  isEmailConfirmed?: boolean;
  firstName?: string;
  lastName?: string;
  publicAlias?: string;
  note?: string;
  about?: string;
  disable?: boolean;
  contacts?: Array<{ name: string; value: string }>;
  createdAt?: Date;
  updatedAt?: Date;
  provider?: string;
  providerId?: string;
  posts?: IPost[];
  comments?: IComment[];
}
