# Rendez-vous - Réservation de créneaux avec les communes

Petite application web permettant à 10 communes de réserver un créneau de
rendez-vous (45 min) à partir d'un simple lien, sans double réservation
possible.

## Fonctionnement

- `/` : page publique listant les créneaux disponibles, regroupés par jour.
  Un clic ouvre un formulaire (nom de la commune, contact, email,
  téléphone) puis confirme la réservation. Le créneau disparaît
  immédiatement pour les autres visiteurs.
- `/admin?key=VOTRE_CLE` : vue réservée à l'organisateur listant toutes les
  réservations.

Les créneaux sont définis dans `data/slots.js`. Les réservations sont
stockées dans `data/bookings.json` (créé automatiquement, non versionné).

## Lancer en local

```bash
npm install
npm start
```

L'application démarre sur http://localhost:3000 (page publique) et
http://localhost:3000/admin?key=changeme (admin).

## Configuration

Variables d'environnement (optionnelles) :

- `PORT` : port d'écoute (défaut `3000`)
- `ADMIN_KEY` : clé secrète pour accéder à `/admin` (défaut `changeme`,
  **à changer avant tout partage du lien public**)

## Déployer pour obtenir un lien public

Cette appli est un simple serveur Node/Express avec stockage dans un
fichier JSON local : il faut donc un hébergeur avec un disque persistant
(pas une plateforme purement "serverless" comme Vercel, qui réinitialise
le système de fichiers à chaque requête).

Options simples et gratuites/peu chères :

1. **Railway** ou **Render** (Web Service) : connectez le dépôt GitHub,
   commande de démarrage `npm start`, ajoutez la variable d'environnement
   `ADMIN_KEY`, et activez un volume/disque persistant pour le dossier
   `data/`.
2. Un petit VPS : `git clone`, `npm install`, puis lancer avec `pm2` ou un
   service systemd.

Une fois déployée, l'URL publique (ex. `https://xxx.up.railway.app/`) est
le lien à envoyer aux 10 communes.

## Modifier les créneaux

Éditez la liste `DAYS` dans `data/slots.js` (dates, libellés, heures de
début). La durée des rendez-vous se règle via `DURATION_MIN` dans le même
fichier.
