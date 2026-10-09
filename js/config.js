/* =========================================================================
   Royal Guest Garden — Configuration globale
   -------------------------------------------------------------------------
   Ce fichier centralise TOUTES les informations que vous pouvez vouloir
   modifier sans toucher au code des pages.

   Modifiez simplement les valeurs ci-dessous, puis rechargez la page.
   ========================================================================= */

window.RGG_CONFIG = {
  /* ---------------------------------------------------------------------
     1. IDENTITÉ DE L'ÉTABLISSEMENT
     --------------------------------------------------------------------- */
  hotel: {
    name: 'Royal Guest Garden, RÉSIDENCE HÔTELIÈRE',
    slogan: { fr: 'Confort, élégance & sérénité', en: 'Comfort, elegance & serenity' },
    type: { fr: 'Hôtel 4 étoiles', en: '4-star hotel' },
    addressLine: 'Dernière rue Hippodrome',
    city: 'Yaoundé',
    region: 'Cameroun',
    address: {
      fr: 'Dernière rue Hippodrome, Yaoundé, Cameroun',
      en: 'At the end of Hippodrome Road, Yaoundé, Cameroon'
    },
    // Numéro d'appel affiché sur le site (format lisible).
    phoneDisplay: '691 491 948',
    phoneDisplayAlt: '683 069 047',
    // Format international pour les liens d'appel.
    phoneTel: '+237691491948',
    phoneTelAlt: '+237683069047',
    email: 'contact@royalguestgarden.cm',
    emailBooking: 'reservations@royalguestgarden.cm',
    // Lien vers la localisation / plan d'accès (à adapter à votre adresse réelle).
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=Derni%C3%A8re+rue+Hippodrome%2C+Yaound%C3%A9%2C+Cameroun',
    mapEmbedNote: {
      fr: 'L\'hôtel se situe à un peu plus d\'un kilomètre du centre administratif.',
      en: 'The hotel is located a little over one kilometre from the administrative centre.'
    },
    landmarks: {
      fr: [
        'À un peu plus d’un kilomètre du centre administratif et des ministères',
        'À 1 km du marché central Akea',
        'À 6 km de l\'aéroport international de Yaoundé-Nsimalen',
        'À 12 km de la route dusud, direction Douala'
      ],
      en: [
        'A little over one kilometre from the administrative centre and the ministries',
        '1 km from Akea Central Market',
        '6 km from Yaoundé-Nsimalen International Airport',
        '12 km from the southern road towards Douala'
      ]
    }
  },

  /* ---------------------------------------------------------------------
     2. WHATSAPP  >>> À PERSONNALISER ICI <<<
     ---------------------------------------------------------------------
     NUMÉRO WHATSAPP PRINCIPAL — format international, CHIFFRES UNIQUEMENT.
     ⚠  PLACEHOLDER : ce numéro est un exemple. Remplacez-le par le vrai
        numéro de l'hôtel avant la mise en ligne (préfixe pays 237 = Cameroun).
     --------------------------------------------------------------------- */
  whatsapp: {
    number: '237691491948', // ⚠ PLACEHOLDER — numéro WhatsApp principal (chiffres uniquement)
    numberAlt: '237683069047', // ⚠ PLACEHOLDER — second numéro WhatsApp
    display: '691 491 948',
    displayAlt: '683 069 047',
    // Numéro affiché dans la fenêtre de réservation (modifiable).
    bookingNumber: null, // null = utilise `number`
    baseUrl: 'https://wa.me/'
  },

  /* ---------------------------------------------------------------------
     3. DEVISE ET TARIFS
     --------------------------------------------------------------------- */
  currency: {
    code: 'XAF',
    label: 'FCFA',
    // Décimales affichées pour les montants (0 pour le franc CFA).
    decimals: 0
  },

  /* ---------------------------------------------------------------------
     4. POLITIQUES DE RÉSERVATION (informations hôtelières modifiables)
     --------------------------------------------------------------------- */
  booking: {
    checkIn: '15:00',
    checkOut: '11:00',
    minNights: 1,
    maxRoomsPerRequest: 5,
    // Horaires indicatifs affichés sur le site.
    receptionHours: {
      fr: 'Réception ouverte 24 h/24',
      en: 'Front desk open 24/7'
    },
    policies: [
      {
        key: 'guarantee',
        fr: 'Aucune réservation n\'est garantie avant confirmation écrite de l\'hôtel. Les disponibilités affichées sur ce site sont des exemples et doivent être vérifiées.',
        en: 'No booking is guaranteed before written confirmation from the hotel. Availability shown on this website is sample data and must be verified.'
      },
      {
        key: 'payment',
        fr: 'Le règlement s\'effectue à l\'arrivée par Mobile Money (MoMo), carte bancaire ou Orange Money (OM).',
        en: 'Payment is due on arrival by Mobile Money (MoMo), bank card or Orange Money (OM).'
      },
      {
        key: 'cancellation',
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée. En cas d\'annulation tardive, la première nuit peut être facturée.',
        en: 'Free cancellation until 48 h before arrival. Late cancellations may be charged for the first night.'
      },
      {
        key: 'identity',
        fr: 'Une pièce d\'identité valide est demandée à l\'enregistrement pour tous les clients.',
        en: 'Valid photo ID is required at check-in for all guests.'
      }
    ]
  },

  /* ---------------------------------------------------------------------
     5. AVIS DE CONTENU DÉMONSTRATIF
     ---------------------------------------------------------------------
     Ce site est une démonstration : témoignages, coordonnées, services
     et disponibilités sont des exemples à remplacer.
     --------------------------------------------------------------------- */
  demo: {
    enabled: true,
    badge: { fr: 'Contenu de démonstration', en: 'Demonstration content' },
    notice: {
      fr: 'Démonstration : les chambres, les tarifs, les témoignages et les coordonnées présentés sur ce site sont des exemples. La disponibilité réelle doit être confirmée par l\'hôtel.',
      en: 'Demonstration: the rooms, rates, testimonials and contact details on this website are samples. Real availability must be confirmed by the hotel.'
    }
  },

  /* ---------------------------------------------------------------------
     6. LIENS DU SITE
     --------------------------------------------------------------------- */
  site: {
    langDefault: 'fr',
    langs: ['fr', 'en'],
    langStorageKey: 'rgg_lang' // seule la langue est mémorisée, aucune donnée personnelle
  }
};
