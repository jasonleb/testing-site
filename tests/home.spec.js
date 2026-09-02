const { test, expect } = require('./fixtures');

test.describe('Accueil', () => {
  test('affiche la marque du site et le titre de page', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(homePage.brand).toBeVisible();
    await expect(page).toHaveTitle(/Accueil/);
  });

  test('la grille de cartes contient les 18 défis et navigue correctement', async ({ homePage, loginPage, page }) => {
    await homePage.goto();
    // Depuis la refonte Arcade, il n'y a plus de sidebar listant les défis :
    // la grille de la page d'accueil est elle-même la navigation.
    await expect(homePage.challengeCards).toHaveCount(18);

    await homePage.card('login').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.form).toBeVisible();
  });
});
