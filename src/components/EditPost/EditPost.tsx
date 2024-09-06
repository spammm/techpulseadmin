import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { ImageUploader } from '../ImageUploader';
import { SourceInput } from '../shared/SourceInput';
import { TagInput } from '../shared/TagInput';
import { TextEditor } from '../TextEditor';
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import {
  editPost,
  loadPostByUrl,
  setActivePost,
  updateActivePostField,
} from '../../store/postsSlice';
import styles from './EditPost.module.css';
import { ImageSelector } from '../ImageSelector';
import { IPost } from '../../types/post';
import { IPostImage } from '../../types/image';

const API_SERVER = import.meta.env.VITE_API_SERVER;
const CLIENT_SITE_HOST = import.meta.env.VITE_SITE_HOST;

export const EditPost: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activePost } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    if (url) {
      dispatch(loadPostByUrl(url));
    }
  }, [url, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setActivePost(null)); // Очищаем активный пост при размонтировании
    };
  }, [dispatch]);

  const handleFieldChange = <K extends keyof IPost>(
    field: K,
    value: IPost[K]
  ) => {
    dispatch(updateActivePostField({ field, value }));
  };

  const handleImageSelect = ({
    smallSrc,
    alt,
    source,
    sourceUrl,
    id,
  }: IPostImage) => {
    handleFieldChange('image', {
      src: `${API_SERVER}${smallSrc}`,
      alt,
      source,
      sourceUrl,
      id,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activePost || !activePost.id) return;

    const formData = {
      ...activePost,
      viewCount: 0,
    };

    try {
      const resultAction = await dispatch(
        editPost({
          id: activePost.id.toString(),
          postData: formData,
        })
      );

      if (editPost.fulfilled.match(resultAction)) {
        console.log('Пост успешно обновлен:', resultAction.payload);
        navigate(`/posts/${resultAction.payload.url}`);
      } else {
        console.error('Ошибка:', resultAction.payload);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  if (!activePost) return null; // Защита от рендеринга до загрузки поста

  return (
    <div className={styles.editPostForm}>
      <h1>Редактировать новость</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="URL статьи"
          name="url"
          value={activePost.url}
          onChange={(e) => handleFieldChange('url', e.target.value)}
          placeholder="Введите URL статьи"
          required
        />
        <Input
          label={`Заголовок (Должен содержать ключевые слова, длина до 80 символов, сейчас ${activePost.title.length})`}
          name="title"
          value={activePost.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Введите заголовок статьи"
          required
        />
        <Input
          label={`Подзаголовок (рекомендованная длина 160-200 символов, сейчас ${activePost.subtitle.length})`}
          name="subtitle"
          value={activePost.subtitle}
          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
          placeholder="Введите подзаголовок"
        />
        <Input
          label="Ключевые слова (Используйте 3-6 ключевых слов/фраз через запятую)"
          name="keywords"
          value={activePost.keywords}
          onChange={(e) => handleFieldChange('keywords', e.target.value)}
          placeholder="Перечислите ключи через запятую"
        />
        <TextEditor
          value={activePost.content}
          onChange={(newValue) => handleFieldChange('content', newValue)}
        />
        <small>
          Обязательно добавить теги (если подходят): "разработки", "гаджеты",
          "технологии", "будущее", "аналитика", "прогнозы", "интервью", "лидеры"
        </small>

        <TagInput
          tags={activePost.tags}
          onChange={(newTags) => handleFieldChange('tags', newTags)}
        />
        <label>Источники материала самой новости:</label>
        <SourceInput
          sources={activePost.sources}
          onChange={(newSources) => handleFieldChange('sources', newSources)}
        />
        <div>
          <p>Главная картинка новости</p>
          <ImageSelector
            onSelectImage={handleImageSelect}
            defaultImageId={activePost.image?.id}
          />
          <br />
          <Input
            label="Название картинки"
            name="imageAlt"
            onChange={(e) =>
              handleFieldChange('image', {
                ...activePost.image,
                alt: e.target.value,
              })
            }
            value={activePost.image?.alt || ''}
          />
        </div>
        <ImageUploader postId={activePost.id} />
        <hr />
        <Input
          label="Имя автора"
          name="authorName"
          value={activePost.authorName}
          onChange={(e) => handleFieldChange('authorName', e.target.value)}
          placeholder="Введите имя автора"
        />
        <div className={styles.checkboxGroup}>
          <label htmlFor="showAuthorName">Показывать имя автора</label>
          <input
            type="checkbox"
            name="showAuthorName"
            id="showAuthorName"
            checked={activePost.showAuthorName}
            onChange={(e) =>
              handleFieldChange('showAuthorName', e.target.checked)
            }
            disabled={!activePost.authorName}
          />
        </div>
        <div className={styles.checkboxGroup}>
          <label htmlFor="published">Опубликовать</label>
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={activePost.published}
            onChange={(e) => handleFieldChange('published', e.target.checked)}
          />
        </div>
        {activePost.published && (
          <div>
            <a
              href={`${CLIENT_SITE_HOST}/news/${activePost.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть страницу
            </a>
          </div>
        )}
        <Button text="Сохранить изменения" type="submit" />
      </form>
    </div>
  );
};
