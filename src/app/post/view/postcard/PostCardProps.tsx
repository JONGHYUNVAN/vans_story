import React from 'react';
import { BasePost } from './BasePost';

export interface PostCardProps<T extends BasePost> {
  post: T;
  renderBadge?: (post: T) => React.ReactNode;
}
