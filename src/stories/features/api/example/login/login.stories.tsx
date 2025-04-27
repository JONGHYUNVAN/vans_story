import type { Meta, StoryObj } from '@storybook/react';
import LoginApiExample from './login.api.example';

const meta: Meta = {
  title: 'Features/API/Example/Login',
  component: LoginApiExample,
};
export default meta;
type Story = StoryObj<typeof LoginApiExample>;

export const ExampleLogin: Story = {}; 