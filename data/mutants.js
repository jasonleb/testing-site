/**
 * Catalogue des mutants : des bugs volontaires, désactivés par défaut,
 * qu'on active pour mesurer si une suite de tests les détecte.
 *
 * Deux façons de les activer :
 *   - Par l'URL (par navigateur, mémorisé dans un cookie) :
 *       http://localhost:3000/pricing?mutant=tarif-borne-16
 *       http://localhost:3000/pricing?mutant=tarif-borne-16,tarif-arrondi
 *       http://localhost:3000/pricing?mutant=off        (désactive)
 *   - Pour tout le serveur, via une variable d'environnement :
 *       MUTANT=tarif-borne-16 npm start
 *
 * Le cookie (ou le paramètre) a priorité sur la variable d'environnement.
 * Sans rien de tout ça, le site se comporte conformément aux règles.
 * `technique` = la technique de conception de tests censée attraper le bug.
 */
const { AsyncLocalStorage } = require('async_hooks');

const mutants = [
  {
    id: 'tarif-borne-16',
    challenge: 'pricing',
    technique: 'Valeurs limites',
    description: "Un client de 16 ans est encore classé « Junior » (-50 %) au lieu de « Jeune » (-25 %).",
  },
  {
    id: 'tarif-borne-65',
    challenge: 'pricing',
    technique: 'Valeurs limites',
    description: "La réduction senior ne démarre qu'à 66 ans au lieu de 65.",
  },
  {
    id: 'tarif-plafond',
    challenge: 'pricing',
    technique: 'Partitions d\'équivalence / combinaisons',
    description: 'Le plafond de 50 % de réduction cumulée n\'est pas appliqué (Junior membre = -70 %).',
  },
  {
    id: 'tarif-arrondi',
    challenge: 'pricing',
    technique: 'Oracle de calcul',
    description: 'Le prix est tronqué aux 5 centimes inférieurs au lieu d\'être arrondi aux 5 centimes les plus proches.',
  },
  {
    id: 'tarif-age-negatif',
    challenge: 'pricing',
    technique: 'Partitions invalides',
    description: 'Un âge négatif est accepté (et traité comme un enfant, donc gratuit) au lieu d\'être refusé.',
  },
  {
    id: 'tarif-enfant-membre',
    challenge: 'pricing',
    technique: 'Table de décision',
    description: 'Un enfant de moins de 6 ans membre paie 50 % : le plafond de cumul écrase la gratuité.',
  },
  {
    id: 'livraison-seuil',
    challenge: 'shipping',
    technique: 'Valeurs limites',
    description: 'La livraison gratuite ne démarre qu\'au-delà de CHF 100.00 (> au lieu de ≥) : un panier de 100.00 paie les frais.',
  },
  {
    id: 'livraison-seuil-international',
    challenge: 'shipping',
    technique: 'Table de décision',
    description: 'Le seuil de gratuité de CHF 100 s\'applique aussi à l\'international.',
  },
  {
    id: 'livraison-premium-international',
    challenge: 'shipping',
    technique: 'Table de décision',
    description: 'Un client premium paie les frais de base à l\'international.',
  },
  {
    id: 'livraison-volumineux-premium',
    challenge: 'shipping',
    technique: 'Table de décision',
    description: 'Le supplément volumineux est offert aux clients premium dans toutes les zones (au lieu de la zone locale seulement).',
  },
  {
    id: 'livraison-international-volumineux',
    challenge: 'shipping',
    technique: 'Table de décision',
    description: 'Un colis volumineux est accepté à l\'international au lieu d\'être refusé.',
  },
  {
    id: 'frais-payer-rejetee',
    challenge: 'expenses',
    technique: 'Transitions d\'état (transition invalide)',
    description: 'La comptabilité peut payer une note rejetée.',
  },
  {
    id: 'frais-modif-soumise',
    challenge: 'expenses',
    technique: 'Transitions d\'état (transition invalide)',
    description: 'L\'auteur peut encore modifier une note déjà soumise.',
  },
  {
    id: 'frais-auto-approbation',
    challenge: 'expenses',
    technique: 'Matrice rôles × actions',
    description: 'Un manager peut approuver sa propre note.',
  },
  {
    id: 'frais-employe-approuve',
    challenge: 'expenses',
    technique: 'Matrice rôles × actions',
    description: 'Un employé peut approuver la note d\'un collègue.',
  },
  {
    id: 'frais-rejet-sans-motif',
    challenge: 'expenses',
    technique: 'Partitions invalides',
    description: 'Une note peut être rejetée sans motif.',
  },
];

const COOKIE = 'mutant';
const knownIds = new Set(mutants.map((m) => m.id));
const parseIds = (value) => (value || '').split(',').map((s) => s.trim()).filter(Boolean);

const envActive = new Set(parseIds(process.env.MUTANT));
const unknownEnv = [...envActive].filter((id) => !knownIds.has(id));
if (unknownEnv.length) {
  throw new Error(`Mutant(s) inconnu(s) : ${unknownEnv.join(', ')}. Voir data/mutants.js.`);
}

// Mutants actifs pour la requête en cours (posés par mutantMiddleware).
const requestContext = new AsyncLocalStorage();

const isActive = (id) => (requestContext.getStore() || envActive).has(id);

/**
 * ?mutant=a,b   → active ces mutants pour ce navigateur (cookie) ;
 * ?mutant=off   → revient au comportement normal (supprime le cookie) ;
 * sinon         → mutants du cookie, à défaut ceux de la variable MUTANT.
 */
function mutantMiddleware(req, res, next) {
  let active = envActive;
  const param = req.query.mutant;

  if (typeof param === 'string') {
    if (param === '' || param === 'off') {
      res.clearCookie(COOKIE);
    } else {
      const ids = parseIds(param);
      const unknown = ids.filter((id) => !knownIds.has(id));
      if (unknown.length) {
        return res.status(400).type('text').send(
          `Mutant(s) inconnu(s) : ${unknown.join(', ')}\nDisponibles : ${[...knownIds].join(', ')}`,
        );
      }
      res.cookie(COOKIE, ids.join(','), { httpOnly: true, sameSite: 'lax' });
      active = new Set(ids);
    }
  } else if (req.cookies && req.cookies[COOKIE]) {
    active = new Set(parseIds(req.cookies[COOKIE]).filter((id) => knownIds.has(id)));
  }

  requestContext.run(active, () => next());
}

module.exports = { mutants, isActive, mutantMiddleware, activeMutants: [...envActive] };
