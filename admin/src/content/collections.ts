import { frText } from '@/lib/i18n';
import type { CollectionDef } from './types';

const published = { kind: 'bool', key: 'published', label: 'Publié sur le site', hint: 'Décoché : brouillon, invisible pour les visiteurs.' } as const;

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'chambres',
    table: 'rooms',
    title: 'Chambres',
    singular: 'chambre',
    pk: 'id',
    pkKind: 'slug',
    description: 'Les chambres du catalogue : tarifs, photos, équipements, textes FR/EN.',
    columns: [
      { kind: 'image', key: 'images', label: '', first: true },
      { kind: 'text', key: 'name', label: 'Nom' },
      { kind: 'text', key: 'ref', label: 'Réf.' },
      { kind: 'ref', key: 'category_id', label: 'Catégorie', table: 'room_categories' },
      { kind: 'xaf', key: 'price', label: 'Prix / nuit' },
      { kind: 'bool', key: 'featured', label: 'Accueil' }
    ],
    fields: [
      { kind: 'slug', key: 'id', label: 'Identifiant', hint: 'Utilisé dans l’adresse room.html?id=… — minuscules, chiffres, tirets. Non modifiable ensuite.' },
      { kind: 'text', key: 'name', label: 'Nom', maxLength: 80 },
      { kind: 'text', key: 'ref', label: 'Référence', hint: 'Ex. RGG-13 — unique.', maxLength: 30 },
      { kind: 'ref', key: 'category_id', label: 'Catégorie', table: 'room_categories' },
      { kind: 'int', key: 'price', label: 'Prix par nuit', suffix: 'FCFA', min: 0 },
      { kind: 'int', key: 'capacity', label: 'Capacité', suffix: 'personnes', min: 1, max: 20 },
      { kind: 'int', key: 'size', label: 'Surface', suffix: 'm²', min: 1, max: 1000 },
      { kind: 'i18n', key: 'beds', label: 'Literie' },
      { kind: 'i18n', key: 'floor', label: 'Étage / aile' },
      { kind: 'i18n', key: 'view', label: 'Vue' },
      { kind: 'i18n', key: 'short', label: 'Résumé (cartes du catalogue)', multiline: true, rows: 3 },
      { kind: 'i18n', key: 'description', label: 'Description complète', multiline: true, rows: 8 },
      { kind: 'amenities', key: 'amenity_ids', label: 'Équipements' },
      { kind: 'images', key: 'images', label: 'Photos', hint: 'La première photo est la couverture. Changez l’ordre avec ← →.' },
      { kind: 'bool', key: 'breakfast_included', label: 'Petit-déjeuner inclus' },
      { kind: 'i18n', key: 'breakfast_note', label: 'Note petit-déjeuner', multiline: true, rows: 2 },
      { kind: 'bool', key: 'tax_included', label: 'Taxes incluses dans le prix' },
      { kind: 'i18n', key: 'tax_note', label: 'Note taxes', multiline: true, rows: 2 },
      { kind: 'i18n', key: 'cancellation', label: 'Conditions d’annulation', multiline: true, rows: 2 },
      { kind: 'bool', key: 'featured', label: 'Mettre en avant sur l’accueil' },
      published
    ],
    defaults: { capacity: 2, size: 20, amenity_ids: [], images: [], published: false, featured: false },
    previewPath: (row) => `room.html?id=${encodeURIComponent(String(row.id))}`,
    titleOf: (row) => String(row.name ?? row.id ?? '')
  },
  {
    slug: 'categories',
    table: 'room_categories',
    title: 'Catégories de chambres',
    singular: 'catégorie',
    pk: 'id',
    pkKind: 'slug',
    description: 'Filtres « catégorie » du catalogue. Une catégorie dépubliée masque toutes ses chambres.',
    columns: [
      { kind: 'text', key: 'id', label: 'Identifiant' },
      { kind: 'i18n', key: 'label', label: 'Libellé' }
    ],
    fields: [
      { kind: 'slug', key: 'id', label: 'Identifiant', hint: 'Minuscules, chiffres, tirets. Non modifiable ensuite.' },
      { kind: 'i18n', key: 'label', label: 'Libellé' },
      published
    ],
    defaults: { published: true },
    previewPath: () => 'rooms.html',
    titleOf: (row) => frText(row.label)
  },
  {
    slug: 'equipements',
    table: 'amenities',
    title: 'Équipements',
    singular: 'équipement',
    pk: 'id',
    pkKind: 'slug',
    description: 'Équipements proposés dans les chambres (filtres du catalogue et fiches).',
    columns: [
      { kind: 'text', key: 'id', label: 'Identifiant' },
      { kind: 'i18n', key: 'label', label: 'Libellé' }
    ],
    fields: [
      { kind: 'slug', key: 'id', label: 'Identifiant', hint: 'Minuscules, chiffres, tirets. Non modifiable ensuite.' },
      { kind: 'i18n', key: 'label', label: 'Libellé' },
      published
    ],
    defaults: { published: true },
    previewPath: () => 'rooms.html',
    titleOf: (row) => frText(row.label)
  },
  {
    slug: 'services',
    table: 'services',
    title: 'Services',
    singular: 'service',
    pk: 'id',
    pkKind: 'slug',
    description: 'Hébergement, restaurant, piscine… avec horaires et tarifs.',
    columns: [
      { kind: 'image', key: 'image', label: '' },
      { kind: 'i18n', key: 'title', label: 'Service' },
      { kind: 'text', key: 'inquiry', label: 'Demande' }
    ],
    fields: [
      { kind: 'slug', key: 'id', label: 'Identifiant', hint: 'Minuscules, chiffres, tirets. Non modifiable ensuite.' },
      { kind: 'i18n', key: 'title', label: 'Nom du service' },
      { kind: 'i18n', key: 'short', label: 'Présentation', multiline: true, rows: 3 },
      { kind: 'i18nList', key: 'details', label: 'Détails (liste à puces)' },
      { kind: 'i18n', key: 'hours', label: 'Horaires' },
      { kind: 'pricing', key: 'pricing', label: 'Tarifs' },
      {
        kind: 'select',
        key: 'inquiry',
        label: 'Bouton WhatsApp',
        options: [
          { value: 'info', label: 'Demande d’information' },
          { value: 'quote', label: 'Demande de devis' }
        ]
      },
      { kind: 'icon', key: 'icon', label: 'Icône' },
      { kind: 'image', key: 'image', label: 'Image' },
      published
    ],
    defaults: { details: [], pricing: { included: false }, inquiry: 'info', icon: 'bell', published: false },
    previewPath: () => 'services.html',
    titleOf: (row) => frText(row.title)
  },
  {
    slug: 'avantages-groupes',
    table: 'benefit_groups',
    title: 'Avantages — groupes',
    singular: 'groupe d’avantages',
    pk: 'id',
    pkKind: 'identity',
    description: 'Blocs « avantages » de la page d’accueil. Les éléments se gèrent dans « Avantages — éléments ».',
    columns: [{ kind: 'i18n', key: 'title', label: 'Titre' }],
    fields: [{ kind: 'i18n', key: 'title', label: 'Titre du groupe' }, published],
    defaults: { published: true },
    previewPath: () => 'index.html',
    titleOf: (row) => frText(row.title)
  },
  {
    slug: 'avantages',
    table: 'benefits',
    title: 'Avantages — éléments',
    singular: 'avantage',
    pk: 'id',
    pkKind: 'identity',
    columns: [
      { kind: 'ref', key: 'group_id', label: 'Groupe', table: 'benefit_groups' },
      { kind: 'i18n', key: 'title', label: 'Titre' },
      { kind: 'text', key: 'icon', label: 'Icône' }
    ],
    fields: [
      { kind: 'ref', key: 'group_id', label: 'Groupe', table: 'benefit_groups', numeric: true },
      { kind: 'icon', key: 'icon', label: 'Icône' },
      { kind: 'i18n', key: 'title', label: 'Titre' },
      { kind: 'i18n', key: 'text', label: 'Texte', multiline: true, rows: 3 },
      published
    ],
    defaults: { icon: 'check', published: true },
    previewPath: () => 'index.html',
    titleOf: (row) => frText(row.title)
  },
  {
    slug: 'temoignages',
    table: 'testimonials',
    title: 'Témoignages',
    singular: 'témoignage',
    pk: 'id',
    pkKind: 'identity',
    description: 'Avis de clients affichés sur l’accueil (les 3 premiers).',
    columns: [
      { kind: 'i18n', key: 'author', label: 'Auteur' },
      { kind: 'i18n', key: 'meta', label: 'Contexte' },
      { kind: 'stars', key: 'rating', label: 'Note' }
    ],
    fields: [
      { kind: 'i18n', key: 'quote', label: 'Citation', multiline: true, rows: 5 },
      { kind: 'i18n', key: 'author', label: 'Auteur' },
      { kind: 'i18n', key: 'meta', label: 'Contexte (type de séjour, mois)' },
      { kind: 'int', key: 'rating', label: 'Note', suffix: '/ 5', min: 0, max: 5 },
      published
    ],
    defaults: { rating: 5, published: false },
    previewPath: () => 'index.html',
    titleOf: (row) => frText(row.author)
  },
  {
    slug: 'valeurs',
    table: 'hotel_values',
    title: 'Valeurs',
    singular: 'valeur',
    pk: 'id',
    pkKind: 'identity',
    columns: [{ kind: 'i18n', key: 'title', label: 'Titre' }],
    fields: [
      { kind: 'i18n', key: 'title', label: 'Titre' },
      { kind: 'i18n', key: 'text', label: 'Texte', multiline: true, rows: 4 },
      published
    ],
    defaults: { published: true },
    previewPath: () => 'about.html',
    titleOf: (row) => frText(row.title)
  },
  {
    slug: 'experiences',
    table: 'guest_experiences',
    title: 'Expériences clients',
    singular: 'expérience',
    pk: 'id',
    pkKind: 'identity',
    columns: [
      { kind: 'i18n', key: 'audience', label: 'Public' },
      { kind: 'text', key: 'icon', label: 'Icône' }
    ],
    fields: [
      { kind: 'i18n', key: 'audience', label: 'Public visé' },
      { kind: 'icon', key: 'icon', label: 'Icône' },
      { kind: 'i18n', key: 'text', label: 'Texte', multiline: true, rows: 4 },
      published
    ],
    defaults: { icon: 'users', published: true },
    previewPath: () => 'about.html',
    titleOf: (row) => frText(row.audience)
  },
  {
    slug: 'equipe',
    table: 'team_members',
    title: 'Équipe',
    singular: 'membre de l’équipe',
    pk: 'id',
    pkKind: 'identity',
    columns: [
      { kind: 'image', key: 'image', label: '' },
      { kind: 'i18n', key: 'name', label: 'Nom' },
      { kind: 'i18n', key: 'role', label: 'Fonction' }
    ],
    fields: [
      { kind: 'i18n', key: 'name', label: 'Nom' },
      { kind: 'i18n', key: 'role', label: 'Fonction' },
      { kind: 'i18n', key: 'bio', label: 'Présentation', multiline: true, rows: 4 },
      { kind: 'image', key: 'image', label: 'Photo' },
      published
    ],
    defaults: { published: true },
    previewPath: () => 'about.html',
    titleOf: (row) => frText(row.name)
  },
  {
    slug: 'galerie',
    table: 'gallery_items',
    title: 'Galerie',
    singular: 'photo',
    pk: 'id',
    pkKind: 'identity',
    description: 'Galerie de la page « À propos ».',
    columns: [
      { kind: 'image', key: 'image', label: '' },
      { kind: 'i18n', key: 'caption', label: 'Légende' }
    ],
    fields: [
      { kind: 'image', key: 'image', label: 'Photo' },
      { kind: 'i18n', key: 'caption', label: 'Légende' },
      published
    ],
    defaults: { published: true },
    previewPath: () => 'about.html',
    titleOf: (row) => frText(row.caption)
  }
];

export const collectionBySlug = (slug: string | undefined) => COLLECTIONS.find((c) => c.slug === slug);

/** Display label of a referenced row (category, benefit group…). */
export function refLabel(row: Record<string, unknown> | undefined): string {
  if (!row) return '—';
  return frText(row.label ?? row.title ?? row.name) || String(row.id ?? '—');
}
