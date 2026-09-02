const { test, expect } = require('./fixtures');

test.describe('Alertes JavaScript', () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.goto();
  });

  test('alert() simple', async ({ alertsPage, page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    await alertsPage.alertButton.click();
    await expect(alertsPage.result).toHaveText('Alerte affichée puis fermée.');
  });

  test('confirm() accepté', async ({ alertsPage, page }) => {
    page.once('dialog', (dialog) => dialog.accept());
    await alertsPage.confirmButton.click();
    await expect(alertsPage.result).toHaveText('Confirmé');
  });

  test('confirm() annulé', async ({ alertsPage, page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await alertsPage.confirmButton.click();
    await expect(alertsPage.result).toHaveText('Annulé');
  });

  test('prompt() avec une valeur saisie', async ({ alertsPage, page }) => {
    page.once('dialog', (dialog) => dialog.accept('Playwright'));
    await alertsPage.promptButton.click();
    await expect(alertsPage.result).toHaveText('Valeur saisie : Playwright');
  });

  test('prompt() annulé', async ({ alertsPage, page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await alertsPage.promptButton.click();
    await expect(alertsPage.result).toHaveText('Annulé');
  });
});
