/* =========================================================================
   Royal Guest Garden — Traductions FR / EN
   -------------------------------------------------------------------------
   Toutes les chaînes visibles par le client sont stockées ici.
   Le site est écrit en français par défaut ; le bouton « English » bascule
   la langue pour toutes les pages.

   Utilisation dans le HTML statique :
     <h1 data-i18n="home.hero.title"></h1>
     <img alt="" data-i18n-attr="alt:home.hero.imageAlt">
     <p data-i18n="x.y" data-i18n-params="{'n': 3}"></p>   (interpolation)
   ========================================================================= */

(function () {
  'use strict';

  var DICT = {
    /* =====================================================================
       GLOBAL
       ===================================================================== */
    fr: {
      'lang.code': 'fr',
      'lang.name': 'Français',
      'lang.other': 'English',
      'lang.switch': 'Passer en anglais',
      'lang.switchTo': 'Switch to French',

      'a11y.skip': 'Aller au contenu principal',
      'a11y.menuOpen': 'Ouvrir le menu',
      'a11y.menuClose': 'Fermer le menu',
      'a11y.book': 'Réserver cette chambre via WhatsApp',
      'a11y.gallery': 'Galerie de la chambre',
      'a11y.thumb': 'Voir la photo {n}',
      'a11y.lightbox': 'Visionneuse de photos',
      'a11y.prev': 'Photo précédente',
      'a11y.next': 'Photo suivante',
      'a11y.close': 'Fermer',
      'a11y.results': 'Résultats de la recherche',
      'a11y.floatingWa': 'Contacter l\'hôtel sur WhatsApp',
      'a11y.external': 'ouvre dans un nouvel onglet',
    'a11y.breadcrumb': 'Fil d\'Ariane',
    'a11y.roomSections': 'Sections de la fiche',
    'a11y.practical': 'Informations pratiques',
    'a11y.pagination': 'Pagination des pages de chambres',

      'nav.home': 'Accueil',
      'nav.rooms': 'Nos chambres',
      'nav.services': 'Nos services',
      'nav.reglement': 'Règlement intérieur',
      'nav.about': 'À propos',
      'nav.contact': 'Contact et accès',
      'nav.primary': 'Navigation principale',
      'nav.utility': 'Navigation secondaire',
      'nav.langLabel': 'Changer de langue',

      'common.perNight': '/ nuit',
      'common.perPerson': '/ personne',
      'common.from': 'À partir de',
      'common.guests': 'clients',
      'common.guest': 'client',
      'common.m2': 'm²',
      'common.seeDetails': 'Voir les détails',
      'common.bookWa': 'Réserver via WhatsApp',
      'common.bookThis': 'Réserver cette chambre via WhatsApp',
      'common.inquireWa': 'Se renseigner via WhatsApp',
      'common.quoteWa': 'Demander un devis via WhatsApp',
      'common.demoBadge': 'Contenu de démonstration',
      'demo.notice':
        'Démonstration : les chambres, les tarifs, les témoignages et les coordonnées présentés sur ce site sont des exemples. La disponibilité réelle doit être confirmée par l’hôtel.',
      'common.perNightShort': 'par nuit',
      'common.category': 'Catégorie',
      'common.capacity': 'Capacité',
      'common.beds': 'Literie',
      'common.amenities': 'Équipements',
      'common.size': 'Surface',
      'common.floor': 'Niveau',
      'common.view': 'Vue',
      'common.ref': 'Référence',
      'common.all': 'Toutes',
      'common.or': 'ou',
      'common.optional': 'facultatif',
      'common.required': 'obligatoire',
      'common.backHome': 'Retour à l\'accueil',
      'common.backRooms': 'Retour à la liste des chambres',

      'footer.tagline': 'Confort, élégance & sérénité',
      'footer.about':
        'Hôtel 4 étoiles à Yaoundé, dernière rue Hippodrome. Dix chambres et suites, un restaurant, un bar, une piscine et un court de tennis.',
      'footer.nav': 'Navigation',
      'footer.contact': 'Contact',
      'footer.hours': 'Horaires',
      'footer.address': 'Adresse',
      'footer.rights': 'Tous droits réservés.',
      'footer.legal': 'Mentions légales',
      'footer.legalText':
        'Site de démonstration. Les chambres, tarifs, services, témoignages et coordonnées sont des exemples et ne constituent pas une offre commerciale ferme. Les disponibilités réelles doivent être confirmées par l\'hôtel.',
      'footer.madeIn': 'Site statique — HTML, CSS et JavaScript',

      'demo.banner':
        'Démonstration : les chambres, tarifs, témoignages et coordonnées présentés sur ce site sont des exemples. La disponibilité réelle doit être confirmée par l\'hôtel.',

      'wa.floatingLabel': 'Écrire sur WhatsApp',
      'wa.title': 'Royal Guest Garden — WhatsApp',
      'wa.prefill': 'Bonjour, je souhaite des informations sur vos chambres et vos services.',

      /* =====================================================================
       PAGE 1 — ACCUEIL
       ===================================================================== */
      'home.metaTitle': 'Hôtel à Yaoundé — Royal Guest Garden',
      'home.metaDesc':
        'Royal Guest Garden, hôtel 4 étoiles à Yaoundé, dernière rue Hippodrome. Dix chambres à partir de 50 000 FCFA la nuit, restaurant, piscine et tennis. Réservation via WhatsApp.',
      'home.badge': 'Hôtel 4 étoiles · Yaoundé, dernière rue Hippodrome',
      'home.hero.title': 'Confort, élégance & sérénité',
      'home.hero.subtitle':
        'Au bout de la dernière rue Hippodrome, à un peu plus d’un kilomètre du centre administratif de Yaoundé, le Royal Guest Garden accueille des clients d\'affaires, des couples et des familles dans un cadre calme et soigné. Dix chambres à partir de 50 000 FCFA la nuit.',
      'home.hero.imageAlt': 'Hall d\'accueil du Royal Guest Garden à Yaoundé',
      'home.hero.cta1': 'Découvrir nos chambres',
      'home.hero.cta2': 'Réserver via WhatsApp',
      'home.hero.scroll': 'Faire défiler',
      'home.quick.checkin': 'Arrivée',
      'home.quick.checkout': 'Départ',
      'home.quick.reception': 'Réception',
      'home.quick.value24': 'Réception ouverte 24 h/24',
      'home.quick.from': 'Chambres à partir de',

      'home.intro.eyebrow': 'Bienvenue',
      'home.intro.title': 'Un hôtel de ville qui connaît l\'hospitalité camerounaise',
      'home.intro.p1':
        'Le Royal Guest Garden est un hôtel de quatre étoiles situé à la dernière rue Hippodrome, à Yaoundé. Derrière sa façade sobre, l\'hôtel déploie dix chambres et suites réparties sur sept étages, un restaurant de cuisine camerounaise et internationale, un bar ouvert tard le soir, une piscine de vingt mètres dans un jardin tropical et un court de tennis en terre battue.',
      'home.intro.p2':
        'Plusieurs chambres portent le nom d\'un lieu ou d\'un quartier du coin — Waza, Mouessi, Ntem, Febe, Lobe, Oku, Laakam — et No NAME complète la collection avec un nom à part. C\'est une façon de rappeler que l\'hôtel appartient à son quartier et que chaque client est attendu comme un voisin.',
      'home.intro.p3':
        'Notre équipe est disponible en permanence, la réception est ouverte 24 h/24, et chaque demande de réservation est traitée directement sur WhatsApp, avec un interlocuteur identifié.',
      'home.intro.cta': 'En savoir plus sur l\'hôtel',

      'home.featured.eyebrow': 'Nos chambres',
      'home.featured.title': 'Chambres mises en avant',
      'home.featured.subtitle':
        'Découvrez nos Chambres simples, Suites Juniors, Suites Seniors et suites VVIP.',
      'home.featured.all': 'Voir les 10 chambres',

      'home.services.eyebrow': 'Nos services',
      'home.services.title': 'Tout sur place, du petit-déjeuner au court de tennis',
      'home.services.subtitle':
        'Hébergement, restauration, bar, piscine, événements : six services pour un séjour qui ne demande pas de sortir de l\'hôtel.',
      'home.services.all': 'Découvrir tous les services',

      'home.benefits.eyebrow': 'Pourquoi nous choisir',
      'home.benefits.title': 'Les atouts du Royal Guest Garden',
      'home.benefits.subtitle': 'Six raisons concrètes, vérifiables dès l\'arrivée.',

      'home.testimonials.eyebrow': 'Avis de clients',
      'home.testimonials.title': 'Ce que disent nos clients',
      'home.testimonials.subtitle':
        'Témoignages de démonstration.',
      'home.testimonials.demoNote':
        'Témoignages exemples : ces avis sont fictifs et servent uniquement à démontrer la mise en page.',

      'home.cta.eyebrow': 'Réservation',
      'home.cta.title': 'Votre chambre vous attend',
      'home.cta.subtitle':
        'Choisissez votre chambre, préparez votre demande en quelques secondes et envoyez-la directement sur WhatsApp. L\'hôtel vous répond pour confirmer les disponibilités et le tarif final.',
      'home.cta.step1': 'Choisissez une chambre',
      'home.cta.step2': 'Indiquez vos dates et le nombre de clients',
      'home.cta.step3': 'Envoyez votre demande sur WhatsApp',
      'home.cta.step1Text':
        'Parcourez les dix chambres, comparez les équipements et les tarifs en FCFA.',
      'home.cta.step2Text':
        'Le site calcule le nombre de nuits et le total estimé de votre séjour.',
      'home.cta.step3Text':
        'La demande s\'ouvre dans WhatsApp : il ne reste qu\'à l\'envoyer à l\'hôtel.',
      'home.cta.note':
        'L\'ouverture de WhatsApp ne vaut pas confirmation de réservation : seul l\'hôtel peut confirmer la disponibilité et le tarif final.',

      /* =====================================================================
       PAGE 2 — NOS CHAMBRES
       ===================================================================== */
      'rooms.metaTitle': 'Nos chambres — Royal Guest Garden Yaoundé',
      'rooms.metaDesc':
        'Catalogue des 10 chambres du Royal Guest Garden à Yaoundé, dont No NAME à 50 000 FCFA la nuit. Réservation via WhatsApp.',
      'rooms.badge': '10 chambres et suites',
      'rooms.hero.title': 'Nos chambres',
      'rooms.hero.subtitle':
        'Dix chambres et suites, dont No NAME. Filtrez selon votre budget, votre nombre de clients et vos équipements préférés.',
      'rooms.hero.imageAlt': 'Chambre de l\'hôtel Royal Guest Garden',

      'rooms.filters.title': 'Filtrer les chambres',
      'rooms.filters.category': 'Catégorie',
      'rooms.filters.categoryAll': 'Toutes les catégories',
      'rooms.filters.budget': 'Budget maximum par nuit',
      'rooms.filters.budgetValue': '{amount} maximum',
      'rooms.filters.budgetMin': '{amount}',
      'rooms.filters.capacity': 'Nombre minimum de clients',
      'rooms.filters.capacityAll': 'Indifférent',
      'rooms.filters.amenities': 'Équipements requis',
      'rooms.filters.amenitiesAll': 'Aucun équipement requis',
      'rooms.filters.sort': 'Trier par',
      'rooms.filters.reset': 'Réinitialiser les filtres',
      'rooms.filters.activeCount': '{n} filtre(s) actif(s)',
      'rooms.filters.none': 'Aucun filtre actif',
      'rooms.filters.collapsed': 'Afficher les filtres',
      'rooms.filters.expanded': 'Masquer les filtres',

      'rooms.sort.recommended': 'Sélection de l\'hôtel',
      'rooms.sort.priceAsc': 'Prix croissant',
      'rooms.sort.priceDesc': 'Prix décroissant',
      'rooms.sort.capacityDesc': 'Capacité décroissante',

      'rooms.results.count': '{n} chambre(s) trouvée(s)',
      'rooms.results.countOne': '{n} chambre trouvée',
      'rooms.empty.title': 'Aucune chambre ne correspond à votre recherche',
      'rooms.empty.text':
        'Essayez d\'augmenter votre budget maximum, de réduire le nombre de clients ou de retirer un équipement.',
      'rooms.empty.reset': 'Réinitialiser les filtres',
      'rooms.disclaimer.title': 'Important',
      'rooms.disclaimer.text':
        'Les disponibilités présentées sur ce site sont des exemples et ne constituent pas un état temps réel. Toute disponibilité et tout tarif définitif doivent être confirmés par l\'hôtel avant validation de votre réservation.',
      'rooms.pager': 'Page {current} sur {total}',
      'rooms.prevPage': 'Page précédente',
      'rooms.nextPage': 'Page suivante',
      'rooms.showing': 'Affichage de {from} à {to} sur {total} chambres',

      'card.capacityLabel': '{n} clients maximum',
      'card.capacityLabelOne': '{n} client maximum',
      'card.amenitiesMore': '+{n} équipement(s)',
      'card.featured': 'Sélection',
      'card.bookAria': 'Réserver la chambre {name} via WhatsApp',
      'card.detailsAria': 'Voir les détails de la chambre {name}',

      /* =====================================================================
       PAGE 3 — DÉTAIL D'UNE CHAMBRE
       ===================================================================== */
      'room.metaTitle': 'Détails de la chambre — Royal Guest Garden',
      'room.metaDesc': 'Photos, équipements, capacité, literie et tarifs en FCFA de nos chambres et suites.',
      'room.notFoundTitle': 'Chambre introuvable',
      'room.notFoundText':
        'La chambre demandée n\'existe pas ou son identifiant est incorrect. Elle a peut-être été retirée du catalogue.',
      'room.backRooms': 'Voir toutes les chambres',
      'room.tabOverview': 'Aperçu',
      'room.tabGallery': 'Galerie ({n} photos)',
      'room.tabInfo': 'Informations',
      'room.tabServices': 'Services inclus',
      'room.tabPolicy': 'Conditions',

      'room.gallery.title': 'Galerie photos',
      'room.gallery.hint': 'Cliquez sur une photo pour l\'agrandir. Utilisez les flèches pour naviguer.',
      'room.gallery.counter': 'Photo {current} sur {total}',
      'room.gallery.alt': 'Photo {n} de la chambre {name}',
      'room.mainImageAlt': 'Vue principale de la chambre {name}',

      'room.summary.title': 'En bref',
      'room.summary.price': 'Tarif par nuit',
      'room.summary.priceFrom': 'à partir de {price}',
      'room.summary.capacity': 'Clients maximum',
      'room.summary.beds': 'Literie',
      'room.summary.size': 'Surface',
      'room.summary.floor': 'Niveau',
      'room.summary.view': 'Vue',
      'room.summary.ref': 'Référence',
      'room.summary.category': 'Catégorie',
      'room.overview.title': 'À propos de cette chambre',
      'room.amenities.title': 'Équipements',
      'room.amenities.all': 'Tous les équipements sont inclus dans le tarif de la chambre.',

      'room.included.title': 'Services inclus dans le tarif',
      'room.included.lists': {
        fr: [
          'Eau chaude et sanitaire privative 24 h/24',
          'Climatisation et Wi-Fi fibre illimité',
          'TV satellite et chaîne internationale',
          'Linge de maison et serviettes changées chaque jour',
          'Wi-Fi fibre et accès au salon commun',
          'Sécurité 24 h/24 et accès contrôlé',
          'Accès à la piscine et aux espaces de détente'
        ],
        en: [
          'Hot water and private bathroom 24/7',
          'Air conditioning and unlimited fibre Wi-Fi',
          'Satellite TV and international channels',
          'House linen and towels changed daily',
          'Fibre Wi-Fi and access to the shared lounge',
          '24/7 security and controlled access',
          'Access to the pool and relaxation areas'
        ]
      },

      'room.excluded.title': 'Non inclus dans le tarif affiché',
      'room.excluded.lists': {
        fr: [
          'Repas et boissons au restaurant et au bar (service en chambre en supplément)',
          'Location de salle de conférence et événements privés',
          'Massages au coins bien-être et cours de tennis',
          'Lit d\'appoint supplémentaire (8 000 FCFA par nuit)'
        ],
        en: [
          'Meals and drinks in the restaurant and bar (in-room dining charged separately)',
          'Conference room hire and private events',
          'Wellness corner massages and tennis lessons',
          'Additional extra bed (8,000 FCFA per night)'
        ]
      },

      'room.taxes.title': 'Taxes et frais',
      'room.taxes.included': 'Taxes incluses dans le tarif affiché.',
      'room.taxes.notIncluded': 'Taxes non incluses dans le tarif affiché.',
      'room.taxes.note': 'Les tarifs affichés sont indicatifs et sont exprimés en francs CFA (FCFA).',

      'room.policy.title': 'Informations hôtelières',
      'room.policy.subtitle':
        'Horaires et conditions ci-dessous : ce sont des informations d\'hôtel modifiables par l\'hôtel.',
      'room.policy.checkIn': 'Heure d\'arrivée (check-in)',
      'room.policy.checkOut': 'Heure de départ (check-out)',
      'room.policy.cancellation': 'Annulation',
      'room.policy.note':
        'Ces informations sont fournies à titre indicatif et peuvent être modifiées par l\'hôtel. Merci de les confirmer lors de votre réservation.',

      'room.similar.title': 'Chambres similaires',
      'room.similar.subtitle': 'Dans la même gamme de prix ou la même catégorie.',
      'room.similar.empty': 'Aucune autre chambre ne correspond à cette gamme pour le moment.',

      'room.cta.title': 'Réserver cette chambre',
      'room.cta.text':
        'Votre demande sera préparée puis envoyée sur WhatsApp. L\'hôtel vérifiera la disponibilité et confirmera le tarif final.',
      'room.cta.note':
        'L\'ouverture de WhatsApp ne constitue pas une réservation confirmée.',

      /* =====================================================================
       PAGE 4 — NOS SERVICES
       ===================================================================== */
      'services.metaTitle': 'Nos services — Royal Guest Garden Yaoundé',
      'services.metaDesc':
        'Hébergement, restaurant et petit-déjeuner, bar et lounge, piscine, événements et conférences, court de tennis au Royal Guest Garden à Yaoundé. Tarifs en FCFA.',
      'services.badge': '6 services',
      'services.hero.title': 'Nos services',
      'services.hero.subtitle':
        'Un hôtel complet : hébergement, restauration, bar, piscine, salles de réception et tennis. Chaque service indique clairement s\'il est compris dans le tarif de la chambre ou facturé séparément.',
      'services.hero.imageAlt': 'Bar et salon du Royal Guest Garden',

      'services.includedBadge': 'Compris dans le tarif',
      'services.partlyBadge': 'Partiellement compris',
      'services.extraBadge': 'Facturé séparément',
      'services.practical': 'Informations pratiques',
      'services.hours': 'Horaires',
      'services.pricing': 'Tarifs indicatifs',
      'services.pricingNote': 'Tarifs indicatifs en FCFA, susceptibles de varier selon la prestation, la saison et le nombre de personnes.',
      'services.quoteOnly': 'Sur devis uniquement — nous vous répondons sous 24 h ouvrées.',
      'services.inquiryInfo': 'Se renseigner via WhatsApp',
      'services.inquiryQuote': 'Demander un devis via WhatsApp',
      'services.cta.title': 'Une question sur l\'un de nos services ?',
      'services.cta.text':
        'Écrivez-nous sur WhatsApp : nous répondons généralement en quelques minutes pendant nos heures d\'ouverture.',

      /* =====================================================================
       PAGE 5 — À PROPOS
       ===================================================================== */
      'about.metaTitle': 'À propos — Royal Guest Garden Yaoundé',
      'about.metaDesc':
        'Découvrez le Royal Guest Garden, hôtel 4 étoiles à Yaoundé : notre atmosphère, nos valeurs, notre emplacement et l\'expérience réservée à chaque type de client.',
      'about.badge': 'Hôtel 4 étoiles · Dernière rue Hippodrome',
      'about.hero.title': 'À propos du Royal Guest Garden',
      'about.hero.subtitle':
        'Un hôtel de ville élégant et accueillant, au bout de la dernière rue Hippodrome, à un peu plus d’un kilomètre du centre administratif et à six kilomètres de l\'aéroport.',
      'about.hero.imageAlt': 'Façade de l\'hôtel Royal Guest Garden',

      'about.story.eyebrow': 'Notre histoire',
      'about.story.title': 'Un lieu pensé pour la ville',
      'about.story.p1':
        'Le Royal Guest Garden est né d\'un constat simple : Yaoundé dispose de nombreux hôtels, mais peu d\'établissements qui réunissent la rigueur d\'un hôtel de ville et la chaleur d\'une maison camerounaise. Nous avons voulu créer ce lieu — un hôtel où l\'on peut séjourner une nuit en mission comme trois semaines en vacances.',
      'about.story.p2':
        'L\'hôtel s\'organise autour d\'un jardin tropical de 2 000 m², d\'une piscine de vingt mètres et d\'un restaurant à la carte ouverte sur la verdure. Les chambres, du simple au prestige, donnent toutes sur un espace paysager : la lumière du matin fait partie du séjour.',
      'about.story.p3':
        'Notre équipe veille à l\'accueil et au bon fonctionnement de l\'hôtel. La réception est ouverte 24 h/24.',

      'about.atmosphere.eyebrow': 'Notre atmosphère',
      'about.atmosphere.title': 'Élégance discrète, chaleur familiale',
      'about.atmosphere.p1':
        'La palette navy et or de l\'hôtel, le bois sombre, les tissus en lin et la lumière dorée du soir composent une atmosphère à la fois formelle et profondément accueillante. Nos clients le formulent souvent ainsi : « on se sent reçu, pas logé ».',
      'about.atmosphere.p2':
        'L\'accueil est chaleureux et l\'atmosphère propice au repos. Profitez du petit-déjeuner, d\'une chambre confortable et d\'un cadre calme pour vous sentir chez vous, à 1 200 kilomètres de chez vous.',

      'about.location.eyebrow': 'Emplacement',
      'about.location.title': 'Dernière rue Hippodrome, Yaoundé',
      'about.location.text':
        'L\'hôtel se trouve au bout de la dernière rue Hippodrome, dans un quartier résidentiel calme, à un peu plus d’un kilomètre des ministères et du centre administratif, et à environ six kilomètres de l\'aéroport international de Yaoundé-Nsimalen.',
      'about.location.map': 'Voir l\'emplacement sur Google Maps',
      'about.location.landmarks': 'À proximité',

      'about.values.eyebrow': 'Nos valeurs',
      'about.values.title': 'Quatre engagements que nous tenons',
      'about.values.subtitle': 'Ils ne sont pas affichés dans une brochure : ils se vérifient dès l\'arrivée.',

      'about.experience.eyebrow': 'Votre séjour',
      'about.experience.title': 'Un hôtel pour chaque type de voyage',
      'about.experience.subtitle':
        'Clients en déplacement professionnel, couples, familles, touristes : l\'hôtel s\'adapte à votre rythme.',

      'about.gallery.eyebrow': 'Galerie',
      'about.gallery.title': 'Le Royal Guest Garden en images',
      'about.gallery.hint': 'Cliquez sur une photo pour l\'agrandir. Photos de démonstration.',

      'about.team.eyebrow': 'Notre équipe',
      'about.team.title': 'Les personnes derrière l\'hôtel',
      'about.team.subtitle':
        'Équipe de démonstration, présentée pour illustrer la mise en page du site.',
      'about.team.demoNote':
        'Les personnes et photographies présentées ci-dessus sont fictives et servent uniquement de démonstration.',
      'about.team.contact': 'Contacter l\'hôtel',

      'about.cta.title': 'Venir nous voir',
      'about.cta.text':
        'Une question avant votre arrivée ? Écrivez-nous sur WhatsApp ou appelez la réception, ouverte 24 h/24.',

      /* =====================================================================
       PAGE 6 — RÈGLEMENT INTÉRIEUR
       ===================================================================== */
      'reglement.metaTitle': 'Règlement intérieur — Royal Guest Garden Yaoundé',
      'reglement.metaDesc':
        'Consultez le règlement intérieur de la résidence Royal Guest Garden à Yaoundé : interdictions, règles de sécurité et numéros utiles.',

      /* =====================================================================
       PAGE 7 — CONTACT ET ACCÈS
       ===================================================================== */
      'contact.metaTitle': 'Contact et accès — Royal Guest Garden Yaoundé',
      'contact.metaDesc':
        'Adresse, téléphone, email, horaires et plan d\'accès du Royal Guest Garden, dernière rue Hippodrome, Yaoundé. Contact WhatsApp et formulaire de demande.',
      'contact.badge': 'Yaoundé · Dernière rue Hippodrome',
      'contact.hero.title': 'Contact et accès',
      'contact.hero.subtitle':
        'Notre réception est ouverte 24 h/24. Pour une réservation rapide, la voie la plus directe est WhatsApp.',
      'contact.hero.imageAlt': 'Entrée de l\'hôtel Royal Guest Garden',

      'contact.wa.title': 'Nous écrire sur WhatsApp',
      'contact.wa.text':
        'Le moyen le plus rapide pour obtenir une réponse : écrivez-nous, nous vous répondons généralement en quelques minutes pendant nos heures d\'ouverture.',
      'contact.wa.primary': 'WhatsApp principal',
      'contact.wa.secondary': 'Second numéro',
      'contact.wa.defaultMessage':
        'Bonjour Royal Guest Garden, je souhaite des informations sur vos chambres et vos services.',

      'contact.info.title': 'Coordonnées',
      'contact.info.address': 'Adresse',
      'contact.info.phone': 'Téléphone',
      'contact.info.email': 'Email',
      'contact.info.hours': 'Horaires',
      'contact.info.map': 'Plan d\'accès',
      'contact.info.reception': 'Réception',
      'contact.info.restaurant': 'Restaurant',
      'contact.info.checkIn': 'Arrivée / Départ',

      'contact.hours.title': 'Horaires d\'ouverture',
      'contact.hours.reception': 'Réception',
      'contact.hours.frontdesk': 'Accueil et enregistrement',
      'contact.hours.breakfast': 'Petit-déjeuner',
      'contact.hours.restaurant': 'Restaurant',
      'contact.hours.bar': 'Bar et lounge',
      'contact.hours.pool': 'Piscine',
      'contact.hours.tennis': 'Court de tennis',
      'contact.hours.always': 'Ouvert 24 h/24',
      'contact.hours.note':
        'Ces horaires sont indicatifs et modifiables. Pour un service en dehors de ces créneaux, contactez la réception.',

      'contact.access.title': 'Venir à l\'hôtel',
      'contact.access.byCar': 'En voiture',
      'contact.access.byCarText':
        'L\'hôtel dispose d\'un parking privé gratuit pour les clients des chambres Mont Cameroun, Dja, Laakam et Oku. Pour les autres chambres, un parking surveillé est disponible à 300 m.',
      'contact.access.byPlane': 'En avion',
      'contact.access.byPlaneText':
        'L\'aéroport international de Yaoundé-Nsimalen se trouve à environ 6 km de l\'hôtel.',

      'contact.form.title': 'Formulaire de demande',
      'contact.form.subtitle':
        'Remplissez ce formulaire : votre demande sera préparée puis ouverte dans WhatsApp, où vous pourrez l\'envoyer vous-même.',
      'contact.form.name': 'Nom et prénom',
      'contact.form.namePh': 'Ex. Aminatou Njoya',
      'contact.form.phone': 'Numéro de téléphone',
      'contact.form.phonePh': 'Ex. 691 491 948',
      'contact.form.email': 'Adresse email',
      'contact.form.emailPh': 'Ex. aminatou.njoya@email.cm',
      'contact.form.subject': 'Objet de la demande',
      'contact.form.message': 'Votre message',
      'contact.form.messagePh': 'Décrivez votre demande : dates, nombre de clients, type de chambre souhaité…',
      'contact.form.optional': 'facultatif',
      'contact.form.submit': 'Continuer sur WhatsApp',
      'contact.form.privacy':
        'Vos informations ne sont ni enregistrées ni envoyées automatiquement par ce site : elles servent uniquement à préparer le message WhatsApp que vous ouvrez, et restent dans votre appareil jusqu\'à l\'envoi.',
      'contact.form.success': 'Votre demande a été préparée. Vérifiez le message dans WhatsApp avant de l\'envoyer.',
      'contact.form.errorSummary': 'Le formulaire contient {n} erreur(s).',
      'contact.form.notSent':
        'Aucun message n\'a été envoyé automatiquement. Vous devez valider l\'envoi dans WhatsApp.',
      'contact.form.fallbackTitle': 'Le message ne s\'est pas ouvert ?',
      'contact.form.fallbackText':
        'WhatsApp n\'est peut-être pas installé sur cet appareil. Vous pouvez copier le message préparé et l\'envoyer au numéro de l\'hôtel par SMS ou par appel.',
      'contact.form.copy': 'Copier le message',
      'contact.form.copied': 'Message copié dans le presse-papiers.',
      'contact.form.copyFailed': 'Copie impossible. Sélectionnez le texte ci-dessous et copiez-le manuellement.',
      'contact.form.preview': 'Aperçu du message',
      'contact.form.callHotel': 'Appeler l\'hôtel',
      'contact.form.number': 'Numéro de l\'hôtel',

      'contact.subjects.availability': 'Disponibilité et tarif',
      'contact.subjects.reservation': 'Demande de réservation',
      'contact.subjects.event': 'Événement ou conférence',
      'contact.subjects.group': 'Réservation de groupe',
      'contact.subjects.complaint': 'Réclamation ou suggestion',
      'contact.subjects.other': 'Autre demande',

      'contact.map.title': 'Nous trouver',
      'contact.map.note': 'Ouvrir l\'adresse dans Google Maps',

      /* =====================================================================
       FENÊTRE DE RÉSERVATION (MODALE)
       ===================================================================== */
      'modal.title': 'Réserver cette chambre via WhatsApp',
      'modal.subtitle': 'Remplissez le formulaire : votre demande sera préparée puis envoyée sur WhatsApp.',
      'modal.room': 'Chambre sélectionnée',
      'modal.close': 'Fermer la fenêtre de réservation',

      'book.name': 'Nom et prénom',
      'book.namePh': 'Ex. Aminatou Njoya',
      'book.phone': 'Numéro de téléphone',
      'book.phonePh': 'Ex. 691 491 948 ou +237 6 91 49 19 48',
      'book.email': 'Adresse email',
      'book.emailPh': 'Ex. aminatou.njoya@email.cm',
      'book.checkIn': 'Date d\'arrivée',
      'book.checkOut': 'Date de départ',
      'book.adults': 'Adultes',
      'book.children': 'Enfants',
      'book.rooms': 'Nombre de chambres',
      'book.requests': 'Demandes particulières',
      'book.requestsPh': 'Lit d\'appoint, arrivée tardive, allergie, berceau…',
      'book.requestsOptional': 'facultatif',
      'book.submit': 'Continuer sur WhatsApp',
      'book.copy': 'Copier le message',
      'book.copied': 'Message copié dans le presse-papiers.',
      'book.copyFailed': 'Copie impossible : copiez le texte manuellement.',

      'book.estimate.title': 'Estimation de votre séjour',
      'book.estimate.nights': 'Nombre de nuits',
      'book.estimate.nightsValue': '{n} nuit(s)',
      'book.estimate.total': 'Total hébergement estimé',
      'book.estimate.formula': '{price} × {nights} nuit(s) × {rooms} chambre(s)',
      'book.estimate.perRoom': 'Par chambre et par nuit',
      'book.estimate.guests': 'Clients',
      'book.estimate.excludedTitle': 'Non compris dans cette estimation',
      'book.estimate.excluded':
        'Repas et boissons au restaurant et au bar, événements, massages et cours de tennis.',
      'book.estimate.disclaimer':
        'Cette estimation est indicative et calculée à partir du tarif par nuit affiché sur le site. Elle ne constitue pas un devis. Le tarif final, la disponibilité et les conditions sont confirmés par l\'hôtel avant validation de votre réservation.',
      'book.estimate.nightly': 'Tarif par nuit',
      'book.estimate.capacityHint':
        'Capacité de cette chambre : {n} clients par chambre. Pour {rooms} chambre(s), {max} clients au maximum.',

      'book.error.required': 'Ce champ est obligatoire.',
      'book.error.name': 'Indiquez votre nom et prénom (2 caractères minimum).',
      'book.error.phone': 'Indiquez un numéro de téléphone valide (chiffres, espaces, + et - autorisés).',
      'book.error.email': 'Indiquez une adresse email valide ou laissez le champ vide.',
      'book.error.date': 'Indiquez une date valide.',
      'book.error.dateFormat': 'Indiquez une date au format jour/mois/année.',
      'book.error.pastDate': 'La date d\'arrivée ne peut pas être dans le passé.',
      'book.error.sameDay': 'La date de départ doit être postérieure à la date d\'arrivée.',
      'book.error.checkOutBefore': 'La date de départ doit être postérieure à la date d\'arrivée.',
      'book.error.positive': 'Indiquez un nombre supérieur ou égal à {min}.',
      'book.error.integer': 'Indiquez un nombre entier.',
      'book.error.maxRooms': 'Vous pouvez demander {max} chambres au maximum par demande.',
      'book.error.capacity':
        'Capacité insuffisante : {n} client(s) demandé(s) pour {rooms} chambre(s), soit {max} au maximum. Réduisez le nombre de clients ou augmentez le nombre de chambres.',
      'book.error.summary': 'Le formulaire contient {n} erreur(s). Corrigez les champs indiqués.',

      'book.whatsapp.title': 'Votre demande est prête',
      'book.whatsapp.text':
        'Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp avec votre message de réservation.',
      'book.whatsapp.explain':
        'Vous serez redirigé vers WhatsApp pour envoyer votre demande. La réservation sera confirmée par l\'hôtel après vérification des disponibilités et du tarif.',
      'book.whatsapp.open': 'Ouvrir WhatsApp',
      'book.whatsapp.notSent':
        'L\'ouverture de WhatsApp n\'envoie aucun message : vous devez valider l\'envoi vous-même. Aucune réservation n\'est confirmée à ce stade.',
      'book.whatsapp.preview': 'Aperçu du message',
      'book.whatsapp.fallback':
        'WhatsApp ne s\'est pas ouvert ?',
      'book.whatsapp.copy': 'Copier le message',
      'book.whatsapp.copied': 'Message copié dans le presse-papiers.',
      'book.whatsapp.number': 'Numéro de l\'hôtel',
      'book.whatsapp.sendSms': 'Envoyer par SMS',
      'book.whatsapp.call': 'Appeler l\'hôtel',
      'book.whatsapp.back': 'Modifier ma demande',
      'book.whatsapp.done': 'Fermer',

      'book.error.required.guests': 'Au moins un adulte est requis.',
      'book.summary.rooms': 'Chambres demandées',
      'book.summary.capacity': 'Capacité totale',

      /* Motif du message WhatsApp (utilisé par booking.js) */
      'wa.greeting': 'Bonjour Royal Guest Garden, je souhaite réserver une chambre.',
      'wa.hotelLine': 'Hôtel : {hotel} — {address}',
      'wa.room': 'Chambre : {name} ({ref})',
      'wa.category': 'Catégorie : {category}',
      'wa.nightly': 'Tarif par nuit : {price}',
      'wa.dates': 'Arrivée : {checkIn} · Départ : {checkOut}',
      'wa.nightsRooms': '{nights} nuit(s) · {rooms} chambre(s)',
      'wa.guests': 'Clients : {adults} adulte(s), {children} enfant(s)',
      'wa.total': 'Total hébergement estimé : {total}',
      'wa.estimateNote': 'Estimation calculée sur le tarif par nuit du site.',
      'wa.requests': 'Demandes particulières : {text}',
      'wa.name': 'Nom : {text}',
      'wa.phone': 'Téléphone : {text}',
      'wa.email': 'Email : {text}',
      'wa.link': 'Détails de la chambre : {link}',
      'wa.footer':
        'Cette demande n\'est pas encore confirmée. Merci de me confirmer la disponibilité et le tarif final.',
      'wa.contactGreeting':
        'Bonjour Royal Guest Garden, je souhaite des informations concernant vos chambres et vos services.',
      'wa.contactSubject': 'Objet : {subject}',
      'wa.contactMessage': 'Message : {text}',

      'error.generic': 'Une erreur est survenue. Merci de réessayer.',
      'error.imageMissing': 'Image indisponible'
    },

    /* =====================================================================
       ENGLISH
       ===================================================================== */
    en: {
      'lang.code': 'en',
      'lang.name': 'English',
      'lang.other': 'Français',
      'lang.switch': 'Switch to French',
      'lang.switchTo': 'Switch to English',

      'a11y.skip': 'Skip to main content',
      'a11y.menuOpen': 'Open menu',
      'a11y.menuClose': 'Close menu',
      'a11y.book': 'Book this room via WhatsApp',
      'a11y.gallery': 'Room gallery',
      'a11y.thumb': 'View photo {n}',
      'a11y.lightbox': 'Photo viewer',
      'a11y.prev': 'Previous photo',
      'a11y.next': 'Next photo',
      'a11y.close': 'Close',
      'a11y.results': 'Search results',
      'a11y.floatingWa': 'Contact the hotel on WhatsApp',
      'a11y.external': 'opens in a new tab',
    'a11y.breadcrumb': 'Breadcrumb',
    'a11y.roomSections': 'Sections of this room page',
    'a11y.practical': 'Practical information',
    'a11y.pagination': 'Room list pagination',

      'nav.home': 'Home',
      'nav.rooms': 'Rooms',
      'nav.services': 'Services',
      'nav.reglement': 'House rules',
      'nav.about': 'About',
      'nav.contact': 'Contact & access',
      'nav.primary': 'Main navigation',
      'nav.utility': 'Secondary navigation',
      'nav.langLabel': 'Change language',

      'common.perNight': '/ night',
      'common.perPerson': '/ person',
      'common.from': 'From',
      'common.guests': 'guests',
      'common.guest': 'guest',
      'common.m2': 'm²',
      'common.seeDetails': 'View details',
      'common.bookWa': 'Book via WhatsApp',
      'common.bookThis': 'Book this room via WhatsApp',
      'common.inquireWa': 'Enquire via WhatsApp',
      'common.quoteWa': 'Request a quote via WhatsApp',
      'common.demoBadge': 'Demonstration content',
      'demo.notice':
        'Demonstration: the rooms, rates, reviews and contact details shown on this site are examples. Actual availability must be confirmed by the hotel.',
      'common.perNightShort': 'per night',
      'common.category': 'Category',
      'common.capacity': 'Capacity',
      'common.beds': 'Bedding',
      'common.amenities': 'Amenities',
      'common.size': 'Size',
      'common.floor': 'Floor',
      'common.view': 'View',
      'common.ref': 'Reference',
      'common.all': 'All',
      'common.or': 'or',
      'common.optional': 'optional',
      'common.required': 'required',
      'common.backHome': 'Back to home',
      'common.backRooms': 'Back to all rooms',

      'footer.tagline': 'Comfort, elegance & serenity',
      'footer.about':
        'A 4-star hotel in Yaoundé, at the end of Hippodrome Road. Ten rooms and suites, a restaurant, a bar, a pool and a tennis court.',
      'footer.nav': 'Navigation',
      'footer.contact': 'Contact',
      'footer.hours': 'Opening hours',
      'footer.address': 'Address',
      'footer.rights': 'All rights reserved.',
      'footer.legal': 'Legal notice',
      'footer.legalText':
        'Demonstration website. Rooms, rates, services, testimonials and contact details are samples and do not constitute a firm commercial offer. Real availability must be confirmed by the hotel.',
      'footer.madeIn': 'Static website — HTML, CSS and JavaScript',

      'demo.banner':
        'Demonstration: the rooms, rates, testimonials and contact details on this website are samples. Real availability must be confirmed by the hotel.',

      'wa.floatingLabel': 'Chat on WhatsApp',
      'wa.title': 'Royal Guest Garden — WhatsApp',
      'wa.prefill': 'Hello, I would like information about your rooms and services.',

      'home.metaTitle': 'Hotel in Yaoundé — Royal Guest Garden',
      'home.metaDesc':
        'Royal Guest Garden, a 4-star hotel in Yaoundé, at the end of Hippodrome Road. Ten rooms from 50,000 FCFA per night, restaurant, pool and tennis. Book via WhatsApp.',
      'home.badge': '4-star hotel · Yaoundé, at the end of Hippodrome Road',
      'home.hero.title': 'Comfort, elegance & serenity',
      'home.hero.subtitle':
        'At the end of Hippodrome Road, a little over one kilometre from Yaoundé\'s administrative centre, Royal Guest Garden welcomes business travellers, couples and families in a calm, well-kept setting. Ten rooms from 50,000 FCFA per night.',
      'home.hero.imageAlt': 'Reception hall of Royal Guest Garden in Yaoundé',
      'home.hero.cta1': 'Discover our rooms',
      'home.hero.cta2': 'Book via WhatsApp',
      'home.hero.scroll': 'Scroll',
      'home.quick.checkin': 'Check-in',
      'home.quick.checkout': 'Check-out',
      'home.quick.reception': 'Reception',
      'home.quick.value24': 'Front desk open 24/7',
      'home.quick.from': 'Rooms from',

      'home.intro.eyebrow': 'Welcome',
      'home.intro.title': 'A city hotel that knows Cameroonian hospitality',
      'home.intro.p1':
        'Royal Guest Garden is a four-star hotel at the end of Hippodrome Road in Yaoundé. Behind its understated façade, the hotel offers ten rooms and suites over seven floors, a restaurant serving Cameroonian and international cuisine, a bar that stays open late, a twenty-metre pool in a tropical garden and a clay tennis court.',
      'home.intro.p2':
        'Several rooms are named after nearby places and districts — Waza, Mouessi, Ntem, Febe, Lobe, Oku and Laakam — while No NAME adds a room with a name of its own. It is a way of saying that the hotel belongs to its neighbourhood and that every traveller is expected like a neighbour.',
      'home.intro.p3':
        'Our team is available around the clock, reception is open 24/7, and every booking request is handled directly on WhatsApp by a named member of staff.',
      'home.intro.cta': 'Learn more about the hotel',

      'home.featured.eyebrow': 'Our rooms',
      'home.featured.title': 'Featured rooms',
      'home.featured.subtitle':
        'Explore our Standard rooms, Junior Suites, Senior Suites and VVIP suite.',
      'home.featured.all': 'See all 10 rooms',

      'home.services.eyebrow': 'Our services',
      'home.services.title': 'Everything on site, from breakfast to the tennis court',
      'home.services.subtitle':
        'Accommodation, dining, bar, pool, events: six services for a stay that never needs to leave the hotel.',
      'home.services.all': 'Discover all services',

      'home.benefits.eyebrow': 'Why choose us',
      'home.benefits.title': 'The Royal Guest Garden advantages',
      'home.benefits.subtitle': 'Six concrete reasons, verifiable from the moment you arrive.',

      'home.testimonials.eyebrow': 'Guest reviews',
      'home.testimonials.title': 'What our customers say',
      'home.testimonials.subtitle':
        'Demonstration testimonials.',
      'home.testimonials.demoNote':
        'Sample testimonials: these reviews are fictional and are used only to demonstrate the layout.',

      'home.cta.eyebrow': 'Booking',
      'home.cta.title': 'Your room is waiting',
      'home.cta.subtitle':
        'Choose your room, prepare your request in seconds and send it straight to WhatsApp. The hotel replies to confirm availability and the final rate.',
      'home.cta.step1': 'Choose a room',
      'home.cta.step2': 'Enter your dates and travellers',
      'home.cta.step3': 'Send your request on WhatsApp',
      'home.cta.step1Text':
        'Browse the ten rooms and compare the facilities and the rates in FCFA.',
      'home.cta.step2Text':
        'The website calculates the number of nights and the estimated total of your stay.',
      'home.cta.step3Text':
        'Your request opens in WhatsApp: all you have to do is send it to the hotel.',
      'home.cta.note':
        'Opening WhatsApp is not a confirmed booking: only the hotel can confirm availability and the final rate.',

      'rooms.metaTitle': 'Our rooms — Royal Guest Garden Yaoundé',
      'rooms.metaDesc':
        'Explore all 10 rooms at Royal Guest Garden in Yaoundé, including No NAME at 50,000 FCFA per night. Book via WhatsApp.',
      'rooms.badge': '10 rooms and suites',
      'rooms.hero.title': 'Our rooms',
      'rooms.hero.subtitle':
        'Ten rooms and suites, including No NAME. Filter by budget, number of travellers and preferred amenities.',
      'rooms.hero.imageAlt': 'A room at Royal Guest Garden',

      'rooms.filters.title': 'Filter the rooms',
      'rooms.filters.category': 'Category',
      'rooms.filters.categoryAll': 'All categories',
      'rooms.filters.budget': 'Maximum budget per night',
      'rooms.filters.budgetValue': '{amount} maximum',
      'rooms.filters.budgetMin': '{amount}',
      'rooms.filters.capacity': 'Minimum number of guests',
      'rooms.filters.capacityAll': 'Any',
      'rooms.filters.amenities': 'Required amenities',
      'rooms.filters.amenitiesAll': 'No amenity required',
      'rooms.filters.sort': 'Sort by',
      'rooms.filters.reset': 'Reset filters',
      'rooms.filters.activeCount': '{n} active filter(s)',
      'rooms.filters.none': 'No active filter',
      'rooms.filters.collapsed': 'Show filters',
      'rooms.filters.expanded': 'Hide filters',

      'rooms.sort.recommended': 'Hotel selection',
      'rooms.sort.priceAsc': 'Price: low to high',
      'rooms.sort.priceDesc': 'Price: high to low',
      'rooms.sort.capacityDesc': 'Capacity: high to low',

      'rooms.results.count': '{n} room(s) found',
      'rooms.results.countOne': '{n} room found',
      'rooms.empty.title': 'No room matches your search',
      'rooms.empty.text':
        'Try raising your maximum budget, reducing the number of guests or removing an amenity.',
      'rooms.empty.reset': 'Reset filters',
      'rooms.disclaimer.title': 'Important',
      'rooms.disclaimer.text':
        'The availability shown on this website is sample data and does not reflect real-time availability. Any availability and final rate must be confirmed by the hotel before your booking is validated.',
      'rooms.pager': 'Page {current} of {total}',
      'rooms.prevPage': 'Previous page',
      'rooms.nextPage': 'Next page',
      'rooms.showing': 'Showing {from} to {to} of {total} rooms',

      'card.capacityLabel': '{n} guests maximum',
      'card.capacityLabelOne': '{n} guest maximum',
      'card.amenitiesMore': '+{n} more amenity/amenities',
      'card.featured': 'Featured',
      'card.bookAria': 'Book room {name} via WhatsApp',
      'card.detailsAria': 'View details of room {name}',

      'room.metaTitle': 'Room details — Royal Guest Garden',
      'room.metaDesc':
        'Photos, amenities, capacity, bedding and rates in FCFA for our rooms and suites.',
      'room.notFoundTitle': 'Room not found',
      'room.notFoundText':
        'The requested room does not exist or its identifier is incorrect. It may have been removed from the catalogue.',
      'room.backRooms': 'View all rooms',
      'room.tabOverview': 'Overview',
      'room.tabGallery': 'Gallery ({n} photos)',
      'room.tabInfo': 'Information',
      'room.tabServices': 'Included services',
      'room.tabPolicy': 'Conditions',

      'room.gallery.title': 'Photo gallery',
      'room.gallery.hint': 'Click a photo to enlarge it. Use the arrows to browse.',
      'room.gallery.counter': 'Photo {current} of {total}',
      'room.gallery.alt': 'Photo {n} of room {name}',
      'room.mainImageAlt': 'Main view of room {name}',

      'room.summary.title': 'At a glance',
      'room.summary.price': 'Rate per night',
      'room.summary.priceFrom': 'from {price}',
      'room.summary.capacity': 'Maximum guests',
      'room.summary.beds': 'Bedding',
      'room.summary.size': 'Size',
      'room.summary.floor': 'Floor',
      'room.summary.view': 'View',
      'room.summary.ref': 'Reference',
      'room.summary.category': 'Category',
      'room.overview.title': 'About this room',
      'room.amenities.title': 'Amenities',
      'room.amenities.all': 'All amenities are included in the room rate.',

      'room.included.title': 'Included in the rate',
      'room.included.lists': {
        fr: [
          'Hot water and private bathroom 24/7',
          'Air conditioning and unlimited fibre Wi-Fi',
          'Satellite TV and international channels',
          'House linen and towels changed daily',
          'Fibre Wi-Fi and access to the shared lounge',
          '24/7 security and controlled access',
          'Access to the pool and relaxation areas'
        ],
        en: [
          'Hot water and private bathroom 24/7',
          'Air conditioning and unlimited fibre Wi-Fi',
          'Satellite TV and international channels',
          'House linen and towels changed daily',
          'Fibre Wi-Fi and access to the shared lounge',
          '24/7 security and controlled access',
          'Access to the pool and relaxation areas'
        ]
      },

      'room.excluded.title': 'Not included in the displayed rate',
      'room.excluded.lists': {
        fr: [
          'Meals and drinks in the restaurant and bar (in-room dining charged separately)',
          'Conference room hire and private events',
          'Wellness corner massages and tennis lessons',
          'Additional extra bed (8,000 FCFA per night)'
        ],
        en: [
          'Meals and drinks in the restaurant and bar (in-room dining charged separately)',
          'Conference room hire and private events',
          'Wellness corner massages and tennis lessons',
          'Additional extra bed (8,000 FCFA per night)'
        ]
      },

      'room.taxes.title': 'Taxes and charges',
      'room.taxes.included': 'Taxes included in the displayed rate.',
      'room.taxes.notIncluded': 'Taxes not included in the displayed rate.',
      'room.taxes.note': 'Rates shown are indicative and expressed in CFA francs (FCFA).',

      'room.policy.title': 'Hotel information',
      'room.policy.subtitle':
        'The times and conditions below are hotel information, editable by the hotel.',
      'room.policy.checkIn': 'Check-in time',
      'room.policy.checkOut': 'Check-out time',
      'room.policy.cancellation': 'Cancellation',
      'room.policy.note':
        'This information is indicative and may be changed by the hotel. Please confirm it when you book.',

      'room.similar.title': 'Similar rooms',
      'room.similar.subtitle': 'In the same price range or the same category.',
      'room.similar.empty': 'No other room currently matches this range.',

      'room.cta.title': 'Book this room',
      'room.cta.text':
        'Your request will be prepared and sent via WhatsApp. The hotel will check availability and confirm the final rate.',
      'room.cta.note': 'Opening WhatsApp does not constitute a confirmed booking.',

      'services.metaTitle': 'Our services — Royal Guest Garden Yaoundé',
      'services.metaDesc':
        'Accommodation, restaurant and breakfast, bar and lounge, pool, events and conferences, tennis court at Royal Guest Garden in Yaoundé. Rates in FCFA.',
      'services.badge': '6 services',
      'services.hero.title': 'Our services',
      'services.hero.subtitle':
        'A complete hotel: accommodation, dining, bar, pool, function rooms and tennis. Each service states clearly whether it is included in the room rate or charged separately.',
      'services.hero.imageAlt': 'Bar and lounge at Royal Guest Garden',

      'services.includedBadge': 'Included in the rate',
      'services.partlyBadge': 'Partly included',
      'services.extraBadge': 'Charged separately',
      'services.practical': 'Practical information',
      'services.hours': 'Opening hours',
      'services.pricing': 'Sample rates',
      'services.pricingNote':
        'Indicative rates in FCFA, which may vary according to the service, the season and the number of guests.',
      'services.quoteOnly': 'Quotation only — we reply within 24 business hours.',
      'services.inquiryInfo': 'Enquire via WhatsApp',
      'services.inquiryQuote': 'Request a quote via WhatsApp',
      'services.cta.title': 'A question about one of our services?',
      'services.cta.text':
        'Message us on WhatsApp: we usually reply within a few minutes during opening hours.',

      'about.metaTitle': 'About us — Royal Guest Garden Yaoundé',
      'about.metaDesc':
        'Discover Royal Guest Garden, a 4-star hotel in Yaoundé: our atmosphere, our values, our location and the experience we offer each type of traveller.',
      'about.badge': '4-star hotel · At the end of Hippodrome Road',
      'about.hero.title': 'About Royal Guest Garden',
      'about.hero.subtitle':
        'An elegant, welcoming city hotel at the end of Hippodrome Road in Yaoundé, a little over one kilometre from the administrative centre and six kilometres from the airport.',
      'about.hero.imageAlt': 'Façade of Royal Guest Garden',

      'about.story.eyebrow': 'Our story',
      'about.story.title': 'A place designed for the city',
      'about.story.p1':
        'Royal Guest Garden grew out of a simple observation: Yaoundé has plenty of hotels, but few places that combine the rigour of a city hotel with the warmth of a Cameroonian home. We wanted to create that place — a hotel where you can stay one night on business or three weeks on holiday.',
      'about.story.p2':
        'The hotel is built around a 2,000 m² tropical garden, a twenty-metre pool and an à la carte restaurant opening onto the greenery. The rooms, from simple to prestigious, all look out onto landscaped space: the morning light is part of the stay.',
      'about.story.p3':
        'Our team looks after the welcome and smooth running of the hotel. The front desk is open 24/7.',

      'about.atmosphere.eyebrow': 'Our atmosphere',
      'about.atmosphere.title': 'Discreet elegance, family warmth',
      'about.atmosphere.p1':
        'The hotel\'s navy and gold palette, dark wood, linen fabrics and the golden light of evening create an atmosphere that is both formal and genuinely welcoming. Our guests often put it this way: "you feel received, not just accommodated".',
      'about.atmosphere.p2':
        'The welcome is warm and the atmosphere is restful. Enjoy breakfast, a comfortable room and a peaceful setting to feel at home, 1,200 kilometres from home.',

      'about.location.eyebrow': 'Location',
      'about.location.title': 'At the end of Hippodrome Road, Yaoundé',
      'about.location.text':
        'The hotel is at the end of Hippodrome Road, in a quiet residential district, a little over one kilometre from the ministries and administrative centre, and about six kilometres from Yaoundé-Nsimalen International Airport.',
      'about.location.map': 'View the location on Google Maps',
      'about.location.landmarks': 'Nearby',

      'about.values.eyebrow': 'Our values',
      'about.values.title': 'Four commitments we keep',
      'about.values.subtitle':
        'They are not just for the brochure: you can verify them the moment you arrive.',

      'about.experience.eyebrow': 'Your stay',
      'about.experience.title': 'A hotel for every type of journey',
      'about.experience.subtitle':
        'Business travellers, couples, families, tourists: the hotel adapts to your rhythm.',

      'about.gallery.eyebrow': 'Gallery',
      'about.gallery.title': 'Royal Guest Garden in pictures',
      'about.gallery.hint': 'Click a photo to enlarge it. Demonstration photos.',

      'about.team.eyebrow': 'Our team',
      'about.team.title': 'The people behind the hotel',
      'about.team.subtitle':
        'A demonstration team, presented to illustrate the layout of the website.',
      'about.team.demoNote':
        'The people and photographs above are fictional and are used for demonstration purposes only.',
      'about.team.contact': 'Contact the hotel',

      'about.cta.title': 'Come and see us',
      'about.cta.text':
        'A question before you arrive? Message us on WhatsApp or call reception, open 24/7.',

      'reglement.metaTitle': 'House rules — Royal Guest Garden Yaoundé',
      'reglement.metaDesc':
        'Read the Royal Guest Garden residence house rules in Yaoundé: restrictions, safety guidelines and emergency numbers.',

      'contact.metaTitle': 'Contact & access — Royal Guest Garden Yaoundé',
      'contact.metaDesc':
        'Address, phone, email, opening hours and directions for Royal Guest Garden, at the end of Hippodrome Road, Yaoundé. WhatsApp contact and enquiry form.',
      'contact.badge': 'Yaoundé · At the end of Hippodrome Road',
      'contact.hero.title': 'Contact & access',
      'contact.hero.subtitle':
        'Our reception is open 24/7. For a quick booking, the fastest route is WhatsApp.',
      'contact.hero.imageAlt': 'Entrance of Royal Guest Garden',

      'contact.wa.title': 'Message us on WhatsApp',
      'contact.wa.text':
        'The quickest way to get an answer: write to us and we usually reply within a few minutes during opening hours.',
      'contact.wa.primary': 'Primary WhatsApp number',
      'contact.wa.secondary': 'Second number',
      'contact.wa.defaultMessage':
        'Hello Royal Guest Garden, I would like information about your rooms and services.',

      'contact.info.title': 'Contact details',
      'contact.info.address': 'Address',
      'contact.info.phone': 'Phone',
      'contact.info.email': 'Email',
      'contact.info.hours': 'Opening hours',
      'contact.info.map': 'Directions',
      'contact.info.reception': 'Reception',
      'contact.info.restaurant': 'Restaurant',
      'contact.info.checkIn': 'Check-in / Check-out',

      'contact.hours.title': 'Opening hours',
      'contact.hours.reception': 'Reception',
      'contact.hours.frontdesk': 'Reception and check-in',
      'contact.hours.breakfast': 'Breakfast',
      'contact.hours.restaurant': 'Restaurant',
      'contact.hours.bar': 'Bar and lounge',
      'contact.hours.pool': 'Swimming pool',
      'contact.hours.tennis': 'Tennis court',
      'contact.hours.always': 'Open 24/7',
      'contact.hours.note':
        'These hours are indicative and may change. For a service outside these times, please contact reception.',

      'contact.access.title': 'Getting to the hotel',
      'contact.access.byCar': 'By car',
      'contact.access.byCarText':
        'The hotel has free private parking for guests in the Mont Cameroun, Dja, Laakam and Oku rooms. For other rooms, monitored parking is available 300 m away.',
      'contact.access.byPlane': 'By plane',
      'contact.access.byPlaneText':
        'Yaoundé-Nsimalen International Airport is about 6 km from the hotel.',

      'contact.form.title': 'Enquiry form',
      'contact.form.subtitle':
        'Fill in this form: your request is prepared and then opened in WhatsApp, where you can send it yourself.',
      'contact.form.name': 'Full name',
      'contact.form.namePh': 'e.g. Aminatou Njoya',
      'contact.form.phone': 'Phone number',
      'contact.form.phonePh': 'e.g. 691 491 948',
      'contact.form.email': 'Email address',
      'contact.form.emailPh': 'e.g. aminatou.njoya@email.cm',
      'contact.form.subject': 'Enquiry subject',
      'contact.form.message': 'Your message',
      'contact.form.messagePh':
        'Describe your request: dates, number of guests, type of room you are looking for…',
      'contact.form.optional': 'optional',
      'contact.form.submit': 'Continue on WhatsApp',
      'contact.form.privacy':
        'Your details are neither stored nor sent automatically by this website: they are used only to prepare the WhatsApp message you open, and stay on your device until you send it.',
      'contact.form.success': 'Your request is ready. Check the message in WhatsApp before sending it.',
      'contact.form.errorSummary': 'The form contains {n} error(s).',
      'contact.form.notSent':
        'No message has been sent automatically. You must confirm the send in WhatsApp.',
      'contact.form.fallbackTitle': 'The message did not open?',
      'contact.form.fallbackText':
        'WhatsApp may not be installed on this device. You can copy the prepared message and send it to the hotel by SMS or by phone call.',
      'contact.form.copy': 'Copy the message',
      'contact.form.copied': 'Message copied to the clipboard.',
      'contact.form.copyFailed': 'Copy failed. Select the text below and copy it manually.',
      'contact.form.preview': 'Message preview',
      'contact.form.callHotel': 'Call the hotel',
      'contact.form.number': 'Hotel number',

      'contact.subjects.availability': 'Availability and rates',
      'contact.subjects.reservation': 'Booking request',
      'contact.subjects.event': 'Event or conference',
      'contact.subjects.group': 'Group booking',
      'contact.subjects.complaint': 'Complaint or suggestion',
      'contact.subjects.other': 'Other enquiry',

      'contact.map.title': 'Find us',
      'contact.map.note': 'Open the address in Google Maps',

      'modal.title': 'Book this room via WhatsApp',
      'modal.subtitle':
        'Fill in the form: your request will be prepared and then sent via WhatsApp.',
      'modal.room': 'Selected room',
      'modal.close': 'Close the booking window',

      'book.name': 'Full name',
      'book.namePh': 'e.g. Aminatou Njoya',
      'book.phone': 'Phone number',
      'book.phonePh': 'e.g. 691 491 948 or +237 6 91 49 19 48',
      'book.email': 'Email address',
      'book.emailPh': 'e.g. aminatou.njoya@email.cm',
      'book.checkIn': 'Check-in date',
      'book.checkOut': 'Check-out date',
      'book.adults': 'Adults',
      'book.children': 'Children',
      'book.rooms': 'Number of rooms',
      'book.requests': 'Special requests',
      'book.requestsPh': 'Extra bed, late arrival, allergy, cot…',
      'book.requestsOptional': 'optional',
      'book.submit': 'Continue on WhatsApp',
      'book.copy': 'Copy the message',
      'book.copied': 'Message copied to the clipboard.',
      'book.copyFailed': 'Copy failed: please copy the text manually.',

      'book.estimate.title': 'Estimated cost of your stay',
      'book.estimate.nights': 'Number of nights',
      'book.estimate.nightsValue': '{n} night(s)',
      'book.estimate.total': 'Estimated accommodation total',
      'book.estimate.formula': '{price} × {nights} night(s) × {rooms} room(s)',
      'book.estimate.perRoom': 'Per room per night',
      'book.estimate.guests': 'Guests',
      'book.estimate.excludedTitle': 'Not included in this estimate',
      'book.estimate.excluded':
        'Meals and drinks in the restaurant and bar, events, massages and tennis lessons.',
      'book.estimate.disclaimer':
        'This estimate is indicative and calculated from the nightly rate shown on the website. It is not a quotation. The final rate, availability and conditions are confirmed by the hotel before your booking is validated.',
      'book.estimate.nightly': 'Nightly rate',
      'book.estimate.capacityHint':
        'Capacity of this room: {n} guests per room. For {rooms} room(s), {max} guests maximum.',

      'book.error.required': 'This field is required.',
      'book.error.name': 'Please enter your full name (at least 2 characters).',
      'book.error.phone': 'Please enter a valid phone number (digits, spaces, + and - allowed).',
      'book.error.email': 'Please enter a valid email address or leave the field empty.',
      'book.error.date': 'Please enter a valid date.',
      'book.error.dateFormat': 'Please enter a date in day/month/year format.',
      'book.error.pastDate': 'The check-in date cannot be in the past.',
      'book.error.sameDay': 'The check-out date must be after the check-in date.',
      'book.error.checkOutBefore': 'The check-out date must be after the check-in date.',
      'book.error.positive': 'Please enter a number greater than or equal to {min}.',
      'book.error.integer': 'Please enter a whole number.',
      'book.error.maxRooms': 'You can request a maximum of {max} rooms per enquiry.',
      'book.error.capacity':
        'Capacity exceeded: {n} guest(s) requested for {rooms} room(s), i.e. {max} maximum. Reduce the number of guests or increase the number of rooms.',
      'book.error.summary': 'The form contains {n} error(s). Please correct the highlighted fields.',

      'book.whatsapp.title': 'Your request is ready',
      'book.whatsapp.text':
        'Click the button below to open WhatsApp with your booking request.',
      'book.whatsapp.explain':
        'You will be redirected to WhatsApp to send your request. The booking will be confirmed by the hotel after checking availability and rates.',
      'book.whatsapp.open': 'Open WhatsApp',
      'book.whatsapp.notSent':
        'Opening WhatsApp does not send any message: you must confirm the send yourself. No booking is confirmed at this stage.',
      'book.whatsapp.preview': 'Message preview',
      'book.whatsapp.fallback': 'WhatsApp did not open?',
      'book.whatsapp.copy': 'Copy the message',
      'book.whatsapp.copied': 'Message copied to the clipboard.',
      'book.whatsapp.number': 'Hotel number',
      'book.whatsapp.sendSms': 'Send by SMS',
      'book.whatsapp.call': 'Call the hotel',
      'book.whatsapp.back': 'Edit my request',
      'book.whatsapp.done': 'Close',

      'book.error.required.guests': 'At least one adult is required.',
      'book.summary.rooms': 'Rooms requested',
      'book.summary.capacity': 'Total capacity',

      'wa.greeting': 'Hello Royal Guest Garden, I would like to book a room.',
      'wa.hotelLine': 'Hotel: {hotel} — {address}',
      'wa.room': 'Room: {name} ({ref})',
      'wa.category': 'Category: {category}',
      'wa.nightly': 'Rate per night: {price}',
      'wa.dates': 'Check-in: {checkIn} · Check-out: {checkOut}',
      'wa.nightsRooms': '{nights} night(s) · {rooms} room(s)',
      'wa.guests': 'Guests: {adults} adult(s), {children} child(ren)',
      'wa.total': 'Estimated accommodation total: {total}',
      'wa.estimateNote': 'Estimate calculated from the nightly rate shown on the website.',
      'wa.requests': 'Special requests: {text}',
      'wa.name': 'Name: {text}',
      'wa.phone': 'Phone: {text}',
      'wa.email': 'Email: {text}',
      'wa.link': 'Room details: {link}',
      'wa.footer':
        'This request is not yet confirmed. Please confirm availability and the final rate.',
      'wa.contactGreeting':
        'Hello Royal Guest Garden, I would like information about your rooms and services.',
      'wa.contactSubject': 'Subject: {subject}',
      'wa.contactMessage': 'Message: {text}',

      'error.generic': 'Something went wrong. Please try again.',
      'error.imageMissing': 'Image unavailable'
    }
  };

  /* ---------------------------------------------------------------------
     Moteur i18n
     --------------------------------------------------------------------- */
  var DEFAULT_LANG = 'fr';
  var current = DEFAULT_LANG;
  var listeners = [];

  function detect() {
    var cfg = window.RGG_CONFIG && window.RGG_CONFIG.site ? window.RGG_CONFIG.site : {};
    var allowed = cfg.langs || ['fr', 'en'];
    var key = cfg.langStorageKey || 'rgg_lang';

    // 1) paramètre d'URL  ?lang=en
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q && allowed.indexOf(q.toLowerCase()) !== -1) return q.toLowerCase();
    } catch (e) {
      /* ignore */
    }
    // 2) préférence mémorisée (langue uniquement, aucune donnée personnelle)
    try {
      var saved = window.localStorage.getItem(key);
      if (saved && allowed.indexOf(saved) !== -1) return saved;
    } catch (e) {
      /* ignore */
    }
    // 3) langue par défaut du site : le français.
    //    On ne se fie pas à navigator.language : un visiteur dont le système
    //    est en anglais (très fréquent au Cameroun) doit tout de même voir
    //    le site en français, et peut changer de langue avec le bouton.
    return DEFAULT_LANG;
  }

  function get() {
    return current;
  }

  /**
   * Traduit une clé. Les variables {x} sont remplacées par params.
   * t('rooms.results.count', { n: 12 }) → « 12 chambre(s) trouvée(s) »
   */
  function t(key, params) {
    var table = DICT[current] || DICT[DEFAULT_LANG];
    var value = table[key];
    if (value === undefined) value = DICT[DEFAULT_LANG][key];
    if (value === undefined) return key;
    if (typeof value === 'object') return value; // valeurs bilingues (tableaux FR/EN)
    return interpolate(String(value), params);
  }

  /** Renvoie la version de la langue courante d'une valeur bilingue {fr, en}. */
  function pick(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (value[current] !== undefined) return value[current];
      if (value[DEFAULT_LANG] !== undefined) return value[DEFAULT_LANG];
    }
    return '';
  }

  function interpolate(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      return params[name] === undefined ? m : String(params[name]);
    });
  }

  function setLang(lang, opts) {
    var cfg = window.RGG_CONFIG && window.RGG_CONFIG.site ? window.RGG_CONFIG.site : {};
    var allowed = cfg.langs || ['fr', 'en'];
    if (allowed.indexOf(lang) === -1) lang = DEFAULT_LANG;
    if (lang === current && !(opts && opts.force)) return;
    current = lang;
    if (document.documentElement) document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(cfg.langStorageKey || 'rgg_lang', lang);
    } catch (e) {
      /* ignore */
    }
    listeners.forEach(function (fn) {
      try {
        fn(lang);
      } catch (e) {
        /* ignore */
      }
    });
  }

  function toggle() {
    setLang(current === 'fr' ? 'en' : 'fr');
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  /** Applique les traductions à tous les [data-i18n*] présents dans le DOM. */
  function applyStatic(root) {
    var scope = root || document;

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var params = el.dataset.i18nParams ? safeParse(el.dataset.i18nParams) : null;
      var val = t(el.dataset.i18n, params);
      if (typeof val === 'object') return;
      el.textContent = val;
    });

    scope.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var val = t(el.dataset.i18nHtml, null);
      if (typeof val !== 'string') return;
      el.innerHTML = val;
    });

    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (pair) {
        var idx = pair.indexOf(':');
        if (idx < 0) return;
        var attr = pair.slice(0, idx).trim();
        var key = pair.slice(idx + 1).trim();
        var val = t(key, null);
        if (typeof val === 'string') el.setAttribute(attr, val);
      });
    });
  }

  function safeParse(str) {
    try {
      /* jshint evil:true */
      return new Function('return (' + str + ');')();
    } catch (e) {
      return null;
    }
  }

  /** Met à jour <title> et la balise meta description. */
  function applyMeta(titleKey, descKey) {
    if (titleKey) document.title = t(titleKey);
    if (descKey) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', t(descKey));
    }
  }

  /* Démarrage */
  current = detect();

  window.RGG_I18N = {
    t: t,
    pick: pick,
    get: get,
    setLang: setLang,
    toggle: toggle,
    onChange: onChange,
    applyStatic: applyStatic,
    applyMeta: applyMeta,
    DICT: DICT
  };
})();
