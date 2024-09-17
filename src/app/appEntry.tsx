import { Provider } from 'react-redux';
import { AppRouter } from './router';
import { store } from './appStore';
import { AuthLoader } from '../features/auth';

import './main.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthLoader />
      <AppRouter />
    </Provider>
  );
};

export default App;
