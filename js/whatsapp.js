/* =========================================================================
   Royal Guest Garden — Liens et messages WhatsApp
   -------------------------------------------------------------------------
   Un seul numéro WhatsApp est configuré dans js/config.js
   (window.RGG_CONFIG.whatsapp.number, format international, chiffres
   uniquement, ex. 237691491948).

   Les liens sont construits selon :
     https://wa.me/NUMBER?text=ENCODED_MESSAGE

   Ouvrir WhatsApp n'envoie aucun message : l'utilisateur doit valider
   l'envoi lui-même dans l'application. Aucune réservation n'est confirmée
   à cette étape.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var I18N = window.RGG_I18N;
  var H = window.RGG_HELPERS;

  var WA = (CONFIG && CONFIG.whatsapp) || {};
  var HOTEL = (CONFIG && CONFIG.hotel) || {};

  /* =====================================================================
     NUMÉROS
     ===================================================================== */

  /** Ne conserve que les chiffres du numéro configuré. */
  function sanitiseNumber(value) {
    return String(value || '').replace(/\D/g, '');
  }

  /** Numéro principal de réservation (constante unique de config.js). */
  function primaryNumber() {
    return sanitiseNumber(WA.bookingNumber || WA.number);
  }

  /** Second numéro de l'hôtel. */
  function altNumber() {
    return sanitiseNumber(WA.numberAlt);
  }

  /** Numéro affiché lisible (« 691 491 948 »). */
  function displayNumber() {
    return WA.display || primaryNumber();
  }

  function displayAltNumber() {
    return WA.displayAlt || altNumber();
  }

  /* =====================================================================
     CONSTRUCTION DES LIENS
     ===================================================================== */

  /**
   * Construit une URL wa.me.
   * @param {string} message  texte du message
   * @param {string} [number] numéro à utiliser (par défaut : principal)
   */
  function waLink(message, number) {
    var num = sanitiseNumber(number) || primaryNumber();
    var base = WA.baseUrl || 'https://wa.me/';
    if (!num) return '';
    return base + num + '?text=' + encodeURIComponent(String(message || ''));
  }

  /** Lien WhatsApp du bouton flottant de la page. */
  function genericLink() {
    return waLink(I18N.t('wa.prefill'));
  }

  /** Lien « Se renseigner » pour un service. */
  function serviceLink(service) {
    var msg = buildServiceMessage(service);
    return waLink(msg);
  }

  /** Message préparé pour une demande sur un service. */
  function buildServiceMessage(service) {
    var title = H.pick(service.title);
    var lines = [];
    lines.push(I18N.t('wa.contactGreeting'));
    lines.push('');
    lines.push(I18N.t('wa.hotelLine', {
      hotel: HOTEL.name,
      address: H.pick(HOTEL.address)
    }));
    lines.push('');
    lines.push(title + ' — ' + I18N.t('services.inquiryInfo'));
    if (service.hours) {
      lines.push(I18N.t('services.hours') + ' : ' + H.pick(service.hours));
    }
    if (service.short) {
      lines.push('');
      lines.push(H.pick(service.short));
    }
    lines.push('');
    lines.push(I18N.t('wa.footer'));
    return lines.join('\n');
  }

  /* =====================================================================
     MESSAGE DE RÉSERVATION
     ===================================================================== */

  /**
   * Compose le message de réservation complet, en français lisible.
   *
   * @param {object} room   chambre sélectionnée
   * @param {object} data   { name, phone, email, checkIn, checkOut,
   *                          adults, children, rooms, requests }
   */
  function buildBookingMessage(room, data) {
    var d = data || {};
    var checkIn = d.checkIn || '';
    var checkOut = d.checkOut || '';
    var nights = H.countNights(checkIn, checkOut);
    var roomsCount = Math.max(1, parseInt(d.rooms, 10) || 1);
    var adults = Math.max(0, parseInt(d.adults, 10) || 0);
    var children = Math.max(0, parseInt(d.children, 10) || 0);
    var total = room.price * nights * roomsCount;
    var lines = [];

    // Accroche
    lines.push(I18N.t('wa.greeting'));
    lines.push('');
    lines.push(I18N.t('wa.hotelLine', {
      hotel: HOTEL.name,
      address: H.pick(HOTEL.address)
    }));
    lines.push('');

    // Chambre
    if (room) {
      lines.push(I18N.t('wa.room', { name: room.name, ref: room.ref }));
      lines.push(I18N.t('wa.category', { category: H.categoryLabel(room.category) }));
      lines.push(I18N.t('wa.nightly', { price: H.formatNightly(room.price) }));
      lines.push('');
    }

    // Séjour
    if (nights > 0) {
      lines.push(
        I18N.t('wa.dates', {
          checkIn: H.formatDateShort(checkIn),
          checkOut: H.formatDateShort(checkOut)
        })
      );
      lines.push(I18N.t('wa.nightsRooms', { nights: nights, rooms: roomsCount }));
      lines.push(
        I18N.t('wa.guests', { adults: adults, children: children })
      );
      lines.push('');
    }

    // Estimation
    if (nights > 0) {
      lines.push(I18N.t('wa.total', { total: H.formatPrice(total) }));
      lines.push(I18N.t('wa.estimateNote'));
      lines.push('');
    }

    // Client
    if (d.name) lines.push(I18N.t('wa.name', { text: d.name }));
    if (d.phone) lines.push(I18N.t('wa.phone', { text: d.phone }));
    if (d.email) lines.push(I18N.t('wa.email', { text: d.email }));

    // Demandes particulières
    if (d.requests) {
      lines.push('');
      lines.push(I18N.t('wa.requests', { text: d.requests }));
    }

    // Lien vers la fiche
    if (room) {
      lines.push('');
      lines.push(I18N.t('wa.link', { link: H.roomUrl(room.id) }));
    }

    lines.push('');
    lines.push(I18N.t('wa.footer'));
    return lines.join('\n');
  }

  /** Lien WhatsApp complet pour une demande de réservation. */
  function bookingLink(room, data, number) {
    return waLink(buildBookingMessage(room, data), number);
  }

  /** Message de demande générale (page Contact). */
  function buildContactMessage(data) {
    var d = data || {};
    var lines = [];
    lines.push(I18N.t('wa.contactGreeting'));
    lines.push('');
    lines.push(I18N.t('wa.hotelLine', {
      hotel: HOTEL.name,
      address: H.pick(HOTEL.address)
    }));
    lines.push('');
    if (d.subject) {
      lines.push(I18N.t('wa.contactSubject', { subject: d.subject }));
      lines.push('');
    }
    if (d.name) lines.push(I18N.t('wa.name', { text: d.name }));
    if (d.phone) lines.push(I18N.t('wa.phone', { text: d.phone }));
    if (d.email) lines.push(I18N.t('wa.email', { text: d.email }));
    lines.push('');
    if (d.message) {
      lines.push(I18N.t('wa.contactMessage', { text: d.message }));
    }
    lines.push('');
    lines.push(I18N.t('wa.footer'));
    return lines.join('\n');
  }

  function contactLink(data, number) {
    return waLink(buildContactMessage(data), number);
  }

  /**
   * Ouvre une URL dans un nouvel onglet.
   * Retourne false si le navigateur a bloqué la fenêtre.
   */
  function openExternal(url) {
    if (!url) return false;
    var win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.opener = null;
    return !!win;
  }

  /* =====================================================================
     COPIE DANS LE PRESSE-PAPIERS
     ===================================================================== */

  /**
   * Copie un texte (sans journaliser son contenu).
   * Retourne une promesse résolue avec true/false.
   */
  function copyText(text) {
    var value = String(text || '');
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(value).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(value);
        }
      );
    }
    return Promise.resolve(legacyCopy(value));
  }

  /** Méthode de repli pour les navigateurs sans API Clipboard. */
  function legacyCopy(value) {
    try {
      var field = document.createElement('textarea');
      field.value = value;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.top = '-1000px';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(field);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  window.RGG_WA = {
    sanitiseNumber: sanitiseNumber,
    primaryNumber: primaryNumber,
    altNumber: altNumber,
    displayNumber: displayNumber,
    displayAltNumber: displayAltNumber,
    waLink: waLink,
    genericLink: genericLink,
    serviceLink: serviceLink,
    buildServiceMessage: buildServiceMessage,
    buildBookingMessage: buildBookingMessage,
    bookingLink: bookingLink,
    buildContactMessage: buildContactMessage,
    contactLink: contactLink,
    openExternal: openExternal,
    copyText: copyText
  };
})();
