import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/model';
import {
  Input,
  TagInput,
  SourceInput,
  Button,
  TextEditor,
  Notification,
  Checkbox,
} from '../../../shared/ui';
import { addNewPost } from '../../../shared/model/store/postsSlice';

import styles from './CreatePostForm.module.scss';

export const CreatePostForm: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [sources, setSources] = useState<{ name: string; link: string }[]>([]);
  const [authorName, setAuthorName] = useState<string>('');
  const [showAuthorName, setShowAuthorName] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isTitleValid, setIsTitleValid] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.posts);
  const userProfile = useAppSelector((state) => state.profile.profile);

  useEffect(() => {
    if (userProfile) {
      setAuthorName(userProfile.publicAlias || '');
    }
  }, [userProfile]);

  const handleTagChange = (newTags: string[]) => setTags(newTags);
  const handleSourceChange = (newSources: { name: string; link: string }[]) =>
    setSources(newSources);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedTitle = e.target.value;
    setTitle(trimmedTitle);
    setIsTitleValid(trimmedTitle.length > 0);
  };
  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    if (e.target.value === '') {
      setShowAuthorName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isTitleValid) {
      setError('Пожалуйста, введите заголовок.');
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

    try {
      setError(null);
      const resultAction = await dispatch(addNewPost(formData));

      if (addNewPost.fulfilled.match(resultAction)) {
        navigate(`/posts/${resultAction.payload.url}`);
      } else {
        setError('Ошибка при создании поста');
      }
    } catch (err) {
      console.error('Ошибка при создании поста: ', err);
      setError('Ошибка при создании поста');
    }
  };

  return (
    <div className={styles.createPostForm}>
      <h1>Создать черновик</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Заголовок (Должен содержать ключевые слова, длина до 80 символов)"
          name="title"
          placeholder="Введите заголовок статьи"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <Input
          label="Подзаголовок (рекомендованная длина 160-200 символов)"
          name="subtitle"
          placeholder="Введите подзаголовок"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <Input
          label="Ключевые слова (Используйте 3-6 ключевых слов/фраз через запятую)"
          name="keywords"
          placeholder="Перечислите ключи через запятую"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <TextEditor onChange={setContent} />
        <small>
          Обязательно добавить теги (если подходят): "разработки", "гаджеты",
          "технологии", "будущее", "аналитика", "прогнозы", "интервью", "лидеры"
        </small>
        <TagInput tags={tags} onChange={handleTagChange} />

        <label>Источники материала самой новости:</label>
        <SourceInput sources={sources} onChange={handleSourceChange} />

        <hr />
        <Input
          label="Имя автора статьи"
          name="authorName"
          placeholder="Введите имя автора"
          value={authorName}
          onChange={handleAuthorNameChange}
        />
        <div className={styles.checkboxGroup}>
          <Checkbox
            id="showAuthorName"
            name="showAuthorName"
            label="Показывать имя автора"
            checked={showAuthorName}
            onChange={(checked) => setShowAuthorName(checked)}
            disabled={!authorName}
          />
        </div>

        <Button
          text="Создать черновик"
          type="submit"
          loading={status === 'loading'}
          disabled={!isTitleValid}
        />
        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
      </form>
    </div>
  );
};
