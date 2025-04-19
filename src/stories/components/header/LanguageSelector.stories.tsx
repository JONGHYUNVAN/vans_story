import type { Meta, StoryObj } from '@storybook/react';
import LanguageSelector from '@/components/header/LanguageSelector';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

// Redux 프로바이더로 컴포넌트 래핑
const LanguageSelectorWithProvider = () => (
  <Provider store={store}>
    <LanguageSelector />
  </Provider>
);

const meta: Meta<typeof LanguageSelectorWithProvider> = {
  title: 'stories/components/header/LanguageSelector',
  component: LanguageSelectorWithProvider,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'center',
        background: 'white' 
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSelectorWithProvider>;

export const Default: Story = {
  args: {},
}; 