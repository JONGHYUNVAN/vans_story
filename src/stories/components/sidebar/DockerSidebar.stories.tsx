import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import DockerSidebar from '@/components/sidebar/DockerSidebar';

// BaseSidebar를 사용하는 컴포넌트를 위한 래퍼
const SidebarContainer = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <div className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      {children}
    </div>
  </Provider>
);

const meta: Meta = {
  title: 'stories/components/sidebar/DockerSidebar',
  component: SidebarContainer,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'docker-blue',
      values: [
        { name: 'docker-blue', value: '#0f4d71' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        height: '100vh', 
        background: '#0f4d71',
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
      <DockerSidebar />
    </SidebarContainer>
  ),
}; 