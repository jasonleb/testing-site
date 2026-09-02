const { test, expect, PageObjects } = require('./fixtures');

test.describe('Fenêtres multiples', () => {
  test('ouvrir un nouvel onglet via un lien target="_blank"', async ({ multipleWindowsPage, context }) => {
    await multipleWindowsPage.goto();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      multipleWindowsPage.newWindowLink.click(),
    ]);
    await popup.waitForLoadState();

    const newWindowPage = new PageObjects.MultipleWindowsNewPage(popup);
    await expect(newWindowPage.message).toHaveText('Ceci est une nouvelle fenêtre.');
  });

  test('ouvrir un nouvel onglet via window.open()', async ({ multipleWindowsPage, context }) => {
    await multipleWindowsPage.goto();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      multipleWindowsPage.newWindowButton.click(),
    ]);
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(/\/multiple-windows\/new$/);
  });
});
