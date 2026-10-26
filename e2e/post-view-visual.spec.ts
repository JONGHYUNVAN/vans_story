import { test, expect } from 'playwright/test';

/**
 * 카테고리 포스트 페이지 27개(목록·하위 카테고리 목록·상세)의 시각 회귀 테스트.
 * 통합(D단계) 전후 비교용. 백엔드는 mock Post BE(localhost:3001, 고정 fixture)를 전제로 한다.
 * 스냅샷은 로컬 데이터 상태에 묶여 있으므로 저장소에 넣지 않는다(.gitignore).
 */
const CATEGORIES = [
  'nextjs',
  'nestjs',
  'spring',
  'mariadb',
  'mongodb',
  'docker',
  'jwt',
  'algorithm',
  'database-theory',
] as const;

const SUB = 'introduction';
const POST_ID = (c: string) =>
  `aaaaaaaaaaaaaaaaaaaa${CATEGORIES.indexOf(c as never)
    .toString()
    .padStart(2, '0')}00`;

test.use({ viewport: { width: 1280, height: 900 } });

for (const c of CATEGORIES) {
  test.describe(c, () => {
    const pages = [
      { name: 'list', url: `/post/view/${c}` },
      { name: 'category', url: `/post/view/${c}/category/${SUB}` },
      { name: 'detail', url: `/post/view/${c}/${POST_ID(c)}` },
    ];
    for (const p of pages) {
      test(p.name, async ({ page }) => {
        await page.goto(p.url, { waitUntil: 'networkidle' });
        // 배경 영상은 프레임마다 달라지므로 숨긴다(레이아웃·색상·카드만 비교)
        await page.addStyleTag({ content: 'video { visibility: hidden !important; }' });
        await page.waitForTimeout(800);
        await expect(page).toHaveScreenshot(`${c}-${p.name}.png`, {
          fullPage: true,
          animations: 'disabled',
          maxDiffPixelRatio: 0.02,
        });
      });
    }
  });
}
