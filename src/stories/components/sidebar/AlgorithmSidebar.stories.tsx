import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import AlgorithmSidebar from '@/components/sidebar/AlgorithmSidebar';

// BaseSidebar를 사용하는 컴포넌트를 위한 래퍼
const SidebarContainer = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <div className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      {children}
    </div>
  </Provider>
);

const meta: Meta = {
  title: 'stories/components/sidebar/AlgorithmSidebar',
  component: SidebarContainer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8f9fa' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        height: '100vh', 
        background: '#f8f9fa',
        position: 'relative',
      }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarContainer>;

export const Default: Story = {
  render: () => (
    <SidebarContainer>
      <AlgorithmSidebar />
    </SidebarContainer>
  ),
}; 