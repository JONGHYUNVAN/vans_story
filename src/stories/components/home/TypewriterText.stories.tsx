import type { Meta, StoryObj } from '@storybook/react';
import TypewriterText from '@/components/home/TypewriterText';

const meta: Meta<typeof TypewriterText> = {
  title: 'stories/components/home/TypewriterText',
  component: TypewriterText,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    text: { control: 'text' },
    style: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof TypewriterText>;

export const DefaultStyle: Story = {
  args: {
    text: 'I am Van',
    style: {
      color: '#3B82F6', // blue-500
      fontFamily: 'monospace',
    },
  },
};

export const GreenStyle: Story = {
  args: {
    text: 'I am Developer',
    style: {
      color: '#10B981', // green-500
      fontFamily: 'system-ui',
    },
  },
};

export const PurpleStyle: Story = {
  args: {
    text: 'Welcome!',
    style: {
      color: '#8B5CF6', // purple-500
      fontFamily: 'cursive',
    },
  },
}; 