const { test, expect } = require('./fixtures');

test.describe('Tableau triable', () => {
  test('trier par âge, croissant puis décroissant', async ({ tablesPage }) => {
    await tablesPage.goto();

    await tablesPage.headerAge.click();
    const asc = (await tablesPage.columnValues(2)).map(Number);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));

    await tablesPage.headerAge.click();
    const desc = (await tablesPage.columnValues(2)).map(Number);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  test('trier par prénom (texte)', async ({ tablesPage }) => {
    await tablesPage.goto();
    await tablesPage.headerPrenom.click();
    const names = await tablesPage.columnValues(0);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
