import type { Meta, StoryObj } from '@storybook/react';
import Header from '@/components/header/Header';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Redux 프로바이더로 컴포넌트 래핑
const HeaderWithProvider = () => (
  <Provider store={store}>
    <Header />
  </Provider>
);

const meta: Meta<typeof HeaderWithProvider> = {
  title: 'stories/components/header/Header',
  component: HeaderWithProvider,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="sb-section">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderWithProvider>;

export const Default: Story = {
  args: {},
}; 