import type { Meta, StoryObj } from '@storybook/react';
import { API_URLS } from '@/api/constants/apiUrl';
import LoginApiLive from './login.api.live';


const meta: Meta = {
  title: 'Features/API/Live/Login',
  component: LoginApiLive,
};
export default meta;
type Story = StoryObj<typeof LoginApiLive>;

export const LiveLogin: Story = {
  args: {
    endpoint: API_URLS.AUTH.LOGIN,
    method: 'POST',
    body: { email: 'test@vans-story.com', password: 'Test1234!' },
  },
}; 