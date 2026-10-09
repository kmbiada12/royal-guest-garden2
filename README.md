# Royal Guest Garden — site vitrine

Site statique pour un hôtel fictif de Douala (Cameroun) : **10 chambres**, **9 services**,
réservation et demandes de devis centralisées sur **WhatsApp**.

Aucune dépendance, aucun build : du HTML, du CSS et du JavaScript natif. Le contenu
(chambres, services, textes) est servi par **Supabase** quand il est disponible, sinon
par les fichiers `js/config.js` et `js/data.js` (voir « Backend Supabase et Docker »).

---

## Démarrer

Le site utilise des chemins relatifs et fonctionne depuis n'importe quel serveur
statique. Ouvrir `index.html` directement sur le disque fonctionne également
(pour `room.html`, préférer un petit serveur afin que les liens de détail se
comportent comme en production).

```bash
# au choix
node preview.js
python -m http.server 3002
npx serve . -l 3002
php -S localhost:3002
```

Puis ouvrir <http://localhost:3002>.

**Aperçu local du back-office** (même adresse qu'en production) :

```powershell
.\start-local.ps1            # base Supabase locale (Docker) doit tourner
node tools/build-vercel.mjs  # compile le back-office sous /admin
node preview.js              # → http://localhost:3002/admin
```

---

## Backend Supabase et Docker

Prérequis : **Docker Desktop**, **Supabase CLI**, **Node.js 18+**.

```powershell
.\start-local.ps1            # base Supabase + site dans Docker
.\start-local.ps1 -Rebuild   # après une modification des fichiers du site
.\stop-local.ps1             # arrêt (les données sont conservées)
```

| Service | Adresse |
|---|---|
| Site (nginx, conteneur `rgg2-web`) | <http://localhost:3003> |
| Supabase Studio (tables, contenu) | <http://127.0.0.1:54323> |
| API Supabase | <http://127.0.0.1:54321> |
| E-mails locaux (Mailpit) | <http://127.0.0.1:54324> |

`node preview.js` (port 3002) reste disponible pour travailler sans reconstruire
l'image : il sert les fichiers du disque directement.

### Comment le site obtient son contenu

`js/supabase-loader.js` appelle la fonction publique `get_site()` (clé publique
`anon`, réglée dans `js/supabase-config.js`), puis remplit `RGG_CONFIG` et `RGG_DATA`
avant le premier rendu. Une copie est gardée dans le navigateur (1 heure) : les
visites suivantes s'affichent immédiatement, et la copie est rafraîchie en
arrière-plan — les modifications publiées dans le back-office apparaissent donc
sous une heure. Si Supabase ne répond pas, le site utilise `js/config.js` et
`js/data.js`.

En production, renseignez `cloud.url` et `cloud.anonKey` dans
`js/supabase-config.js`. **Ne mettez jamais la clé `service_role` dans le site.**

### Base de données

| Dossier / outil | Rôle |
|---|---|
| `supabase/migrations/` | Schéma, contrôles de contenu, sécurité (RLS), API, tâches planifiées |
| `supabase/seed.sql` | Contenu initial, **généré** : `node tools/build-seed.js` (depuis `js/config.js` + `js/data.js`) |
| `supabase/tests/` | Tests pgTAP : `supabase test db` |
| `supabase db reset` | Recrée la base locale (migrations + seed) — **efface les modifications faites dans Studio** |

La base refuse le contenu invalide : texte bilingue sans français, image hors de
`img/` ou non `https://`, lien de carte ou WhatsApp non `https://`, équipement
inconnu, chambre sans photo.

### Comptes du personnel

L'inscription publique est désactivée. Créer le premier compte admin :

```powershell
node tools/create-admin.js prenom.nom@exemple.cm               # admin
node tools/create-admin.js prenom.nom@exemple.cm --role editor # éditeur (contenu seul)
```

Le mot de passe généré s'affiche une seule fois. Rôles : **editor** = contenu,
**admin** = tout (personnel, réglages, données personnelles). Le dernier admin ne
peut être ni supprimé ni rétrogradé.

---

## Back-office (`admin/`)

Application React + Vite + TypeScript, en français, pour gérer le site sans passer
par Supabase Studio. Conteneur Docker sur <http://localhost:3004> (lancé par
`start-local.ps1`).

| Rubrique | Qui | Contenu |
|---|---|---|
| Tableau de bord | tous | Compteurs, brouillons, traductions anglaises manquantes |
| Contenu | éditeur + admin | Chambres, catégories, équipements, services, avantages, témoignages, valeurs, expériences, équipe, galerie — FR/EN côte à côte, publication, ordre, photos |
| Réglages du site | admin | Coordonnées, WhatsApp, règles de réservation, mention démo, bannières |
| Réservations, Messages, Prospects | admin | Demandes des clients : statut, notes internes, suppression des données |
| Personnel | admin | Invitations, rôles, retrait d'accès (Edge Function `staff-admin`) |
| Journal d'audit | admin | Historique des modifications |
| Mon compte | tous | Mot de passe, double authentification (TOTP) |

Les images envoyées sont redimensionnées (2000 px max), converties en WebP et
débarrassées de leurs métadonnées dans le navigateur, puis stockées dans le
bucket `site-images`.

**En production, le back-office est servi sur le même domaine que le site,
sous `/admin`** (par ex. <https://www.royalguestgarden.cm/admin>) — voir
« Mise en ligne » ci-dessous. Le guide destiné à l'équipe de l'hôtel est
[`GUIDE-ADMINISTRATION.md`](GUIDE-ADMINISTRATION.md).

Développement :

```powershell
cd admin
npm install
npm run dev       # http://localhost:5173 (rechargement à chaud)
npm run check     # vérification des types + tests (Vitest) + build
npm run gen-types # régénère src/lib/database.types.ts après une migration
```

Variables (publiques) : `admin/.env.example`. Les invitations et liens de mot de
passe locaux arrivent dans Mailpit (<http://127.0.0.1:54324>).

**Edge Functions sous Windows :** après une modification de
`supabase/functions/…`, redémarrez le conteneur
`supabase_edge_runtime_royal-guest-garden2` (les changements de fichiers ne sont
pas détectés).

---

## Mise en ligne (production)

Architecture cible : **un seul domaine** — le site public à la racine
(<https://www.royalguestgarden.cm>) et le back-office sous
**`/admin`** (<https://www.royalguestgarden.cm/admin>) — hébergés sur
**Vercel**, avec **Supabase cloud** comme backend. L'équipe de l'hôtel
n'a besoin d'aucun outil technique : elle ouvre l'adresse `/admin` et se
connecte (voir [`GUIDE-ADMINISTRATION.md`](GUIDE-ADMINISTRATION.md)).

### 1. Projet Supabase cloud

1. Créer le projet (région **eu-west-3**, Paris) puis récupérer l'URL et
   les clés dans *Project Settings → API*.
2. Appliquer les migrations : `supabase link --project-ref <ref>` puis
   `supabase db push`.
3. Charger le contenu initial : exécuter `supabase/seed.sql` dans le
   *SQL Editor* du tableau de bord.
4. *Authentication* : désactiver « Allow new users to sign up », régler
   l'URL du site sur `https://www.royalguestgarden.cm/admin`, ajouter les
   URLs de redirection et traduire les modèles d'e-mails (invitation,
   réinitialisation) en français.
5. Déployer l'Edge Function du personnel :

   ```powershell
   supabase functions deploy staff-admin
   supabase secrets set ADMIN_URL=https://www.royalguestgarden.cm/admin
   supabase secrets set ADMIN_ORIGINS=https://www.royalguestgarden.cm
   ```

6. Créer le premier compte administrateur :

   ```powershell
   $env:SUPABASE_URL="https://<ref>.supabase.co"
   $env:SUPABASE_SERVICE_ROLE_KEY="<clé service_role>"
   node tools/create-admin.js prenom.nom@exemple.cm
   ```

   Le mot de passe s'affiche une seule fois ; la clé `service_role` ne
   doit jamais apparaître dans le site ni dans Vercel.

### 2. Site et back-office sur Vercel

1. Importer le dépôt dans Vercel (racine du projet = racine du dépôt).
   `vercel.json` fait le reste :
   - `tools/build-vercel.mjs` compile le back-office (base `/admin/`) et
     assemble `.vercel-static/` : site à la racine, back-office sous
     `/admin` ;
   - réécriture SPA `/admin/*` → `/admin/index.html` ;
   - en-têtes de sécurité (CSP, HSTS…) et cache immutable des assets
     du back-office.
2. Variables d'environnement Vercel (Production) :
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `VITE_SITE_URL=https://www.royalguestgarden.cm` — le build **refuse**
   de compiler sans elles.
3. Renseigner `cloud.url` et `cloud.anonKey` dans `js/supabase-config.js`
   (clés **publiques** uniquement) pour que le site charge son contenu
   depuis Supabase.
4. Ajouter le domaine dans *Settings → Domains* et régler le DNS.

### 3. Après la mise en ligne

- Accompagner l'équipe avec `GUIDE-ADMINISTRATION.md` : changement du
  mot de passe, activation de la 2FA, vérification du **numéro WhatsApp**
  (placeholder à remplacer), désactivation du **mode démo**.
- Vérifier : le site charge depuis Supabase (`RGG_CONTENT_SOURCE` dans la
  console), `/admin` répond, une modification publiée apparaît sur le
  site sous une heure.
- Les sauvegardes : Supabase cloud sauvegarde quotidiennement selon le
  plan ; un `pg_dump` manuel reste possible et documenté.

---

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : hero, avantages, chambres mises en avant, aperçu des services, témoignages |
| `rooms.html` | Catalogue complet : filtres combinés, tri, compteur, état vide |
| `room.html` | Fiche d'une chambre via `?id=…` : galerie, équipements, inclusions, similaires |
| `services.html` | Les 6 services : informations ou devis, FAQ, prestations incluses |
| `about.html` | Histoire, chronologie, galerie avec visionneuse, équipe, engagements |
| `contact.html` | Formulaire validé : aperçu du message, envoi WhatsApp, copie de secours |

`room.html` lit le paramètre `id` de l'URL. Sans paramètre valide, la page affiche
un état « chambre introuvable » avec liens de retour, jamais une page vide.

---

## Configuration

Tout se règle dans **`js/config.js`** (contenu de secours affiché quand
Supabase ne répond pas) — en production, les mêmes réglages se modifient
depuis le back-office (**Réglages**) et sont servis par Supabase.

### Numéro WhatsApp (à changer en priorité)

```js
whatsapp: {
  number: '237691491948',   // ⚠ PLACEHOLDER — indicatif pays + numéro, chiffres uniquement
  numberAlt: '237683069047',
  bookingNumber: null,       // null = utilise `number`
  baseUrl: 'https://wa.me/'
}
```

Remplacez par le vrai numéro international de l'hôtel, **sans `+`, sans espaces
et sans tirets**. En production, ce numéro se règle aussi dans le back-office
(Réglages → WhatsApp) sans toucher au code.

Le numéro est utilisé à deux endroits seulement (liens `wa.me` de l'en-tête, du
pied de page, du bouton flottant, et des formulaires) : aucune autre valeur
similaire n'est codée en dur dans le site.

### Autres réglages

| Bloc | Contenu |
|---|---|
| `hotel` | Identité, adresse (Yaoundé), téléphones, e-mails, lien carte, points de repère |
| `currency` | Formatage FCFA (code, libellé, décimales) |
| `booking` | Horaires d'arrivée/départ, nuits min/max, politiques (arrivée, garantie, paiement, annulation, identité) |
| `demo` | Mention « contenu de démonstration » (badge + bandeau) — à désactiver en production |
| `site` | Langues disponibles (`fr`, `en`), langue par défaut, clé de mémorisation de la langue |

---

## Contenu des chambres et des services

- **`js/data.js`** — les 10 chambres (prix, capacité, lits, surface, équipements,
  galerie photo, petit-déjeuner, taxe, inclusions, non-inclusions).
- **`js/data-services.js`** — les 9 services, les témoignages, les engagements,
  l'équipe et la galerie de l'hôtel.

Les identifiants de chambre doivent être uniques et stables : ils apparaissent dans
les liens `room.html?id=…` et dans les messages WhatsApp.

---

## Scripts

Chargés dans cet ordre sur toutes les pages (tous avec `defer`) :

| Script | Rôle |
|---|---|
| `js/config.js` | Configuration (voir ci-dessus) |
| `js/i18n.js` | Dictionnaires FR/EN, sélecteur de langue, attributs `data-i18n` |
| `js/data.js` | Catalogue complet (chambres, services, témoignages, équipe, galerie) |
| `js/supabase-config.js` | Adresses et clés publiques Supabase (local + cloud) |
| `js/supabase-loader.js` | Charge le contenu depuis `get_site()` avec cache navigateur et repli statique |
| `js/helpers.js` | Filtres, calculs, formatage, messages WhatsApp (espace de noms `RGG`) |
| `js/icons.js` | Icônes SVG (espace de noms `RGG_ICONS`) |
| `js/cards.js` | Cartes et fragments HTML réutilisables |
| `js/whatsapp.js` | Liens et messages WhatsApp (en-tête, pied de page, bouton flottant) |
| `js/layout.js` | En-tête, pied de page, bouton flottant, bouton « retour en haut » (injectés dans `#site-header`, `#site-footer`, `#site-floating`) |
| `js/lightbox.js` | Visionneuse plein écran des photos |
| `js/booking.js` | Modale de réservation |
| `js/main.js` | Point d'entrée commun : montage de l'interface, traductions, titre/description par page |
| `js/page-*.js` | Logique spécifique à chaque page |

Les scripts de page s'inscrivent via `RGG.onLanguageChange(fn)` pour se
redessiner au changement de langue ; le premier rendu attend
`RGG_ON_READY` (contenu réglé + DOM prêt).

---

## Réservation et WhatsApp

Aucune réservation n'est enregistrée par le site : le formulaire prépare un message
que le client relit et envoie lui-même dans WhatsApp.

1. Validation des champs : nom, téléphone, dates, voyageurs, capacité de la chambre,
   entiers positifs, date de départ postérieure à l'arrivée.
2. Calcul de l'estimation : **tarif par nuit × nombre de nuits × nombre de chambres**.
3. Message pré-rempli récapitulant la chambre, la référence, les dates, les voyageurs,
   l'estimation et les demandes particulières, avec un lien vers la fiche de la chambre.
4. Deux issues possibles : ouverture de WhatsApp, ou copie du message dans le presse-papiers
   si l'ouverture est bloquée.

La confirmation n'est jamais promises par le site : seul l'hôtel répond.

**Aucune donnée personnelle n'est stockée.** Le seul `localStorage` du site
public contient la langue choisie et une copie du contenu public (chambres,
services, textes) pour afficher les pages plus vite — jamais de saisie client.
Aucun envoi réseau autre que Supabase (contenu public), WhatsApp et le
chargement des polices et des photos.

---

## Images et polices

Photos : [Unsplash](https://unsplash.com) via `images.unsplash.com`.
Polices : Google Fonts (Playfair Display, Inter).

Si une image ne se charge pas, un dégradé sobre prend sa place
(`js/helpers.js` → `attachImageFallback`). Un site en ligne peut remplacer ces
adresses par ses propres visuels dans `js/data.js`.

---

## Vérifications

```powershell
# Back-office : types TypeScript + tests (Vitest) + build
cd admin ; npm run check

# Base locale : tests pgTAP (RLS, get_site(), gardes de contenu)
supabase test db

# Depuis la racine du dépôt :
node tools/build-seed.js    # régénère supabase/seed.sql depuis js/config.js + js/data.js
node tools/build-vercel.mjs # essai local de l'assemblage production (site + /admin)
```

| Suite | Contrôle |
|---|---|
| `tools/check-data.js` | Nombre et unicité des chambres, filtres combinés, tris, calcul de nuits et de total, contenu des messages WhatsApp, échappement HTML |
| `tools/check-url.js` | Lecture du paramètre `?id=`, cas invalides, identifiants hostiles, messages des 10 chambres |
| `tools/check-html.js` | Équilibre des balises, présence d'un seul `<h1>`, slots partagés, existence des scripts, `lang`, `viewport` |
| `tools/check-pages.js` | Chargement des scripts, ancres attendues par chaque script, champs du formulaire, liens internes valides |
| `tools/check-css.js` | Classes utilisées en HTML et en JS présentes dans la feuille de style, variables CSS toutes définies |
| `tools/check-text.js` | Caractères corrompus (U+FFFD, CJK, cyrillique) et mots anglais résiduels dans le texte destiné au lecteur |

Une suite peut aussi être lancée seule, par exemple `node tools/check-data.js`.
Code de sortie `0` si tout passe, `1` sinon.

Ces vérifications s'exécutent en Node.js sans navigateur ni dépendance à installer.

Le back-office compilé sans variables (`VITE_SUPABASE_URL`…) reste utilisable
en local mais affiche une erreur claire au navigateur ; sur Vercel, le script
d'assemblage **refuse** de compiler si les variables cloud manquent.

---

## Accessibilité

Navigation au clavier complète, lien d'évitement, `aria-*` sur les composants
dynamiques, focus déplacé à l'ouverture des modales et restitué à la fermeture,
gestion d'Échap, contrastes conformes, respect de
`prefers-reduced-motion`, libellés explicites pour chaque image de contenu.

---

## Contenu de démonstration

Tarifs, disponibilités, photos, témoignages, informations et profils d'équipe sont
des contenus d'illustration. Ils doivent être remplacés par les informations réelles
avant la mise en ligne, ainsi que les coordonnées, le numéro WhatsApp et les
conditions de réservation.

---

## Licence

Contenu de démonstration fourni pour un projet de présentation.