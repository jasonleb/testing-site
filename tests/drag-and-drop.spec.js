const { test, expect } = require('./fixtures');

test.describe('Glisser-déposer', () => {
  test('échanger le contenu des deux cases', async ({ dragAndDropPage }) => {
    await dragAndDropPage.goto();

    await expect(dragAndDropPage.columnA).toHaveText('A');
    await expect(dragAndDropPage.columnB).toHaveText('B');

    await dragAndDropPage.swapColumns();

    await expect(dragAndDropPage.columnA).toHaveText('B');
    await expect(dragAndDropPage.columnB).toHaveText('A');
  });
});
