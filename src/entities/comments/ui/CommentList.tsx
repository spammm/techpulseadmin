import { memo } from 'react';
import { CommentItem } from './CommentItem';
import { IComment } from '../../../shared/types/comment';

import styles from './CommentList.module.scss';

interface CommentListProps {
  comments: IComment[];
  onPublishedChange: (commentId: number, published: boolean) => void;
  onModeratedChange: (commentId: number, moderated: boolean) => void;
}

export const CommentList: React.FC<CommentListProps> = memo(
  ({ comments, onPublishedChange, onModeratedChange }) => {
    return (
      <ul className={styles.commentList}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onPublishedChange={onPublishedChange}
            onModeratedChange={onModeratedChange}
          />
        ))}
      </ul>
    );
  }
);
