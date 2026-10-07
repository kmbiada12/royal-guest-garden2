/* =========================================================================
   Royal Guest Garden — Constructeurs de cartes partagés
   -------------------------------------------------------------------------
   Les cartes (chambres, services, témoignages, valeurs, équipe, galerie)
   sont construites ici afin que les six pages restent cohérentes.

   Deux délégations d'événements sont installées une seule fois :
     · [data-book="id"]        → ouvre la fenêtre de réservation
     · [data-service="id"]     → ouvre WhatsApp avec le bon message
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var DATA = window.RGG_DATA;
  var H = window.RGG_HELPERS;
  var ICONS = window.RGG_ICONS;

  function t(key, params) {
    return H.t(key, params);
  }

  /* =====================================================================
     ÉTOILES
     ===================================================================== */

  /** Affiche une note sur 5 sous forme d'étoiles (accessible). */
  function stars(rating) {
    var value = Math.max(0, Math.min(5, Number(rating) || 0));
    var chars = '';
    for (var i = 1; i <= 5; i++) {
      chars += '<span class="' + (i <= value ? '' : 'stars__empty') + '">' + '★' + '</span>';
    }
    return (
      '<span class="stars" role="img" aria-label="' +
      H.escapeHtml(value + ' / 5') +
      '">' +
      chars +
      '</span>'
    );
  }

  /* =====================================================================
     CARTE CHAMBRE
     ===================================================================== */

  /**
   * Carte chambre réutilisée sur l'accueil, la liste et la fiche.
   * @param {Object} room  chambre de RGG_DATA.ROOMS
   * @param {Object} [opts] { maxAmenities }
   */
  function roomCard(room, opts) {
    var options = opts || {};
    var maxAmenities = options.maxAmenities || 3;
    var name = H.pick(room.name);
    var href = H.roomUrl(room.id);
    var img = H.imageUrl(room.images[0], 800);

    var badges = '<span class="badge">' + H.escapeHtml(H.categoryLabel(room.category)) + '</span>';
    if (room.featured) badges += '<span class="badge badge-navy">' + H.escapeHtml(t('card.featured')) + '</span>';

    var capacityKey = room.capacity > 1 ? 'card.capacityLabel' : 'card.capacityLabelOne';
    var meta = [
      '<li>' + ICONS.icon('users') + H.escapeHtml(t(capacityKey, { n: room.capacity })) + '</li>',
      '<li>' + ICONS.icon('ruler') + H.escapeHtml(room.size + ' ' + t('common.m2')) + '</li>',
      '<li>' + ICONS.icon('location') + H.escapeHtml(H.pick(room.view)) + '</li>'
    ].join('');

    var amenityItems = room.amenities
      .slice(0, maxAmenities)
      .map(function (id) {
        return '<li class="tag">' + H.escapeHtml(H.amenityLabel(id)) + '</li>';
      })
      .join('');

    return (
      '<article class="card">' +
      '  <a class="card__media" href="' + href + '" data-no-wa' +
      '     aria-label="' + H.escapeHtml(t('card.detailsAria', { name: name })) + '">' +
      '    <img class="card__img" src="' + H.escapeHtml(img) + '"' +
      '         alt="' + H.escapeHtml(name) + '" loading="lazy" decoding="async"' +
      '         width="800" height="600" />' +
      '    <span class="card__badges">' + badges + '</span>' +
      '  </a>' +
      '  <div class="card__body">' +
      '    <div class="card__head">' +
      '      <h3 class="card__title"><a href="' + href + '" data-no-wa>' + H.escapeHtml(name) + '</a></h3>' +
      '      <span class="card__ref">' + H.escapeHtml(room.ref) + '</span>' +
      '    </div>' +
      '    <p class="card__text">' + H.escapeHtml(H.pick(room.short)) + '</p>' +
      '    <ul class="card__meta">' + meta + '</ul>' +
      '    <ul class="card__amenities">' + amenityItems + '</ul>' +
      '    <div class="card__foot">' +
      '      <p class="card__price"><strong>' + H.escapeHtml(H.formatPrice(room.price)) + '</strong>' +
      H.escapeHtml(t('common.perNight')) + '</p>' +
      '      <div class="card__actions">' +
      '        <a class="btn btn-outline btn-sm" href="' + href + '" data-no-wa>' +
      H.escapeHtml(t('common.seeDetails')) + '</a>' +
      '        <button type="button" class="btn btn-gold btn-sm" data-book="' + room.id + '"' +
      '                aria-label="' + H.escapeHtml(t('card.bookAria', { name: name })) + '">' +
      H.escapeHtml(t('common.bookThis')) + '</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  /* =====================================================================
     CARTE SERVICE
     ===================================================================== */

  /**
   * @param {Object} service  service de RGG_DATA.SERVICES
   * @param {Object} [opts] { image, wide } image affiche la photo ; wide affiche le texte complet
   */
  function serviceCard(service, opts) {
    var options = opts || {};
    var title = H.pick(service.title);
    var isQuote = service.inquiry === 'quote';
    var buttonLabel = t(isQuote ? 'common.quoteWa' : 'common.inquireWa');
    var showImage = options.image || options.wide;

    var facts = [];
    if (service.hours) {
      facts.push(
        '<li>' + ICONS.icon('clock') + H.escapeHtml(H.pick(service.hours)) + '</li>'
      );
    }
    if (service.pricing && service.pricing.note) {
      facts.push(
        '<li>' + ICONS.icon('wallet') + H.escapeHtml(H.pick(service.pricing.note)) + '</li>'
      );
    }

    var image = showImage
      ? '<div class="card__media"><img class="card__img" src="' +
        H.escapeHtml(H.imageUrl(service.image, 1000)) +
        '" alt="' + H.escapeHtml(title) + '" loading="lazy" decoding="async" width="1000" height="750" /></div>'
      : '';

    return (
      '<article class="card card--service' + (options.wide ? ' service-card--wide' : '') + '">' +
      image +
      '  <div class="card__body">' +
      '    <div class="service-card__head">' +
       (showImage ? '' : '<span class="service-icon">' + ICONS.icon(service.icon, 'icon--lg') + '</span>') +
      '      <h3 class="card__title">' + H.escapeHtml(title) + '</h3>' +
      '    </div>' +
      '    <p class="card__text">' +
      H.escapeHtml(H.pick(options.wide ? service.details[0] : service.short)) + '</p>' +
      (facts.length ? '<ul class="card__facts">' + facts.join('') + '</ul>' : '') +
      '    <div class="card__actions">' +
      '      <button type="button" class="btn btn-navy btn-sm" data-service="' + service.id + '"' +
      '              data-service-inquiry="' + service.inquiry + '">' +
      H.escapeHtml(buttonLabel) + '</button>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  /* =====================================================================
     CARTES DIVERSES
     ===================================================================== */

  function benefitCard(item) {
    return (
      '<article class="value-card benefit-card">' +
      '  <span class="service-icon" aria-hidden="true">' + ICONS.icon(item.icon, 'icon--lg') + '</span>' +
      '  <div class="benefit-card__content">' +
      '    <h4>' + H.escapeHtml(H.pick(item.title)) + '</h4>' +
      '    <p>' + H.escapeHtml(H.pick(item.text)) + '</p>' +
      '  </div>' +
      '</article>'
    );
  }

  function valueCard(item) {
    return (
      '<article class="value-card">' +
      '  <h3>' + H.escapeHtml(H.pick(item.title)) + '</h3>' +
      '  <p>' + H.escapeHtml(H.pick(item.text)) + '</p>' +
      '</article>'
    );
  }

  function experienceCard(item) {
    return (
      '<article class="experience-card">' +
      '  <span class="experience-card__icon" aria-hidden="true">' + ICONS.icon(item.icon) + '</span>' +
      '  <h3>' + H.escapeHtml(H.pick(item.audience)) + '</h3>' +
      '  <p>' + H.escapeHtml(H.pick(item.text)) + '</p>' +
      '</article>'
    );
  }

  function testimonialCard(item) {
    return (
      '<figure class="quote-card">' +
      '  <p class="quote-card__mark" aria-hidden="true">&ldquo;</p>' +
      '  <blockquote><p>' + H.escapeHtml(H.pick(item.quote)) + '</p></blockquote>' +
      '  <figcaption>' +
      '    <span><span class="quote-card__author">' + H.escapeHtml(H.pick(item.author)) + '</span>' +
      '      <span class="quote-card__meta">' + H.escapeHtml(H.pick(item.meta)) + '</span></span>' +
      stars(item.rating) +
      '  </figcaption>' +
      '</figure>'
    );
  }

  function teamCard(item) {
    return (
      '<article class="team-card">' +
      '  <img class="team-card__photo" src="' + H.escapeHtml(H.imageUrl(item.image, 400)) + '"' +
      '       alt="' + H.escapeHtml(H.pick(item.name)) + '" loading="lazy" decoding="async"' +
      '       width="400" height="400" />' +
      '  <h3>' + H.escapeHtml(H.pick(item.name)) + '</h3>' +
      '  <span class="team-card__role">' + H.escapeHtml(H.pick(item.role)) + '</span>' +
      '  <p>' + H.escapeHtml(H.pick(item.bio)) + '</p>' +
      '</article>'
    );
  }

  /* =====================================================================
     DÉLÉGATIONS D'ÉVÉNEMENTS
     ===================================================================== */

  function openService(serviceId, inquiry) {
    var WA = window.RGG_WA;
    var service = H.getServiceById(serviceId);
    if (!service || !WA) return;
    var link = WA.serviceLink(service);
    WA.openExternal(link);
    void inquiry; // le message est déjà adapté dans whatsapp.js
  }

  function initDelegation() {
    document.addEventListener('click', function (event) {
      var bookBtn = event.target.closest ? event.target.closest('[data-book]') : null;
      if (bookBtn) {
        var booking = window.RGG_BOOKING;
        if (booking) booking.open(bookBtn.getAttribute('data-book'));
        return;
      }

      var serviceBtn = event.target.closest ? event.target.closest('[data-service]') : null;
      if (serviceBtn) {
        event.preventDefault();
        openService(
          serviceBtn.getAttribute('data-service'),
          serviceBtn.getAttribute('data-service-inquiry')
        );
      }
    });
  }

  window.RGG_CARDS = {
    roomCard: roomCard,
    serviceCard: serviceCard,
    benefitCard: benefitCard,
    valueCard: valueCard,
    experienceCard: experienceCard,
    testimonialCard: testimonialCard,
    teamCard: teamCard,
    stars: stars,
    initDelegation: initDelegation,
    render: function (host, html) {
      if (!host) return;
      host.innerHTML = html;
      if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(host);
    }
  };

  /* Le catalogue est disponible immédiatement : pas d'attente du DOM. */
  initDelegation();
  void CONFIG;
  void DATA;
})();
