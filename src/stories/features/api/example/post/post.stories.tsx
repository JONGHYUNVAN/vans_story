import type { Meta, StoryObj } from '@storybook/react';
import PostApiExample from './post.api.example';

const meta: Meta = {
  title: 'Features/API/Example/Post',
  component: PostApiExample,
};
export default meta;
type Story = StoryObj<typeof PostApiExample>;

export const ExampleGet: Story = {
  args: { method: 'GET' },
};
export const ExamplePost: Story = {
  args: { method: 'POST', body: { title: '새 글', content: '내용', author: '홍길동' } },
};
export const ExamplePatch: Story = {
  args: { method: 'PATCH', body: { title: '수정된 글' } },
};
export const ExampleDelete: Story = {
  args: { method: "GET" },
}; 