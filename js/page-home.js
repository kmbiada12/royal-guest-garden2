/* =========================================================================
   Royal Guest Garden — Script de la page d'accueil
   -------------------------------------------------------------------------
   Remplit les blocs dynamiques : prix minimum, nombre de chambres, sélection
   de chambres, services, avantages et témoignages.
   Chaque bloc est reconstruit au changement de langue.
   ========================================================================= */

(function () {
  'use strict';

  var DATA = window.RGG_DATA;
  var H = window.RGG_HELPERS;
  var CARDS = window.RGG_CARDS;

  function fill(id, html) {
    var host = document.querySelector('[data-' + id + ']');
    if (!host) return;
    host.innerHTML = html;
    if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(host);
  }

  function render() {
    /* Compteurs et prix minimum */
    var fromPrice = document.querySelector('[data-home-from-price]');
    if (fromPrice) fromPrice.textContent = H.formatPrice(H.minPrice());

    var roomCount = document.querySelector('[data-home-room-count]');
    if (roomCount) roomCount.textContent = String(DATA.ROOMS.length);

    /* Chambres mises en avant : 6 au maximum, sans Mont Cameroun */
    var featured = H.getFeaturedRooms().filter(function (room) {
      return room.id !== 'mont-cameroun';
    }).slice(0, 6);
    if (featured.length < 6) {
      featured = H.sortRooms(H.getRooms().filter(function (room) {
        return room.id !== 'mont-cameroun';
      })).slice(0, 6);
    }
    fill(
      'featured-rooms',
      featured
        .map(function (room) {
          return CARDS.roomCard(room, { maxAmenities: 3 });
        })
        .join('')
    );

    /* Services */
    fill(
      'home-services',
      DATA.SERVICES.map(function (service) {
        return CARDS.serviceCard(service, { image: true });
      }).join('')
    );

    /* Avantages */
    fill(
      'home-benefits',
      DATA.BENEFITS.map(function (group) {
        return (
          '<section class="benefit-group">' +
          '  <h3 class="benefit-group__title">' + H.escapeHtml(H.pick(group.title)) + '</h3>' +
          '  <div class="cards benefit-group__cards">' +
          group.items
            .map(function (item) {
              return CARDS.benefitCard(item);
            })
            .join('') +
          '  </div>' +
          '</section>'
        );
      }).join('')
    );

    /* Témoignages : trois premiers */
    fill(
      'home-testimonials',
      DATA.TESTIMONIALS.slice(0, 3)
        .map(function (item) {
          return CARDS.testimonialCard(item);
        })
        .join('')
    );
  }

  /* ---------------------------------------------------------------------
     Mouvement des images : révélation au défilement
     --------------------------------------------------------------------- */
  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function armReveal() {
    var split = document.querySelector('.split__media');
    if (split) split.setAttribute('data-reveal', '');

    var media = [].slice.call(
      document.querySelectorAll(
        '[data-featured-rooms] .card__media, [data-home-services] .card__media'
      )
    );
    media.forEach(function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--reveal-delay', ((i % 3) * 0.12) + 's');
    });

    var targets = [].slice.call(document.querySelectorAll('[data-reveal]:not(.is-in)'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(function (el) { io.observe(el); });
  }

  function init() {
    render();
    armReveal();
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
