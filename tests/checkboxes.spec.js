const { test, expect } = require('./fixtures');

test.describe('Cases à cocher', () => {
  test('états initiaux puis tout cocher / tout décocher', async ({ checkboxesPage }) => {
    await checkboxesPage.goto();

    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();

    await checkboxesPage.checkAllButton.click();
    await expect(checkboxesPage.checkbox1).toBeChecked();
    await expect(checkboxesPage.checkbox2).toBeChecked();

    await checkboxesPage.uncheckAllButton.click();
    await expect(checkboxesPage.checkbox1).not.toBeChecked();
    await expect(checkboxesPage.checkbox2).not.toBeChecked();
  });
});
