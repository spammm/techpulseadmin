import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IComment } from '../../../shared/types/comment';
import { formatDate } from '../../../shared/lib/utils';

import styles from './CommentItem.module.scss';
import { Checkbox } from '../../../shared/ui';

interface CommentItemProps {
  comment: IComment;
  onPublishedChange: (commentId: number, published: boolean) => void;
  onModeratedChange: (commentId: number, moderated: boolean) => void;
}

export const CommentItem: React.FC<CommentItemProps> = memo(
  ({ comment, onPublishedChange, onModeratedChange }) => {
    const formattedDate = formatDate(comment.createdAt);

    return (
      <li className={styles.commentItem}>
        <div>
          <p>{comment.content}</p>
          <small>{formattedDate}</small>

          {comment.post ? (
            <p>
              <Link to={`/posts/${comment.post.url}`} target="_blank">
                {comment.post.title
                  ? comment.post.title.slice(0, 50)
                  : 'Без заголовка'}
                ...
              </Link>
            </p>
          ) : (
            <p>Пост не найден</p>
          )}

          {comment.user ? (
            <p>
              <Link to={`/users/${comment.user.id}`} target="_blank">
                {comment.user.email || 'Без email'}
              </Link>
            </p>
          ) : (
            <p>Пользователь не найден</p>
          )}
        </div>
        <div className={styles.actions}>
          <Checkbox
            checked={comment.published}
            onChange={(checked) => onPublishedChange(comment.id, checked)}
            label="Опубликовано"
          />
          <Checkbox
            checked={comment.moderated}
            onChange={(checked) => onModeratedChange(comment.id, checked)} // Передаем функцию обработки изменения
            label="Промодерировано"
          />
        </div>
      </li>
    );
  }
);
