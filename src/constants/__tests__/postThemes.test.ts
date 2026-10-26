import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  POST_THEMES,
  POST_THEME_KEYS,
  POST_THEME_GROUPS,
  getPostTheme,
  isPostThemeKey,
} from '../postThemes';
import { CATEGORY_GROUPS, MAIN_CATEGORIES } from '../mainCategories';

const PUBLIC_DIR = join(process.cwd(), 'public');

describe('POST_THEMES', () => {
  it('키 집합이 CATEGORY_GROUPS(에디터 메인 카테고리)의 값 집합과 같다', () => {
    const formValues = Object.values(CATEGORY_GROUPS)
      .flatMap((g) => g.categories.map((c) => c.value))
      .sort();
    expect([...POST_THEME_KEYS].sort()).toEqual(formValues);
    expect(MAIN_CATEGORIES.map((c) => c.value).sort()).toEqual(formValues);
  });

  it('홈 사이드바 그룹은 모든 테마를 정확히 한 번씩 포함한다', () => {
    const grouped = Object.values(POST_THEME_GROUPS).flat().sort();
    expect(grouped).toEqual([...POST_THEME_KEYS].sort());
  });

  it.each(POST_THEME_KEYS)('%s: path·이미지·영상 파일이 맞는다', (key) => {
    const theme = POST_THEMES[key];
    expect(theme.key).toBe(key);
    expect(theme.path).toBe(`/post/view/${key}`);
    expect(existsSync(join(PUBLIC_DIR, theme.fallbackImage))).toBe(true);
    if (theme.layout.video) {
      expect(existsSync(join(PUBLIC_DIR, theme.layout.video.src))).toBe(true);
    }
  });

  it('getPostTheme/isPostThemeKey: 모르는 값은 거부', () => {
    expect(isPostThemeKey('nextjs')).toBe(true);
    expect(isPostThemeKey('jest')).toBe(false);
    expect(getPostTheme('../etc')).toBeNull();
    expect(getPostTheme('spring')?.name).toBe('Spring');
  });
});
