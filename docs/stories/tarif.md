# US-TARIF-01 — Calcul du tarif d'abonnement annuel

**En tant que** visiteur du site,
**je veux** connaître le prix de mon abonnement annuel en fonction de mon âge et de mon statut de membre,
**afin de** savoir combien je vais payer avant de m'inscrire.

## Contexte

L'abonnement annuel coûte **CHF 89.90**. Des réductions existent pour certaines catégories de clients afin de rendre l'offre accessible aux familles et aux personnes âgées.

## Règles de gestion

1. Les enfants sont gratuits.
2. Les juniors de 6 à 15 ans bénéficient de 50 % de réduction.
3. Les jeunes jusqu'à 25 ans bénéficient de 25 % de réduction.
4. Les seniors bénéficient de 30 % de réduction.
5. Les membres du club bénéficient de 20 % de réduction supplémentaire.
6. La réduction ne peut pas dépasser 50 %.

## Critères d'acceptation

- **CA1** — Étant donné un visiteur de 30 ans non membre, quand il calcule son tarif, alors le prix affiché est CHF 89.90.
- **CA2** — Étant donné un visiteur de 10 ans, quand il calcule son tarif, alors la catégorie « Junior » et une réduction de 50 % sont affichées.
- **CA3** — Étant donné un visiteur membre, quand il calcule son tarif, alors la réduction membre s'ajoute à sa réduction d'âge.
- **CA4** — Étant donné une saisie d'âge invalide, quand le visiteur calcule son tarif, alors un message d'erreur est affiché.

## Hors périmètre

- Paiement et inscription.
- Abonnements familiaux ou multi-personnes.
