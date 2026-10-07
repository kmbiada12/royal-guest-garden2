/* =========================================================================
   Royal Guest Garden — Fonctions utilitaires
   -------------------------------------------------------------------------
   Accès aux données, filtres, tri, formatage des prix en FCFA, calcul des
   nuits et des totaux estimés.

   Aucune information personnelle n'est stockée : ni localStorage, ni
   cookie, ni journalisation en console.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var DATA = window.RGG_DATA;
  var I18N = window.RGG_I18N;

  /* =====================================================================
     OUTILS GÉNÉRIQUES
     ===================================================================== */

  /** Échappe les caractères HTML (toute donnée injectée passe par ici). */
  function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Traduit une clé i18n. */
  function t(key, params) {
    return I18N.t(key, params);
  }

  /** Version langue courante d'une valeur bilingue {fr, en}. */
  function pick(value) {
    return I18N.pick(value);
  }

  /** Crée un élément DOM avec attributs et enfants. */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val === null || val === undefined || val === false) return;
        if (key === 'class') node.className = val;
        else if (key === 'html') node.innerHTML = val;
        else if (key === 'text') node.textContent = val;
        else if (key === 'dataset') {
          Object.keys(val).forEach(function (d) {
            node.dataset[d] = val[d];
          });
        } else if (val === true) node.setAttribute(key, '');
        else node.setAttribute(key, val);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  /** Vide un élément de son contenu. */
  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  /* =====================================================================
     PRIX ET DEVISES
     ===================================================================== */

  /**
   * Formate un montant en FCFA : 35000 → « 35 000 FCFA »
   * Le séparateur de milliers est une espace insécable.
   */
  function formatPrice(amount) {
    var cfg = (CONFIG && CONFIG.currency) || { label: 'FCFA', decimals: 0 };
    var num = Number(amount);
    if (!isFinite(num)) num = 0;
    var formatted;
    try {
      formatted = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: cfg.decimals || 0,
        maximumFractionDigits: cfg.decimals || 0
      }).format(num);
    } catch (e) {
      formatted = String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return formatted + ' ' + cfg.label;
  }

  /** Formate un prix avec le suffixe « / nuit ». */
  function formatNightly(price) {
    return formatPrice(price) + t('common.perNight');
  }

  /** Formate un prix par personne. */
  function formatPerPerson(price) {
    return formatPrice(price) + t('common.perPerson');
  }

  /* =====================================================================
     DATES (calcul sur des dates civiles, sans fuseau horaire)
     ===================================================================== */

  /** Analyse une date ISO « AAAA-MM-JJ » et renvoie un Date à minuit, ou null. */
  function parseISODate(str) {
    if (!str) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(str).trim());
    if (!m) return null;
    var y = Number(m[1]);
    var mo = Number(m[2]);
    var d = Number(m[3]);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    var date = new Date(y, mo - 1, d);
    // rejette 31/02 et autres dates impossibles
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) {
      return null;
    }
    return date;
  }

  /** Date du jour à minuit. */
  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /** Nombre de nuits entre deux dates civiles (b - a, en jours calendaires). */
  function countNights(checkIn, checkOut) {
    var a = checkIn instanceof Date ? checkIn : parseISODate(checkIn);
    var b = checkOut instanceof Date ? checkOut : parseISODate(checkOut);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  /** Date du jour au format ISO « AAAA-MM-JJ ». */
  function todayISO() {
    var d = today();
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  /**
   * Affiche une date au format de la langue courante :
   * « 12 mars 2026 » en français, « 12 March 2026 » en anglais.
   */
  function formatDate(iso) {
    var d = parseISODate(iso);
    if (!d) return String(iso || '');
    var locale = I18N.get() === 'en' ? 'en-GB' : 'fr-FR';
    try {
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(d);
    } catch (e) {
      return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }
  }

  /** Date courte pour les messages : « 12/03/2026 ». */
  function formatDateShort(iso) {
    var d = parseISODate(iso);
    if (!d) return String(iso || '');
    return (
      String(d.getDate()).padStart(2, '0') +
      '/' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '/' +
      d.getFullYear()
    );
  }

  /** Date ISO décalée de n jours (utilisé pour pré-remplir le départ). */
  function addDaysISO(iso, days) {
    var d = parseISODate(iso) || today();
    d.setDate(d.getDate() + days);
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }

  /* =====================================================================
     CHAMBRES
     ===================================================================== */

  function getRooms() {
    return DATA.ROOMS.slice();
  }

  /** Récupère une chambre par identifiant (ou null). */
  function getRoomById(id) {
    if (!id) return null;
    var wanted = String(id).toLowerCase();
    for (var i = 0; i < DATA.ROOMS.length; i++) {
      if (DATA.ROOMS[i].id.toLowerCase() === wanted) return DATA.ROOMS[i];
    }
    return null;
  }

  /** Chambres mises en avant (page d'accueil). */
  function getFeaturedRooms(limit) {
    var rooms = DATA.ROOMS.filter(function (r) {
      return r.featured;
    });
    if (!limit) return rooms;
    return rooms.slice(0, limit);
  }

  /** Étiquette traduite d'une catégorie. */
  function categoryLabel(id) {
    var cat = DATA.CATEGORIES.filter(function (c) {
      return c.id === id;
    })[0];
    return cat ? pick(cat) : id;
  }

  /** Étiquette traduite d'un équipement. */
  function amenityLabel(id) {
    var am = DATA.AMENITIES.filter(function (a) {
      return a.id === id;
    })[0];
    return am ? pick(am) : id;
  }

  /** Prix minimum du catalogue. */
  function minPrice() {
    return DATA.ROOMS.reduce(function (min, r) {
      return Math.min(min, r.price);
    }, Infinity);
  }

  /** Prix maximum du catalogue. */
  function maxPrice() {
    return DATA.ROOMS.reduce(function (max, r) {
      return Math.max(max, r.price);
    }, 0);
  }

  /**
   * Filtre et trie le catalogue.
   * filters = { category, maxPrice, minCapacity, amenities[], sort }
   * Tous les critères sont combinés (ET logique).
   */
  function filterRooms(filters) {
    var f = filters || {};
    var list = getRooms().filter(function (room) {
      if (f.category && f.category !== 'all' && room.category !== f.category) return false;
      if (f.maxPrice !== undefined && f.maxPrice !== null && room.price > f.maxPrice) return false;
      if (f.minCapacity && room.capacity < f.minCapacity) return false;
      if (f.amenities && f.amenities.length) {
        var hasAll = f.amenities.every(function (a) {
          return room.amenities.indexOf(a) !== -1;
        });
        if (!hasAll) return false;
      }
      return true;
    });
    return sortRooms(list, f.sort || 'recommended');
  }

  /** Trie une liste de chambres (nouvelle tableau). */
  function sortRooms(rooms, sort) {
    var list = rooms.slice();
    switch (sort) {
      case 'priceAsc':
        list.sort(function (a, b) {
          return a.price - b.price || a.name.localeCompare(b.name);
        });
        break;
      case 'priceDesc':
        list.sort(function (a, b) {
          return b.price - a.price || a.name.localeCompare(b.name);
        });
        break;
      case 'capacityDesc':
        list.sort(function (a, b) {
          return b.capacity - a.capacity || a.price - b.price;
        });
        break;
      default:
        // sélection de l'hôtel : mises en avant, puis prix croissant
        list.sort(function (a, b) {
          if (a.featured !== b.featured) return a.featured ? -1 : 1;
          return a.price - b.price;
        });
    }
    return list;
  }

  /** Nombre de filtres réellement actifs. */
  function countActiveFilters(filters) {
    var f = filters || {};
    var n = 0;
    if (f.category && f.category !== 'all') n++;
    if (f.maxPrice !== undefined && f.maxPrice !== null && f.maxPrice < maxPrice()) n++;
    if (f.minCapacity) n++;
    if (f.amenities && f.amenities.length) n += f.amenities.length;
    return n;
  }

  /**
   * Chambres similaires : même catégorie en priorité, sinon même
   * fourchette de prix (écart de 25 % autour du prix de la chambre).
   */
  function getSimilarRooms(room, limit) {
    if (!room) return [];
    var max = limit || 3;
    var others = DATA.ROOMS.filter(function (r) {
      return r.id !== room.id;
    });

    var sameCategory = others.filter(function (r) {
      return r.category === room.category;
    });
    var nearPrice = others.filter(function (r) {
      return (
        r.category !== room.category &&
        Math.abs(r.price - room.price) <= room.price * 0.25
      );
    });
    var rest = others.filter(function (r) {
      return sameCategory.indexOf(r) === -1 && nearPrice.indexOf(r) === -1;
    });

    function byPrice(a, b) {
      return Math.abs(a.price - room.price) - Math.abs(b.price - room.price);
    }
    sameCategory.sort(byPrice);
    nearPrice.sort(byPrice);

    return sameCategory.concat(nearPrice, rest).slice(0, max);
  }

  /* =====================================================================
     CALCUL DU SÉJOUR
     ===================================================================== */

  /**
   * Calcule le nombre de nuits et le total estimé de l'hébergement.
   * total = prix par nuit × nuits × nombre de chambres
   */
  function estimateStay(room, checkIn, checkOut, roomsCount) {
    var nights = countNights(checkIn, checkOut);
    var qty = Math.max(1, Number(roomsCount) || 1);
    var nightly = room ? room.price : 0;
    return {
      nights: nights,
      rooms: qty,
      nightly: nightly,
      total: nightly * nights * qty,
      capacity: room ? room.capacity * qty : 0
    };
  }

  /** Vérifie que le nombre de clients tient dans la capacité demandée. */
  function checkCapacity(room, roomsCount, adults, children) {
    var qty = Math.max(1, Number(roomsCount) || 1);
    var max = room ? room.capacity * qty : 0;
    var guests = (Number(adults) || 0) + (Number(children) || 0);
    return { ok: guests <= max && guests > 0, guests: guests, max: max };
  }

  /* =====================================================================
     SERVICES
     ===================================================================== */

  function getServices() {
    return DATA.SERVICES.slice();
  }

  function getServiceById(id) {
    return (
      DATA.SERVICES.filter(function (s) {
        return s.id === id;
      })[0] || null
    );
  }

  /* =====================================================================
     URL DES IMAGES
     ===================================================================== */

  /** Redimensionne une URL Unsplash existante. */
  function imageUrl(url, width) {
    if (!url) return '';
    if (!width || !/^https?:\/\//i.test(url)) return url;
    if (/[?&]w=\d+/.test(url)) return url.replace(/([?&]w=)\d+/, '$1' + width);
    return url + (url.indexOf('?') === -1 ? '?' : '&') + 'w=' + width;
  }

  /**
   * URL de la page détail d'une chambre.
   * Toujours relative au dossier du site pour rester valable sur
   * n'importe quelle page (et sur un sous-dossier) : « room.html?id=… ».
   */
  function roomUrl(roomId) {
    return 'room.html?id=' + encodeURIComponent(roomId);
  }

  /**
   * Teste une media query sans erreur si matchMedia est absent
   * (anciens navigateurs, WebViews, environnements de test).
   */
  function media(query) {
    if (typeof window.matchMedia !== 'function') return false;
    try {
      return !!window.matchMedia(query).matches;
    } catch (error) {
      return false;
    }
  }

  /* =====================================================================
     VALIDATION DES FORMULAIRES
     ===================================================================== */

  /** Un nombre entier positif ou nul, sans décimale ni signe. */
  function parseInteger(value) {
    var str = String(value === undefined || value === null ? '' : value).trim();
    if (!str) return NaN;
    if (!/^\d+$/.test(str)) return NaN;
    var n = Number(str);
    return isFinite(n) ? n : NaN;
  }

  /** Numéro de téléphone acceptable : chiffres, espaces, +, -, ., /. */
  function isValidPhone(value) {
    var str = String(value || '').trim();
    if (str.length < 6) return false;
    if (!/^[+0-9 ()./-]+$/.test(str)) return false;
    return (str.match(/\d/g) || []).length >= 6;
  }

  /** Adresse email acceptable. */
  function isValidEmail(value) {
    var str = String(value || '').trim();
    if (!str) return true; // champ optionnel
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str);
  }

  window.RGG_HELPERS = {
    escapeHtml: escapeHtml,
    el: el,
    clear: clear,
    t: t,
    pick: pick,
    formatPrice: formatPrice,
    formatNightly: formatNightly,
    formatPerPerson: formatPerPerson,
    parseISODate: parseISODate,
    today: today,
    todayISO: todayISO,
    addDaysISO: addDaysISO,
    countNights: countNights,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    getRooms: getRooms,
    getRoomById: getRoomById,
    getFeaturedRooms: getFeaturedRooms,
    categoryLabel: categoryLabel,
    amenityLabel: amenityLabel,
    minPrice: minPrice,
    maxPrice: maxPrice,
    filterRooms: filterRooms,
    sortRooms: sortRooms,
    countActiveFilters: countActiveFilters,
    getSimilarRooms: getSimilarRooms,
    estimateStay: estimateStay,
    checkCapacity: checkCapacity,
    getServices: getServices,
    getServiceById: getServiceById,
    imageUrl: imageUrl,
    roomUrl: roomUrl,
    media: media,
    parseInteger: parseInteger,
    isValidPhone: isValidPhone,
    isValidEmail: isValidEmail
  };
})();
