const { test, expect } = require('./fixtures');
const { routes } = require('./routes');

test.describe('Codes de statut HTTP', () => {
  test('200 OK', async ({ request }) => {
    const res = await request.get(routes.statusCodes.ok);
    expect(res.status()).toBe(200);
  });

  test('301 redirige de façon permanente', async ({ request }) => {
    const res = await request.get(routes.statusCodes.permanentRedirect, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe(routes.statusCodes.permanentRedirectTarget);
  });

  test('404 Not Found', async ({ request }) => {
    const res = await request.get(routes.statusCodes.notFound);
    expect(res.status()).toBe(404);
  });

  test('500 Internal Server Error', async ({ request }) => {
    const res = await request.get(routes.statusCodes.serverError);
    expect(res.status()).toBe(500);
  });

  test('la page liste les 4 codes et affiche le bon résultat en cliquant', async ({ statusCodesPage, statusResultPage }) => {
    await statusCodesPage.goto();
    await expect(statusCodesPage.links).toHaveCount(4);

    await statusCodesPage.link404.click();
    await expect(statusResultPage.code).toHaveText('404');
  });
});
