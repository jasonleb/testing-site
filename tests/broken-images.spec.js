const { test, expect } = require('./fixtures');

test.describe('Images cassées', () => {
  test('une image valide, une 404, une 500', async ({ brokenImagesPage }) => {
    await brokenImagesPage.goto();

    await expect
      .poll(() => brokenImagesPage.validImage.evaluate((el) => el.naturalWidth))
      .toBeGreaterThan(0);

    await expect
      .poll(() => brokenImagesPage.image404.evaluate((el) => el.naturalWidth))
      .toBe(0);

    await expect
      .poll(() => brokenImagesPage.image500.evaluate((el) => el.naturalWidth))
      .toBe(0);
  });
});
