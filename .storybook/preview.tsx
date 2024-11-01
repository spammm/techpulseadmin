import React from 'react';
import type { Preview } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '../src/app/appStore';
import '../src/app/main.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

export default preview;
