/**
 * Workflow de notes de frais (défi « Workflow de note de frais »).
 *
 * États : brouillon → soumise → approuvee → payee
 *                           ↘ rejetee → brouillon (reprise par l'auteur)
 *
 * Utilisateurs (pas d'authentification : on choisit « en tant que ») :
 *   - alice : employée
 *   - bob   : manager (peut aussi créer ses propres notes)
 *   - chloe : comptable
 *
 * Règles de référence :
 *   - Tout utilisateur peut créer une note (état brouillon, il en est l'auteur)
 *   - Modifier / soumettre : l'auteur, en brouillon uniquement
 *   - Approuver / rejeter : un manager, sur une note soumise, jamais la sienne
 *   - Rejeter : motif obligatoire
 *   - Reprendre une note rejetée (retour en brouillon) : l'auteur
 *   - Payer : la comptabilité, sur une note approuvée uniquement
 *   - Libellé obligatoire (80 caractères max), montant > 0 et ≤ 10 000, 2 décimales max
 *
 * Codes d'erreur de l'API : 400 saisie invalide, 403 action interdite pour ce rôle,
 * 404 note inconnue, 409 action impossible dans l'état actuel.
 *
 * Les données vivent en mémoire, séparées par session navigateur (cookie),
 * pour que des tests parallèles ne se marchent pas dessus.
 */
const crypto = require('crypto');
const { isActive } = require('../data/mutants');

const USERS = {
  alice: { id: 'alice', name: 'Alice Martin', role: 'employe', roleLabel: 'Employée' },
  bob: { id: 'bob', name: 'Bob Keller', role: 'manager', roleLabel: 'Manager' },
  chloe: { id: 'chloe', name: 'Chloé Rey', role: 'comptable', roleLabel: 'Comptable' },
};

const STATES = {
  brouillon: 'Brouillon',
  soumise: 'Soumise',
  approuvee: 'Approuvée',
  rejetee: 'Rejetée',
  payee: 'Payée',
};

const ACTIONS = ['edit', 'submit', 'approve', 'reject', 'reopen', 'pay'];

class ExpenseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// --- Règles : état de départ valide, et qui a le droit ---------------------

function validFrom(action) {
  switch (action) {
    case 'edit': return isActive('frais-modif-soumise') ? ['brouillon', 'soumise'] : ['brouillon'];
    case 'submit': return ['brouillon'];
    case 'approve':
    case 'reject': return ['soumise'];
    case 'reopen': return ['rejetee'];
    case 'pay': return isActive('frais-payer-rejetee') ? ['approuvee', 'rejetee'] : ['approuvee'];
    default: return [];
  }
}

function isAllowed(action, note, user) {
  const isAuthor = note.author === user.id;
  switch (action) {
    case 'edit':
    case 'submit':
    case 'reopen':
      return isAuthor;
    case 'approve':
    case 'reject': {
      const roles = isActive('frais-employe-approuve') ? ['manager', 'employe'] : ['manager'];
      const ownNoteOk = isActive('frais-auto-approbation');
      return roles.includes(user.role) && (!isAuthor || ownNoteOk);
    }
    case 'pay':
      return user.role === 'comptable';
    default:
      return false;
  }
}

const NEXT_STATE = { submit: 'soumise', approve: 'approuvee', reject: 'rejetee', reopen: 'brouillon', pay: 'payee' };

function allowedActions(note, user) {
  return ACTIONS.filter((a) => validFrom(a).includes(note.state) && isAllowed(a, note, user));
}

// --- Validation -----------------------------------------------------------

function parseUser(raw) {
  const user = USERS[String(raw || '').trim()];
  if (!user) throw new ExpenseError(400, 'Utilisateur inconnu (alice, bob ou chloe).');
  return user;
}

function parseLabel(raw) {
  const label = String(raw === undefined || raw === null ? '' : raw).trim();
  if (!label) throw new ExpenseError(400, 'Le libellé est obligatoire.');
  if (label.length > 80) throw new ExpenseError(400, 'Le libellé ne doit pas dépasser 80 caractères.');
  return label;
}

function parseAmount(raw) {
  const s = String(raw === undefined || raw === null ? '' : raw).trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    throw new ExpenseError(400, 'Le montant doit être un nombre positif avec au plus 2 décimales.');
  }
  const cents = Math.round(Number(s) * 100);
  if (cents <= 0 || cents > 1000000) {
    throw new ExpenseError(400, 'Le montant doit être supérieur à 0 et au plus CHF 10 000.00.');
  }
  return cents;
}

// --- Stockage par session ---------------------------------------------------

const MAX_SESSIONS = 500;
const sessions = new Map();

function seed() {
  return {
    nextId: 4,
    notes: [
      { id: 1, label: 'Train Genève – Zurich', amountCents: 8900, author: 'alice', state: 'soumise', rejectionReason: null },
      { id: 2, label: 'Repas client', amountCents: 14550, author: 'bob', state: 'soumise', rejectionReason: null },
      { id: 3, label: 'Hôtel Lausanne', amountCents: 21000, author: 'alice', state: 'brouillon', rejectionReason: null },
    ],
  };
}

function getStore(sid) {
  if (!sessions.has(sid)) {
    if (sessions.size >= MAX_SESSIONS) sessions.delete(sessions.keys().next().value);
    sessions.set(sid, seed());
  }
  return sessions.get(sid);
}

function resetStore(sid) {
  sessions.set(sid, seed());
}

const newSessionId = () => crypto.randomUUID();

// --- Opérations -------------------------------------------------------------

function present(note, user) {
  return {
    id: note.id,
    label: note.label,
    amount: (note.amountCents / 100).toFixed(2),
    author: note.author,
    authorName: USERS[note.author].name,
    state: note.state,
    stateLabel: STATES[note.state],
    rejectionReason: note.rejectionReason,
    allowedActions: allowedActions(note, user),
  };
}

function findNote(store, rawId) {
  const note = store.notes.find((n) => String(n.id) === String(rawId));
  if (!note) throw new ExpenseError(404, 'Note de frais introuvable.');
  return note;
}

function checkAction(action, note, user) {
  if (!validFrom(action).includes(note.state)) {
    throw new ExpenseError(409, `Action impossible : la note est « ${STATES[note.state]} ».`);
  }
  if (!isAllowed(action, note, user)) {
    throw new ExpenseError(403, `${user.name} (${user.roleLabel}) n'a pas le droit de faire cette action sur cette note.`);
  }
}

function list(store, rawUser) {
  const user = parseUser(rawUser);
  return { user, notes: store.notes.map((n) => present(n, user)) };
}

function create(store, { as, label, amount }) {
  const user = parseUser(as);
  const note = {
    id: store.nextId++,
    label: parseLabel(label),
    amountCents: parseAmount(amount),
    author: user.id,
    state: 'brouillon',
    rejectionReason: null,
  };
  store.notes.push(note);
  return present(note, user);
}

function update(store, id, { as, label, amount }) {
  const user = parseUser(as);
  const note = findNote(store, id);
  checkAction('edit', note, user);
  const newLabel = parseLabel(label);
  const newAmount = parseAmount(amount);
  note.label = newLabel;
  note.amountCents = newAmount;
  return present(note, user);
}

function transition(store, id, action, { as, reason }) {
  if (!NEXT_STATE[action]) throw new ExpenseError(404, 'Action inconnue.');
  const user = parseUser(as);
  const note = findNote(store, id);
  checkAction(action, note, user);

  if (action === 'reject') {
    const motif = String(reason === undefined || reason === null ? '' : reason).trim();
    if (!motif && !isActive('frais-rejet-sans-motif')) {
      throw new ExpenseError(400, 'Le motif de rejet est obligatoire.');
    }
    note.rejectionReason = motif || null;
  }
  if (action === 'reopen') note.rejectionReason = null;

  note.state = NEXT_STATE[action];
  return present(note, user);
}

module.exports = {
  USERS, STATES, ExpenseError, getStore, resetStore, newSessionId, list, create, update, transition,
};
