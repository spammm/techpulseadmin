import { useParams } from 'react-router-dom';
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
} from '../../../../shared/ui';
import { useEditPost } from '../../model/useEditPost';
import styles from './EditPostForm.module.scss';

export const EditPostForm: React.FC = () => {
  const clientSite = import.meta.env.VITE_SITE_HOST;
  const { url } = useParams<{ url: string }>();
  const {
    handleFieldChange,
    handleImageSelect,
    handleSubmit,
    activePost,
    notification,
    setNotification,
    setIsCustomPublishDate,
    isLoading,
    isAdmin,
    isCustomPublishDate,
  } = useEditPost(url);

  if (!activePost) return null;

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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
        <Input
          label="Шаблон для поиска похожих статей"
          readOnly
          defaultValue={
            'https://yandex.ru/search/?text=[Текст] site:tehpulse.ru'
          }
        />
        <small>
          Обязательно добавить теги: «разработки», «гаджеты», «технологии» и
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

        {isAdmin && (
          <div className={styles.publishDateContainer}>
            <Checkbox
              id="customPublishDate"
              name="customPublishDate"
              label="Указать дату публикации"
              checked={isCustomPublishDate}
              onChange={(checked) => setIsCustomPublishDate(checked)}
            />
            <Input
              label="Дата публикации"
              name="publishedAt"
              type="text"
              value={
                activePost.publishedAt && isCustomPublishDate
                  ? activePost.publishedAt
                  : ''
              }
              onChange={(e) => handleFieldChange('publishedAt', e.target.value)}
              disabled={!isCustomPublishDate}
            />
          </div>
        )}

        {activePost.published && (
          <div>
            <a
              href={`${clientSite}/news/${activePost.url}`}
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
