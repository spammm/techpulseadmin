import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Dashboard } from '../pages/Dashboard';
import { EditPostPage } from '../pages/EditPost';
import { NewPostPage } from '../pages/NewPost';
import { Posts } from '../pages/Posts';
import { LoginPage } from '../pages/Login';
import { PrivateRoute } from './PrivateRoute';
import { UserListPage } from '../pages/UserListPage';
import { ProfilePage } from '../pages/Profile';
import { EditUser } from '../pages/EditUser';
import { CreateUser } from '../pages/CreateUser';

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
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="/posts/:url" element={<EditPostPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/users/create" element={<CreateUser />} />
            </Route>

            <Route
              element={<PrivateRoute allowedRoles={['admin', 'manager']} />}
            >
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/:id" element={<EditUser />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
