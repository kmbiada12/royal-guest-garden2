/* =========================================================================
   Royal Guest Garden — Script de la fiche chambre
   -------------------------------------------------------------------------
   La chambre est identifiée par le paramètre d'URL ?id=…
   (par exemple room.html?id=nkolbisson). Si l'identifiant est absent ou
   inconnu, la page affiche un message d'erreur et un lien vers le catalogue.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var H = window.RGG_HELPERS;
  var ICONS = window.RGG_ICONS;
  var CARDS = window.RGG_CARDS;

  var POLICIES = (CONFIG.booking && CONFIG.booking.policies) || [];

  function t(key, params) {
    return H.t(key, params);
  }

  function galleryItems(room) {
    return room.images.map(function (src, index) {
      return {
        src: src,
        alt: t('room.gallery.alt', { n: index + 1, name: H.pick(room.name) }),
        caption: H.pick(room.name) + ' · ' + room.ref
      };
    });
  }

  /* =====================================================================
     BLOCS DE LA PAGE
     ===================================================================== */

  function heroSection(room) {
    var items = galleryItems(room);
    var name = H.pick(room.name);
    var lead = [
      room.capacity + ' ' + t('common.guests'),
      room.size + ' ' + t('common.m2'),
      H.pick(room.beds)
    ].join(' · ');

    var thumbs = items
      .map(function (item, index) {
        return (
          '<button type="button" class="thumb' + (index === 0 ? ' is-active' : '') + '"' +
          '        data-gallery-index="' + index + '"' +
          '        aria-label="' + H.escapeHtml(item.alt) + '">' +
          '  <img src="' + H.escapeHtml(H.imageUrl(item.src, 320)) + '" alt="" loading="lazy"' +
          '       width="320" height="240" />' +
          '</button>'
        );
      })
      .join('');

    return [
      '<section class="section section--tight section--cream">',
      '  <div class="container">',
      '    <nav aria-label="' + H.escapeHtml(t('a11y.breadcrumb')) + '">',
      '      <ol class="breadcrumb">',
      '        <li><a href="index.html" data-no-wa>' + H.escapeHtml(t('nav.home')) + '</a></li>',
      '        <li><a href="rooms.html" data-no-wa>' + H.escapeHtml(t('nav.rooms')) + '</a></li>',
      '        <li>' + H.escapeHtml(name) + '</li>',
      '      </ol>',
      '    </nav>',
      '    <div class="room-head">',
      '      <p class="room-head__cat">' + H.escapeHtml(H.categoryLabel(room.category)) + '</p>',
      '      <h1 class="room-head__title">' + H.escapeHtml(name) + '</h1>',
      '      <p class="room-head__lead">' + H.escapeHtml(lead) + '</p>',
      '    </div>',
      '    <div class="room-top">',
      '      <div class="room-gallery">',
      '        <button type="button" class="room-gallery__main" data-gallery-open="0" data-gallery-main-target>',
      '          <img src="' + H.escapeHtml(H.imageUrl(items[0].src, 1400)) + '"',
      '               alt="' + H.escapeHtml(t('room.mainImageAlt', { name: name })) + '"',
      '               width="1400" height="875" fetchpriority="high" />',
      '          <span class="room-gallery__zoom">' + ICONS.icon('expand') +
      H.escapeHtml(t('a11y.lightbox')) + '</span>',
      '        </button>',
      '        <div class="room-gallery__thumbs">' + thumbs + '</div>',
      '        <p class="form-note">' + H.escapeHtml(t('room.gallery.hint')) + '</p>',
      '      </div>',
      bookCard(room),
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  function bookCard(room) {
    var name = H.pick(room.name);
    var facts = [
      [t('common.ref'), room.ref, 'info'],
      [t('common.capacity'), room.capacity + ' ' + t('common.guests'), 'users'],
      [t('common.size'), room.size + ' ' + t('common.m2'), 'ruler'],
      [t('common.beds'), H.pick(room.beds), 'bed'],
      [t('common.floor'), H.pick(room.floor), 'location'],
      [t('common.view'), H.pick(room.view), 'leaf']
    ]
      .map(function (row) {
        return (
          '<li>' + ICONS.icon(row[2]) +
          '<span><strong>' + H.escapeHtml(row[0]) + '</strong>' +
          H.escapeHtml(row[1]) + '</span></li>'
        );
      })
      .join('');

    return [
      '<aside class="room-book-card" aria-label="' + H.escapeHtml(t('a11y.book', { name: name })) + '">',
      '  <p class="room-book-card__price">' + H.escapeHtml(H.formatPrice(room.price)) + '</p>',
      '  <p class="room-book-card__per">' + H.escapeHtml(t('common.perNight')) + '</p>',
      '  <ul class="room-book-card__facts">' + facts + '</ul>',
      '  <button type="button" class="btn btn-gold btn-block btn-lg" data-book="' + room.id + '">',
      H.escapeHtml(t('common.bookThis')),
      '  </button>',
      '  <p class="room-book-card__note">' + H.escapeHtml(t('book.whatsapp.notSent')) + '</p>',
      '</aside>'
    ].join('\n');
  }

  function roomNav() {
    var items = [
      ['overview', 'room.tabOverview'],
      ['included', 'room.included.title'],
      ['policy', 'room.policy.title'],
      ['similar', 'room.similar.title']
    ]
      .map(function (row) {
        return (
          '<li><a class="room-nav__link" href="#' + row[0] + '" data-no-wa>' +
          H.escapeHtml(t(row[1])) + '</a></li>'
        );
      })
      .join('');

    return (
      '<nav class="room-nav" aria-label="' + H.escapeHtml(t('a11y.roomSections')) + '">' +
      '<ul class="room-nav__list">' + items + '</ul></nav>'
    );
  }

  function overviewSection(room) {
    var amenities = room.amenities
      .map(function (id) {
        return '<li>' + ICONS.icon('check') + H.escapeHtml(H.amenityLabel(id)) + '</li>';
      })
      .join('');

    return [
      '<section class="panel" id="overview">',
      '  <h2 class="panel__title">' + H.escapeHtml(t('room.overview.title')) + '</h2>',
      '  <div class="prose"><p>' + H.escapeHtml(H.pick(room.description)) + '</p></div>',
      '  <h3>' + H.escapeHtml(t('room.amenities.title')) + '</h3>',
      '  <ul class="amenity-list">' + amenities + '</ul>',
      '  <p class="form-note">' + H.escapeHtml(t('room.amenities.all')) + '</p>',
      '</section>'
    ].join('\n');
  }

  function includedSection(room) {
    var included = H.pick(t('room.included.lists'));
    var excluded = H.pick(t('room.excluded.lists'));

    function column(title, items, iconName, listClass) {
      var list = (items || [])
        .map(function (line) {
          return '<li>' + ICONS.icon(iconName) + H.escapeHtml(line) + '</li>';
        })
        .join('');
      return (
        '<div><h3>' + H.escapeHtml(title) + '</h3><ul class="' + listClass + '">' +
        list + '</ul></div>'
      );
    }

    return [
      '<section class="panel" id="included">',
      '  <h2 class="panel__title">' + H.escapeHtml(t('room.included.title')) + '</h2>',
      '  <div class="two-col">',
      column(t('room.included.title'), included, 'check', 'tick-list'),
      column(t('room.excluded.title'), excluded, 'info', 'cross-list'),
      '  </div>',
      '  <div class="two-col" style="margin-top:var(--sp-6)">',
      '    <div>',
      '      <h3>' + H.escapeHtml(t('room.breakfast.title')) + '</h3>',
      '      <ul class="tick-list">',
      '        <li>' + ICONS.icon(room.breakfastIncluded ? 'check' : 'info') +
      H.escapeHtml(room.breakfastIncluded ? t('room.breakfast.included') : t('room.breakfast.notIncluded')) +
      '</li>',
      '        <li>' + ICONS.icon('info') + H.escapeHtml(H.pick(room.breakfastNote)) + '</li>',
      '      </ul>',
      '    </div>',
      '    <div>',
      '      <h3>' + H.escapeHtml(t('room.taxes.title')) + '</h3>',
      '      <ul class="tick-list">',
      '        <li>' + ICONS.icon('check') + H.escapeHtml(t('room.taxes.included')) + '</li>',
      '        <li>' + ICONS.icon('info') + H.escapeHtml(t('room.taxes.notIncluded')) + '</li>',
      '      </ul>',
      '      <p class="form-note">' + H.escapeHtml(t('room.taxes.note')) + '</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  function policySection() {
    var items = POLICIES.map(function (policy, index) {
      return (
        '<li><span class="policy-list__num">' + (index + 1) + '</span>' +
        '<p class="policy-list__text">' + H.escapeHtml(H.pick(policy)) + '</p></li>'
      );
    }).join('');

    return [
      '<section class="panel" id="policy">',
      '  <h2 class="panel__title">' + H.escapeHtml(t('room.policy.title')) + '</h2>',
      '  <p>' + H.escapeHtml(t('room.policy.subtitle')) + '</p>',
      '  <ul class="policy-list">' + items + '</ul>',
      '  <div class="notice" style="margin-top:var(--sp-5)">',
      '    <p class="notice__title">' + H.escapeHtml(t('common.demoBadge')) + '</p>',
      '    <p>' + H.escapeHtml(t('home.cta.note')) + '</p>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  function similarSection(room) {
    var similar = H.getSimilarRooms(room, 3);
    var cards = similar
      .map(function (item) {
        return CARDS.roomCard(item, { maxAmenities: 2 });
      })
      .join('');

    return [
      '<section id="similar">',
      '  <div class="section-head">',
      '    <h2>' + H.escapeHtml(t('room.similar.title')) + '</h2>',
      '    <p>' + H.escapeHtml(t('room.similar.subtitle')) + '</p>',
      '  </div>',
      similar.length
        ? '<div class="cards">' + cards + '</div>'
        : '<p>' + H.escapeHtml(t('room.similar.empty')) + '</p>',
      '</section>'
    ].join('\n');
  }

  function ctaSection(room) {
    return [
      '<section class="cta-band">',
      '  <div class="container cta-band__inner">',
      '    <div>',
      '      <h2>' + H.escapeHtml(t('room.cta.title')) + '</h2>',
      '      <p>' + H.escapeHtml(t('room.cta.text')) + '</p>',
      '      <p style="margin-top:var(--sp-3);font-size:var(--fs-xs);color:rgba(247,244,238,.6)">' +
      H.escapeHtml(t('room.cta.note')) + '</p>',
      '    </div>',
      '    <div class="cta-band__actions">',
      '      <button type="button" class="btn btn-gold btn-lg" data-book="' + room.id + '">' +
      H.escapeHtml(t('common.bookThis')) + '</button>',
      '      <a class="btn btn-outline btn-lg" href="rooms.html" data-no-wa>' +
      H.escapeHtml(t('room.backRooms')) + '</a>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  /* =====================================================================
     GALERIE ET VISIONNEUSE
     ===================================================================== */

  function bindGallery() {
    var root = document.querySelector('[data-room-root]');
    if (!root) return;

    /* Un seul écouteur pour toute la vie de la page : « render() » est relancé
       à chaque changement de langue et remplace le contenu, mais pas la racine. */
    if (root.__galleryBound) return;
    root.__galleryBound = true;

    root.addEventListener('click', function (event) {
      var thumb = event.target.closest('[data-gallery-index]');
      if (thumb) {
        showMain(Number(thumb.getAttribute('data-gallery-index')));
        return;
      }
      var opener = event.target.closest('[data-gallery-open]');
      if (opener) {
        window.RGG_LIGHTBOX.open(galleryItems(currentRoom()), Number(opener.getAttribute('data-gallery-open')));
      }
    });
  }

  /** Affiche une photo en grand et met à jour la vignette active. */
  function showMain(index) {
    var root = document.querySelector('[data-room-root]');
    var mainButton = root ? root.querySelector('[data-gallery-main-target]') : null;
    var mainImage = mainButton ? mainButton.querySelector('img') : null;
    if (!mainImage) return;

    var items = galleryItems(currentRoom());
    if (!items[index]) return;

    mainImage.setAttribute('src', H.imageUrl(items[index].src, 1400));
    mainImage.setAttribute('alt', items[index].alt);

    root.querySelectorAll('[data-gallery-index]').forEach(function (thumb) {
      var isActive = Number(thumb.getAttribute('data-gallery-index')) === index;
      thumb.classList.toggle('is-active', isActive);
      if (isActive) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });

    /* La visionneuse doit s'ouvrir sur la photo affichée, pas sur la première. */
    if (mainButton) mainButton.setAttribute('data-gallery-open', String(index));
  }

  function currentRoom() {
    var id = new URLSearchParams(window.location.search).get('id');
    return H.getRoomById(id);
  }

  /* =====================================================================
     RENDU COMPLET
     ===================================================================== */

  function render() {
    var root = document.querySelector('[data-room-root]');
    if (!root) return;

    var room = currentRoom();

    if (!room) {
      renderNotFound(root);
      return;
    }

    root.innerHTML = [
      heroSection(room),
      '<section class="section section--tight section--white">',
      '<div class="container">',
      roomNav(),
      '<div class="room-sections">',
      overviewSection(room),
      includedSection(room),
      policySection(),
      '</div>',
      '</div>',
      '</section>',
      '<section class="section section--cream">',
      '<div class="container">',
      similarSection(room),
      '</div>',
      '</section>',
      ctaSection(room)
    ].join('\n');

    /* Galerie : la photo principale porte data-gallery-main-target. */
    bindGallery();
    if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(root);
  }

  function renderNotFound(root) {
    root.innerHTML = [
      '<section class="section section--cream">',
      '  <div class="container">',
      '    <div class="empty-state">',
      '      <span class="empty-state__icon" data-icon="alert"></span>',
      '      <h1>' + H.escapeHtml(t('room.notFoundTitle')) + '</h1>',
      '      <p>' + H.escapeHtml(t('room.notFoundText')) + '</p>',
      '      <a class="btn btn-outline" href="rooms.html" data-no-wa>' +
      H.escapeHtml(t('common.backRooms')) + '</a>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');
    if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(root);
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