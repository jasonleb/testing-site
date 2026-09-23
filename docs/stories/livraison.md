# US-LIVR-01 — Calcul des frais de livraison

**En tant que** client de la boutique,
**je veux** connaître les frais de livraison de ma commande avant de payer,
**afin de** ne pas avoir de mauvaise surprise au moment du paiement.

## Contexte

Les frais dépendent de l'endroit où le colis est livré. Pour encourager les grosses commandes et fidéliser nos meilleurs clients, certaines livraisons sont offertes.

## Règles de gestion

1. Les frais de base sont de CHF 5.00 en zone locale, CHF 9.00 en zone nationale et CHF 25.00 à l'international.
2. La livraison est offerte à partir de CHF 100 d'achat.
3. Les clients premium ne paient jamais la livraison.
4. Les colis volumineux entraînent un supplément de CHF 15.00.
5. Les colis volumineux ne peuvent pas être livrés partout.

## Critères d'acceptation

- **CA1** — Étant donné un panier de CHF 50 livré en zone nationale, quand le client calcule les frais, alors CHF 9.00 sont affichés.
- **CA2** — Étant donné un panier de CHF 150 livré en zone locale, quand le client calcule les frais, alors la livraison est gratuite.
- **CA3** — Étant donné un client premium, quand il calcule les frais, alors la livraison est gratuite.
- **CA4** — Étant donné un colis volumineux, quand le client calcule les frais, alors le supplément est ajouté au total.

## Hors périmètre

- Délais de livraison et choix du transporteur.
- Codes promotionnels.
