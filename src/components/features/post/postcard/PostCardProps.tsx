import type React from 'react';
import type { BasePost } from './BasePost';

export interface PostCardProps<T extends BasePost> {
  post: T;
  renderBadge?: (post: T) => React.ReactNode;
}
