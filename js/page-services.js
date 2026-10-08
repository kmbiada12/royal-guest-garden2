/* =========================================================================
   Royal Guest Garden — Script de la page « Services »
   -------------------------------------------------------------------------
   Affiche chaque service avec sa description complète, ses horaires et ses
   tarifs, puis un récapitulatif sous forme de tableau.
   ========================================================================= */

(function () {
  'use strict';

  var DATA = window.RGG_DATA;
  var H = window.RGG_HELPERS;
  var ICONS = window.RGG_ICONS;
  var CARDS = window.RGG_CARDS;

  /* `pricing.included` vaut true, false ou 'partial' et pilote le badge. */
  function inclusionBadge(service) {
    var kind = service.pricing ? service.pricing.included : false;
    var key;
    if (kind === true) key = 'services.includedBadge';
    else if (kind === 'partial') key = 'services.partlyBadge';
    else key = 'services.extraBadge';
    var modifier = kind === true ? 'included' : kind === 'partial' ? 'partly' : 'extra';
    return '<li><span class="badge badge--' + modifier + '">' + H.escapeHtml(H.t(key)) + '</span></li>';
  }

  function priceList(service) {
    if (!service.pricing || !service.pricing.items) return '';
    return (
      '<ul class="card__facts" style="margin-top:var(--sp-2)">' +
      service.pricing.items
        .map(function (item) {
          var amount =
            typeof item.price === 'number' ? H.formatPrice(item.price) : H.pick(item.price);
          return (
            '<li>' + ICONS.icon('wallet') + '<span><strong>' +
            H.escapeHtml(H.pick(item.label)) + '</strong>' +
            H.escapeHtml(amount) + '</span></li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function detailCard(service) {
    var title = H.pick(service.title);
    var details = (service.details || [])
      .map(function (line) {
        return '<li>' + ICONS.icon('check') + H.escapeHtml(H.pick(line)) + '</li>';
      })
      .join('');

    return (
      '<article class="service-block" style="margin-bottom:var(--sp-6)">' +
      '<div class="card service-card--wide">' +
      '<div class="card__media">' +
      '<img class="card__img" src="' + H.escapeHtml(H.imageUrl(service.image, 1000)) +
      '" alt="' + H.escapeHtml(title) + '" loading="lazy" decoding="async" width="1000" height="750" />' +
      '</div>' +
      '<div class="card__body">' +
      '<div class="service-card__head">' +
      '<span class="service-icon">' + ICONS.icon(service.icon, 'icon--lg') + '</span>' +
      '<h2 class="card__title">' + H.escapeHtml(title) + '</h2>' +
      '</div>' +
      '<ul class="service-badges">' + inclusionBadge(service) + '</ul>' +
      '<p class="card__text">' + H.escapeHtml(H.pick(service.short)) + '</p>' +
      '<ul class="tick-list">' + details + '</ul>' +
      priceList(service) +
      '<div class="card__actions">' +
      '<button type="button" class="btn btn-navy btn-sm" data-service="' + service.id +
      '" data-service-inquiry="' + service.inquiry + '">' +
      H.escapeHtml(H.t(service.inquiry === 'quote' ? 'common.quoteWa' : 'common.inquireWa')) +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function renderHours() {
    var body = document.querySelector('[data-services-hours] tbody');
    if (!body) return;
    body.innerHTML = DATA.SERVICES.map(function (service) {
      return (
        '<tr><th scope="row">' + H.escapeHtml(H.pick(service.title)) + '</th>' +
        '<td>' + H.escapeHtml(H.pick(service.hours)) + '</td></tr>'
      );
    }).join('');
  }

  function renderLegend() {
    var host = document.querySelector('[data-services-legend]');
    if (!host) return;
    var kinds = [
      ['included', 'services.includedBadge'],
      ['partly', 'services.partlyBadge'],
      ['extra', 'services.extraBadge']
    ]
      .map(function (row) {
        return (
          '<li><span class="badge badge--' + row[0] + '">' + H.escapeHtml(H.t(row[1])) +
          '</span></li>'
        );
      })
      .join('');
    host.innerHTML = kinds;
  }

  function render() {
    var host = document.querySelector('[data-services-list]');
    if (host) {
      host.innerHTML = DATA.SERVICES.map(detailCard).join('');
    }
    renderHours();
    renderLegend();
    if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(document);
  }

  function init() {
    render();
    if (window.RGG) window.RGG.onLanguageChange(render);
  }

  /* Premier rendu une fois le contenu chargé (Supabase ou statique). */
  if (window.RGG_ON_READY) {
    window.RGG_ON_READY(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* La carte compacte reste utilisée sur la page d'accueil. */
  void CARDS;
})();