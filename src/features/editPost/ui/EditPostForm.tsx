import { useState } from 'react';
import { IPostImage } from '../../../shared/types/image';
import { IPost } from '../../../shared/types/post';
import {
  Input,
  TagInput,
  SourceInput,
  Button,
  Checkbox,
  TextEditor,
  ImageSelector,
  ImageUploader,
  Notification,
} from '../../../shared/ui';

import styles from './EditPostForm.module.scss';

type EditPostFormProps = {
  activePost: IPost;
  handleFieldChange: <K extends keyof IPost>(field: K, value: IPost[K]) => void;
  handleImageSelect: (image: IPostImage) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const CLIENT_SITE_HOST = import.meta.env.VITE_SITE_HOST;

export const EditPostForm: React.FC<EditPostFormProps> = ({
  activePost,
  handleFieldChange,
  handleImageSelect,
  handleSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!activePost.title) {
      setNotification({ message: 'Заголовок обязателен', type: 'error' });
      return;
    }
    if (!activePost.url) {
      setNotification({ message: 'Url обязателен', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await handleSubmit(e);
      setNotification({ message: 'Сохранено', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Ошибка при сохранении', type: 'error' });
      console.error('Ошибка при сохранении: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={onSubmit}>
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
          Обязательно добавить теги: "разработки", "гаджеты", "технологии" и
          т.д.
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
          <Checkbox
            id="showAuthorName"
            name="showAuthorName"
            label="Показывать имя автора"
            checked={activePost.showAuthorName}
            onChange={(checked) => handleFieldChange('showAuthorName', checked)}
            disabled={!activePost.authorName}
          />
        </div>
        <div className={styles.checkboxGroup}>
          <Checkbox
            id="published"
            name="published"
            label="Опубликовать"
            checked={activePost.published}
            onChange={(checked) => handleFieldChange('published', checked)}
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
        <Button text="Сохранить изменения" type="submit" loading={isLoading} />
      </form>
    </>
  );
};
