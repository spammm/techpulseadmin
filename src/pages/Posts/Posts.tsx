import React from 'react';
import { PostList } from '../../components/PostList';

const Posts: React.FC = () => {
  return (
    <div>
      <h1>Список постов</h1>
      <PostList />
    </div>
  );
};

export { Posts };
