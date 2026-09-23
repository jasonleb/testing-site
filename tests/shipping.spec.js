/**
 * Suite écrite à la main pour le défi « Frais de livraison ».
 * Table de décision complète : 3 zones × premium × volumineux × panier (99.99 / 100.00).
 * Chaque mutant « livraison-* » de data/mutants.js doit faire échouer au moins un test.
 */
const { test, expect } = require('./fixtures');
const { routes } = require('./routes');

const shipping = (request, { amount, zone, premium = false, bulky = false }) =>
  request.get(routes.shippingApi, {
    params: { amount: String(amount), zone, premium: String(premium), bulky: String(bulky) },
  });

// zone, premium, volumineux, panier, frais de base, supplément, total (null = non livrable)
const X = null;
const decisionTable = [
  ['locale', false, false, '99.99', '5.00', '0.00', '5.00'],
  ['locale', false, false, '100.00', '0.00', '0.00', '0.00'],
  ['locale', false, true, '99.99', '5.00', '15.00', '20.00'],
  ['locale', false, true, '100.00', '0.00', '15.00', '15.00'],
  ['locale', true, false, '99.99', '0.00', '0.00', '0.00'],
  ['locale', true, false, '100.00', '0.00', '0.00', '0.00'],
  ['locale', true, true, '99.99', '0.00', '0.00', '0.00'],
  ['locale', true, true, '100.00', '0.00', '0.00', '0.00'],

  ['nationale', false, false, '99.99', '9.00', '0.00', '9.00'],
  ['nationale', false, false, '100.00', '0.00', '0.00', '0.00'],
  ['nationale', false, true, '99.99', '9.00', '15.00', '24.00'],
  ['nationale', false, true, '100.00', '0.00', '15.00', '15.00'],
  ['nationale', true, false, '99.99', '0.00', '0.00', '0.00'],
  ['nationale', true, false, '100.00', '0.00', '0.00', '0.00'],
  ['nationale', true, true, '99.99', '0.00', '15.00', '15.00'],
  ['nationale', true, true, '100.00', '0.00', '15.00', '15.00'],

  ['internationale', false, false, '99.99', '25.00', '0.00', '25.00'],
  ['internationale', false, false, '100.00', '25.00', '0.00', '25.00'],
  ['internationale', false, true, '99.99', X, X, X],
  ['internationale', false, true, '100.00', X, X, X],
  ['internationale', true, false, '99.99', '0.00', '0.00', '0.00'],
  ['internationale', true, false, '100.00', '0.00', '0.00', '0.00'],
  ['internationale', true, true, '99.99', X, X, X],
  ['internationale', true, true, '100.00', X, X, X],
];

test.describe('Frais de livraison — API (table de décision)', () => {
  for (const [zone, premium, bulky, amount, baseFee, bulkySurcharge, total] of decisionTable) {
    const title = `${zone}, ${premium ? 'premium' : 'standard'}, ${bulky ? 'volumineux' : 'normal'}, panier ${amount}`;
    test(`${title} → ${total === null ? 'non livrable' : `CHF ${total}`}`, async ({ request }) => {
      const res = await shipping(request, { amount, zone, premium, bulky });
      expect(res.status()).toBe(200);
      const body = await res.json();
      if (total === null) {
        expect(body.deliverable).toBe(false);
        expect(body.total).toBeNull();
      } else {
        expect(body).toMatchObject({ deliverable: true, baseFee, bulkySurcharge, total });
      }
    });
  }

  test('le montant accepte la virgule décimale', async ({ request }) => {
    const res = await shipping(request, { amount: '100,00', zone: 'nationale' });
    expect((await res.json()).total).toBe('0.00');
  });

  for (const [label, params] of [
    ['montant vide', { amount: '', zone: 'locale' }],
    ['montant négatif', { amount: '-5', zone: 'locale' }],
    ['montant à 3 décimales', { amount: '10.999', zone: 'locale' }],
    ['montant non numérique', { amount: 'abc', zone: 'locale' }],
    ['zone inconnue', { amount: '50', zone: 'mars' }],
  ]) {
    test(`saisie invalide : ${label} → 400`, async ({ request }) => {
      const res = await shipping(request, params);
      expect(res.status()).toBe(400);
      expect((await res.json()).error).toBeTruthy();
    });
  }
});

test.describe('Frais de livraison — interface', () => {
  test('affiche le détail des frais', async ({ shippingPage }) => {
    await shippingPage.goto();
    await shippingPage.calculate('99.99', { zone: 'nationale', bulky: true });

    await expect(shippingPage.result).toBeVisible();
    await expect(shippingPage.baseFee).toHaveText('9.00');
    await expect(shippingPage.surcharge).toHaveText('15.00');
    await expect(shippingPage.total).toHaveText('24.00');
    await expect(shippingPage.undeliverable).toBeHidden();
  });

  test('signale un colis volumineux non livrable à l\'international', async ({ shippingPage }) => {
    await shippingPage.goto();
    await shippingPage.calculate('50', { zone: 'internationale', bulky: true });

    await expect(shippingPage.undeliverable).toHaveText("Les colis volumineux ne sont pas livrés à l'international.");
    await expect(shippingPage.total).toBeHidden();
  });

  test('affiche une erreur de saisie', async ({ shippingPage }) => {
    await shippingPage.goto();
    await shippingPage.calculate('');
    await expect(shippingPage.error).toHaveText('Le montant du panier est obligatoire.');
    await expect(shippingPage.result).toBeHidden();
  });
});
