import type { Meta, StoryObj } from '@storybook/react';
import MainContent from '@/components/home/MainContent';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Redux 프로바이더로 컴포넌트 래핑
const MainContentWithProvider = () => (
  <Provider store={store}>
    <MainContent />
  </Provider>
);

const meta: Meta<typeof MainContentWithProvider> = {
  title: 'stories/components/home/MainContent',
  component: MainContentWithProvider,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MainContentWithProvider>;

export const Default: Story = {
  args: {},
}; 