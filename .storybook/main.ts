import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/experimental-nextjs-vite",
    "options": {}
  },
  "staticDirs": ['../public'],
  "viteFinal": async (config) => {
    // 스토리북을 정적 파일로 제공하기 위한 설정
    return {
      ...config,
      base: '/storybook/'
    };
  }
};
export default config;