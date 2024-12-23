import { IImage, IPostImage } from './image';
import { ISources } from './sources';
import { IUser } from './user';

export interface IPost {
  id: number;
  url: string;
  keywords?: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  image: Partial<IPostImage>;
  imageLinks?: IImage[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  sources: ISources[];
  authorName?: string;
  showAuthorName: boolean;
  viewCount: number;
  owner?: IUser;
  comments?: [];
  telegramMessageId?: number;
}
