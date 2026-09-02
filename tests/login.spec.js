const { test, expect } = require('./fixtures');

test.describe('Connexion', () => {
  test('identifiants invalides affichent une erreur', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('mauvais', 'mauvais');

    await expect(loginPage.error).toHaveText('Identifiants invalides.');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('identifiants valides mènent à la zone sécurisée puis déconnexion', async ({ loginPage, securePage, page }) => {
    await loginPage.goto();
    await loginPage.login('testuser', 'Test1234!');

    await expect(page).toHaveURL(/\/secure$/);
    await expect(securePage.message).toContainText('Vous êtes connecté');

    await securePage.logout();
    await expect(page).toHaveURL(/\/login$/);

    // Sans cookie de session, /secure redirige vers /login
    await securePage.goto();
    await expect(page).toHaveURL(/\/login$/);
  });
});
