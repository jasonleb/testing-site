/**
 * Calcul des frais de livraison (défi « Frais de livraison »).
 * Calcul côté serveur pour que les mutants (data/mutants.js) restent invisibles.
 *
 * Règles de référence :
 *   - Frais de base par zone : locale CHF 5.00, nationale CHF 9.00, internationale CHF 25.00
 *   - Client premium : frais de base offerts dans toutes les zones
 *   - Panier ≥ CHF 100.00 : frais de base offerts, en zone locale et nationale uniquement
 *   - Colis volumineux : supplément de CHF 15.00, toujours dû,
 *     sauf pour un client premium en zone locale
 *   - Colis volumineux + zone internationale : livraison impossible
 *   - Montant du panier : nombre ≥ 0, au plus 2 décimales, obligatoire
 */
const { isActive } = require('../data/mutants');

const ZONES = {
  locale: { label: 'Locale', feeCents: 500 },
  nationale: { label: 'Nationale', feeCents: 900 },
  internationale: { label: 'Internationale', feeCents: 2500 },
};
const FREE_THRESHOLD_CENTS = 10000;
const BULKY_SURCHARGE_CENTS = 1500;
const MAX_AMOUNT_CENTS = 100000000;

class ShippingError extends Error {}

const parseBool = (raw) => raw === true || raw === 'true' || raw === 'on' || raw === '1';
const formatChf = (cents) => (cents / 100).toFixed(2);

function parseAmount(raw) {
  const s = raw === undefined || raw === null ? '' : String(raw).trim().replace(',', '.');
  if (s === '') throw new ShippingError('Le montant du panier est obligatoire.');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) {
    throw new ShippingError('Le montant du panier doit être un nombre positif avec au plus 2 décimales.');
  }
  const cents = Math.round(Number(s) * 100);
  if (cents > MAX_AMOUNT_CENTS) throw new ShippingError('Le montant du panier est trop élevé.');
  return cents;
}

function parseZone(raw) {
  const zone = raw === undefined || raw === null ? '' : String(raw).trim();
  if (!ZONES[zone]) throw new ShippingError('Zone de livraison inconnue (locale, nationale ou internationale).');
  return zone;
}

function computeShipping({ amount: rawAmount, premium: rawPremium, zone: rawZone, bulky: rawBulky }) {
  const amountCents = parseAmount(rawAmount);
  const zone = parseZone(rawZone);
  const premium = parseBool(rawPremium);
  const bulky = parseBool(rawBulky);
  const international = zone === 'internationale';

  const base = {
    amount: formatChf(amountCents),
    premium,
    zone,
    zoneLabel: ZONES[zone].label,
    bulky,
    currency: 'CHF',
  };

  if (international && bulky && !isActive('livraison-international-volumineux')) {
    return {
      ...base,
      deliverable: false,
      message: "Les colis volumineux ne sont pas livrés à l'international.",
      baseFee: null,
      bulkySurcharge: null,
      total: null,
      freeShippingReason: null,
    };
  }

  // Frais de base
  let baseFeeCents = ZONES[zone].feeCents;
  let freeShippingReason = null;
  const reachesThreshold = isActive('livraison-seuil')
    ? amountCents > FREE_THRESHOLD_CENTS
    : amountCents >= FREE_THRESHOLD_CENTS;
  const thresholdApplies = !international || isActive('livraison-seuil-international');
  const premiumApplies = premium && !(international && isActive('livraison-premium-international'));

  if (premiumApplies) {
    baseFeeCents = 0;
    freeShippingReason = 'premium';
  } else if (reachesThreshold && thresholdApplies) {
    baseFeeCents = 0;
    freeShippingReason = 'seuil';
  }

  // Supplément volumineux
  let surchargeCents = bulky ? BULKY_SURCHARGE_CENTS : 0;
  const surchargeWaived = premium && (zone === 'locale' || isActive('livraison-volumineux-premium'));
  if (surchargeWaived) surchargeCents = 0;

  return {
    ...base,
    deliverable: true,
    message: null,
    baseFee: formatChf(baseFeeCents),
    bulkySurcharge: formatChf(surchargeCents),
    total: formatChf(baseFeeCents + surchargeCents),
    freeShippingReason,
  };
}

module.exports = { computeShipping, ShippingError, ZONES };
