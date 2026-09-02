const { test, expect } = require('./fixtures');

test.describe('Shadow DOM', () => {
  test('Playwright traverse le Shadow DOM automatiquement', async ({ shadowDomPage }) => {
    await shadowDomPage.goto();

    // Ces locators vivent DANS le shadow root du <test-widget>,
    // Playwright les trouve sans code spécifique.
    await expect(shadowDomPage.text).toContainText('Compteur : 0');

    await shadowDomPage.increment(2);
    await expect(shadowDomPage.text).toContainText('Compteur : 2');
  });
});
