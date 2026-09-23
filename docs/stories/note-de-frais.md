# US-FRAIS-01 — Workflow de validation des notes de frais

**En tant qu'**employé,
**je veux** déclarer mes notes de frais et suivre leur validation,
**afin d'**être remboursé rapidement.

## Contexte

Aujourd'hui les notes de frais circulent par e-mail et se perdent. L'outil doit formaliser le circuit : l'employé déclare, son manager valide, la comptabilité rembourse.

Utilisateurs de démonstration : Alice (employée), Bob (manager), Chloé (comptable).

## Règles de gestion

1. Un employé crée une note de frais avec un libellé et un montant. Elle est d'abord en brouillon.
2. L'employé soumet sa note quand elle est complète.
3. Le manager approuve ou rejette les notes soumises.
4. La comptabilité paie les notes.
5. Une note rejetée peut être corrigée.

## Critères d'acceptation

- **CA1** — Étant donné une note en brouillon, quand son auteur la soumet, alors elle passe à l'état « Soumise ».
- **CA2** — Étant donné une note soumise, quand le manager l'approuve, alors elle passe à l'état « Approuvée ».
- **CA3** — Étant donné une note approuvée, quand la comptabilité la paie, alors elle passe à l'état « Payée ».
- **CA4** — Étant donné une note soumise, quand le manager la rejette, alors elle passe à l'état « Rejetée ».

## Hors périmètre

- Pièces justificatives (upload).
- Plafonds par catégorie de dépense.
- Notifications par e-mail.
