'use client';
import type { Meta, StoryObj } from '@storybook/react';
import PostApiLive from './post.api.live';
import { API_URLS } from '@/api/constants/apiUrl';

const meta: Meta = {
  title: 'Features/API/Live/Post',
  component: PostApiLive,
};
export default meta;
type Story = StoryObj<typeof PostApiLive>;

export const LiveGet: Story = {
  args: {
    endpoint: API_URLS.POST.GET_STORY + '/67f7955e5b320613a0b177c7',
    method: 'GET',
  },
}; 