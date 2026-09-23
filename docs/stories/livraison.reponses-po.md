# US-LIVR-01 — Réponses du PO (corrigé)

> ⚠️ Corrigé : ce fichier ne doit **pas** être fourni en entrée au testeur ou à l'agent.
> Il sert à évaluer la qualité de la revue de story et des tests conçus.

## Ambiguïtés et contradictions volontaires de la story

| # | Où | Question attendue | Réponse du PO |
|---|---|---|---|
| A1 | Règle 2 | « À partir de CHF 100 » : un panier de exactement 100.00 est-il gratuit ? | Oui, dès 100.00 inclus. |
| A2 | Règle 2 | Le seuil de gratuité s'applique-t-il à l'international ? | Non, uniquement en zone locale et nationale. |
| A3 | Règle 3 vs 4 | « Ne paient jamais la livraison » : le supplément volumineux est-il aussi offert aux premium ? | Seulement en zone locale. Ailleurs, le premium paie le supplément. |
| A4 | Règle 3 | La gratuité premium vaut-elle à l'international ? | Oui, les frais de base sont offerts dans toutes les zones. |
| A5 | Règle 5 | Où les colis volumineux ne sont-ils pas livrés ? Que voit le client ? | Pas à l'international. Le client voit un message « non livrable », sans montant. |
| A6 | Règle 2 vs 4 | Le seuil de CHF 100 offre-t-il aussi le supplément volumineux ? | Non, seulement les frais de base. |
| A7 | Règle 2 | Le montant du panier inclut-il les frais ? Quelles saisies sont valides ? | Montant des articles seul. Nombre ≥ 0, 2 décimales max, virgule acceptée. |
| A8 | CA2 / CA3 | CA3 contredit CA4 pour un client premium avec un colis volumineux : quelle règle l'emporte ? | Voir A3. |

## Table de décision consolidée

Frais de base : locale 5.00, nationale 9.00, internationale 25.00. Supplément volumineux : 15.00.

| Zone | Premium | Volumineux | Panier < 100 | Panier ≥ 100 |
|---|---|---|---|---|
| Locale | non | non | 5.00 | 0.00 |
| Locale | non | oui | 20.00 | 15.00 |
| Locale | oui | non | 0.00 | 0.00 |
| Locale | oui | oui | 0.00 | 0.00 |
| Nationale | non | non | 9.00 | 0.00 |
| Nationale | non | oui | 24.00 | 15.00 |
| Nationale | oui | non | 0.00 | 0.00 |
| Nationale | oui | oui | 15.00 | 15.00 |
| Internationale | non | non | 25.00 | 25.00 |
| Internationale | non | oui | non livrable | non livrable |
| Internationale | oui | non | 0.00 | 0.00 |
| Internationale | oui | oui | non livrable | non livrable |

## Bugs injectables (`data/mutants.js`)

| Mutant | Ambiguïté liée | Technique qui devrait l'attraper |
|---|---|---|
| `livraison-seuil` | A1 | Valeurs limites (99.99 / 100.00) |
| `livraison-seuil-international` | A2 | Table de décision (international × panier ≥ 100) |
| `livraison-premium-international` | A4 | Table de décision (international × premium) |
| `livraison-volumineux-premium` | A3 | Table de décision (premium × volumineux × zone ≠ locale) |
| `livraison-international-volumineux` | A5 | Table de décision (international × volumineux) |
