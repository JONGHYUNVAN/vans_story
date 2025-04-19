import type { Meta, StoryObj } from '@storybook/react';
import AuthButtons from '@/components/header/AuthButtons';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Redux 프로바이더로 컴포넌트 래핑
const AuthButtonsWithProvider = () => (
  <Provider store={store}>
    <AuthButtons />
  </Provider>
);

const meta: Meta<typeof AuthButtonsWithProvider> = {
  title: 'stories/components/header/AuthButtons',
  component: AuthButtonsWithProvider,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AuthButtonsWithProvider>;

export const Default: Story = {
  args: {},
}; 