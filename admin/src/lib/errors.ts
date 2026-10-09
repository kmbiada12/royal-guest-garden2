/** Database / API errors → messages for the back-office (French). */

interface ErrorLike {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
}

/** Specific constraint names → explanation. */
const CONSTRAINTS: Record<string, string> = {
  rooms_images_check: 'Photos : au moins une, en https:// ou dans img/ (ou envoyée ici).',
  rooms_id_check: 'Identifiant : lettres minuscules, chiffres et tirets uniquement.',
  room_categories_id_check: 'Identifiant : lettres minuscules, chiffres et tirets uniquement.',
  amenities_id_check: 'Identifiant : lettres minuscules, chiffres et tirets uniquement.',
  services_id_check: 'Identifiant : lettres minuscules, chiffres et tirets uniquement.',
  services_pricing_check: 'Tarifs : chaque ligne doit avoir un libellé en français et un prix positif.',
  services_details_check: 'Détails : chaque ligne doit avoir un texte en français.',
  settings_hotel_chk: "Hôtel : le nom est obligatoire et le lien de carte doit commencer par https://.",
  settings_whatsapp_chk: 'WhatsApp : numéros de 8 à 15 chiffres, adresse de base en https://.',
  settings_hero_images_chk: 'Images de bannière : https:// ou chemin img/… uniquement.',
  idx_rooms_id_lower: 'Une chambre utilise déjà cet identifiant.',
  rooms_ref_key: 'Cette référence est déjà utilisée par une autre chambre.'
};

export function friendlyError(error: unknown): string {
  if (!error) return 'Erreur inconnue.';
  if (typeof error === 'string') return error;
  const e = error as ErrorLike;
  const message = e.message ?? '';

  for (const [name, text] of Object.entries(CONSTRAINTS)) {
    if (message.includes(name)) return text;
  }

  if (/last admin/i.test(message)) return 'Il doit toujours rester au moins un administrateur.';
  if (/Unknown amenity/i.test(message)) return 'Équipement inconnu : choisissez-le dans la liste des équipements.';
  if (/still used by a room/i.test(message)) {
    return 'Cet équipement est encore utilisé par au moins une chambre : retirez-le d’abord des chambres.';
  }

  switch (e.code) {
    case '23505':
      return 'Cet identifiant ou cette valeur existe déjà.';
    case '23503':
      return 'Cet élément est encore utilisé ailleurs (par ex. une catégorie utilisée par des chambres).';
    case '23514': {
      const m = message.match(/_(\w+?)_(check|chk)"/);
      return m
        ? `Valeur refusée pour « ${m[1]} » : vérifiez le format (français obligatoire, liens en https://…).`
        : 'Une valeur ne respecte pas les règles de contenu.';
    }
    case '23502':
      return 'Un champ obligatoire est vide.';
    case '42501':
      return 'Droits insuffisants pour cette action.';
    case 'PGRST301':
    case 'PGRST303':
      return 'Session expirée : reconnectez-vous.';
  }

  if (/Invalid login credentials/i.test(message)) return 'Adresse ou mot de passe incorrect.';
  if (/Email not confirmed/i.test(message)) return 'Adresse e-mail non confirmée : utilisez le lien reçu par e-mail.';
  if (/Password should|weak password|password.*characters/i.test(message)) {
    return 'Mot de passe trop faible : 12 caractères minimum, avec minuscules, majuscules et chiffres.';
  }
  if (/reauthentication|recent login/i.test(message)) {
    return 'Pour des raisons de sécurité, reconnectez-vous puis recommencez.';
  }
  if (/Invalid TOTP code|invalid code|expired/i.test(message)) return 'Code incorrect ou expiré.';
  if (/Failed to fetch|NetworkError/i.test(message)) return 'Serveur injoignable : vérifiez que Supabase est démarré.';

  return message || 'Une erreur est survenue.';
}
