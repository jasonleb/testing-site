const { test, expect, PageObjects } = require('./fixtures');
const { routes } = require('./routes');

test.describe('Redirection', () => {
  test('le lien déclenche une redirection 302 vers la page cible', async ({ redirectPage, page }) => {
    await redirectPage.goto();
    await redirectPage.link.click();
    await expect(page).toHaveURL(/\/redirect\/target$/);

    const targetPage = new PageObjects.RedirectTargetPage(page);
    await expect(targetPage.message).toBeVisible();
  });

  test("vérifie le code HTTP 302 et l'en-tête Location", async ({ request }) => {
    const res = await request.get(routes.redirect.go, { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toBe(routes.redirect.target);
  });
});
