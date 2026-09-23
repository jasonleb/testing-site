const { test, expect } = require('./fixtures');
const { challenges } = require('../data/challenges');

test.describe('Accueil', () => {
  test('affiche la marque du site et le titre de page', async ({ homePage, page }) => {
    await homePage.goto();
    await expect(homePage.brand).toBeVisible();
    await expect(page).toHaveTitle(/Accueil/);
  });

  test('la grille de cartes contient tous les défis et navigue correctement', async ({ homePage, loginPage, page }) => {
    await homePage.goto();
    // Depuis la refonte Arcade, il n'y a plus de sidebar listant les défis :
    // la grille de la page d'accueil est elle-même la navigation.
    await expect(homePage.challengeCards).toHaveCount(challenges.length);

    await homePage.card('login').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.form).toBeVisible();
  });

  test('sépare les défis « Règles métier » et explique leur principe', async ({ homePage }) => {
    await homePage.goto();
    const business = challenges.filter((c) => c.category === 'metier');

    await expect(homePage.automationCards).toHaveCount(challenges.length - business.length);
    await expect(homePage.businessCards).toHaveCount(business.length);
    for (const c of business) {
      await expect(homePage.businessGrid.getByTestId(`card-${c.id}`)).toBeVisible();
    }
    await expect(homePage.businessIntro).toContainText('?mutant=');
  });
});
