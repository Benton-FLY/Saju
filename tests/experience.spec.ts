import { test, expect, type Page } from '@playwright/test';
async function person(page: Page, year: string, nickname: string, unknown = false) {
  await page.getByLabel('이름 또는 별명').fill(nickname);
  await page.getByLabel('태어난 연도').fill(year);
  await page.getByLabel('태어난 월').fill('6');
  await page.getByLabel('태어난 일').fill('15');
  if (unknown) await page.getByLabel('시간 모름').check();
  else await page.getByLabel('태어난 시간', { exact: true }).fill('11:30');
}
async function getResult(page: Page, unknown = false) {
  await page.goto('/');
  await page.getByRole('button', { name: '우리 궁합 보기', exact: true }).click();
  await person(page, '1990', '엄마', unknown);
  await page.getByRole('button', { name: '아이 정보 입력하기' }).click();
  await person(page, '2020', '서윤', unknown);
  await page.getByRole('button', { name: '우리 궁합 확인하기' }).click();
  await expect(page.getByText('두 사람의 타고난 기운을 살펴보고 있어요')).toBeVisible();
  await expect(page.getByRole('heading', { name: '불꽃 모녀' })).toBeVisible();
}
test('모바일 전체 흐름, 공유 복사 및 새 브라우저 복원', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await getResult(page);
  await expect(page.getByRole('meter')).toHaveCount(5);
  await page.getByRole('button', { name: '링크 복사', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('링크를 복사했어요');
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(link).search).toBe('');
  expect(new URL(link).hash).toMatch(/^#result=/);
  const shared = await context.newPage();
  await shared.goto(link);
  await expect(shared.getByText('공유받은 우리 사이 이야기')).toBeVisible();
  await expect(shared.getByRole('heading', { name: '불꽃 모녀' })).toBeVisible();
  expect(await shared.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  await shared.getByRole('button', { name: '다시 궁합 보기' }).click();
  await expect(shared.getByLabel('이름 또는 별명')).toBeEmpty();
  expect(new URL(shared.url()).hash).toBe('');
  expect(errors).toEqual([]);
});
test('시간 미상 안내 및 음력·윤달 UI, 이전 단계 보존', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '우리 궁합 보기', exact: true }).click();
  await person(page, '1990', '다정', true);
  await expect(page.getByLabel('태어난 시간', { exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '아이 정보 입력하기' }).click();
  await page.getByRole('button', { name: '이전 단계' }).click();
  await expect(page.getByLabel('이름 또는 별명')).toHaveValue('다정');
  await expect(page.getByLabel('시간 모름')).toBeChecked();
  await page.getByRole('button', { name: '아이 정보 입력하기' }).click();
  await person(page, '2020', '서윤', true);
  await page.getByRole('button', { name: '음력', exact: true }).click();
  await page.getByLabel('태어난 월').fill('4');
  await page.getByLabel('태어난 일').fill('1');
  await page.getByLabel('윤달에 태어났어요').check();
  await page.getByRole('button', { name: '우리 궁합 확인하기' }).click();
  await expect(
    page.getByText('출생시간을 입력하면 조금 더 상세하게 볼 수 있어요.', { exact: true }),
  ).toBeVisible();
});
test('실제 타이핑 시 입력 포커스 유지, 날짜 오류를 한글로 안내', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '우리 궁합 보기', exact: true }).click();
  const nickname = page.getByLabel('이름 또는 별명');
  await nickname.pressSequentially('mama');
  await expect(nickname).toHaveValue('mama');
  await person(page, '1990', '엄마');
  await page.getByLabel('태어난 월').fill('2');
  await page.getByLabel('태어난 일').fill('30');
  await page.getByRole('button', { name: '아이 정보 입력하기' }).click();
  await expect(page.getByRole('alert')).toContainText('존재하지 않는 날짜');
});
test('지원되는 환경에서 native share 호출; 취소는 오류로 표시하지 않음', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        (window as unknown as { shared: ShareData }).shared = data;
      },
    }),
  );
  await getResult(page);
  await page.getByRole('button', { name: '결과 공유하기', exact: true }).click();
  const data = await page.evaluate(() => (window as unknown as { shared: ShareData }).shared);
  expect(data.title).toContain('불꽃 모녀');
  expect(data.url).toContain('#result=');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'share', {
      value: async () => {
        throw new DOMException('cancel', 'AbortError');
      },
    }),
  );
  await page.getByRole('button', { name: '결과 공유하기', exact: true }).click();
  await expect(page.locator('.share-notice')).toBeEmpty();
});
test('공유 미지원 시 클립보드 fallback, 차단되면 수동 복사', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copied: string }).copied = text;
        },
      },
      configurable: true,
    });
  });
  await getResult(page);
  await page.getByRole('button', { name: '결과 공유하기', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toContain(
    '#result=',
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw Error('denied');
        },
      },
    });
    document.execCommand = () => false;
  });
  await page.getByRole('button', { name: '링크 복사', exact: true }).click();
  await expect(page.getByLabel('공유 링크 직접 복사')).toBeVisible();
});
test('손상된 공유 링크에서 다시 시작 가능', async ({ page }) => {
  await page.goto('/#result=broken');
  await expect(page.getByRole('alert')).toContainText('공유 링크');
  await page.getByRole('button', { name: '우리 궁합 보기', exact: true }).click();
  await expect(page.getByLabel('이름 또는 별명')).toBeVisible();
});
test('320px·390px·1440px 가로 넘침 없음, 데스크톱 중앙 배치', async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const box = await page.locator('.app-shell').boundingBox();
    expect(box!.width).toBeLessThanOrEqual(480);
    if (width === 1440) expect(box!.x).toBe(480);
  }
  await page.setViewportSize({ width: 320, height: 800 });
  await getResult(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('모션 줄이기에서도 점수·상세 카드가 보임', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await getResult(page);
  await page.getByRole('heading', { name: '우리 아이가 원하는 것' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: '우리 아이가 원하는 것' })).toBeVisible();
  expect(await page.locator('.score-display').innerText()).toMatch(/\d+/);
});
