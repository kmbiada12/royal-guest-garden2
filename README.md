# Royal Guest Garden — site vitrine

Site statique pour un hôtel fictif de Douala (Cameroun) : **12 chambres**, **9 services**,
réservation et demandes de devis centralisées sur **WhatsApp**.

Aucune dépendance, aucun build, aucun backend : du HTML, du CSS et du JavaScript natif.

---

## Démarrer

Le site utilise des chemins relatifs et fonctionne depuis n'importe quel serveur
statique. Ouvrir `index.html` directement sur le disque fonctionne également
(pour `room.html`, préférer un petit serveur afin que les liens de détail se
comportent comme en production).

```bash
# au choix
python -m http.server 8000
npx serve .
php -S localhost:8000
```

Puis ouvrir <http://localhost:8000>.

---

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : hero, avantages, chambres mises en avant, aperçu des services, témoignages |
| `rooms.html` | Catalogue complet : filtres combinés, tri, compteur, état vide |
| `room.html` | Fiche d'une chambre via `?id=…` : galerie, équipements, inclusions, similaires |
| `services.html` | Les 9 services : informations ou devis, FAQ, prestations incluses |
| `about.html` | Histoire, chronologie, galerie avec visionneuse, équipe, engagements |
| `contact.html` | Formulaire validé : aperçu du message, envoi WhatsApp, copie de secours |

`room.html` lit le paramètre `id` de l'URL. Sans paramètre valide, la page affiche
un état « chambre introuvable » avec liens de retour, jamais une page vide.

---

## Configuration

Tout se règle dans **`js/config.js`**. C'est le seul fichier à modifier pour mettre
le site en production.

### Numéro WhatsApp (à changer en priorité)

```js
whatsappNumber: '237699000000',  // indicatif pays + numéro, chiffres uniquement
whatsappIsPlaceholder: true,
```

Remplacez par le vrai numéro international de l'hôtel, **sans `+`, sans espaces et
sans tirets**, puis passez `whatsappIsPlaceholder` à `false`.

Le numéro est utilisé à deux endroits seulement (liens `wa.me` de l'en-tête, du
pied de page, du bouton flottant, et des formulaires) : aucune autre valeur
similaire n'est codée en dur dans le site.

### Autres réglages

| Bloc | Contenu |
|---|---|
| `hotelName`, `hotelTagline`, `hotelBaseline` | Identité affichée |
| `address`, `contact`, `geo` | Coordonnées, téléphone, e-mails, lien carte |
| `currency` | Formatage FCFA (espace fine insécable) |
| `booking` | Horaires d'arrivée/départ, annulation, acompte |
| `demoContentNotice`, `availabilityNotice`, … | Mentions affichées |
| `nav` | Liens de navigation injectés dans l'en-tête et le pied de page |

---

## Contenu des chambres et des services

- **`js/data.js`** — les 12 chambres (prix, capacité, lits, surface, équipements,
  galerie photo, petit-déjeuner, taxe, inclusions, non-inclusions).
- **`js/data-services.js`** — les 9 services, les témoignages, les engagements,
  l'équipe et la galerie de l'hôtel.

Les identifiants de chambre doivent être uniques et stables : ils apparaissent dans
les liens `room.html?id=…` et dans les messages WhatsApp.

---

## Scripts

Chargés dans cet ordre sur toutes les pages :

| Script | Rôle |
|---|---|
| `js/config.js` | Configuration (voir ci-dessus) |
| `js/data.js` | Catalogue des chambres |
| `js/data-services.js` | Services et contenus éditoriaux |
| `js/helpers.js` | Filtres, calculs, formatage, messages WhatsApp (espace de noms `RGG`) |
| `js/render.js` | Cartes et fragments HTML réutilisables |
| `js/app.js` | En-tête, pied de page, menu mobile, modale de réservation, visionneuse |
| `js/page-*.js` | Logique spécifique à une page |

L'en-tête, le pied de page, le bouton WhatsApp flottant et le bouton « retour en haut »
sont injectés par `js/app.js` dans les emplacements `#site-header`, `#site-footer`
et `#site-floating` : ces emplacements doivent exister sur chaque page.

`js/app.js` émet l'événement `rgg:ready` une fois l'interface montée.

---

## Réservation et WhatsApp

Aucune réservation n'est enregistrée par le site : le formulaire prépare un message
que le client relit et envoie lui-même dans WhatsApp.

1. Validation des champs : nom, téléphone, dates, voyageurs, capacité de la chambre,
   entiers positifs, date de départ postérieure à l'arrivée.
2. Calcul de l'estimation : **tarif par nuit × nombre de nuits × nombre de chambres**.
3. Message pré-rempli récapitulant la chambre, la référence, les dates, les voyageurs,
   l'estimation et les demandes particulières, avec un lien vers la fiche de la chambre.
4. Deux'issue possibles : ouverture de WhatsApp, ou copie du message dans le presse-papiers
   si l'ouverture est bloquée.

La confirmation n'est jamais promises par le site : seul l'hôtel répond.

**Aucune donnée personnelle n'est stockée** — pas de `localStorage`, pas de
`sessionStorage`, pas de cookie, aucun envoi réseau autre que WhatsApp et le chargement
des polices et des photos.

---

## Images et polices

Photos : [Unsplash](https://unsplash.com) via `images.unsplash.com`.
Polices : Google Fonts (Playfair Display, Inter).

Si une image ne se charge pas, un dégradé sobre prend sa place
(`js/helpers.js` → `attachImageFallback`). Un site en ligne peut remplacer ces
adresses par ses propres visuels dans `js/data.js`.

---

## Vérifications

```bash
node tools/run-all.js       # lance les cinq suites ci-dessous
```

| Suite | Contrôle |
|---|---|
| `tools/check-data.js` | Nombre et unicité des chambres, filtres combinés, tris, calcul de nuits et de total, contenu des messages WhatsApp, échappement HTML |
| `tools/check-url.js` | Lecture du paramètre `?id=`, cas invalides, identifiants hostiles, messages des 12 chambres |
| `tools/check-html.js` | Équilibre des balises, présence d'un seul `<h1>`, slots partagés, existence des scripts, `lang`, `viewport` |
| `tools/check-pages.js` | Chargement des scripts, ancres attendues par chaque script, champs du formulaire, liens internes valides |
| `tools/check-css.js` | Classes utilisées en HTML et en JS présentes dans la feuille de style, variables CSS toutes définies |
| `tools/check-text.js` | Caractères corrompus (U+FFFD, CJK, cyrillique) et mots anglais résiduels dans le texte destiné au lecteur |

Une suite peut aussi être lancée seule, par exemple `node tools/check-data.js`.
Code de sortie `0` si tout passe, `1` sinon.

Ces vérifications s'exécutent en Node.js sans navigateur ni dépendance à installer.

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