const { test, expect } = require('./fixtures');

test.describe('Dropdown', () => {
  test.beforeEach(async ({ dropdownPage }) => {
    await dropdownPage.goto();
  });

  test('sélectionner une option du menu natif', async ({ dropdownPage }) => {
    await dropdownPage.selectNativeOption('Option 1');
    await expect(dropdownPage.result).toHaveText('Sélection : Option 1');

    await dropdownPage.selectNativeOption('Option 2');
    await expect(dropdownPage.result).toHaveText('Sélection : Option 2');
  });

  test('menu déroulant personnalisé (non natif)', async ({ dropdownPage }) => {
    await expect(dropdownPage.customList).toBeHidden();

    await dropdownPage.openCustomDropdown();
    await expect(dropdownPage.customList).toBeVisible();

    await dropdownPage.customOption('lausanne').click();
    await expect(dropdownPage.customResult).toHaveText('Ville sélectionnée : Lausanne');
    await expect(dropdownPage.customList).toBeHidden();
  });
});
