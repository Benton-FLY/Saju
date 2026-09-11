import { test, expect, type Page } from '@playwright/test';
import { reportTestCases } from '../src/data/reportTestCases';
import { createReport } from '../src/lib/report';
import { createShareUrl, sharePayload } from '../src/utils/share';
import { serviceCopy as copy } from '../src/data/serviceCopy';
import type { PersonInput } from '../src/types';
async function fillPerson(page: Page, p: PersonInput) {
  await page
    .locator('.role-options')
    .getByRole('button', { name: new RegExp(p.role) })
    .click();
  await page.getByLabel('이름 또는 별명').fill(p.nickname);
  if (p.calendar === 'lunar') {
    await page.getByRole('button', { name: '음력', exact: true }).click();
    if (p.leapMonth) await page.getByLabel('윤달에 태어났어요').check();
  }
  await page.getByLabel('태어난 연도').fill(p.year);
  await page.getByLabel('태어난 월').fill(p.month);
  await page.getByLabel('태어난 일').fill(p.day);
  if (p.unknownTime) await page.getByLabel('시간 모름').check();
  else await page.getByLabel('태어난 시간', { exact: true }).fill(p.time);
}
async function getResult(page: Page, index = 0) {
  const fixture = reportTestCases[index];
  await page.clock.setFixedTime(new Date('2026-09-11T03:00:00Z'));
  await page.goto('/');
  await page.getByRole('button', { name: copy.hero.cta, exact: true }).click();
  await fillPerson(page, fixture.parent);
  await page.getByRole('button', { name: copy.input.next, exact: true }).click();
  await fillPerson(page, fixture.child);
  await page.getByRole('button', { name: copy.input.submit, exact: true }).click();
  await expect(page.getByRole('status')).toContainText(copy.loading.messages[0]);
  await expect(page.locator('.report-hero h1')).toBeVisible();
  return createReport(fixture.parent, fixture.child, '2026-09-11');
}
for (const [index, fixture] of reportTestCases.entries()) {
  test(`실제 입력 ${index + 1}: ${fixture.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const result = await getResult(page, index);
    await expect(page.locator('.report-hero h1')).toHaveText(result.archetype.copy.title);
    expect(
      await page
        .locator('[data-trigger-id]')
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-trigger-id'))),
    ).toEqual(result.triggers.map((t) => t.id));
    await expect(page.locator('[data-scenario-id]')).toHaveAttribute(
      'data-scenario-id',
      result.translator.id,
    );
    await expect(page.locator('.report-hero .score-display')).toHaveCount(0);
    if (result.age === 3)
      expect(await page.locator('.translator-stack').innerText()).not.toMatch(
        /숙제|성적|스마트폰|학교/,
      );
    await page.locator('.report-evidence>summary').click();
    await expect(page.locator('.evidence-fact').first()).toBeVisible();
    if (index === 0) {
      await expect(
        page
          .locator('.evidence-body > .evidence-fact .fact-text')
          .filter({ hasText: '부모 午(오)와 아이 子(자)의 충' }),
      ).toBeVisible();
    }
    expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
    expect(errors).toEqual([]);
  });
}
test('모바일 레이아웃·스크린샷·PNG 생성과 개인정보 없는 이미지', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '/tmp/saju-v2-home.png', fullPage: true });
  await getResult(page);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '/tmp/saju-v2-hero.png' });
  await page.locator('#translator').scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/tmp/saju-v2-translator.png' });
  await page
    .getByRole('button', { name: copy.share.imageButton, exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('button', { name: copy.share.imageButton, exact: true }),
  ).toBeEnabled();
  const poster = page.getByTestId('share-card');
  expect(await poster.innerText()).not.toMatch(/1990|2020|11:30|09:00|만 6세|연지|일간/);
  await poster.screenshot({ path: '/tmp/saju-v2-poster.png' });
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: new RegExp(copy.share.save) }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('our-family-report.png');
  await file.saveAs('/tmp/saju-v2-share.png');
  const dimensions = await page.locator('.saved-image img').evaluate(async (img) => {
    await (img as HTMLImageElement).decode();
    return [(img as HTMLImageElement).naturalWidth, (img as HTMLImageElement).naturalHeight];
  });
  expect(dimensions).toEqual([1080, 1440]);
  await page.locator('.secondary-numbers>summary').click();
  await expect(page.getByRole('meter')).toHaveCount(5);
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: '/tmp/saju-v2-full.png', fullPage: true });
});
test('요약 링크 복사·다른 기기 복원·전체 근거 비공개', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const r = await getResult(page);
  await page.getByRole('button', { name: copy.share.copy, exact: true }).click();
  await expect(page.locator('.share-notice')).toContainText(copy.share.copied);
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(new URL(link).search).toBe('');
  expect(link).toContain('#report=');
  expect(link.length).toBeLessThan(2000);
  const shared = await context.newPage();
  await shared.goto(link);
  await expect(shared.locator('.share-poster h3')).toHaveText(r.archetype.copy.title);
  await expect(shared.locator('.report-evidence')).toHaveCount(0);
  await shared.getByRole('button', { name: copy.share.makeOwn }).click();
  await expect(shared.getByLabel('이름 또는 별명')).toBeEmpty();
  expect(new URL(shared.url()).hash).toBe('');
});
test('파일 공유 지원 시 PNG native share, 취소 시 다운로드하지 않음', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        (
          window as unknown as {
            shared: { name: string; type: string; size: number; url?: string };
          }
        ).shared = {
          name: data.files![0].name,
          type: data.files![0].type,
          size: data.files![0].size,
          url: data.url,
        };
      },
    });
  });
  await getResult(page);
  const imageShare = page.getByRole('button', { name: copy.share.imageButton, exact: true });
  await expect(imageShare).toBeEnabled();
  await imageShare.click();
  const data = await page.evaluate(
    () =>
      (window as unknown as { shared: { name: string; type: string; size: number; url?: string } })
        .shared,
  );
  expect(data.type).toBe('image/png');
  expect(data.size).toBeGreaterThan(20000);
  expect(data.url).toBeUndefined();
  let downloaded = false;
  page.on('download', () => {
    downloaded = true;
  });
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'share', {
      value: async () => {
        throw new DOMException('cancel', 'AbortError');
      },
    }),
  );
  await imageShare.click();
  await expect(page.locator('.share-notice')).toBeEmpty();
  expect(downloaded).toBe(false);
});
test('공유·복사 차단 시 수동 URL fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw Error('blocked');
        },
      },
      configurable: true,
    });
    document.execCommand = () => false;
  });
  await getResult(page);
  await page.getByRole('button', { name: copy.share.linkButton, exact: true }).click();
  await expect(page.getByLabel('공유 링크 직접 복사')).toBeVisible();
});
test('입력 포커스·이전 단계 유지·오류 안내', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: copy.hero.cta }).click();
  const name = page.getByLabel('이름 또는 별명');
  await name.pressSequentially('mama');
  await expect(name).toHaveValue('mama');
  await fillPerson(page, reportTestCases[0].parent);
  await page.getByLabel('태어난 월').fill('2');
  await page.getByLabel('태어난 일').fill('30');
  await page.getByRole('button', { name: copy.input.next }).click();
  await expect(page.getByRole('alert')).toContainText('존재하지 않는 날짜');
  await page.getByLabel('태어난 일').fill('20');
  await page.getByRole('button', { name: copy.input.next }).click();
  await page.getByRole('button', { name: '이전 단계' }).click();
  await expect(name).toHaveValue('엄마');
});
test('320px·390px·1440px과 모션 줄이기·긴 별명', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const box = await page.locator('.app-shell').boundingBox();
    expect(box!.width).toBeLessThanOrEqual(480);
  }
  await page.setViewportSize({ width: 320, height: 850 });
  await getResult(page);
  expect(
    await page.evaluate(() =>
      [...document.querySelectorAll('.report-content h2,.report-hero h1,.translation')].every(
        (el) => el.getBoundingClientRect().right <= innerWidth,
      ),
    ),
  ).toBe(true);
  const r = createReport(reportTestCases[0].parent, reportTestCases[0].child, '2026-09-11'),
    summary = sharePayload(r);
  summary.parent.nickname = '가나다라마바사아자차카타';
  summary.child.nickname = '파하가나다라마바사아자차';
  await page.goto(createShareUrl(summary, 'http://127.0.0.1:5173/'));
  await expect(page.locator('.share-poster h3')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('손상된 링크에서 새 분석 가능', async ({ page }) => {
  await page.goto('/#report=broken');
  await expect(page.getByRole('alert')).toContainText('공유 링크');
  await page.getByRole('button', { name: copy.hero.cta }).click();
  await expect(page.getByLabel('이름 또는 별명')).toBeVisible();
});
