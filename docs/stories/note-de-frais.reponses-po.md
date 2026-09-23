# US-FRAIS-01 — Réponses du PO (corrigé)

> ⚠️ Corrigé : ce fichier ne doit **pas** être fourni en entrée au testeur ou à l'agent.
> Il sert à évaluer la qualité de la revue de story et des tests conçus.

## Ambiguïtés volontaires de la story

| # | Où | Question attendue | Réponse du PO |
|---|---|---|---|
| A1 | Règle 3 | Un manager peut-il approuver sa propre note ? | Non, jamais (séparation des pouvoirs). |
| A2 | Règle 3 | Qui d'autre qu'un manager peut approuver ou rejeter ? | Personne. |
| A3 | Règle 3 | Un rejet doit-il être motivé ? | Oui, le motif est obligatoire et visible par l'auteur. |
| A4 | Règle 4 | La comptabilité peut-elle payer une note qui n'est pas approuvée ? | Non, uniquement les notes approuvées. |
| A5 | Règle 5 | Comment corriger une note rejetée ? Qui peut le faire ? | L'auteur la « reprend » : elle revient en brouillon, le motif est effacé, puis il la modifie et la resoumet. |
| A6 | Règle 2 | Peut-on modifier une note après l'avoir soumise ? | Non, seulement en brouillon. |
| A7 | Règle 1 | Un manager ou la comptabilité peuvent-ils créer des notes ? | Oui, tout utilisateur peut créer ses propres notes. |
| A8 | Règle 1 | Quelles sont les contraintes de saisie ? | Libellé obligatoire, 80 caractères max. Montant > 0 et ≤ CHF 10 000, 2 décimales max. |
| A9 | — | Que se passe-t-il pour une action interdite ou impossible ? | L'action n'est pas proposée dans l'interface. L'API répond 403 (rôle) ou 409 (état). |

## Diagramme d'états consolidé

```
            submit (auteur)           approve (manager ≠ auteur)        pay (comptable)
 Brouillon ─────────────────► Soumise ──────────────────────────► Approuvée ─────────────► Payée
     ▲                           │
     │ reopen (auteur)           │ reject + motif (manager ≠ auteur)
     └────────── Rejetée ◄───────┘

 edit (auteur) : uniquement en Brouillon
```

## Matrice rôles × actions (sur une note dans l'état requis)

| Action | État requis | Auteur | Manager (non auteur) | Comptable (non auteur) |
|---|---|---|---|---|
| Modifier | Brouillon | ✅ | ❌ | ❌ |
| Soumettre | Brouillon | ✅ | ❌ | ❌ |
| Approuver / Rejeter | Soumise | ❌ (même manager) | ✅ | ❌ |
| Reprendre | Rejetée | ✅ | ❌ | ❌ |
| Payer | Approuvée | ❌ sauf si comptable | ❌ | ✅ |

## Bugs injectables (`data/mutants.js`)

| Mutant | Ambiguïté liée | Technique qui devrait l'attraper |
|---|---|---|
| `frais-payer-rejetee` | A4 | Transitions invalides (Rejetée → Payée) |
| `frais-modif-soumise` | A6 | Transitions invalides (modifier en Soumise) |
| `frais-auto-approbation` | A1 | Matrice rôles × actions (manager auteur) |
| `frais-employe-approuve` | A2 | Matrice rôles × actions (employé) |
| `frais-rejet-sans-motif` | A3 | Partitions invalides (motif vide) |
