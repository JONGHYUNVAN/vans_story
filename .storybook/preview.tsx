import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/,
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