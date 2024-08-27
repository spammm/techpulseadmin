import React from 'react';
import { Provider } from 'react-redux';
import { AppRouter } from './router';
import { store } from './store/store';
import AuthLoader from './features/auth/AuthLoader';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthLoader />
      <AppRouter />
    </Provider>
  );
};

export default App;
