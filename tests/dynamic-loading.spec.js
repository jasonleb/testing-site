const { test, expect } = require('./fixtures');

test.describe('Chargement dynamique', () => {
  test.beforeEach(async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.goto();
  });

  test('exemple 1 : élément masqué (display:none) devient visible', async ({ dynamicLoadingPage }) => {
    await expect(dynamicLoadingPage.finish1).toBeHidden();

    await dynamicLoadingPage.start1.click();
    await expect(dynamicLoadingPage.loading1).toBeVisible();
    await expect(dynamicLoadingPage.finish1).toBeVisible({ timeout: 5000 });
    await expect(dynamicLoadingPage.loading1).toBeHidden();
  });

  test("exemple 2 : élément inséré dans le DOM après le chargement", async ({ dynamicLoadingPage }) => {
    await expect(dynamicLoadingPage.finish2).toHaveCount(0);

    await dynamicLoadingPage.start2.click();
    await expect(dynamicLoadingPage.loading2).toBeVisible();
    await expect(dynamicLoadingPage.finish2).toHaveCount(1, { timeout: 5000 });
    await expect(dynamicLoadingPage.finish2).toHaveText('Élément chargé avec succès !');
  });
});
