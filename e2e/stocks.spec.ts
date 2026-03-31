import { test, expect, type Page, type Route } from 'playwright/test';

// ============================================================
// Mock 데이터
// ============================================================

const mockPrices = {
  success: true,
  data: {
    stocks: [
      {
        symbol: '005930.KS',
        name: '삼성전자',
        price: 72000,
        change: 1500,
        changePercent: 2.13,
        previousClose: 70500,
        open: 71000,
        high: 72500,
        low: 70800,
        volume: 15000000,
        marketCap: 430000000000000,
        currency: 'KRW',
        market: 'kr',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: '000660.KS',
        name: 'SK하이닉스',
        price: 185000,
        change: -2000,
        changePercent: -1.07,
        previousClose: 187000,
        open: 186000,
        high: 187500,
        low: 184000,
        volume: 3200000,
        marketCap: 134000000000000,
        currency: 'KRW',
        market: 'kr',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: '005380.KS',
        name: '현대차',
        price: 215000,
        change: 3000,
        changePercent: 1.41,
        previousClose: 212000,
        open: 213000,
        high: 216000,
        low: 212500,
        volume: 820000,
        marketCap: 45000000000000,
        currency: 'KRW',
        market: 'kr',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA',
        price: 875.5,
        change: 15.3,
        changePercent: 1.78,
        previousClose: 860.2,
        open: 862.0,
        high: 878.0,
        low: 858.5,
        volume: 45000000,
        marketCap: 2160000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'AAPL',
        name: 'Apple',
        price: 182.3,
        change: -1.2,
        changePercent: -0.65,
        previousClose: 183.5,
        open: 183.0,
        high: 183.8,
        low: 181.5,
        volume: 60000000,
        marketCap: 2800000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'QCOM',
        name: 'Qualcomm',
        price: 162.5,
        change: 2.1,
        changePercent: 1.31,
        previousClose: 160.4,
        open: 161.0,
        high: 163.0,
        low: 160.5,
        volume: 8000000,
        marketCap: 180000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'AMD',
        name: 'AMD',
        price: 135.8,
        change: 3.5,
        changePercent: 2.64,
        previousClose: 132.3,
        open: 133.0,
        high: 136.5,
        low: 132.8,
        volume: 35000000,
        marketCap: 220000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'INTC',
        name: 'Intel',
        price: 20.5,
        change: -0.3,
        changePercent: -1.44,
        previousClose: 20.8,
        open: 20.7,
        high: 20.9,
        low: 20.3,
        volume: 45000000,
        marketCap: 88000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'TSLA',
        name: 'Tesla',
        price: 250.0,
        change: 5.0,
        changePercent: 2.04,
        previousClose: 245.0,
        open: 246.0,
        high: 251.5,
        low: 245.5,
        volume: 80000000,
        marketCap: 795000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        price: 415.0,
        change: 4.5,
        changePercent: 1.10,
        previousClose: 410.5,
        open: 411.0,
        high: 416.0,
        low: 410.0,
        volume: 20000000,
        marketCap: 3100000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
      {
        symbol: 'AVGO',
        name: 'Broadcom',
        price: 1380.0,
        change: 20.0,
        changePercent: 1.47,
        previousClose: 1360.0,
        open: 1365.0,
        high: 1385.0,
        low: 1362.0,
        volume: 3500000,
        marketCap: 640000000000,
        currency: 'USD',
        market: 'us',
        marketState: 'CLOSED',
        updatedAt: Date.now(),
      },
    ],
    fetchedAt: new Date().toISOString(),
  },
};

const mockMacro = {
  success: true,
  data: {
    currency: [
      {
        symbol: 'USDKRW=X',
        name: 'USD/KRW',
        displayName: '원/달러 환율',
        price: 1320.5,
        change: -5.2,
        changePercent: -0.39,
        category: 'currency',
      },
    ],
    bond: [
      {
        symbol: '^TNX',
        name: 'US 10Y Treasury',
        displayName: '미국 10년 국채',
        price: 4.23,
        change: 0.05,
        changePercent: 1.20,
        category: 'bond',
      },
    ],
    index: [
      {
        symbol: '^KS11',
        name: 'KOSPI',
        displayName: '코스피',
        price: 2650.3,
        change: 15.2,
        changePercent: 0.58,
        category: 'index',
      },
      {
        symbol: '^KQ11',
        name: 'KOSDAQ',
        displayName: '코스닥',
        price: 875.4,
        change: 3.1,
        changePercent: 0.36,
        category: 'index',
      },
      {
        symbol: '^IXIC',
        name: 'NASDAQ',
        displayName: '나스닥',
        price: 17850.5,
        change: 125.3,
        changePercent: 0.71,
        category: 'index',
      },
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        displayName: 'S&P 500',
        price: 5200.8,
        change: 28.5,
        changePercent: 0.55,
        category: 'index',
      },
      {
        symbol: '^SOX',
        name: 'SOX',
        displayName: '필라델피아 반도체',
        price: 4850.2,
        change: 62.4,
        changePercent: 1.30,
        category: 'index',
      },
    ],
    fetchedAt: new Date().toISOString(),
  },
};

const mockNews = {
  success: true,
  data: {
    symbol: '005930.KS',
    news: [
      {
        title: '삼성전자 HBM 공급 확대 계획 발표',
        link: 'https://example.com/news/1',
        pubDate: new Date().toISOString(),
        description: '삼성전자가 HBM 메모리 공급 확대 계획을 발표했습니다.',
        source: 'Reuters',
      },
      {
        title: '삼성전자 2분기 실적 전망 상향 조정',
        link: 'https://example.com/news/2',
        pubDate: new Date(Date.now() - 3600000).toISOString(),
        description: '애널리스트들이 삼성전자 2분기 실적 전망을 상향 조정했습니다.',
        source: 'Bloomberg',
      },
    ],
    fetchedAt: new Date().toISOString(),
  },
};

const mockDart = {
  success: true,
  data: {
    disclosures: [],
    fetchedAt: new Date().toISOString(),
  },
};

// ============================================================
// 헬퍼: API 인터셉트 설정
// ============================================================

async function setupApiMocks(page: Page) {
  await page.route('**/api/stocks/prices', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPrices),
    });
  });

  await page.route('**/api/stocks/macro', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMacro),
    });
  });

  await page.route('**/api/stocks/news**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockNews),
    });
  });

  await page.route('**/api/stocks/dart**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockDart),
    });
  });
}

// ============================================================
// 테스트 스위트
// ============================================================

test.describe('주가 대시보드 (/stocks) E2E 테스트', () => {

  // ----------------------------------------------------------
  // 시나리오 1: 메인 페이지에서 /stocks 진입
  // ----------------------------------------------------------
  test.describe('시나리오 1: 메인 페이지에서 /stocks 진입', () => {
    test('메인 페이지에 주가 대시보드 링크가 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/');

      // 주가 대시보드 링크 확인
      const stocksLink = page.locator('a[href="/stocks"]');
      await expect(stocksLink).toBeVisible({ timeout: 10_000 });
      await expect(stocksLink).toContainText('주가 대시보드');
    });

    test('주가 대시보드 링크 클릭 시 /stocks로 이동한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/');

      const stocksLink = page.locator('a[href="/stocks"]');
      await expect(stocksLink).toBeVisible({ timeout: 10_000 });
      await stocksLink.click();

      await expect(page).toHaveURL(/\/stocks/, { timeout: 10_000 });
    });
  });

  // ----------------------------------------------------------
  // 시나리오 2: /stocks 페이지 기본 렌더링
  // ----------------------------------------------------------
  test.describe('시나리오 2: /stocks 페이지 기본 렌더링', () => {
    test('페이지 타이틀 "주가 대시보드" 텍스트가 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const heading = page.locator('h1').filter({ hasText: '주가 대시보드' });
      await expect(heading).toBeVisible({ timeout: 10_000 });
    });

    test('MarketStatusBadge 컴포넌트가 존재한다 (LIVE 또는 장마감)', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // LIVE 배지 또는 장마감 배지 중 하나가 존재해야 함
      const liveBadge = page.locator('span').filter({ hasText: 'Live' });
      const closedBadge = page.locator('span').filter({ hasText: '장마감' });

      const isLive = await liveBadge.isVisible();
      const isClosed = await closedBadge.isVisible();

      expect(isLive || isClosed).toBe(true);
    });

    test('새로고침 버튼이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await expect(refreshBtn).toBeVisible({ timeout: 10_000 });
      await expect(refreshBtn).toContainText('새로고침');
    });

    test('"한국 시장" 섹션 헤딩이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const krHeading = page.locator('h2').filter({ hasText: '한국 시장' });
      await expect(krHeading).toBeVisible({ timeout: 10_000 });
    });

    test('"미국 시장" 섹션 헤딩이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const usHeading = page.locator('h2').filter({ hasText: '미국 시장' });
      await expect(usHeading).toBeVisible({ timeout: 10_000 });
    });

    test('"거시 지표" 섹션 헤딩이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const macroHeading = page.locator('h2').filter({ hasText: '거시 지표' });
      await expect(macroHeading).toBeVisible({ timeout: 10_000 });
    });

    test('"관련 뉴스" 섹션 헤딩이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const newsHeading = page.locator('h2').filter({ hasText: '관련 뉴스' });
      await expect(newsHeading).toBeVisible({ timeout: 10_000 });
    });

    test('"DART 공시" 섹션 헤딩이 존재한다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      const dartHeading = page.locator('h2').filter({ hasText: 'DART 공시' });
      await expect(dartHeading).toBeVisible({ timeout: 10_000 });
    });
  });

  // ----------------------------------------------------------
  // 시나리오 3: 로딩 상태 (스켈레톤 UI)
  // ----------------------------------------------------------
  test.describe('시나리오 3: 로딩 상태 - 스켈레톤 UI', () => {
    test('페이지 로드 초기에 animate-pulse 스켈레톤 요소가 존재한다', async ({ page }) => {
      // API 응답을 지연시켜 로딩 상태를 포착
      await page.route('**/api/stocks/prices', async (route: Route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPrices),
        });
      });

      await page.route('**/api/stocks/macro', async (route: Route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');

      // 스켈레톤 UI(animate-pulse)가 즉시 표시되는지 확인
      const skeletonElements = page.locator('.animate-pulse');
      await expect(skeletonElements.first()).toBeVisible({ timeout: 5_000 });

      // 스켈레톤 요소가 여러 개 존재 (StockCard + MacroPanel 스켈레톤)
      const count = await skeletonElements.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ----------------------------------------------------------
  // 시나리오 4: 데이터 로드 후 상태 (API mock)
  // ----------------------------------------------------------
  test.describe('시나리오 4: 데이터 로드 후 상태', () => {
    test('삼성전자 주가 카드가 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // 스켈레톤이 사라지고 실제 데이터가 표시될 때까지 대기
      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });
    });

    test('NVIDIA 주가 카드가 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=NVIDIA').first()).toBeVisible({ timeout: 10_000 });
    });

    test('한국 주가 카드가 최소 1개 이상 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // 삼성전자 카드 대기
      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });

      // KRX 배지: 종목 심볼 표시 영역에서 '005930.KS' 텍스트 확인 (한국 종목 카드 렌더링 증명)
      // StockCard에서 stock.symbol을 p 태그로 렌더링
      const symbolEl = page.locator('p').filter({ hasText: '005930.KS' });
      await expect(symbolEl.first()).toBeVisible({ timeout: 10_000 });
    });

    test('미국 주가 카드가 최소 1개 이상 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=NVIDIA').first()).toBeVisible({ timeout: 10_000 });

      // 미국 종목 카드: NVDA 심볼이 p 태그로 렌더링됨
      const symbolEl = page.locator('p').filter({ hasText: 'NVDA' });
      await expect(symbolEl.first()).toBeVisible({ timeout: 10_000 });
    });

    test('거시지표 패널에 원/달러 환율이 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=원/달러 환율').first()).toBeVisible({ timeout: 10_000 });
    });

    test('거시지표 패널에 코스피 지수가 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=코스피').first()).toBeVisible({ timeout: 10_000 });
    });

    test('거시지표 패널에 나스닥 지수가 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=나스닥').first()).toBeVisible({ timeout: 10_000 });
    });

    test('삼성전자 주가가 올바르게 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // 72,000원 형식으로 표시
      await expect(page.locator('text=72,000원').first()).toBeVisible({ timeout: 10_000 });
    });

    test('뉴스 섹션에 종목 탭이 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // 뉴스 탭 버튼에 삼성전자 탭이 존재
      const samsungTab = page.locator('button').filter({ hasText: '삼성전자' }).first();
      await expect(samsungTab).toBeVisible({ timeout: 10_000 });
    });

    test('뉴스 섹션에 뉴스 아이템이 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      await expect(page.locator('text=삼성전자 HBM 공급 확대 계획 발표')).toBeVisible({ timeout: 10_000 });
    });

    test('DART 섹션에 한국 종목 탭이 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // DART 탭 영역에서 삼성전자 버튼 확인
      const dartSection = page.locator('h2').filter({ hasText: 'DART 공시' }).locator('../..');
      const samsungDartTab = page.locator('button').filter({ hasText: '삼성전자' }).nth(1);
      await expect(samsungDartTab).toBeVisible({ timeout: 10_000 });
    });

    test('DART 섹션에 공시 없음 메시지가 표시된다 (빈 배열 응답)', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // 빈 disclosures 배열에 대한 안내 메시지
      await expect(
        page.locator('text=/최근 30일 공시가 없거나|DART API 키가 설정되지 않았습니다/').first()
      ).toBeVisible({ timeout: 10_000 });
    });

    test('데이터 로드 후 fetchedAt 기준 시각이 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.goto('/stocks');

      // "데이터 기준:" 텍스트와 함께 출처 정보가 표시
      await expect(page.locator('text=/데이터 기준.*Yahoo Finance/')).toBeVisible({ timeout: 10_000 });
    });
  });

  // ----------------------------------------------------------
  // 시나리오 5: 새로고침 버튼 동작
  // ----------------------------------------------------------
  test.describe('시나리오 5: 새로고침 버튼 동작', () => {
    test('새로고침 버튼 클릭 시 API가 재호출된다', async ({ page }) => {
      let pricesCallCount = 0;
      let macroCallCount = 0;

      await page.route('**/api/stocks/prices', (route: Route) => {
        pricesCallCount++;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPrices),
        });
      });

      await page.route('**/api/stocks/macro', (route: Route) => {
        macroCallCount++;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');

      // 초기 로딩이 완료될 때까지 대기
      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });

      const initialPricesCalls = pricesCallCount;
      const initialMacroCalls = macroCallCount;

      // 새로고침 버튼 클릭 (고정 헤더가 가리지 않도록 force 클릭 사용)
      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await refreshBtn.click({ force: true });

      // API 재호출 대기
      await page.waitForTimeout(1000);

      expect(pricesCallCount).toBeGreaterThan(initialPricesCalls);
      expect(macroCallCount).toBeGreaterThan(initialMacroCalls);
    });

    test('새로고침 버튼 클릭 시 로딩 스피너가 표시된다', async ({ page }) => {
      let resolveDelay: (() => void) | null = null;

      await page.route('**/api/stocks/prices', async (route: Route) => {
        // 첫 번째 호출은 즉시 응답, 두 번째 호출은 지연
        if (!resolveDelay) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockPrices),
          });
        } else {
          await new Promise<void>((resolve) => {
            resolveDelay = resolve;
          });
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockPrices),
          });
        }
      });

      await page.route('**/api/stocks/macro', async (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');
      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });

      // 두 번째 클릭을 위한 새 지연 route 설정
      await page.route('**/api/stocks/prices', async (route: Route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPrices),
        });
      });

      // 고정 헤더가 가리지 않도록 force 클릭 사용
      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await refreshBtn.click({ force: true });

      // 로딩 중 스피너 확인 (animate-spin)
      await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 3_000 });
    });

    test('새로고침 버튼은 로딩 중 비활성화된다', async ({ page }) => {
      await page.route('**/api/stocks/prices', async (route: Route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPrices),
        });
      });

      await page.route('**/api/stocks/macro', async (route: Route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');

      // 초기 로딩 중 새로고침 버튼이 disabled 상태인지 확인
      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await expect(refreshBtn).toBeDisabled({ timeout: 5_000 });
    });
  });

  // ----------------------------------------------------------
  // 시나리오 6: 반응형 레이아웃
  // ----------------------------------------------------------
  test.describe('시나리오 6: 반응형 레이아웃', () => {
    test('모바일 뷰포트 (375x667)에서 페이지가 정상 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/stocks');

      // 페이지 타이틀 확인
      const heading = page.locator('h1').filter({ hasText: '주가 대시보드' });
      await expect(heading).toBeVisible({ timeout: 10_000 });

      // 새로고침 버튼 확인
      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await expect(refreshBtn).toBeVisible({ timeout: 10_000 });

      // 섹션 헤딩들 확인
      await expect(page.locator('h2').filter({ hasText: '거시 지표' })).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('h2').filter({ hasText: '한국 시장' })).toBeVisible({ timeout: 10_000 });
    });

    test('데스크탑 뷰포트 (1280x800)에서 페이지가 정상 렌더링된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/stocks');

      // 페이지 타이틀 확인
      const heading = page.locator('h1').filter({ hasText: '주가 대시보드' });
      await expect(heading).toBeVisible({ timeout: 10_000 });

      // 새로고침 버튼 확인
      const refreshBtn = page.locator('button[aria-label="데이터 새로고침"]');
      await expect(refreshBtn).toBeVisible({ timeout: 10_000 });

      // 모든 섹션 헤딩 확인
      await expect(page.locator('h2').filter({ hasText: '거시 지표' })).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('h2').filter({ hasText: '한국 시장' })).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('h2').filter({ hasText: '미국 시장' })).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('h2').filter({ hasText: '관련 뉴스' })).toBeVisible({ timeout: 10_000 });
    });

    test('모바일에서 데이터 로드 후 주가 카드가 표시된다', async ({ page }) => {
      await setupApiMocks(page);
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/stocks');

      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });
    });
  });

  // ----------------------------------------------------------
  // 시나리오 7: 뉴스 탭 전환
  // ----------------------------------------------------------
  test.describe('시나리오 7: 뉴스 탭 전환', () => {
    test('뉴스 섹션에서 다른 종목 탭 클릭 시 API가 재호출된다', async ({ page }) => {
      let newsCallCount = 0;
      let lastNewsSymbol = '';

      await setupApiMocks(page);

      // 뉴스 API를 별도로 오버라이드
      await page.route('**/api/stocks/news**', (route: Route) => {
        newsCallCount++;
        const url = new URL(route.request().url());
        lastNewsSymbol = url.searchParams.get('symbol') || '';
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.goto('/stocks');
      await expect(page.locator('text=삼성전자').first()).toBeVisible({ timeout: 10_000 });

      const initialNewsCount = newsCallCount;

      // NVIDIA 탭 클릭 (뉴스 섹션의 종목 탭)
      const nvidiaTab = page.locator('button').filter({ hasText: 'NVIDIA' }).first();
      await nvidiaTab.click();

      await page.waitForTimeout(1000);
      expect(newsCallCount).toBeGreaterThan(initialNewsCount);
    });
  });

  // ----------------------------------------------------------
  // 시나리오 8: 에러 상태
  // ----------------------------------------------------------
  test.describe('시나리오 8: 에러 상태 처리', () => {
    test('prices API 실패 시 에러 메시지가 표시된다', async ({ page }) => {
      await page.route('**/api/stocks/prices', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { message: '주가 데이터를 불러올 수 없습니다.' },
          }),
        });
      });

      await page.route('**/api/stocks/macro', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');

      // 에러 메시지 표시 확인
      await expect(page.locator('text=데이터 로드 실패')).toBeVisible({ timeout: 10_000 });
    });

    test('에러 상태에서 "다시 시도" 버튼이 표시된다', async ({ page }) => {
      await page.route('**/api/stocks/prices', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { message: '서버 오류' },
          }),
        });
      });

      await page.route('**/api/stocks/macro', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMacro),
        });
      });

      await page.route('**/api/stocks/news**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNews),
        });
      });

      await page.route('**/api/stocks/dart**', (route: Route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDart),
        });
      });

      await page.goto('/stocks');

      await expect(page.locator('button').filter({ hasText: '다시 시도' })).toBeVisible({ timeout: 10_000 });
    });
  });
});
