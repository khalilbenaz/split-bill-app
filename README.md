# Split Bill

Partagez vos dépenses entre amis, famille ou collègues. Calculez automatiquement les soldes et obtenez un plan de remboursement simplifié. 100% navigateur, aucune donnée envoyée en ligne.

## Fonctionnalités

- **Gestion des participants** — ajoutez ou supprimez des personnes en un clic
- **Ajout de dépenses** — libellé, montant, payeur et répartition configurable (par défaut : tous)
- **Soldes automatiques** — chaque personne voit ce qu'elle a payé, sa part et son solde net
- **Règlement simplifié** — algorithme de minimisation des transferts (moins de virements possibles)
- **Total du groupe** et part moyenne par personne
- **Persistance localStorage** — vos données restent entre les sessions
- **Données d'exemple** — 3 participants et 4 dépenses préchargés au premier lancement
- **Formatage euros** — via `Intl.NumberFormat` en locale `fr-FR`
- **UI responsive** — onglets sur mobile, double colonne sur desktop
- **Accessibilité** — labels ARIA, navigation clavier

## Installation et démarrage

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur.

## Build de production

```bash
npm run build
```

Les fichiers compilés se trouvent dans `dist/`.

## Déploiement sur Cloudflare Pages

```bash
npm run deploy
```

Requiert un compte Cloudflare et que `wrangler` soit configuré (`wrangler login`).

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework UI | React 18 + TypeScript |
| Build | Vite 5 |
| Style | Tailwind CSS v3 |
| Police | Inter (Google Fonts) |
| Déploiement | Cloudflare Pages (Wrangler) |
| Persistance | localStorage |
| Aucune dépendance externe | Parseurs et algorithmes maison |

## Algorithme de remboursement

Le règlement simplifié utilise un algorithme glouton :

1. Calcul du solde net de chaque personne (`payé − part due`)
2. Séparation en créditeurs (solde > 0) et débiteurs (solde < 0)
3. Matching itératif en minimisant le nombre de transferts

## Licence

MIT — voir le fichier `LICENSE`.
