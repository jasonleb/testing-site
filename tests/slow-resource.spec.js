const { test, expect } = require('./fixtures');

test.describe('Ressource lente', () => {
  test("l'image met ~3s à se charger", async ({ slowResourcePage }) => {
    await slowResourcePage.goto();
    await expect
      .poll(() => slowResourcePage.image.evaluate((el) => el.naturalWidth), { timeout: 6000 })
      .toBeGreaterThan(0);
  });

  test('les données lentes finissent par arriver', async ({ slowResourcePage }) => {
    await slowResourcePage.goto();
    await slowResourcePage.loadDataButton.click();
    await expect(slowResourcePage.dataResult).toHaveText('Chargement…');
    await expect(slowResourcePage.dataResult).toContainText('3 secondes', { timeout: 6000 });
  });
});
