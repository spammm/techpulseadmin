import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { ImageUploader } from '../ImageUploader';
import { SourceInput } from '../shared/SourceInput';
import { TagInput } from '../shared/TagInput';
import { TextEditor } from '../TextEditor';
import { IPost } from '../../types/post';
import { RootState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { editPost, loadPostByUrl } from '../../store/postsSlice';
import styles from './EditPost.module.css';

export const EditPost: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { activePost } = useSelector((state: RootState) => state.posts);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [sources, setSources] = useState<{ name: string; link: string }[]>([]);
  const [image, setImage] = useState<{ src: string; alt: string }>({
    src: '',
    alt: '',
  });
  const [imageLinks, setImageLinks] = useState<{ src: string; alt: string }[]>(
    []
  );
  const [published, setPublished] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [showAuthorName, setShowAuthorName] = useState<boolean>(false);

  useEffect(() => {
    if (url) {
      dispatch(loadPostByUrl(url));
    }
  }, [url, dispatch]);

  useEffect(() => {
    if (activePost) {
      setTitle(activePost.title || '');
      setSubtitle(activePost.subtitle || '');
      setKeywords(activePost.keywords || '');
      setContent(activePost.content || '');
      setTags(activePost.tags || []);
      setSources(activePost.sources || []);
      setImageLinks(activePost.imageLinks || []);
      setPublished(activePost.published || false);
      setAuthorName(activePost.authorName || '');
      setShowAuthorName(activePost.showAuthorName || false);
      setImage(
        activePost.image || {
          src: '',
          alt: '',
        }
      );
    }
  }, [activePost]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activePost || !activePost.id) return;

    const formData: Omit<
      IPost,
      'id' | 'createdAt' | 'updatedAt' | 'url' | 'owner'
    > = {
      title,
      subtitle,
      content,
      tags,
      sources,
      image,
      imageLinks,
      keywords,
      published,
      authorName,
      showAuthorName,
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

  return (
    <div className={styles.editPostForm}>
      <h1>Редактировать новость</h1>
      <form onSubmit={handleSubmit}>
        <Input
          label="Заголовок"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок статьи"
          required
        />
        <Input
          label="Подзаголовок"
          name="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Введите подзаголовок"
        />
        <Input
          label="Ключевые слова"
          name="keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Перечислите ключи через запятую"
        />
        <TextEditor value={content} onChange={setContent} />
        <small>
          Обязательно добавить теги(если подходят): "разработки", "гаджеты",
          "технологии", "будущее", "аналитика", "прогнозы", "интервью", "лидеры"
        </small>

        <TagInput tags={tags} onChange={setTags} />
        <SourceInput sources={sources} onChange={setSources} />
        <div>
          <p>Главная картинка новости</p>
          <Input
            label="URL главной картинки"
            name="imageUrl"
            onChange={(e) =>
              setImage((prev) => ({ ...prev, src: e.target.value }))
            }
            value={image.src}
          />
          <Input
            label="Название картинки"
            name="imageAlt"
            onChange={(e) =>
              setImage((prev) => ({ ...prev, alt: e.target.value }))
            }
            value={image.alt}
          />
        </div>
        <ImageUploader
          onUpload={setImageLinks}
          defaultImageLinks={imageLinks}
        />
        <Input
          label="Имя автора"
          name="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Введите имя автора"
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
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </div>
        <Button text="Сохранить изменения" type="submit" />
      </form>
    </div>
  );
};
