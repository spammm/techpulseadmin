import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { SourceInput } from '../shared/SourceInput';
import { TagInput } from '../shared/TagInput';
import { createPost } from '../../api/postsApi';
import { TextEditor } from '../TextEditor';
import { RootState } from '../../store/store';
import styles from './CreatePost.module.css';

export const CreatePost: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [sources, setSources] = useState<{ name: string; link: string }[]>([]);

  const [authorName, setAuthorName] = useState<string>('');
  const [showAuthorName, setShowAuthorName] = useState<boolean>(false);

  const userProfile = useSelector((state: RootState) => state.user.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      setAuthorName(userProfile.publicAlias || '');
    }
  }, [userProfile]);

  const handleTagChange = (newTags: string[]) => setTags(newTags);
  const handleSourceChange = (newSources: { name: string; link: string }[]) =>
    setSources(newSources);

  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    if (e.target.value === '') {
      setShowAuthorName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;

    if (!title.trim()) {
      alert('Пожалуйста, введите заголовок.');
      return;
    }

    const formData = {
      title,
      subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
      keywords: (form.elements.namedItem('keywords') as HTMLInputElement).value,
      content,
      tags,
      sources,
      authorName,
      showAuthorName,
    };

    try {
      const response = await createPost(formData);
      console.log('Пост успешно создан:', response);
      navigate(`/posts/${response.url}`);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className={styles.createPostForm}>
      <h1>Создать черновик</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label={`Заголовок (Должен содержать ключевые слова, длина до 80 символов)`}
          name="title"
          placeholder="Введите заголовок статьи"
          required
        />
        <Input
          label={`Подзаголовок (рекомендованная длина 160-200 символов)`}
          name="subtitle"
          placeholder="Введите подзаголовок"
        />
        <Input
          label="Ключевые слова (Используйте 3-6 ключевых слов/фраз через запятую)"
          name="keywords"
          placeholder="Перечислите ключи через запятую"
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
          <label htmlFor="showAuthorName">Показывать имя автора</label>
          <input
            type="checkbox"
            name="showAuthorName"
            id="showAuthorName"
            checked={showAuthorName}
            onChange={(e) => setShowAuthorName(e.target.checked)}
            disabled={!authorName}
          />
        </div>

        <Button text="Создать черновик" type="submit" />
      </form>
    </div>
  );
};
