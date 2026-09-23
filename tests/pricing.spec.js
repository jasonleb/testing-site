/**
 * Suite écrite à la main pour le défi « Calculateur de tarif ».
 * Elle sert aussi de référence pour la campagne de mutation (`npm run mutants`) :
 * chaque mutant de data/mutants.js doit faire échouer au moins un test ici.
 */
const { test, expect } = require('./fixtures');
const { routes } = require('./routes');

const price = (request, age, member = false) =>
  request.get(routes.pricingApi, { params: { age: String(age), member: String(member) } });

test.describe('Calculateur de tarif — API', () => {
  // Valeurs limites de chaque tranche d'âge + combinaisons avec l'adhésion
  const cases = [
    // âge, membre, catégorie, réduction, prix
    [0, false, 'enfant', 100, '0.00'],
    [5, false, 'enfant', 100, '0.00'],
    [5, true, 'enfant', 100, '0.00'],
    [6, false, 'junior', 50, '44.95'],
    [15, false, 'junior', 50, '44.95'],
    [15, true, 'junior', 50, '44.95'],
    [16, false, 'jeune', 25, '67.45'],
    [25, false, 'jeune', 25, '67.45'],
    [25, true, 'jeune', 45, '49.45'],
    [26, false, 'adulte', 0, '89.90'],
    [30, true, 'adulte', 20, '71.90'],
    [64, false, 'adulte', 0, '89.90'],
    [65, false, 'senior', 30, '62.95'],
    [65, true, 'senior', 50, '44.95'],
    [120, false, 'senior', 30, '62.95'],
  ];

  for (const [age, member, category, discount, finalPrice] of cases) {
    test(`${age} ans, ${member ? 'membre' : 'non membre'} → ${category}, -${discount} %, CHF ${finalPrice}`, async ({ request }) => {
      const res = await price(request, age, member);
      expect(res.status()).toBe(200);
      expect(await res.json()).toMatchObject({ category, discountPercent: discount, finalPrice });
    });
  }

  for (const age of ['', 'abc', '12.5', '-1', '121']) {
    test(`âge invalide « ${age} » → 400`, async ({ request }) => {
      const res = await price(request, age);
      expect(res.status()).toBe(400);
      expect((await res.json()).error).toBeTruthy();
    });
  }
});

test.describe('Calculateur de tarif — interface', () => {
  test('affiche la catégorie, la réduction et le prix', async ({ pricingPage }) => {
    await pricingPage.goto();
    await pricingPage.calculate(25, { member: true });

    await expect(pricingPage.result).toBeVisible();
    await expect(pricingPage.category).toHaveText('Jeune');
    await expect(pricingPage.discount).toHaveText('45');
    await expect(pricingPage.finalPrice).toHaveText('49.45');
    await expect(pricingPage.error).toBeHidden();
  });

  test('affiche une erreur pour un âge invalide, puis la masque après correction', async ({ pricingPage }) => {
    await pricingPage.goto();
    await pricingPage.calculate('abc');
    await expect(pricingPage.error).toHaveText("L'âge doit être un nombre entier.");
    await expect(pricingPage.result).toBeHidden();

    await pricingPage.calculate(30);
    await expect(pricingPage.error).toBeHidden();
    await expect(pricingPage.finalPrice).toHaveText('89.90');
  });
});
