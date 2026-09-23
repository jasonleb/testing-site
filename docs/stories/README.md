# User stories des défis « Règles métier »

Chaque défi de la catégorie **Règles métier** est accompagné de deux fichiers :

| Fichier | Rôle |
|---|---|
| `<defi>.md` | La user story **telle qu'un PO l'écrirait** : volontairement incomplète et ambiguë par endroits. C'est l'entrée donnée à un testeur (ou à un agent) pour concevoir les tests. |
| `<defi>.reponses-po.md` | Les réponses du PO aux questions qu'une bonne revue de story (Three Amigos) devrait soulever, plus la liste des ambiguïtés volontaires. Sert de **corrigé** : ne pas le donner en entrée. |

Les bugs injectables correspondants sont décrits dans `data/mutants.js` et s'activent avec la variable d'environnement `MUTANT` (voir le README principal).
