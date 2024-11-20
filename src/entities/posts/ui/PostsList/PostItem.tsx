import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { IPost } from '../../../../shared/types/post';
import { Button } from '../../../../shared/ui';
import { formatDate } from '../../../../shared/lib/utils';
import styles from './PostItem.module.scss';

interface PostItemProps {
  post: IPost;
  userRole: string;
  onDelete: (postId: number) => void;
}

const MetaItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => {
  return (
    <p>
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
};

const PostItem: React.FC<PostItemProps> = memo(
  ({ post, userRole, onDelete }) => {
    const clientSiteHost = import.meta.env.VITE_SITE_HOST;
    const createdAt = formatDate(post.createdAt);
    const publishedAt = post.publishedAt
      ? formatDate(post.publishedAt)
      : 'Не опубликовано';

    return (
      <div className={styles.postItem}>
        {post.image?.src && (
          <img
            src={post.image.src}
            alt={post.image.alt}
            className={styles.thumbnail}
          />
        )}
        <div className={styles.postContent}>
          <h3>
            <Link to={`/posts/${post.url}`}>{post.title}</Link>
          </h3>
          <p className={styles.subtitle}>{post.subtitle}</p>
          <div className={styles.meta}>
            <MetaItem
              label="Автор"
              value={
                post.authorName || post.owner?.username || 'Неизвестный автор'
              }
            />
            <MetaItem label="Просмотры" value={post.viewCount} />
            <MetaItem
              label="Опубликовано"
              value={post.published ? 'Опубликовано' : 'Не опубликовано'}
            />
            <MetaItem label="Дата создания" value={createdAt} />
            <MetaItem
              label="Дата публикации"
              value={post.published ? publishedAt : '-'}
            />
          </div>
          <div className={styles.tags}>
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          {post.published && (
            <Link
              to={`${clientSiteHost}/news/${post.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть на основном сайте
            </Link>
          )}
          {userRole === 'admin' && (
            <div className={styles.actions}>
              <Button
                className={styles.deleteButton}
                text="Удалить"
                onClick={() => onDelete(post.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.post.id === nextProps.post.id;
  }
);

export default PostItem;
