import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { ImageUploader } from '../ImageUploader';
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
  const [imageLinks, setImageLinks] = useState<{ src: string; alt: string }[]>(
    []
  );
  const [image, setImage] = useState<{ src: string; alt: string }>({
    src: '',
    alt: '',
  });

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
  const handleImageUpload = (links: { src: string; alt: string }[]) =>
    setImageLinks(links);

  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
    if (e.target.value === '') {
      setShowAuthorName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      subtitle: (form.elements.namedItem('subtitle') as HTMLInputElement).value,
      keywords: (form.elements.namedItem('keywords') as HTMLInputElement).value,
      content,
      tags,
      sources,
      imageLinks,
      image,
      published: (form.elements.namedItem('published') as HTMLInputElement)
        .checked,
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
      <h1>Создать новость</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Заголовок"
          name="title"
          placeholder="Введите заголовок статьи"
          required
        />
        <Input
          label="Подзаголовок"
          name="subtitle"
          placeholder="Введите подзаголовок"
        />
        <Input
          label="Ключевые слова"
          name="keywords"
          placeholder="Перечислите ключи через запятую"
        />
        <TextEditor onChange={setContent} />
        <small>
          Обязательно добавить теги(если подходят): "разработки", "гаджеты",
          "технологии", "будущее", "аналитика", "прогнозы", "интервью", "лидеры"
        </small>
        <TagInput tags={tags} onChange={handleTagChange} />
        <SourceInput sources={sources} onChange={handleSourceChange} />
        <ImageUploader onUpload={handleImageUpload} />
        <div>
          <p>Главная картинка новости</p>
          <Input
            label="URL главной картинки"
            name="imageUrl"
            onChange={(e) =>
              setImage((prev) => ({ ...prev, src: e.target.value }))
            }
          />
          <Input
            label="Название картинки"
            name="imageAlt"
            onChange={(e) =>
              setImage((prev) => ({ ...prev, alt: e.target.value }))
            }
          />
        </div>
        <Input
          label="Имя автора"
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
        <div className={styles.checkboxGroup}>
          <label htmlFor="published">Опубликовать</label>
          <input type="checkbox" name="published" id="published" />
        </div>
        <Button text="Создать новость" type="submit" />
      </form>
    </div>
  );
};
