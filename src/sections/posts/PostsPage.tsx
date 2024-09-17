import { PostList } from '../../features/posts';

export const PostsPage: React.FC = () => {
  return (
    <section>
      <h1>Список постов</h1>
      <PostList />
    </section>
  );
};
