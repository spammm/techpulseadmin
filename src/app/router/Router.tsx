import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from '../layouts';
import { CommentsPage } from '../../sections/comments';
import { CreateUserPage } from '../../sections/createUsers';
import { DashboardPage } from '../../sections/dashboard';
import { EditPostPage } from '../../sections/editPost';
import { EditUserPage } from '../../sections/editUser';
import { LoginPage } from '../../sections/login';
import { NewPostPage } from '../../sections/newPost';
import { PostsPage } from '../../sections/posts';
import { ProfilePage } from '../../sections/profile';
import { UserListPage } from '../../sections/users';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <PrivateRoute allowedRoles={['admin', 'writer', 'manager']} />
          }
        >
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="/posts/:url" element={<EditPostPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/users/create" element={<CreateUserPage />} />
            </Route>

            <Route
              element={<PrivateRoute allowedRoles={['admin', 'manager']} />}
            >
              <Route path="/comments" element={<CommentsPage />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/:id" element={<EditUserPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
