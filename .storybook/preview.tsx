import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';

// API 스토리를 위한 데코레이터
const withApiMock = (Story: React.ComponentType) => (
  <div className="p-4 border rounded-lg bg-white shadow-sm">
    <Story />
  </div>
);

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
  // API 스토리 전용 데코레이터
  globalTypes: {
    apiMock: {
      name: 'API Mock',
      description: 'API 모킹 사용 여부',
      defaultValue: false,
      toolbar: {
        icon: 'api',
        items: [
          { value: false, title: '실제 API' },
          { value: true, title: '모킹 API' },
        ],
      },
    },
  },
};

export default preview; 