const { test, expect } = require('./fixtures');
const { routes } = require('./routes');
const { BasicAuthPage } = require('./pages/BasicAuthPage');

test.describe('Authentification HTTP Basic', () => {
  test('sans identifiants : 401', async ({ request }) => {
    const res = await request.get(routes.basicAuth);
    expect(res.status()).toBe(401);
    expect(res.headers()['www-authenticate']).toContain('Basic');
  });

  test('avec les bons identifiants : accès autorisé', async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: { username: 'admin', password: 'admin' },
    });
    const page = await context.newPage();
    const basicAuthPage = new BasicAuthPage(page);

    await basicAuthPage.goto();
    await expect(basicAuthPage.message).toContainText('Authentification réussie');

    await context.close();
  });
});
