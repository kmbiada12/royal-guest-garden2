/* =========================================================================
   Royal Guest Garden — En-tête, pied de page et éléments partagés
   -------------------------------------------------------------------------
   L'en-tête et le pied de page sont injectés par JavaScript sur toutes les
   pages, ce qui garantit une navigation cohérente et un seul endroit où
   modifier les liens.

   États de navigation actifs, menu mobile accessible, sélecteur de langue
   et bouton WhatsApp flottant.
   ========================================================================= */

(function () {
  'use strict';

  var I18N = window.RGG_I18N;
  var H = window.RGG_HELPERS;
  var WA = window.RGG_WA;
  var CONFIG = window.RGG_CONFIG;
  var HOTEL = CONFIG.hotel;

  /* Liens de navigation. `match` liste les pages qui doivent rester actives. */
  var NAV = [
    { key: 'nav.home', href: 'index.html', match: ['home'] },
    { key: 'nav.rooms', href: 'rooms.html', match: ['rooms', 'room'] },
    { key: 'nav.services', href: 'services.html', match: ['services'] },
    { key: 'nav.reglement', href: 'reglement.html', match: ['reglement'] },
    { key: 'nav.about', href: 'about.html', match: ['about'] },
    { key: 'nav.contact', href: 'contact.html', match: ['contact'] }
  ];

  var BRAND_LOGO =
    '<img class="brand-mark" src="img/logo-rgg.png" alt="" aria-hidden="true">';

  var WA_ICON = [
    '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">',
    '<path fill="currentColor" d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.4 1.7 6.3L3 29l6.9-1.8c1.8 1 3.8 1.5 6.1 1.5',
    ' 7.2 0 13-5.8 13-13S23.2 3 16 3zm7.6 18.4c-.3.9-1.6 1.7-2.3 1.8-.6.1-1.2.1-2-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.5-4.7-5.7-4.9-.1-.2-1.3-1.7-1.3-3.3s.8-2.3',
    ' 1.1-2.6c.3-.3.6-.4.9-.4h.6c.2 0 .5-.1.8.6l1 2.4c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1',
    ' 1 2 1.3 2.5 1.7.3.3.5.3.7.1l.9-1.1c.2-.2.4-.2.6-.1l2.3 1.1c.3.1.5.3.5.4 0 .1 0 .8-.3 1.7z"/>',
    '</svg>'
  ].join('');

  /* =====================================================================
     EN-TÊTE
     ===================================================================== */

  function buildHeader(activePage) {
    var isActive = function (item) {
      return item.match.indexOf(activePage) !== -1;
    };

    var links = NAV.map(function (item) {
      return (
        '<li><a class="nav-link' +
        (isActive(item) ? ' is-active' : '') +
        '" href="' +
        item.href +
        '"' +
        (isActive(item) ? ' aria-current="page"' : '') +
        ' data-i18n="' +
        item.key +
        '"></a></li>'
      );
    }).join('');

    var mobileLinks = NAV.map(function (item) {
      return (
        '<li><a class="mobile-link' +
        (isActive(item) ? ' is-active' : '') +
        '" href="' +
        item.href +
        '"' +
        (isActive(item) ? ' aria-current="page"' : '') +
        ' data-i18n="' +
        item.key +
        '"></a></li>'
      );
    }).join('');

    return [
      '<header class="site-header" data-header>',
      '  <div class="container header-inner">',
      '    <a class="brand" href="index.html">',
      '      ' + BRAND_LOGO,
      '      <span class="brand-text">',
      '        <span class="brand-name">Royal Guest Garden</span>',
      '        <span class="brand-slogan" data-i18n="footer.tagline"></span>',
      '      </span>',
      '    </a>',
      '',
      '    <nav class="nav-desktop" aria-label="Navigation principale" data-i18n-attr="aria-label:nav.primary">',
      '      <ul class="nav-list">' + links + '</ul>',
      '    </nav>',
      '',
      '    <div class="header-actions">',
      '      <button type="button" class="lang-toggle" data-lang-toggle data-i18n-attr="aria-label:lang.switch">',
      '        <span class="lang-toggle__label" data-lang-toggle-label>EN</span>',
      '      </button>',
      '      <a class="btn btn-gold btn-sm header-book" href="rooms.html" data-no-wa data-i18n="common.bookWa"></a>',
      '      <button type="button" class="nav-toggle" id="nav-toggle" data-nav-toggle',
      '              aria-expanded="false" aria-controls="mobile-menu"',
      '              data-i18n-attr="aria-label:a11y.menuOpen">',
      '        <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>',
      '      </button>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="mobile-menu" id="mobile-menu" hidden>',
      '    <nav aria-label="Navigation mobile" data-i18n-attr="aria-label:nav.primary">',
      '      <ul class="mobile-list">' + mobileLinks + '</ul>',
      '    </nav>',
      '    <div class="mobile-menu__footer">',
      '      <button type="button" class="lang-toggle lang-toggle--block" data-lang-toggle data-i18n="lang.other"></button>',
      '      <a class="btn btn-gold btn-block" href="rooms.html" data-no-wa data-i18n="common.bookWa"></a>',
      '    </div>',
      '  </div>',
      '</header>'
    ].join('\n');
  }

  /* =====================================================================
     PIED DE PAGE
     ===================================================================== */

  function buildFooter() {
    var navLinks = NAV.map(function (item) {
      return (
        '<li><a href="' + item.href + '" data-i18n="' + item.key + '"></a></li>'
      );
    }).join('');

    var hours = [
      ['contact.hours.reception', '24 h/24'],
      ['contact.hours.breakfast', '6 h 30 – 10 h 30'],
      ['contact.hours.restaurant', '12 h 00 – 15 h 00 · 18 h 30 – 22 h 30'],
      ['contact.hours.bar', '10 h 00 – 01 h 00']
    ]
      .map(function (row) {
        return (
          '<li><span class="footer-hours__label" data-i18n="' +
          row[0] +
          '"></span><span class="footer-hours__value">' +
          row[1] +
          '</span></li>'
        );
      })
      .join('');

    return [
      '<footer class="site-footer">',
      '  <div class="container footer-grid">',
      '',
      '    <div class="footer-col footer-col--brand">',
      '      <a class="brand brand--footer" href="index.html">',
      '        ' + BRAND_LOGO,
      '        <span class="brand-text">',
      '          <span class="brand-name">Royal Guest Garden</span>',
      '          <span class="brand-slogan" data-i18n="footer.tagline"></span>',
      '        </span>',
      '      </a>',
      '      <p class="footer-about" data-i18n="footer.about"></p>',
      '      <a class="btn btn-gold btn-sm" href="#" data-wa-generic data-i18n="common.inquireWa"></a>',
      '    </div>',
      '',
      '    <div class="footer-col">',
      '      <h2 class="footer-title" data-i18n="footer.nav"></h2>',
      '      <ul class="footer-links">' + navLinks + '</ul>',
      '    </div>',
      '',
      '    <div class="footer-col">',
      '      <h2 class="footer-title" data-i18n="footer.contact"></h2>',
      '      <address class="footer-address">',
      '        <span data-i18n="footer.address"></span>',
      '        <strong>' + HOTEL.addressLine + '</strong>',
      '        <span>' + HOTEL.city + ', Cameroun</span>',
      '        <a href="tel:' + HOTEL.phoneTel + '">' + HOTEL.phoneDisplay + '</a>',
      '        <a href="tel:' + HOTEL.phoneTelAlt + '">' + HOTEL.phoneDisplayAlt + '</a>',
      '        <a href="mailto:' + HOTEL.email + '">' + HOTEL.email + '</a>',
      '      </address>',
      '    </div>',
      '',
      '    <div class="footer-col">',
      '      <h2 class="footer-title" data-i18n="footer.hours"></h2>',
      '      <ul class="footer-hours">' + hours + '</ul>',
      '    </div>',
      '  </div>',
      '',
      '  <div class="container footer-bottom">',
      '    <p class="footer-copy">',
      '      <span>© <span data-current-year>2026</span> Royal Guest Garden.</span>',
      '      <span data-i18n="footer.rights"></span>',
      '    </p>',
      '    <p class="footer-legal">',
      '      <span class="badge badge-demo" data-i18n="common.demoBadge"></span>',
      '      <span data-i18n="footer.madeIn"></span>',
      '    </p>',
      '  </div>',
      '',
      '  <div class="footer-disclaimer">',
      '    <div class="container">',
      '      <p data-i18n="footer.legalText"></p>',
      '    </div>',
      '  </div>',
      '</footer>'
    ].join('\n');
  }

  /* =====================================================================
     BOUTON WHATSAPP FLOTTANT
     ===================================================================== */

  function buildFloating() {
    return [
      '<a class="wa-float" href="#" data-wa-generic data-wa-float target="_blank" rel="noopener noreferrer"',
      '   data-i18n-attr="aria-label:a11y.floatingWa">',
      '  <span class="wa-float__icon">' + WA_ICON + '</span>',
      '  <span class="wa-float__label" data-i18n="wa.floatingLabel"></span>',
      '</a>'
    ].join('\n');
  }

  /* =====================================================================
     MONTAGE ET COMPORTEMENT
     ===================================================================== */

  var navToggle = null;
  var mobileMenu = null;

  function closeMenu(restoreFocus) {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', I18N.t('a11y.menuOpen'));
    document.body.classList.remove('menu-open');
    if (restoreFocus) navToggle.focus();
  }

  function openMenu() {
    if (!navToggle || !mobileMenu) return;
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', I18N.t('a11y.menuClose'));
    document.body.classList.add('menu-open');
  }

  function initMenu() {
    navToggle = document.querySelector('[data-nav-toggle]');
    mobileMenu = document.getElementById('mobile-menu');
    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener('click', function () {
      if (navToggle.getAttribute('aria-expanded') === 'true') closeMenu();
      else openMenu();
    });

    // Fermeture au clavier
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    // Fermeture au clic extérieur
    document.addEventListener('click', function (event) {
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      if (mobileMenu.contains(event.target) || navToggle.contains(event.target)) return;
      closeMenu(false);
    });

    // Fermeture au redimensionnement
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && navToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu(false);
      }
    });

    // Fermeture après navigation interne
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });
  }

  /** Surligne l'élément de navigation correspondant à la page courante. */
  function markActiveNav(activePage) {
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function (link) {
      var item = NAV.filter(function (nav) {
        return link.getAttribute('href') === nav.href;
      })[0];
      if (!item) return;
      var active = item.match.indexOf(activePage) !== -1;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  /** Met à jour tous les liens WhatsApp « génériques » du site. */
  function refreshWhatsAppLinks() {
    var url = WA.genericLink();
    document.querySelectorAll('[data-wa-generic]').forEach(function (node) {
      node.setAttribute('href', url);
    });
  }

  function initLanguageToggle() {
    document.querySelectorAll('[data-lang-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        I18N.toggle();
      });
    });
  }

  /** Affiche sur le bouton le code de la langue à laquelle on bascule. */
  function refreshLangLabels() {
    var current = I18N.get();
    var other = current === 'fr' ? 'EN' : 'FR';
    document.querySelectorAll('[data-lang-toggle-label]').forEach(function (node) {
      node.textContent = other;
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (button) {
      // Le bouton du bandeau affiche un code court, celui du menu la langue.
      var isBlock = button.classList.contains('lang-toggle--block');
      var key = isBlock ? 'lang.other' : 'lang.switch';
      var value = I18N.t(key);
      if (isBlock) button.textContent = value;
      else button.setAttribute('aria-label', value);
      button.setAttribute('title', value);
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  function setCurrentYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll('[data-current-year]').forEach(function (node) {
      node.textContent = year;
    });
  }

  /** Point d'entrée appelé par main.js. */
  function mount() {
    var page = document.body.getAttribute('data-page') || 'home';

    var headerHost = document.getElementById('site-header');
    if (headerHost) headerHost.innerHTML = buildHeader(page);

    var footerHost = document.getElementById('site-footer');
    if (footerHost) footerHost.innerHTML = buildFooter();

    var waHost = document.getElementById('wa-root');
    if (waHost) waHost.innerHTML = buildFloating();

    I18N.applyStatic(document);
    markActiveNav(page);
    refreshWhatsAppLinks();
    refreshLangLabels();
    initMenu();
    initLanguageToggle();
    initHeaderScroll();
    setCurrentYear();

    // Le label du bouton flottant et les liens sont retraduits à chaque changement
    I18N.onChange(function () {
      I18N.applyStatic(document);
      markActiveNav(page);
      refreshWhatsAppLinks();
      refreshLangLabels();
      setCurrentYear();
    });
  }

  window.RGG_LAYOUT = {
    mount: mount,
    markActiveNav: markActiveNav,
    refreshWhatsAppLinks: refreshWhatsAppLinks,
    closeMenu: closeMenu
  };
})();
