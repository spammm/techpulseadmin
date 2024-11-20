import {
  Input,
  TagInput,
  SourceInput,
  Button,
  TextEditor,
  Notification,
  Checkbox,
} from '../../../../shared/ui';
import { useCreatePostForm } from '../../model/useCreatePostForm';
import styles from './CreatePostForm.module.scss';

export const CreatePostForm: React.FC = () => {
  const {
    tags,
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
  } = useCreatePostForm();

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
        <br />
        <Input
          label="Шаблон для поиска похожих статей"
          readOnly
          defaultValue={`https://yandex.ru/search/?text=[Текст] site:tehpulse.ru`}
        />
        <br />
        <small>
          Обязательно добавить теги: «разработки», «гаджеты», «технологии» и
          т.д.
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
        {errorNotification && (
          <Notification
            message={errorNotification}
            type="error"
            onClose={() => setErrorNotification(null)}
          />
        )}
      </form>
    </div>
  );
};
