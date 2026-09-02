const { test, expect } = require('./fixtures');

test.describe('IFrame', () => {
  test("éditer le contenu d'une iframe", async ({ iframePage }) => {
    await iframePage.goto();
    await expect(iframePage.editorBody).toHaveText('Votre texte ici…');

    await iframePage.replaceEditorText('Bonjour depuis Playwright');
    await expect(iframePage.editorBody).toHaveText('Bonjour depuis Playwright');
  });

  test('naviguer dans des iframes imbriquées', async ({ iframePage }) => {
    await iframePage.goto();
    await expect(iframePage.innerFrameBody).toContainText('Frame interne');
  });
});
