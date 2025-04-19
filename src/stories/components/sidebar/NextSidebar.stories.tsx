import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import NextSidebar from '@/components/sidebar/NextSidebar';

// 실제 Sidebar 컴포넌트 대신 개별 사이드바 컴포넌트를 직접 표시
const SidebarContainer = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <aside className="fixed left-0 top-0 h-full z-[30] overflow-hidden">
      {children}
    </aside>
  </Provider>
);

const meta: Meta<typeof SidebarContainer> = {
  title: 'stories/components/sidebar/NextSidebar',
  component: SidebarContainer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarContainer>;

// Next.js 사이드바
export const Default: Story = {
  render: () => (
    <SidebarContainer>
      <NextSidebar />
    </SidebarContainer>
  ),
}; 