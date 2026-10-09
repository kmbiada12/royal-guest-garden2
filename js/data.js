/* =========================================================================
   Royal Guest Garden — Données de démonstration
   -------------------------------------------------------------------------
   10 chambres / catégories, les services de l'hôtel, les équipements,
   les témoignages exemples, les avantages, les valeurs et l'équipe.

   ⚠  CONTENU DE DÉMONSTRATION : tous les textes, tarifs, disponibilités
      et témoignages sont des exemples réalistes. Remplacez-les par vos
      informations réelles avant la mise en ligne.
   ========================================================================= */

(function () {
  'use strict';

  /* Génère une URL Unsplash à la largeur souhaitée. */
  var u = function (id, w) {
    return (
      'https://images.unsplash.com/photo-' +
      id +
      '?auto=format&fit=crop&w=' +
      (w || 1400) +
      '&q=80'
    );
  };

  /* ---------------------------------------------------------------------
     CATÉGORIES DE CHAMBRES
     --------------------------------------------------------------------- */
  var CATEGORIES = [
    { id: 'simple', fr: 'Chambres simples', en: 'Standard rooms' },
    { id: 'junior-suite', fr: 'Suites Juniors', en: 'Junior Suites' },
    { id: 'senior-suite', fr: 'Suites Seniors', en: 'Senior Suites' },
    { id: 'vvip', fr: 'VVIP', en: 'VVIP' }
  ];

  /* ---------------------------------------------------------------------
     ÉQUIPEMENTS  (utilisés par les filtres et les fiches chambre)
     --------------------------------------------------------------------- */
  var AMENITIES = [
    { id: 'eau-chaude', fr: 'Eau chaude', en: 'Hot water' },
    { id: 'climatisation', fr: 'Climatisation', en: 'Air conditioning' },
    { id: 'tv-satellite', fr: 'TV satellite', en: 'Satellite TV' },
    { id: 'cuisine-equipee', fr: 'Cuisine équipée', en: 'Equipped kitchen' },
    { id: 'salon', fr: 'Salon confortable', en: 'Comfortable lounge' },
    { id: 'placards', fr: 'Grands placards', en: 'Large wardrobes' },
    { id: 'lumineuse', fr: 'Chambre lumineuse', en: 'Bright room' },
    { id: 'wifi', fr: 'Wi-Fi fibre', en: 'Fibre Wi-Fi' },
    { id: 'minibar', fr: 'Minibar', en: 'Minibar' },
    { id: 'coffret', fr: 'Coffret de bienvenue', en: 'Welcome amenity kit' },
    { id: 'coffre-fort', fr: 'Coffre-fort', en: 'Safe' },
    { id: 'balcon', fr: 'Balcon privatif', en: 'Private balcony' },
    { id: 'vue-jardin', fr: 'Vue sur le jardin', en: 'Garden view' },
    { id: 'baignoire', fr: 'Baignoire', en: 'Bathtub' },
    { id: 'bureau', fr: 'Bureau de travail', en: 'Work desk' },
    { id: 'seche-cheveux', fr: 'Sèche-cheveux', en: 'Hairdryer' },
    { id: 'bouilloire', fr: 'Bouilloire électrique', en: 'Electric kettle' },
    { id: 'machine-a-laver', fr: 'Machine à laver', en: 'Washing machine' },
    { id: 'piscine', fr: 'Accès piscine', en: 'Pool access' },
    { id: 'tv-55', fr: 'Téléviseur 55 pouces', en: '55-inch TV' },
    { id: 'chauffage', fr: 'Chauffage', en: 'Heating' },
    { id: 'interphone', fr: 'Interphone', en: 'Intercom' },
    { id: 'parking', fr: 'Parking privé', en: 'Private parking' },
    { id: 'securite-24', fr: 'Sûreté 24 h/24', en: '24/7 security' },
    { id: 'petit-dejeuner', fr: 'Petit-déjeuner inclus', en: 'Breakfast included' }
  ];

  /* ---------------------------------------------------------------------
     10 CHAMBRES / CATÉGORIES
     --------------------------------------------------------------------- */
  var ROOMS = [
    {
      id: 'waza',
      ref: 'RGG-01',
      name: 'Waza',
      category: 'senior-suite',
      price: 100000,
      capacity: 2,
      beds: {
        fr: '1 lit double 160 × 200 cm + 1 lit simple 90 × 190 cm',
        en: '1 double bed 160 × 200 cm + 1 single bed 90 × 190 cm'
      },
      size: 24,
      floor: { fr: '2ᵉ étage, aile jardin', en: '2nd floor, garden wing' },
      view: { fr: 'Vue sur le jardin paysager', en: 'View over the landscaped garden' },
      short: {
        fr: 'Découvrez WAza, un espace chaleureux et agréable pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur accueillant, d\'un cadre apaisant et de tout le nécessaire pour vous sentir pleinement chez vous.',
        en: 'The gateway to comfort. A bright, well-equipped room, ideal for a short business trip or a weekend in town.'
      },
      description: {
        fr: 'Découvrez WAza, un espace chaleureux et agréable pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur accueillant, d\'un cadre apaisant et de tout le nécessaire pour vous sentir pleinement chez vous.',
        en: 'The Waza room opens directly onto the landscaped garden of Royal Guest Garden. Its large bay window brings exceptional natural light throughout the day. The light-marble bathroom features an Italian shower, permanent hot water and a hairdryer. A compact desk makes it easy to work, while air conditioning and satellite TV ensure a restful stay. The buffet breakfast is served from 6:30 am to 10:30 am in the hotel restaurant.'
      },
      amenities: [
        'eau-chaude',
        'climatisation',
        'tv-satellite',
        'cuisine-equipee',
        'salon',
        'placards',
        'lumineuse'
      ],
      images: [
        'img/chambres/wazabon/wazab.png',
        'img/chambres/wazabon/Warm wood luxury bedroom retreat-2.png',
        'img/chambres/wazabon/Luxury lounge with carved wood furnishings-3.png',
        'img/chambres/wazabon/Warm wood dining nook-4.png',
        'img/chambres/wazabon/Warm daylight in a polished kitchenette-5.png',
        'img/chambres/wazabon/Luxury hotel living and kitchen in daylight-6.png',
        'img/chambres/wazabon/Elegant hotel doorway air-conditioner detail-7.png',
        'img/chambres/wazabon/Warm-lit luxury hotel bathroom-8.png',
        'img/chambres/wazabon/Elegant lounge with carved wood sofa-9.png',
        'img/chambres/wazabon/Warmly lit luxury hotel basin detail-10.png',
        'img/chambres/wazabon/Luxury rain shower in stone and black-11.png',
        'img/chambres/wazabon/Warm daylight in a luxury stone bathroom-12.png'
      ],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: true
    },

    {
      id: 'no-name',
      ref: 'RGG-02',
      name: 'Lobe',
      category: 'simple',
      price: 50000,
      capacity: 2,
      beds: {
        fr: '1 lit double 140 × 200 cm',
        en: '1 double bed 140 × 200 cm'
      },
      size: 20,
      floor: { fr: '1ᵉʳ étage', en: '1st floor' },
      view: { fr: 'Vue sur la cour intérieure', en: 'View over the inner courtyard' },
      short: {
        fr: 'La chambre la plus simple et la plus économique de la maison, sans compromis sur la propreté ni sur le confort.',
        en: 'The simplest and most affordable room in the house, with no compromise on cleanliness or comfort.'
      },
      description: {
        fr: 'La chambre Lobe est notre chambre la plus accessible. Elle reste volontairement simple : un lit double confortable, un bureau de travail, une armoire et une salle d\'eau fonctionnelle avec eau chaude. Elle convient parfaitement aux clients qui cherchent un hébergement propre, calme et économique à un peu plus d’un kilomètre du centre administratif. Le Wi-Fi fibre et la climatisation sont compris, comme dans toutes les chambres de l\'hôtel.',
        en: 'The Lobe room is our most affordable room. It is deliberately simple: a comfortable double bed, a study desk, a wardrobe and a functional bathroom with hot water. It suits travellers looking for clean, quiet and affordable accommodation a little over one kilometre from the administrative centre. Fibre Wi-Fi and air conditioning are included, as in every room at the hotel.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'wifi',
        'placards',
        'coffret',
        'seche-cheveux',
        'securite-24'
      ],
      images: [
        'img/chambres/lobe/lobe.png',
        'img/chambres/lobe/Luxury hotel lounge with floral seating-1.png',
        'img/chambres/lobe/Gold-Rimmed Vanity in Luxury Hotel Bathroom-2.png',
        'img/chambres/lobe/Sunlit Luxury Suite With Kitchenette-3.png',
        'img/chambres/lobe/Elegant Hotel Kitchenette in Soft Daylight-4.png',
        'img/chambres/lobe/Luxury hotel bedroom in soft daylight-6.png',
        'img/chambres/lobe/Luxury hotel bedroom with cane bed-7.png',
        'img/chambres/lobe/Polished Honey-Wood Wardrobe Alcove-8.png',
        'img/chambres/lobe/Warm Daylight Cane Bed Retreat-9.png',
        'img/chambres/lobe/Elegant hotel shower with glass divider-10.png',
        'img/chambres/lobe/Elegant Hotel Desk in Soft Daylight-11.png'
      ],
      breakfastIncluded: false,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: false
    },

    {
      id: 'mouessi',
      ref: 'RGG-03',
      name: 'Mouessi',
      category: 'senior-suite',
      price: 100000,
      capacity: 3,
      beds: {
        fr: '1 lit double 160 × 200 cm + 1 lit simple 90 × 190 cm',
        en: '1 double bed 160 × 200 cm + 1 single bed 90 × 190 cm'
      },
      size: 27,
      floor: { fr: '2ᵉ étage, aile ville', en: '2nd floor, city wing' },
      view: { fr: 'Vue sur la rue calme de l\'Hippodrome', en: 'View over the quiet Hippodrome street' },
      short: {
        fr: 'Découvrez MOUESSI, un espace confortable et lumineux pensé pour vous offrir un séjour agréable et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et d\'un cadre idéal pour vous détendre comme chez vous.',
        en: 'A generous senior suite, designed for three people or a longer stay.'
      },
      description: {
        fr: 'Découvrez MOUESSI, un espace confortable et lumineux pensé pour vous offrir un séjour agréable et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et d\'un cadre idéal pour vous détendre comme chez vous.',
        en: 'Mouessi is a spacious 27 m² room with a smart layout. The main bed is separated from the extra bed by a partition, so a parent and a child can sleep without disturbing a colleague. The wardrobe is large, the bathroom has powerful hot water and the fibre connection is stable. Breakfast can be added on request when you submit your booking enquiry.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'wifi',
        'placards',
        'bureau',
        'bouilloire',
        'coffret',
        'seche-cheveux',
        'securite-24'
      ],
      images: [
        'img/chambres/mouessi/mouessi.png',
        'img/chambres/mouessi/Warm Modern Luxury Suite-1.png',
        'img/chambres/mouessi/Elegant seating nook in warm daylight-2.png',
        'img/chambres/mouessi/Elegant pedestal table and paisley chairs-3.png',
        'img/chambres/mouessi/Luxury kitchenette in warm daylight-4.png',
        'img/chambres/mouessi/Warm wood interiors with blue-grey drapes-5.png',
        'img/chambres/mouessi/Refined writing desk in warm daylight-7.png',
        'img/chambres/mouessi/Luxury bedroom with rounded cane headboard-8.png',
        'img/chambres/mouessi/Warm luxury room with wood media chest-9.png',
        'img/chambres/mouessi/Keypad hotel safe in warm wardrobe-10.png',
        'img/chambres/mouessi/Luxury suite with wall-mounted AC-11.png',
        'img/chambres/mouessi/Luxury hotel room with mirrored wardrobe-12.png',
        'img/chambres/mouessi/Rounded Cane Bed with Golden Lamps-13.png',
        'img/chambres/mouessi/Warmly lit cane bed retreat-14.png',
        'img/chambres/mouessi/Warm wood-cane bedroom with ensuite-15.png',
        'img/chambres/mouessi/Polished bathroom with twin pink basins-16.png',
        'img/chambres/mouessi/Warm daylight over twin pink sinks-17.png',
        'img/chambres/mouessi/Bedroom View Into Frosted Glass Bath-18.png',
        'img/chambres/mouessi/Sunlit Luxury Interior with Rich Wood.png'
      ],
      breakfastIncluded: false,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: true
    },

    {
      id: 'ntem',
      ref: 'RGG-04',
      name: 'Ntem',
      category: 'junior-suite',
      price: 70000,
      capacity: 2,
      beds: {
        fr: '1 lit king size 180 × 200 cm',
        en: '1 king size bed 180 × 200 cm'
      },
      size: 30,
      floor: { fr: '3ᵉ étage', en: '3rd floor' },
      view: { fr: 'Vue panoramique sur les collines de Yaoundé', en: 'Panoramic view over Yaoundé hills' },
      short: {
        fr: 'Découvrez NTEM, un espace élégant et chaleureux conçu pour vous offrir confort, tranquillité et praticité. Profitez d\'un intérieur agréable, d\'une atmosphère apaisante et de tout le nécessaire pour rendre votre séjour des plus agréables.',
        en: 'Our best value for money: a king size bed, a real lounge area and a view that wakes you up.'
      },
      description: {
        fr: 'Découvrez NTEM, un espace élégant et chaleureux conçu pour vous offrir confort, tranquillité et praticité. Profitez d\'un intérieur agréable, d\'une atmosphère apaisante et de tout le nécessaire pour rendre votre séjour des plus agréables.',
        en: 'The Ntem room opens onto a large south-facing bay window: on waking, the view over the Yaoundé hills is one of the day\'s first pleasures. The 180 × 200 cm king size bed is directly accessible from the living area. A comfortable lounge with two armchairs, a low table and mood lighting completes the ensemble. The grey-marble bathroom offers a rainfall shower and a large mirror.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'lumineuse',
        'placards',
        'bureau',
        'minibar',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'securite-24'
      ],
      images: [
        'img/chambres/ntem/ntem.png',
        'img/chambres/ntem/Luxury hotel bedroom with urban view-1.png',
        'img/chambres/ntem/Luminous luxury bedroom with urban view-2.png',
        'img/chambres/ntem/Sunlit hotel kitchenette with wood accents-3.png',
        'img/chambres/ntem/Carved-wood hotel lounge in warm daylight-4.png',
        'img/chambres/ntem/Sunlit luxury bedroom with balcony views-6.png',
        'img/chambres/ntem/Window-side luxury bedroom with sports court view-7.png',
        'img/chambres/ntem/Luxury hotel wardrobe with mirrored panel-8.png',
        'img/chambres/ntem/Classic hotel bedside table and telephone-9.png',
        'img/chambres/ntem/Luminous terrazzo shower retreat-10.png'
      ],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: true
    },

    {
      id: 'febe',
      ref: 'RGG-06',
      name: 'Febe',
      category: 'junior-suite',
      price: 80000,
      capacity: 3,
      beds: {
        fr: '1 lit king size 180 × 200 cm + 1 lit d\'appoint 90 × 190 cm',
        en: '1 king size bed 180 × 200 cm + 1 pull-out bed 90 × 190 cm'
      },
      size: 34,
      floor: { fr: '4ᵉ étage', en: '4th floor' },
      view: { fr: 'Vue sur le quartier de l\'Hippodrome', en: 'View over the Hippodrome district' },
      short: {
        fr: 'Découvrez FEBE, un espace lumineux et accueillant pensé pour vous offrir un séjour confortable et paisible. Profitez d\'un intérieur soigneusement aménagé, d\'un salon convivial et d\'un cadre propice à la détente.',
        en: 'Elegant and functional: ideal for a business traveller hosting a visiting colleague.'
      },
      description: {
        fr: 'Découvrez FEBE, un espace lumineux et accueillant pensé pour vous offrir un séjour confortable et paisible. Profitez d\'un intérieur soigneusement aménagé, d\'un salon convivial et d\'un cadre propice à la détente.',
        en: 'Febe combines the elegance of a city hotel with the comfort of a family home. The L-shaped entry creates a real cloakroom area, greatly appreciated while travelling for work. The sofa bed turns the lounge into an extra sleeping space without needing to set it up each time the room is vacated. The bathroom, pared down to natural stone, features a deep bathtub. The ergonomic desk and work chair allow you to handle files in the best conditions.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'cuisine-equipee',
        'bureau',
        'lumineuse',
        'placards',
        'minibar',
        'baignoire',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'securite-24'
      ],
      images: [
        'img/chambres/febe/febe.png',
        'img/chambres/febe/Elegant Hotel Sitting Room, Open TV Cabinet-1.png',
        'img/chambres/febe/Polished Open-Gate Hotel Kitchenette-2.png',
        'img/chambres/febe/Luxury bedroom with cane headboard-4.png',
        'img/chambres/febe/Luxury suite with angled bed and kitchenette-5.png',
        'img/chambres/febe/Elegant Bedside Table in Soft Daylight-6.png',
        'img/chambres/febe/Luxury hotel corner with honeywood door-7.png',
        'img/chambres/febe/Hotel room with TV and mirrored wardrobe-8.png',
        'img/chambres/febe/Luxury hotel shower in warm daylight-9.png',
        'img/chambres/febe/Hotel Window View with Palms and Lawn-10.png',
        'img/chambres/febe/Hotel Bathroom Vanity in Soft Daylight-11.png',
        'img/chambres/febe/Luxury bathroom with warm daylight-12.png'
      ],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: true
    },

    {
      id: 'mont-cameroun',
      ref: 'RGG-07',
      name: 'Mont Cameroun',
      category: 'senior-suite',
      price: 100000,
      capacity: 4,
      beds: {
        fr: '1 lit king size 180 × 200 cm + 2 lits simples 90 × 190 cm',
        en: '1 king size bed 180 × 200 cm + 2 single beds 90 × 190 cm'
      },
      size: 42,
      floor: { fr: '5ᵉ étage, aile panoramique', en: '5th floor, panoramic wing' },
      view: { fr: 'Vue dégagée sur le massif du Mont Cameroun', en: 'Unobstructed view of the Mount Cameroon massif' },
      short: {
        fr: 'Découvrez MONT CAMEROUN, d\'un espace chaleureux et confortable conçu pour vous offrir une véritable parenthèse de détente. Profitez d\'un intérieur agréable, d\'une ambiance paisible et de tout le nécessaire pour vous sentir comme chez-vous.',
        en: 'Our most requested room for a family stay: 42 m², a balcony and a spectacular view.'
      },
      description: {
        fr: 'Découvrez MONT CAMEROUN, d\'un espace chaleureux et confortable conçu pour vous offrir une véritable parenthèse de détente. Profitez d\'un intérieur agréable, d\'une ambiance paisible et de tout le nécessaire pour vous sentir comme chez-vous.',
        en: 'Named in tribute to the summit that dominates the Yaoundé skyline, the Mount Cameroon room is one of the hotel\'s most spacious rooms. The two separate bedrooms (one master bedroom, one children\'s room with two single beds) let the whole family rest. The lounge is fitted with a three-seater sofa and a large coffee table. The west-facing balcony is the ideal place for a sunset coffee. Bathroom with bathtub and separate shower.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'balcon',
        'cuisine-equipee',
        'vue-jardin',
        'lumineuse',
        'placards',
        'minibar',
        'baignoire',
        'bureau',
        'piscine',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'machine-a-laver',
        'securite-24'
      ],
      images: [u('1631049035182-249067d7618e'), u('1522708323590-d24dbb6b0267'), u('1616486338812-3dadae4b4ace')],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: true
    },

    {
      id: 'dja',
      ref: 'RGG-08',
      name: 'Dja',
      category: 'senior-suite',
      price: 100000,
      capacity: 4,
      beds: {
        fr: '1 lit king size 180 × 200 cm + 1 lit double 160 × 200 cm',
        en: '1 king size bed 180 × 200 cm + 1 double bed 160 × 200 cm'
      },
      size: 45,
      floor: { fr: '5ᵉ étage, aile jardin', en: '5th floor, garden wing' },
      view: { fr: 'Vue sur le jardin tropical et la piscine', en: 'View over the tropical garden and pool' },
      short: {
        fr: 'Découvre DJA, un espace accueillant et lumineux pensé pour vous offrir confort et sérénité. Profitez d\'un intérieur agréable, d\'un salon convivial et d\'un environnement idéal pour vous reposer et profiter pleinement de votre séjour.',
        en: 'Two separate bedrooms, a deep lounge and a large work table for four guests.'
      },
      description: {
        fr: 'Découvre DJA, un espace accueillant et lumineux pensé pour vous offrir confort et sérénité. Profitez d\'un intérieur agréable, d\'un salon convivial et d\'un environnement idéal pour vous reposer et profiter pleinement de votre séjour.',
        en: 'The Dja room was designed for long stays. Two separate bedrooms — one with a king bed, one with a double bed — connected by a 10 m² deep lounge. The equipped kitchen (sink, two-burner hob, refrigerator, microwave oven, full crockery) makes it genuinely possible to live on site. The work desk, deliberately large, takes two laptops. Fibre Wi-Fi and air conditioning guarantee working comfort whatever the season. Pool and tennis court access included.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'balcon',
        'cuisine-equipee',
        'vue-jardin',
        'lumineuse',
        'placards',
        'minibar',
        'piscine',
        'bureau',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'machine-a-laver',
        'securite-24'
      ],
      images: [
        'img/chambres/dja/dja.png',
        'img/chambres/dja/Luxury hotel lounge with carved seating-1.png',
        'img/chambres/dja/Wooden TV Nook with Open Minibar-2.png',
        'img/chambres/dja/Luxury Hotel Sitting Area with Wood Cabinet-3.png',
        'img/chambres/dja/Blush tub in a navy-tiled bathroom-4.png',
        'img/chambres/dja/Daylit Pink Double Vanity-5.png',
        'img/chambres/dja/Pink Double-Sink Hotel Bathroom-6.png',
        'img/chambres/dja/Pink tub, navy tiles, chrome shower-7.png',
        'img/chambres/dja/Pink Bidet in Navy Tiles-8.png',
        'img/chambres/dja/Elegant hotel room with chandelier-9.png'
      ],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée.',
        en: 'Free cancellation up to 48 h before arrival.'
      },
      featured: false
    },

    {
      id: 'laakam',
      ref: 'RGG-10',
      name: 'Laakam',
      category: 'junior-suite',
      price: 80000,
      capacity: 6,
      beds: {
        fr: '1 lit king size 180 × 200 cm + 1 lit double 160 × 200 cm + 2 lits simples 90 × 190 cm',
        en: '1 king size bed 180 × 200 cm + 1 double bed 160 × 200 cm + 2 single beds 90 × 190 cm'
      },
      size: 58,
      floor: { fr: '4ᵉ et 5ᵉ étages, duplex familial', en: '4th and 5th floors, family duplex' },
      view: { fr: 'Vue sur le jardin et la piscine', en: 'View over the garden and pool' },
      short: {
        fr: 'Découvrez LAAKAM, un espace chaleureux et lumineux pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et de tout le nécessaire pour sentir comme chez-vous.',
        en: 'Our family room: two levels, a full kitchen and six beds. Comfort for the whole family.'
      },
      description: {
        fr: 'Découvrez LAAKAM, un espace chaleureux et lumineux pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et de tout le nécessaire pour sentir comme chez-vous.',
        en: 'Laakam is a 58 m² family duplex, the largest sleeping space at the hotel. On the ground floor: an open lounge with a fully equipped French kitchen (oven, extractor hood, four-burner hob, refrigerator, dishwasher), a table for eight and a separate toilet. Upstairs: three bedrooms (one master, one with a double bed, one with two single beds) and a shared bathroom with shower and bathtub. A second toilet is available upstairs. Ideal for a large family or two families travelling together.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'balcon',
        'cuisine-equipee',
        'vue-jardin',
        'lumineuse',
        'placards',
        'minibar',
        'baignoire',
        'bureau',
        'piscine',
        'machine-a-laver',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'parking',
        'securite-24'
      ],
      images: [
        'img/chambres/laakam/laakam.png',
        'img/chambres/laakam/Warmly-Lit-Hotel-Suite-Sitting-Area-1.png',
        'img/chambres/laakam/Warmly-lit-hotel-room-with-balcony-view-2.png',
        'img/chambres/laakam/Warmly-lit-carved-wood-hotel-sitting-area-3.png',
        'img/chambres/laakam/Warmly-Refined-Hotel-Suite-Lounge-4.png',
        'img/chambres/laakam/Warm-polished-hotel-room-and-kitchenette-5.png',
        'img/chambres/laakam/Warm-refined-hotel-bedroom-6.png',
        'img/chambres/laakam/Refined-double-bedroom-in-warm-daylight-8.png',
        'img/chambres/laakam/Elegant-cream-marble-hotel-vanity-9.png',
        'img/chambres/laakam/Bright-modern hotel-bathroom-retreat-10.png',
        'img/chambres/laakam/Hotel-bathroom-heater-detail-11.png',
        'img/chambres/laakam/Polished-rainfall shower-in-w-rm-stone-12.png',
        'img/chambres/laakam/Warmly-lit-hotel-bathroom-detail-13.png',
        'img/chambres/laakam/Warmly-lit-luxury-double-bedroom-14.png',
        'img/chambres/laakam/Warm-polishe-luxury-hotel-bedroom-15.png',
        'img/chambres/laakam/Elegant-hotel-room-with-city-view-16.png',
        'img/chambres/laakam/Polished-hotel room-air conditioning detail-17.png'
      ],
      breakfastIncluded: false,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 48 h avant l\'arrivée, jusqu\'à 7 jours pour les séjours de plus de 5 nuits.',
        en: 'Free cancellation until 48 h before arrival, up to 7 days for stays longer than 5 nights.'
      },
      featured: true
    },

    {
      id: 'oku',
      ref: 'RGG-12',
      name: 'Oku',
      category: 'vvip',
      price: 150000,
      capacity: 5,
      beds: {
        fr: '1 lit king size 200 × 200 cm + 1 lit queen 160 × 200 cm + 1 lit simple 90 × 190 cm',
        en: '1 king size bed 200 × 200 cm + 1 queen bed 160 × 200 cm + 1 single bed 90 × 190 cm'
      },
      size: 78,
      floor: { fr: '8ᵉ étage, suite panoramique', en: '8th floor, panoramic suite' },
      view: { fr: 'Vue à 360°, sans vis-à-vis, sur toute la ville de Yaoundé', en: 'Unobstructed 360° view over the whole of Yaoundé' },
      short: {
        fr: 'Découvre OKU, un espace chaleureux et lumineux pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et de tout le nécessaire pour vous sentir comme chez-vous.',
        en: 'The hotel\'s signature suite: 78 m² over two levels, private terrace and panoramic views.'
      },
      description: {
        fr: 'Découvre OKU, un espace chaleureux et lumineux pensé pour vous offrir un séjour confortable, pratique et reposant. Profitez d\'un intérieur spacieux, d\'un salon accueillant et de tout le nécessaire pour vous sentir comme chez-vous.',
        en: 'The Oku suite is on the top floor of the hotel, with by far the finest view. It comprises two bedrooms (a master with a 200 × 200 cm king bed and a guest room with a queen bed and a single bed), two private bathrooms, a glazed corner lounge and a private 20 m² terrace overlooking the whole city. Ideal for a wedding, a honeymoon or an executive stay.'
      },
      amenities: [
        'climatisation',
        'eau-chaude',
        'tv-satellite',
        'tv-55',
        'wifi',
        'salon',
        'balcon',
        'cuisine-equipee',
        'vue-jardin',
        'lumineuse',
        'placards',
        'minibar',
        'baignoire',
        'bureau',
        'piscine',
        'machine-a-laver',
        'coffret',
        'coffre-fort',
        'seche-cheveux',
        'bouilloire',
        'parking',
        'chauffage',
        'securite-24'
      ],
      images: [
        'img/chambres/oku/oku.png',
        'img/chambres/oku/oku-1.png',
        'img/chambres/oku/oku-2.png',
        'img/chambres/oku/oku-3.png',
        'img/chambres/oku/oku-4.png',
        'img/chambres/oku/oku-5.png',
        'img/chambres/oku/oku-6.png',
        'img/chambres/oku/oku-7.png',
        'img/chambres/oku/oku-9.png',
        'img/chambres/oku/oku-10.png',
        'img/chambres/oku/oku-11.png',
        'img/chambres/oku/oku-12.png',
        'img/chambres/oku/oku-13.png',
        'img/chambres/oku/oku-14.png',
        'img/chambres/oku/oku-15.png',
        'img/chambres/oku/oku-16.png'
      ],
      breakfastIncluded: true,
      taxes: {
        included: true,
        note: {
          fr: 'Taxes de séjour et TVA (19,25 %) incluses dans le tarif affiché.',
          en: 'City tax and VAT (19.25%) included in the displayed rate.'
        }
      },
      cancellation: {
        fr: 'Annulation gratuite jusqu\'à 72 h avant l\'arrivée. Acompte de 50 % demandé pour confirmer le séjour.',
        en: 'Free cancellation until 72 h before arrival. A 50% deposit is required to confirm the stay.'
      },
      featured: true
    },

    {
      id: 'no-name-2',
      ref: 'RGG-13',
      name: 'No NAME',
      category: 'simple',
      price: 50000,
      // Capacity and size are temporary values to be confirmed with the hotel.
      capacity: 2,
      beds: {
        fr: '1 lit double (à confirmer)',
        en: '1 double bed (to be confirmed)'
      },
      size: 20,
      floor: { fr: 'À confirmer', en: 'To be confirmed' },
      view: { fr: 'À confirmer', en: 'To be confirmed' },
      short: {
        fr: 'Découvrez No NAME, un espace moderne et convivial conçu pour vous offrir une expérience agréable et reposante.',
        en: 'Discover No NAME, a modern and welcoming space designed to make your stay enjoyable and restful.'
      },
      description: {
        fr: 'Découvrez NO NAME, un espace moderne et convivial conçu pour vous offrir une expérience agréable et reposante. Profitez d\'un intérieur confortable, d\'une ambiance accueillante et de tout le nécessaire pour passer un séjour en toute sérénité.',
        en: 'Discover NO NAME, a modern and welcoming space designed to offer you a pleasant and restful experience. Enjoy a comfortable interior, a welcoming atmosphere and everything you need for a truly peaceful stay.'
      },
      amenities: [],
      images: [
        'img/chambres/noname/noname.png',
        'img/chambres/noname/Sunlit cane-headboard hotel room-2.png',
        'img/chambres/noname/Classic bedside table in warm daylight-3.png',
        'img/chambres/noname/Luxury hotel TV console detail-4.png',
        'img/chambres/noname/Luxury hotel desk beside grey curtains-5.png',
        'img/chambres/noname/Sunlit luxury bedroom with a chandelier-6.png',
        'img/chambres/noname/Narrow Luxury Bathroom in Warm Daylight-7.png',
        'img/chambres/noname/Luxury bedroom in warm daylight-8.png',
        'img/chambres/noname/Luxury Hotel Bathroom in Matte Black-9.png'
      ],
      breakfastIncluded: false,
      breakfastNote: { fr: 'À confirmer', en: 'To be confirmed' },
      taxes: {
        included: false,
        note: { fr: 'À confirmer', en: 'To be confirmed' }
      },
      cancellation: { fr: 'À confirmer', en: 'To be confirmed' },
      featured: false
    }
  ];

  /* ---------------------------------------------------------------------
     SERVICES DE L'HÔTEL
     inquiry : 'info'  → « Se renseigner via WhatsApp »
               'quote' → « Demander un devis via WhatsApp »
     --------------------------------------------------------------------- */
  var SERVICES = [
    {
      id: 'hebergement',
      icon: 'bed',
      image: 'img/hebergement.png',
      title: { fr: 'Hébergement', en: 'Accommodation' },
      short: {
        fr: '10 chambres et suites réparties sur sept étages, avec des vues dégagées sur la ville et le jardin paysager.',
        en: '10 rooms and suites spread over seven floors, with unobstructed views over the city and the landscaped garden.'
      },
      details: [
        {
          fr: 'Réception ouverte 24 h/24.',
          en: 'Front desk open 24/7.'
        },
        {
          fr: 'Arrivée dès 15 h 00, départ jusqu\'à 11 h 00 — horaires indicatifs, modifiables.',
          en: 'Check-in from 3:00 pm, check-out until 11:00 am — indicative times, configurable.'
        },
        {
          fr: 'Wi-Fi fibre gratuit dans toutes les chambres et les espaces communs.',
          en: 'Free fibre Wi-Fi in all rooms and shared areas.'
        },
        {
          fr: 'Petit-déjeuner buffet servi de 6 h 30 à 10 h 30.',
          en: 'Buffet breakfast served from 6:30 am to 10:30 am.'
        }
      ],
      hours: {
        fr: 'Réception 24 h/24 · Check-in à partir de 15 h 00',
        en: 'Front desk 24/7 · Check-in from 3:00 pm'
      },
      pricing: {
        included: 'partial',
        note: {
          fr: 'La chambre et les services listés sont inclus dans le tarif de la chambre. Le petit-déjeuner est inclus dans certaines chambres (Waza, Ntem, Febe, Mont Cameroun, Dja, Oku) et en option pour les autres.',
          en: 'The room and the listed services are included in the room rate. Breakfast is included in certain rooms (Waza, Ntem, Febe, Mount Cameroon, Dja, Oku) and optional for the others.'
        },
        items: [
          { label: { fr: 'Chambre à partir de', en: 'Room from' }, price: 50000 },
          { label: { fr: 'Petit-déjeuner buffet (par personne)', en: 'Buffet breakfast (per person)' }, price: 9500 },
          { label: { fr: 'Lit d\'appoint supplémentaire', en: 'Additional extra bed' }, price: 8000 }
        ]
      },
      inquiry: 'info'
    },

    {
      id: 'restaurant',
      icon: 'restaurant',
      image: u('1517248135467-4c7edcad34c4'),
      title: { fr: 'Restaurant & Petit-déjeuner', en: 'Restaurant & Breakfast' },
      short: {
        fr: 'Une cuisine camerounaise revisitée et des classiques internationaux, dans une salle élégante ouverte sur le jardin.',
        en: 'Reimagined Cameroonian cuisine and international classics, in an elegant dining room opening onto the garden.'
      },
      details: [
        {
          fr: 'Petit-déjeuner buffet continental et camerounais (œufs, pasteilles, jus de gingembre frais, fruits de saison).',
          en: 'Continental and Cameroonian breakfast buffet (eggs, pastries, fresh ginger juice, seasonal fruit).'
        },
        {
          fr: 'Menu à la carte Tradition : poulet DG, Ndolé, érés, koki, poisson braisé et plantains, accompagnés de bières locales.',
          en: 'Tradition à la carte menu: chicken DG, Ndolé, érés, koki, grilled fish and plantains served with local draught beer.'
        },
        {
          fr: 'Service en chambre disponible de 7 h 00 à 22 h 30.',
          en: 'In-room dining available from 7:00 am to 10:30 pm.'
        },
        {
          fr: 'Cuisine ouverte sur le jardin pour les dîners de groupe et les événements privés.',
          en: 'Open kitchen onto the garden for group dinners and private events.'
        }
      ],
      hours: {
        fr: 'Petit-déjeuner 6 h 30 – 10 h 30 · Déjeuner 12 h 00 – 15 h 00 · Dîner 18 h 30 – 22 h 30',
        en: 'Breakfast 6:30 – 10:30 am · Lunch 12:00 – 3:00 pm · Dinner 6:30 – 10:30 pm'
      },
      pricing: {
        included: false,
        note: {
          fr: 'Service facturé séparément, sauf petit-déjeuner lorsqu\'il est inclus dans le tarif de la chambre.',
          en: 'Charged separately, except breakfast where included in the room rate.'
        },
        items: [
          { label: { fr: 'Petit-déjeuner buffet', en: 'Buffet breakfast' }, price: 9500 },
          { label: { fr: 'Pause café & pâtisserie', en: 'Coffee break & pastries' }, price: 4500 },
          { label: { fr: 'Menu à la carte Tradition (à partir de)', en: 'Tradition à la carte menu (from)' }, price: 15000 },
          { label: { fr: 'Dîner de gala (à partir de, par personne)', en: 'Gala dinner (from, per person)' }, price: 32000 }
        ]
      },
      inquiry: 'info'
    },

    {
      id: 'bar',
      icon: 'bar',
      image: u('1514933651103-005eec06c04b'),
      title: { fr: 'Bar & Lounge', en: 'Bar & Lounge' },
      short: {
        fr: 'Le cœur social de l\'hôtel : cocktails à base de produits locaux, vins, bières pression et discussions qui durent.',
        en: 'The social heart of the hotel: cocktails based on local produce, wines, draught beer and conversation that lingers.'
      },
      details: [
        {
          fr: 'Cocktails maison : Bissap, Boma (bissap, gingembre, citron vert), Beute (ananas, menthe, gingembre), Tik (gingembre, citron vert, piment).',
          en: 'House cocktails: Bissap, Boma (hibiscus, ginger, lime), Beute (pineapple, mint, ginger), Tik (ginger, lime, chilli).'
        },
        {
          fr: 'Sélection de bières locales et internationales, vin rouge, blanc et rosé.',
          en: 'Selection of local and international beers, red, white and rosé wines.'
        },
        {
          fr: 'Café, thés du pays, infusions, smoothies et softs (jus de bissap, gingembre, mangue).',
          en: 'Coffee, Cameroonian teas, infusions, smoothies and soft drinks (hibiscus, ginger, mango juice).'
        },
        {
          fr: 'Terrasse couverte, tables hautes et commande au comptoir ; musique d\'ambiance légère le vendredi et le samedi soirs.',
          en: 'Covered terrace, high tables, orders at the bar; light music on Friday and Saturday evenings.'
        }
      ],
      hours: {
        fr: 'Tous les jours de 10 h 00 à 01 h 00 · Dernière commande à 00 h 30',
        en: 'Every day from 10:00 am to 1:00 am · Last order at 12:30 am'
      },
      pricing: {
        included: false,
        note: {
          fr: 'Service facturé séparément. Boissons non alcoolisées offertes pour les clients des Suites Seniors et VVIP.',
          en: 'Charged separately. Non-alcoholic drinks are complimentary for Senior Suite and VVIP guests.'
        },
        items: [
          { label: { fr: 'Cocktail du Royal', en: 'Royal cocktail' }, price: 5500 },
          { label: { fr: 'Soft drink / smoothie', en: 'Soft drink / smoothie' }, price: 2000 },
          { label: { fr: 'Café ou thé', en: 'Coffee or tea' }, price: 1500 },
          { label: { fr: 'Verre de vin', en: 'Glass of wine' }, price: 8000 }
        ]
      },
      inquiry: 'info'
    },

    {
      id: 'piscine',
      icon: 'pool',
      image: 'img/piscine.png',
      title: { fr: 'Piscine & espaces de détente', en: 'Swimming pool & relaxation areas' },
      short: {
        fr: 'Une piscine de 20 mètres dans un jardin tropical, avec transats, parasols et coin bien-être au calme.',
        en: 'A 20-metre pool in a tropical garden, with sun loungers, parasols and a quiet wellness corner.'
      },
      details: [
        {
          fr: 'Piscine de 20 × 8 m, profondeur de 1,20 m à 2,50 m, avec rappel de hauteur pour les enfants.',
          en: '20 × 8 m pool, depth from 1.20 m to 2.50 m, with a shallow area for children.'
        },
        {
          fr: 'Transats, parasols, serviettes et douches solaires disponibles à partir de 6 h 30.',
          en: 'Sun loungers, parasols, towels and solar showers available from 6:30 am.'
        },
        {
          fr: 'Espace bien-être : massage relaxant de 30 ou 60 minutes, sur rendez-vous.',
          en: 'Wellness corner: 30 or 60-minute relaxing massage, by appointment.'
        },
        {
          fr: 'Bassin relaxation calme, réservé aux clients des suites (séances de 45 minutes).',
          en: 'Calm pool, reserved for suite guests (45-minute sessions).'
        }
      ],
      hours: {
        fr: 'Tous les jours de 6 h 30 à 21 h 00 · Massage sur rendez-vous',
        en: 'Every day from 6:30 am to 9:00 pm · Massage by appointment'
      },
      pricing: {
        included: 'partial',
        note: {
          fr: 'Accès à la piscine offert aux clients des chambres Mont Cameroun, Dja, Laakam et Oku. En option pour les visiteurs extérieurs.',
          en: 'Pool access is free for guests in the Mont Cameroun, Dja, Laakam and Oku rooms. Available as an option for external visitors.'
        },
        items: [
          { label: { fr: 'Accès piscine (clients de l\'hôtel)', en: 'Pool access (hotel guests)' }, price: 0 },
          { label: { fr: 'Accès piscine (visiteurs extérieurs)', en: 'Pool access (external visitors)' }, price: 5000 },
          { label: { fr: 'Massage relaxant 30 minutes', en: '30-minute relaxing massage' }, price: 25000 },
          { label: { fr: 'Massage relaxant 60 minutes', en: '60-minute relaxing massage' }, price: 45000 }
        ]
      },
      inquiry: 'info'
    },

    {
      id: 'evenements',
      icon: 'event',
      image: 'img/salle-conference-room.png',
      title: { fr: 'Conférences', en: 'Conferences' },
      short: {
        fr: 'Salle de conférence pour 30 personnes, salon privé et accompagnement sur mesure pour vos rencontres professionnelles.',
        en: 'Conference room for up to 30 people, a private lounge, and tailored support for your business events.'
      },
      details: [
        {
          fr: 'Salle de conférence « Mont Cameroun » : jusqu’à 30 personnes en configuration école ou en U, avec vidéoprojecteur, écran, sonorisation et Wi-Fi dédié.',
          en: '"Mont Cameroon" conference room: up to 30 people in classroom or U-shape seating, with a projector, screen, sound system, and dedicated Wi-Fi.'
        },
        {
          fr: 'Salon privé « Ntem » pour vos réunions en petit comité, déjeuners d’affaires ou moments de réseautage.',
          en: 'Private "Ntem" lounge for small meetings, business lunches, or networking.'
        },
        {
          fr: 'Organisation de séminaires, réunions d’entreprise, formations et lancements de produits.',
          en: 'Planning for seminars, business meetings, training sessions, and product launches.'
        }
      ],
      hours: {
        fr: 'Salle disponible de 7 h 00 à 23 h 00 · Devis sur demande sous 24 h',
        en: 'Room available from 7:00 am to 11:00 pm · Quote on request within 24 h'
      },
      pricing: {
        included: false,
        quoteOnly: true,
        note: {
          fr: 'Sur devis uniquement. Le devis comprend la location de la salle, la restauration, la logistique technique et l\'accompagnement.',
          en: 'Quotation only. The quote includes room hire, catering, technical logistics and staff support.'
        },
        items: [
          { label: { fr: 'Salle de conférence (demi-journée)', en: 'Conference room (half day)' }, price: 45000 },
          { label: { fr: 'Salle de conférence (journée complète)', en: 'Conference room (full day)' }, price: 75000 },
          { label: { fr: 'Salon privé (dîner ou cocktail, jusqu\'à 30 pers.)', en: 'Private lounge (dinner or cocktail, up to 30 guests)' }, price: 120000 },
          { label: { fr: 'Pause café & mignardises (par personne)', en: 'Coffee break & canapés (per person)' }, price: 4500 }
        ]
      },
      inquiry: 'quote'
    },

    {
      id: 'espace-vert-evenement',
      icon: 'event',
      image: 'img/espace_vert_vue.png',
      title: { fr: 'Espace vert pour événements', en: 'Outdoor event space' },
      short: {
        fr: 'Location de l’espace vert à 2 000 000 FCFA pour trois jours, avec une suite de deux chambres offerte pour une nuitée.',
        en: 'Rent the outdoor event space for three days at 2,000,000 CFA francs, including a complimentary one-night stay in a two-bedroom suite.'
      },
      details: [
        {
          fr: 'Occupation du site pendant une période de trois jours.',
          en: 'Use of the venue for a three-day period.'
        },
        {
          fr: 'Une suite complète de deux chambres offerte pour une nuitée.',
          en: 'A complimentary one-night stay in a two-bedroom suite.'
        },
        {
          fr: 'Nettoyage régulier des salles d’eau pendant l’événement.',
          en: 'Regular cleaning of the washrooms throughout the event.'
        },
        {
          fr: 'Accès aux deux parkings intérieurs et au parking extérieur.',
          en: 'Access to both indoor parking areas and the outdoor car park.'
        },
        {
          fr: 'Sécurité renforcée pendant toute la durée de l’événement.',
          en: 'Enhanced security throughout the event.'
        },
        {
          fr: 'Salle de rangement pour le matériel de cuisine avec deux feux de cuisson.',
          en: 'A storage room for catering equipment with a two-burner cooking hob.'
        },
        {
          fr: 'Relais automatique du générateur en cas de coupure de courant.',
          en: 'Automatic generator backup in the event of a power outage.'
        }
      ],
      hours: {
        fr: 'Location sur réservation · Occupation du site pendant trois jours',
        en: 'Available by reservation · Venue use for three days'
      },
      pricing: {
        included: false,
        note: {
          fr: 'Tarif de location pour trois jours : 2 000 000 FCFA.',
          en: 'Three-day rental rate: 2,000,000 CFA francs.'
        },
        items: [
          { label: { fr: 'Location de l’espace vert (3 jours)', en: 'Outdoor event space rental (3 days)' }, price: 2000000 }
        ]
      },
      inquiry: 'quote'
    }
  ];

  /* ---------------------------------------------------------------------
     AVANTAGES  (page d'accueil)
     --------------------------------------------------------------------- */
  var BENEFITS = [
    {
      title: { fr: 'Praticité & sérénité', en: 'Convenience & peace of mind' },
      items: [
        {
          icon: 'location',
          title: { fr: 'En bout de la rue Hippodrome', en: 'At the end of Hippodrome Road' },
          text: {
            fr: 'Au bout de la dernière rue Hippodrome, à un peu plus d’un kilomètre du centre administratif et à 6 km de l\'aéroport international de Yaoundé-Nsimalen.',
            en: 'At the end of Hippodrome Road, a little over one kilometre from the administrative centre and 6 km from Yaoundé-Nsimalen International Airport.'
          }
        },
        {
          icon: 'bell',
          title: { fr: 'Réception 24 h/24', en: '24/7 front desk' },
          text: {
            fr: 'Réception ouverte 24 h/24 pour vous accueillir à tout moment.',
            en: 'The front desk is open 24/7 to welcome guests at any time.'
          }
        },
        {
          icon: 'shield',
          title: { fr: 'Sécurité & calme', en: 'Security & quiet' },
          text: {
            fr: 'Sûreté 24 h/24, parking privé et chambres calées sur les collines, loin du bruit du trafic.',
            en: '24/7 security, free private parking and rooms set against the hills, away from traffic noise.'
          }
        }
      ]
    },
    {
      title: { fr: 'Confort & loisirs', en: 'Comfort & leisure' },
      items: [
        {
          icon: 'wifi',
          title: { fr: 'Wi-Fi fibre', en: 'Fibre Wi-Fi' },
          text: {
            fr: 'Connexion internet fibre dans toutes les chambres et les espaces communs, sans frais supplémentaires.',
            en: 'Fibre internet in every room and shared area, at no extra charge.'
          }
        },
        {
          icon: 'restaurant',
          title: { fr: 'Cuisine sur place', en: 'Food on site' },
          text: {
            fr: 'Restaurant, petit-déjeuner buffet et service en chambre tous les jours, de 6 h 30 à 22 h 30.',
            en: 'Restaurant, breakfast buffet and in-room dining every day, from 6:30 am to 10:30 pm.'
          }
        },
        {
          icon: 'pool',
          title: { fr: 'Piscine & tennis', en: 'Pool & tennis' },
          text: {
            fr: 'Une piscine de 20 mètres et un court de tennis en terre battue, en accès libre selon votre catégorie de chambre.',
            en: 'A 20-metre pool and a clay tennis court, freely available depending on your room category.'
          }
        }
      ]
    }
  ];

  /* ---------------------------------------------------------------------
     TÉMOIGNAGES — CONTENU DE DÉMONSTRATION
     --------------------------------------------------------------------- */
  var TESTIMONIALS = [
    {
      quote: {
        fr: 'Un vrai havre de paix à Yaoundé. La chambre Mont Cameroun est spacieuse, propre, et la vue au coucher du soleil vaut à elle seule le détour. Le personnel est d\'une grande gentillesse, même quand il est pris par l\'affluence du petit-déjeuner.',
        en: 'A real haven of peace in Yaoundé. The Mount Cameroon room is spacious and spotless, and the sunset view is worth the detour on its own. The staff are extremely kind, even when breakfast is busy.'
      },
      author: { fr: 'Aminatou N.', en: 'Aminatou N.' },
      meta: { fr: 'Séjour en famille · Mars', en: 'Family stay · March' },
      rating: 5
    },
    {
      quote: {
        fr: 'Je viens à Yaoundé presque chaque mois pour des réunions. Le Wi-Fi tient la route, le bureau est confortable, et pouvoir commander un petit-déjeuner ou un dîner en chambre entre deux visioconférences change tout.',
        en: 'I come to Yaoundé almost every month for meetings. The Wi-Fi holds up, the desk is comfortable, and being able to order breakfast or dinner in room between two video calls makes all the difference.'
      },
      author: { fr: 'Jean-Marc B.', en: 'Jean-Marc B.' },
      meta: { fr: 'Client d\'affaires · 6 séjours', en: 'Business traveller · 6 stays' },
      rating: 5
    },
    {
      quote: {
        fr: 'Nous avons préparé notre mariage à l\'hôtel : la suite Oku pour la nuit, le salon privé pour le dîner. Tout a été minuté comme il se doit, et la direction a répondu à chaque demande la même journée.',
        en: 'We held our wedding at the hotel: the Oku suite for the night, the private lounge for the dinner. Everything was timed as it should be, and management answered every request the same day.'
      },
      author: { fr: 'Chantal & Éric', en: 'Chantal & Éric' },
      meta: { fr: 'Mariage · Novembre', en: 'Wedding · November' },
      rating: 5
    },
    {
      quote: {
        fr: 'Excellent rapport qualité-prix pour Yaoundé. La chambre Febe est bien pensée pour travailler, la douche est vraiment chaude et abondante, et le bar le soir est un endroit où il fait bon rester.',
        en: 'Excellent value for money in Yaoundé. The Febe room is well designed for working, the shower is genuinely hot and plentiful, and the bar is a good place to spend an evening.'
      },
      author: { fr: 'Olivier T.', en: 'Olivier T.' },
      meta: { fr: 'Séjour professionnel · Janvier', en: 'Business stay · January' },
      rating: 4
    },
    {
      quote: {
        fr: 'Voyage avec deux enfants : la chambre familiale Laakam nous a donné de l\'espace, et la cuisine de la chambre a changé notre séjour. Le personnel a installé un lit d\'appoint en dix minutes, à 23 heures.',
        en: 'Travelling with two children: the Laakam family room gave us space, and the in-room kitchen changed our stay. Staff set up an extra bed in ten minutes, at 11 pm.'
      },
      author: { fr: 'Famille Nkolo', en: 'Nkolo family' },
      meta: { fr: 'Séjour en famille · Avril', en: 'Family stay · April' },
      rating: 5
    },
    {
      quote: {
        fr: 'J\'ai séjourné une semaine pour un déplacement long. Le nettoyage était fait chaque jour, les serviettes changées sans que je demande, et la machine à laver de la chambre Dja m\'a sauvé une semaine de valises.',
        en: 'I stayed a week on a long assignment. The room was cleaned daily, towels changed without me asking, and the washing machine in the Dja room saved me a week of luggage.'
      },
      author: { fr: 'Sarah M.', en: 'Sarah M.' },
      meta: { fr: 'Séjour longue durée · Août', en: 'Long stay · August' },
      rating: 5
    }
  ];

  /* ---------------------------------------------------------------------
     À PROPOS : VALEURS ET EXPÉRIENCE CLIENT
     --------------------------------------------------------------------- */
  var VALUES = [
    {
      title: { fr: 'Accueil chaleureux', en: 'Warm welcome' },
      text: {
        fr: 'Un hôte vous accueille par votre nom, vous propose un verre d\'eau fraîche et vous conduit jusqu\'à votre chambre. C\'est la première impression que nousloffrons.',
        en: 'A host greets you by name, offers you a glass of cool water and walks you to your room. It is the first impression we make.'
      }
    },
    {
      title: { fr: 'Propreté irréprochable', en: 'Impeccable cleanliness' },
      text: {
        fr: 'Chambres nettoyées chaque jour, linge changé selon vos préférences, protocole de désinfection renforcé dans les espaces communs.',
        en: 'Rooms cleaned daily, linen changed to your preferences, enhanced disinfection protocol in shared areas.'
      }
    },
    {
      title: { fr: 'Hospitalité camerounaise', en: 'Cameroonian hospitality' },
      text: {
        fr: 'Nous cultivons la tradition de l\'hospitalité camerounaise : l\'art d\'accueillir, de partager un repas, de prendre le temps de la conversation.',
        en: 'We draw on the Cameroonian tradition of hospitality: to welcome, to share a meal, to take the time for conversation.'
      }
    },
    {
      title: { fr: 'Transparence des prix', en: 'Price transparency' },
      text: {
        fr: 'Les tarifs affichés sont en FCFA, comprennent les taxes et précisent ce qui est compris ou facturé en supplément. Pas de surprise à l\'arrivée.',
        en: 'Rates are shown in FCFA, taxes included, and state clearly what is included or charged separately. No surprises at check-in.'
      }
    }
  ];

  var GUEST_EXPERIENCE = [
    {
      audience: { fr: 'Clients d\'affaires', en: 'Business travellers' },
      icon: 'briefcase',
      text: {
        fr: 'Wi-Fi fibre, chambres calées sur un bureau ergonomique, service d\'étage jusqu\'à 22 h 30, réception 24 h/24 et parking privé : tout est prévu pour enchaîner les réunions sans interruption.',
        en: 'Fibre Wi-Fi, rooms with a proper ergonomic desk, in-room dining until 10:30 pm, a 24/7 front desk and private parking: everything is in place to move from one meeting to the next.'
      }
    },
    {
      audience: { fr: 'Couples', en: 'Couples' },
      icon: 'heart',
      text: {
        fr: 'Suites Seniors et VVIP avec terrasse privative, baignoire profonde, dîner au calme sur la terrasse du restaurant et cocktails au bar en soirée.',
        en: 'Senior and VVIP suites with private terrace, deep bathtubs, quiet dinners on the restaurant terrace and cocktails at the bar in the evening.'
      }
    },
    {
      audience: { fr: 'Familles', en: 'Families' },
      icon: 'family',
      text: {
        fr: 'La chambre familiale Laakam accueille six personnes avec cuisine équipée, et la piscine dispose d\'un bassin pour les enfants.',
        en: 'The Laakam family room sleeps six guests with an equipped kitchen, and the pool has a shallow area for children.'
      }
    },
    {
      audience: { fr: 'Touristes', en: 'Tourists' },
      icon: 'camera',
      text: {
        fr: 'L\'hôtel se trouve dans le quartier de l\'Hippodrome, à proximité du marché central et des principaux lieux d\'intérêt de Yaoundé.',
        en: 'The hotel is located in the Hippodrome district, near the central market and Yaoundé\'s main attractions.'
      }
    }
  ];

  /* ---------------------------------------------------------------------
     ÉQUIPE — CONTENU DE DÉMONSTRATION
     --------------------------------------------------------------------- */
  var TEAM = [
    {
      name: { fr: 'Marie-Claude Ngono', en: 'Marie-Claude Ngono' },
      role: { fr: 'Directrice de l\'hôtel', en: 'Hotel Director' },
      bio: {
        fr: 'Douze ans d\'expérience dans l\'hôtellerie à Yaoundé et à Douala. Elle supervise le service, la qualité et les relations avec les partenaires locaux.',
        en: 'Twelve years of experience in hotels in Yaoundé and Douala. She oversees service, quality and relationships with local partners.'
      },
      image: u('1580894732444-8ecded7900cd')
    },
    {
      name: { fr: 'Serge Atangana', en: 'Serge Atangana' },
      role: { fr: 'Chef de la réception', en: 'Head of Reception' },
      bio: {
        fr: 'Le visage de l\'accueil : disponible 24 h/24, il vous accueille à la réception de l\'hôtel.',
        en: 'The public face of reception: available 24/7 to welcome guests at the hotel.'
      },
      image: u('1531123897727-8f129e1688ce')
    },
    {
      name: { fr: 'Aïssatou Fadimatou', en: 'Aïssatou Fadimatou' },
      role: { fr: 'Chef de cuisine', en: 'Head Chef' },
      bio: {
        fr: 'Elle met en valeur la cuisine camerounaise — Ndolé, poulet DG, poisson braisé — sans jamais renoncer aux classiques internationaux demandés par nos clients.',
        en: 'She showcases Cameroonian cuisine — Ndolé, chicken DG, grilled fish — without giving up on the international classics our guests ask for.'
      },
      image: u('1607746882042-944635dfe10e')
    },
    {
      name: { fr: 'Patrick Mbarga', en: 'Patrick Mbarga' },
      role: { fr: 'Gouvernante générale', en: 'Head of Housekeeping' },
      bio: {
        fr: 'Il veille au détail : linge impeccable, chiffons propres, chambres vérifiées deux fois avant votre arrivée. C\'est le travail que l\'on ne voit pas, mais que l\'on ressent.',
        en: 'He looks after the details: pristine linen, clean cloths, rooms checked twice before you arrive. It is the work you do not see, but feel.'
      },
      image: u('1544723795-3fb6469f5b39')
    }
  ];

  /* Galerie de l'hôtel (page « À propos ») */
  var GALLERY = {
    items: [
      { image: u('1568084680786-a84f91d1153c'), caption: { fr: 'Le hall d\'accueil', en: 'The reception hall' } },
      { image: u('1517248135467-4c7edcad34c4'), caption: { fr: 'Le restaurant', en: 'The restaurant' } },
      { image: u('1508344928928-7165b67de128'), caption: { fr: 'La piscine', en: 'The swimming pool' } },
      { image: u('1566073771259-6a8506099945'), caption: { fr: 'Une Suite Senior', en: 'A Senior Suite' } },
      { image: u('1439066615861-d1af74d74000'), caption: { fr: 'Le court de tennis', en: 'The tennis court' } },
      { image: u('1514933651103-005eec06c04b'), caption: { fr: 'Le bar', en: 'The bar' } },
      { image: u('1542314831-068cd1dbfeeb'), caption: { fr: 'La façade de l\'hôtel', en: 'The hotel façade' } },
      { image: u('1520250497591-112f2f40a3f4'), caption: { fr: 'L\'espace bien-être', en: 'The wellness area' } },
      { image: u('1497366754035-f200968a6e72'), caption: { fr: 'La suite Oku', en: 'The Oku suite' } },
      { image: u('1549294413-26f195200c16'), caption: { fr: 'La salle des conférences', en: 'The conference room' } }
    ]
  };

  /* ---------------------------------------------------------------------
     GALERIE D'ACCUEIL (bannière)
     --------------------------------------------------------------------- */
  var HERO_IMAGES = {
    home: u('1568084680786-a84f91d1153c', 2000),
    rooms: u('1618773928121-c32242e63f39', 1600),
    services: 'img/services.png',
    about: u('1542314831-068cd1dbfeeb', 1600),
    contact: u('1522798514-97ceb8c4f1c8', 1600)
  };

  /* ---------------------------------------------------------------------
     EXPORT
     --------------------------------------------------------------------- */
  window.RGG_DATA = {
    CATEGORIES: CATEGORIES,
    AMENITIES: AMENITIES,
    ROOMS: ROOMS,
    SERVICES: SERVICES,
    BENEFITS: BENEFITS,
    TESTIMONIALS: TESTIMONIALS,
    VALUES: VALUES,
    GUEST_EXPERIENCE: GUEST_EXPERIENCE,
    TEAM: TEAM,
    GALLERY: GALLERY,
    HERO_IMAGES: HERO_IMAGES,
    image: u
  };
})();
