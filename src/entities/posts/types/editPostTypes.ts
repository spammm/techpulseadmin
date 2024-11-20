import { IPost, IPostImage } from '../../../shared/types';

export type EditPostFormProps = {
  activePost: IPost;
  handleFieldChange: <K extends keyof IPost>(field: K, value: IPost[K]) => void;
  handleImageSelect: (image: IPostImage) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
