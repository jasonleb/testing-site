const { test, expect } = require('./fixtures');

test.describe('Défilement infini', () => {
  test('charge de nouveaux paragraphes en scrollant', async ({ infiniteScrollPage }) => {
    await infiniteScrollPage.goto();

    await expect(infiniteScrollPage.paragraph(0)).toBeVisible();
    await expect(infiniteScrollPage.paragraph(9)).toBeVisible();
    await expect(infiniteScrollPage.paragraph(10)).toHaveCount(0);

    await infiniteScrollPage.scrollToSentinel();
    await expect(infiniteScrollPage.paragraph(10)).toBeVisible({ timeout: 5000 });
  });
});
