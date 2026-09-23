/**
 * Calcul du tarif d'abonnement annuel (défi « Calculateur de tarif »).
 * Tout le calcul est fait côté serveur pour que les mutants (data/mutants.js)
 * soient invisibles depuis le navigateur.
 *
 * Règles de référence :
 *   - Tarif de base : CHF 89.90 / an
 *   - 0 à 5 ans : gratuit (aucune autre réduction ne s'applique)
 *   - 6 à 15 ans : Junior, -50 %
 *   - 16 à 25 ans : Jeune, -25 %
 *   - 26 à 64 ans : Adulte, plein tarif
 *   - 65 ans et plus : Senior, -30 %
 *   - Membre du club : -20 % supplémentaires, cumulables (addition)
 *   - Réduction cumulée plafonnée à 50 %
 *   - Prix final arrondi aux 5 centimes les plus proches
 *   - Âge : nombre entier de 0 à 120, sinon erreur
 */
const { isActive } = require('../data/mutants');

const BASE_PRICE_CENTS = 8990;
const MEMBER_DISCOUNT = 20;
const MAX_DISCOUNT = 50;
const MIN_AGE = 0;
const MAX_AGE = 120;

class PricingError extends Error {}

function parseAge(raw) {
  const s = raw === undefined || raw === null ? '' : String(raw).trim();
  if (s === '') throw new PricingError("L'âge est obligatoire.");
  if (!/^-?\d+$/.test(s)) throw new PricingError("L'âge doit être un nombre entier.");
  const age = Number(s);
  const tooLow = age < MIN_AGE && !isActive('tarif-age-negatif');
  if (tooLow || age > MAX_AGE) {
    throw new PricingError(`L'âge doit être compris entre ${MIN_AGE} et ${MAX_AGE} ans.`);
  }
  return age;
}

function parseMember(raw) {
  return raw === true || raw === 'true' || raw === 'on' || raw === '1';
}

function ageCategory(age) {
  if (age < 6) return { id: 'enfant', label: 'Enfant', discount: 100 };
  const juniorMax = isActive('tarif-borne-16') ? 16 : 15;
  if (age <= juniorMax) return { id: 'junior', label: 'Junior', discount: 50 };
  if (age <= 25) return { id: 'jeune', label: 'Jeune', discount: 25 };
  const seniorMin = isActive('tarif-borne-65') ? 66 : 65;
  if (age >= seniorMin) return { id: 'senior', label: 'Senior', discount: 30 };
  return { id: 'adulte', label: 'Adulte', discount: 0 };
}

function roundTo5Cents(cents) {
  const step = isActive('tarif-arrondi') ? Math.floor(cents / 5) : Math.round(cents / 5);
  return step * 5;
}

const formatChf = (cents) => (cents / 100).toFixed(2);

function computePrice({ age: rawAge, member: rawMember }) {
  const age = parseAge(rawAge);
  const member = parseMember(rawMember);
  const category = ageCategory(age);

  let discount;
  if (category.id === 'enfant' && !isActive('tarif-enfant-membre')) {
    discount = 100; // gratuité sans condition
  } else {
    discount = category.discount + (member ? MEMBER_DISCOUNT : 0);
    if (!isActive('tarif-plafond')) discount = Math.min(discount, MAX_DISCOUNT);
  }

  const finalCents = roundTo5Cents((BASE_PRICE_CENTS * (100 - discount)) / 100);

  return {
    age,
    member,
    category: category.id,
    categoryLabel: category.label,
    basePrice: formatChf(BASE_PRICE_CENTS),
    discountPercent: discount,
    finalPrice: formatChf(finalCents),
    currency: 'CHF',
  };
}

module.exports = { computePrice, PricingError, BASE_PRICE_CENTS };
