/* =========================================================================
   Royal Guest Garden — Script de la page « À propos »
   -------------------------------------------------------------------------
   Valeurs, publics, points d'intérêt, galerie avec visionneuse et équipe.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var DATA = window.RGG_DATA;
  var H = window.RGG_HELPERS;
  var ICONS = window.RGG_ICONS;
  var CARDS = window.RGG_CARDS;

  var galleryBound = false;

  function renderLandmarks() {
    var host = document.querySelector('[data-about-landmarks]');
    if (!host) return;
    var list = H.pick(CONFIG.hotel.landmarks) || [];
    host.innerHTML = list
      .map(function (line) {
        return '<li>' + ICONS.icon('location') + H.escapeHtml(line) + '</li>';
      })
      .join('');

    var mapLink = document.querySelector('[data-about-map]');
    if (mapLink) mapLink.setAttribute('href', CONFIG.hotel.mapUrl);
  }

  function renderValues() {
    var host = document.querySelector('[data-about-values]');
    if (!host) return;
    host.innerHTML = DATA.VALUES.map(function (item) {
      return CARDS.valueCard(item);
    }).join('');
  }

  function renderExperience() {
    var host = document.querySelector('[data-about-experience]');
    if (!host) return;
    host.innerHTML = DATA.GUEST_EXPERIENCE.map(function (item) {
      return CARDS.experienceCard(item);
    }).join('');
  }

  function renderTeam() {
    var host = document.querySelector('[data-about-team]');
    if (!host) return;
    host.innerHTML = DATA.TEAM.map(function (item) {
      return CARDS.teamCard(item);
    }).join('');
  }

  function galleryItems() {
    return DATA.GALLERY.items.map(function (item, index) {
      return {
        src: item.image,
        alt: H.pick(item.caption),
        caption: H.pick(item.caption)
      };
    });
  }

  function renderGallery() {
    var host = document.querySelector('[data-about-gallery]');
    if (!host) return;
    host.innerHTML = DATA.GALLERY.items
      .map(function (item, index) {
        var caption = H.pick(item.caption);
        return (
          '<button type="button" class="gallery-item" data-about-photo="' + index + '"' +
          '        aria-label="' + H.escapeHtml(caption) + '">' +
          '  <img src="' + H.escapeHtml(H.imageUrl(item.image, 700)) + '" alt="' +
          H.escapeHtml(caption) + '" loading="lazy" decoding="async" width="700" height="700" />' +
          '  <span class="gallery-item__caption">' + H.escapeHtml(caption) + '</span>' +
          '</button>'
        );
      })
      .join('');

    if (galleryBound) return;
    galleryBound = true;
    host.addEventListener('click', function (event) {
      var button = event.target.closest('[data-about-photo]');
      if (!button) return;
      window.RGG_LIGHTBOX.open(galleryItems(), Number(button.getAttribute('data-about-photo')));
    });
  }

  function render() {
    renderLandmarks();
    renderValues();
    renderExperience();
    renderTeam();
    renderGallery();
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
})();