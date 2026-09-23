# US-TARIF-01 — Réponses du PO (corrigé)

> ⚠️ Corrigé : ce fichier ne doit **pas** être fourni en entrée au testeur ou à l'agent.
> Il sert à évaluer la qualité de la revue de story et des tests conçus.

## Ambiguïtés volontaires de la story

| # | Où | Question attendue | Réponse du PO |
|---|---|---|---|
| A1 | Règle 1 | Jusqu'à quel âge est-on « enfant » ? | De 0 à 5 ans inclus. |
| A2 | Règle 3 | « Jeunes jusqu'à 25 ans » : à partir de quel âge ? 25 inclus ? | De 16 à 25 ans inclus. |
| A3 | Règle 4 | À partir de quel âge est-on senior ? | 65 ans inclus. |
| A4 | Règle 5 | La réduction membre s'additionne ou se multiplie avec la réduction d'âge ? | Elle s'additionne (Jeune membre = 25 + 20 = 45 %). |
| A5 | Règle 6 | Le plafond de 50 % s'applique-t-il aux enfants gratuits ? | Non. Un enfant reste gratuit, membre ou non. |
| A6 | Contexte | Comment le prix est-il arrondi ? | Aux 5 centimes les plus proches (arrondi suisse). |
| A7 | CA4 | Qu'est-ce qu'un âge invalide ? | Vide, non entier, négatif ou supérieur à 120. |
| A8 | Règle 5 | Un adulte (26–64) membre a-t-il droit aux 20 % ? | Oui. |

## Règles consolidées

| Âge | Catégorie | Réduction d'âge |
|---|---|---|
| 0 – 5 | Enfant | 100 % (gratuit, sans condition) |
| 6 – 15 | Junior | 50 % |
| 16 – 25 | Jeune | 25 % |
| 26 – 64 | Adulte | 0 % |
| 65 – 120 | Senior | 30 % |

- Membre : +20 points de réduction, additionnés.
- Réduction totale plafonnée à 50 % (sauf gratuité enfant).
- Prix = 89.90 × (1 − réduction), arrondi aux 5 centimes les plus proches.

## Valeurs de référence (oracle)

| Âge | Membre | Réduction | Prix (CHF) |
|---|---|---|---|
| 5 | oui | 100 % | 0.00 |
| 6 | non | 50 % | 44.95 |
| 15 | oui | 50 % (plafond) | 44.95 |
| 16 | non | 25 % | 67.45 |
| 25 | oui | 45 % | 49.45 |
| 26 | non | 0 % | 89.90 |
| 30 | oui | 20 % | 71.90 |
| 64 | non | 0 % | 89.90 |
| 65 | non | 30 % | 62.95 |
| 65 | oui | 50 % (plafond) | 44.95 |

## Bugs injectables (`data/mutants.js`)

| Mutant | Ambiguïté liée | Technique qui devrait l'attraper |
|---|---|---|
| `tarif-borne-16` | A2 | Valeurs limites (15/16) |
| `tarif-borne-65` | A3 | Valeurs limites (64/65) |
| `tarif-plafond` | — | Combinaisons âge × membre |
| `tarif-arrondi` | A6 | Oracle de calcul (16 ans → 67.45) |
| `tarif-age-negatif` | A7 | Partitions invalides |
| `tarif-enfant-membre` | A5 | Table de décision (enfant × membre) |
