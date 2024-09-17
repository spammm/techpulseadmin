import { memo } from 'react';
import { IComment } from '../../../shared/types/comment';

import styles from './CommentItem.module.scss';

interface CommentItemProps {
  comment: IComment;
  onPublishedChange: (commentId: number, published: boolean) => void;
  onModeratedChange: (commentId: number, moderated: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = memo(
  ({ comment, onPublishedChange, onModeratedChange }) => {
    return (
      <li className={styles.commentItem}>
        <div>
          <p>{comment.content}</p>
          <small>{new Date(comment.createdAt).toLocaleDateString()}</small>

          {comment.post ? (
            <p>
              <a href={`/posts/${comment.post.url}`} target="_blank">
                {comment.post.title
                  ? comment.post.title.slice(0, 50)
                  : 'Без заголовка'}
                ...
              </a>
            </p>
          ) : (
            <p>Пост не найден</p>
          )}

          {comment.user ? (
            <p>
              <a href={`/users/${comment.user.id}`} target="_blank">
                {comment.user.email || 'Без email'}
              </a>
            </p>
          ) : (
            <p>Пользователь не найден</p>
          )}
        </div>
        <div className={styles.actions}>
          <label>
            Опубликовано
            <input
              type="checkbox"
              checked={comment.published}
              onChange={(e) => onPublishedChange(comment.id, e.target.checked)}
            />
          </label>
          <label>
            Промодерировано
            <input
              type="checkbox"
              checked={comment.moderated}
              onChange={(e) => onModeratedChange(comment.id, e.target.checked)}
            />
          </label>
        </div>
      </li>
    );
  }
);
