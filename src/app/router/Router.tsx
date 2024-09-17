import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { PrivateRoute } from './PrivateRoute';
import { CommentsPage } from '../../pages/comments';
import { CreateUserPage } from '../../pages/createUsers';
import { DashboardPage } from '../../pages/dashboard';
import { EditPostPage } from '../../pages/editPost';
import { EditUserPage } from '../../pages/editUser';
import { NewPostPage } from '../../pages/newPost';
import { ProfilePage } from '../../pages/profile';
import { UserListPage } from '../../pages/users';
import { LoginPage } from '../../pages/login';
import { PostsPage } from '../../pages/posts';

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
