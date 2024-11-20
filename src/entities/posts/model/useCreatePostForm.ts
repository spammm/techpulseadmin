import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import { addNewPost } from './postsSlice';
import {
  selectCurrentUser,
  selectPostsError,
  selectPostStatus,
} from './selectors';

export const useCreatePostForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [sources, setSources] = useState<{ name: string; link: string }[]>([]);
  const [authorName, setAuthorName] = useState<string>('');
  const [showAuthorName, setShowAuthorName] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [errorNotification, setErrorNotification] = useState<string | null>(
    null
  );
  const [isTitleValid, setIsTitleValid] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectPostStatus);
  const userProfile = useAppSelector(selectCurrentUser);
  const error = useAppSelector(selectPostsError);

  useEffect(() => {
    if (userProfile) {
      setAuthorName(userProfile.publicAlias || '');
    }
  }, [userProfile]);

  useEffect(() => {
    if (error) {
      setErrorNotification(error);
    }
  }, [error]);

  const handleTagChange = (newTags: string[]) => setTags(newTags);

  const handleSourceChange = (newSources: { name: string; link: string }[]) =>
    setSources(newSources);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const titleValue = e.target.value;
    setTitle(titleValue);
    setIsTitleValid(titleValue.length > 0);
  };

  const handleAuthorNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setAuthorName(name);
    if (name === '') {
      setShowAuthorName(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isTitleValid) {
      setErrorNotification('Пожалуйста, введите заголовок.');
      return;
    }

    const formData = {
      title: title.trim(),
      subtitle,
      keywords,
      content,
      tags,
      sources,
      authorName,
      showAuthorName,
    };

    const resultAction = await dispatch(addNewPost(formData));

    if (addNewPost.fulfilled.match(resultAction)) {
      navigate(`/posts/${resultAction.payload.url}`);
    }
  };

  return {
    tags,
    content,
    sources,
    authorName,
    showAuthorName,
    title,
    subtitle,
    keywords,
    errorNotification,
    isTitleValid,
    status,
    handleTagChange,
    handleSourceChange,
    handleTitleChange,
    handleAuthorNameChange,
    handleSubmit,
    setContent,
    setSubtitle,
    setKeywords,
    setShowAuthorName,
    setErrorNotification,
  };
};
