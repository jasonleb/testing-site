/**
 * Suite écrite à la main pour le défi « Workflow de note de frais ».
 * Couvre le diagramme d'états (transitions valides et invalides) et la matrice rôles × actions.
 * Chaque mutant « frais-* » de data/mutants.js doit faire échouer au moins un test.
 *
 * Données de départ (propres à chaque test grâce au cookie de session) :
 *   n° 1 « Train Genève – Zurich »  alice  soumise
 *   n° 2 « Repas client »           bob    soumise
 *   n° 3 « Hôtel Lausanne »         alice  brouillon
 */
const { test, expect } = require('./fixtures');
const { routes } = require('./routes');

const api = (request) => ({
  list: (as) => request.get(routes.expensesApi.list, { params: { as } }),
  create: (as, label, amount) => request.post(routes.expensesApi.list, { data: { as, label, amount } }),
  edit: (as, id, label, amount) => request.put(routes.expensesApi.note(id), { data: { as, label, amount } }),
  act: (as, id, action, reason) => request.post(routes.expensesApi.action(id, action), { data: { as, reason } }),
  reset: () => request.post(routes.expensesApi.reset),
});

const noteOf = async (res, id) => (await res.json()).notes.find((n) => n.id === id);

test.describe('Note de frais — API : transitions valides', () => {
  test('parcours complet : création → soumission → approbation → paiement', async ({ request }) => {
    const e = api(request);
    const created = await e.create('alice', 'Taxi aéroport', '42.50');
    expect(created.status()).toBe(201);
    const { id, state, author } = await created.json();
    expect({ state, author }).toEqual({ state: 'brouillon', author: 'alice' });

    expect((await e.edit('alice', id, 'Taxi aéroport de Genève', '45')).status()).toBe(200);
    expect((await (await e.act('alice', id, 'submit')).json()).state).toBe('soumise');
    expect((await (await e.act('bob', id, 'approve')).json()).state).toBe('approuvee');
    const paid = await (await e.act('chloe', id, 'pay')).json();
    expect(paid).toMatchObject({ state: 'payee', label: 'Taxi aéroport de Genève', amount: '45.00' });
  });

  test('rejet avec motif, puis reprise et correction par l\'auteur', async ({ request }) => {
    const e = api(request);
    const rejected = await (await e.act('bob', 1, 'reject', 'Justificatif manquant')).json();
    expect(rejected).toMatchObject({ state: 'rejetee', rejectionReason: 'Justificatif manquant' });

    const reopened = await (await e.act('alice', 1, 'reopen')).json();
    expect(reopened).toMatchObject({ state: 'brouillon', rejectionReason: null });
    expect((await e.edit('alice', 1, 'Train Genève – Zurich (2e classe)', '89.00')).status()).toBe(200);
    expect((await (await e.act('alice', 1, 'submit')).json()).state).toBe('soumise');
  });

  test('la réinitialisation restaure les données de départ', async ({ request }) => {
    const e = api(request);
    await e.act('bob', 1, 'approve');
    expect((await e.reset()).status()).toBe(204);
    expect((await noteOf(await e.list('alice'), 1)).state).toBe('soumise');
  });
});

test.describe('Note de frais — API : transitions invalides (409)', () => {
  test('payer une note seulement soumise', async ({ request }) => {
    expect((await api(request).act('chloe', 1, 'pay')).status()).toBe(409);
  });

  test('payer une note rejetée', async ({ request }) => {
    const e = api(request);
    await e.act('bob', 1, 'reject', 'Hors politique de voyage');
    expect((await e.act('chloe', 1, 'pay')).status()).toBe(409);
  });

  test('modifier une note déjà soumise', async ({ request }) => {
    expect((await api(request).edit('alice', 1, 'Autre libellé', '10')).status()).toBe(409);
  });

  test('soumettre deux fois, reprendre une note non rejetée, approuver une note payée', async ({ request }) => {
    const e = api(request);
    expect((await e.act('alice', 1, 'submit')).status()).toBe(409);
    expect((await e.act('alice', 1, 'reopen')).status()).toBe(409);
    await e.act('bob', 1, 'approve');
    await e.act('chloe', 1, 'pay');
    expect((await e.act('bob', 1, 'approve')).status()).toBe(409);
    expect((await e.act('bob', 1, 'reject', 'trop tard')).status()).toBe(409);
  });
});

test.describe('Note de frais — API : rôles (403)', () => {
  test('un manager ne peut pas approuver ni rejeter sa propre note', async ({ request }) => {
    const e = api(request);
    expect((await e.act('bob', 2, 'approve')).status()).toBe(403);
    expect((await e.act('bob', 2, 'reject', 'test')).status()).toBe(403);
  });

  test('ni un employé ni la comptabilité ne peuvent approuver', async ({ request }) => {
    const e = api(request);
    expect((await e.act('alice', 2, 'approve')).status()).toBe(403);
    expect((await e.act('chloe', 2, 'approve')).status()).toBe(403);
  });

  test('seule la comptabilité paie', async ({ request }) => {
    const e = api(request);
    await e.act('bob', 1, 'approve');
    expect((await e.act('alice', 1, 'pay')).status()).toBe(403);
    expect((await e.act('bob', 1, 'pay')).status()).toBe(403);
  });

  test('seul l\'auteur modifie, soumet et reprend sa note', async ({ request }) => {
    const e = api(request);
    expect((await e.edit('bob', 3, 'Hôtel', '100')).status()).toBe(403);
    expect((await e.act('bob', 3, 'submit')).status()).toBe(403);
    await e.act('bob', 1, 'reject', 'Doublon');
    expect((await e.act('bob', 1, 'reopen')).status()).toBe(403);
  });

  test('les actions proposées dépendent du rôle et de l\'auteur', async ({ request }) => {
    const e = api(request);
    expect((await noteOf(await e.list('bob'), 1)).allowedActions).toEqual(['approve', 'reject']);
    expect((await noteOf(await e.list('bob'), 2)).allowedActions).toEqual([]);
    expect((await noteOf(await e.list('alice'), 1)).allowedActions).toEqual([]);
    expect((await noteOf(await e.list('alice'), 3)).allowedActions).toEqual(['edit', 'submit']);
    expect((await noteOf(await e.list('chloe'), 1)).allowedActions).toEqual([]);
  });
});

test.describe('Note de frais — API : saisies invalides (400 / 404)', () => {
  test('le motif de rejet est obligatoire', async ({ request }) => {
    const e = api(request);
    expect((await e.act('bob', 1, 'reject', '')).status()).toBe(400);
    expect((await e.act('bob', 1, 'reject', '   ')).status()).toBe(400);
    expect((await noteOf(await e.list('bob'), 1)).state).toBe('soumise');
  });

  for (const [label, noteLabel, amount, status] of [
    ['montant minimal 0.01', 'Café', '0.01', 201],
    ['montant maximal 10000.00', 'Salon', '10000.00', 201],
    ['libellé de 80 caractères', 'x'.repeat(80), '10', 201],
    ['montant 0', 'Café', '0', 400],
    ['montant 10000.01', 'Salon', '10000.01', 400],
    ['montant négatif', 'Café', '-3', 400],
    ['montant à 3 décimales', 'Café', '3.141', 400],
    ['libellé vide', '  ', '10', 400],
    ['libellé de 81 caractères', 'x'.repeat(81), '10', 400],
  ]) {
    test(`création : ${label} → ${status}`, async ({ request }) => {
      expect((await api(request).create('alice', noteLabel, amount)).status()).toBe(status);
    });
  }

  test('utilisateur inconnu → 400, note inconnue → 404', async ({ request }) => {
    const e = api(request);
    expect((await e.list('mallory')).status()).toBe(400);
    expect((await e.act('bob', 999, 'approve')).status()).toBe(404);
  });
});

test.describe('Note de frais — interface', () => {
  test('parcours complet en changeant d\'utilisateur', async ({ expensesPage, page }) => {
    await expensesPage.goto();
    await expensesPage.fillAndSave('Parking gare', '18.40');
    await expect(expensesPage.message).toHaveText('Note n° 4 créée (brouillon).');
    await expect(expensesPage.state(4)).toHaveText('Brouillon');

    await expensesPage.doAction(4, 'submit');
    await expect(expensesPage.state(4)).toHaveText('Soumise');
    await expect(expensesPage.actionButtons(4)).toHaveCount(0);

    await expensesPage.actAs('bob');
    await expensesPage.doAction(4, 'approve');
    await expect(expensesPage.state(4)).toHaveText('Approuvée');

    await expensesPage.actAs('chloe');
    await expensesPage.doAction(4, 'pay');
    await expect(expensesPage.state(4)).toHaveText('Payée');
    await expect(page.getByTestId('expense-amount-4')).toHaveText('18.40');
  });

  test('rejet avec motif puis reprise par l\'auteur', async ({ expensesPage }) => {
    await expensesPage.goto();
    await expensesPage.actAs('bob');
    await expect(expensesPage.actionButtons(2)).toHaveCount(0); // sa propre note

    await expensesPage.doAction(1, 'reject');
    await expect(expensesPage.message).toHaveText('Le motif de rejet est obligatoire.');

    await expensesPage.reject(1, 'Justificatif manquant');
    await expect(expensesPage.state(1)).toHaveText('Rejetée');
    await expect(expensesPage.reason(1)).toHaveText('Motif : Justificatif manquant');

    await expensesPage.actAs('alice');
    await expensesPage.doAction(1, 'reopen');
    await expect(expensesPage.state(1)).toHaveText('Brouillon');
    await expect(expensesPage.reason(1)).toHaveCount(0);
  });

  test('modification d\'un brouillon', async ({ expensesPage }) => {
    await expensesPage.goto();
    await expensesPage.doAction(3, 'edit');
    await expect(expensesPage.formTitle).toHaveText('Modifier la note n° 3');
    await expensesPage.fillAndSave('Hôtel Lausanne (2 nuits)', '420');
    await expect(expensesPage.label(3)).toHaveText('Hôtel Lausanne (2 nuits)');
    await expect(expensesPage.formTitle).toHaveText('Nouvelle note de frais');
  });
});
