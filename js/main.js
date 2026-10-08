/* =========================================================================
   Royal Guest Garden — Point d'entrée commun
   -------------------------------------------------------------------------
   Chargé sur toutes les pages (avec defer) : monte l'en-tête et le pied de
   page, applique les traductions, met à jour le titre et la description de
   la page, et enregistre un gestionnaire de re-traduction.

   Chaque page charge ensuite son propre script (js/page-*.js) et s'inscrit
   via RGG.onLanguageChange(fn) pour se redessiner au changement de langue.
   ========================================================================= */

(function () {
  'use strict';

  var I18N = window.RGG_I18N;
  var LAYOUT = window.RGG_LAYOUT;
  var ICONS = window.RGG_ICONS;

  /* Titre et description par page. */
  var META = {
    home: ['home.metaTitle', 'home.metaDesc'],
    rooms: ['rooms.metaTitle', 'rooms.metaDesc'],
    room: ['room.metaTitle', 'room.metaDesc'],
    services: ['services.metaTitle', 'services.metaDesc'],
    reglement: ['reglement.metaTitle', 'reglement.metaDesc'],
    about: ['about.metaTitle', 'about.metaDesc'],
    contact: ['contact.metaTitle', 'contact.metaDesc']
  };

  /* Gestionnaires de redessin ajoutés par les scripts de page. */
  var pageHandlers = [];

  /**
   * Inscrit une fonction à exécuter après chaque changement de langue.
   * @param {Function} fn reçoit la langue ('fr' ou 'en')
   */
  function onLanguageChange(fn) {
    pageHandlers.push(fn);
  }

  function applyPageMeta() {
    var page = document.body.getAttribute('data-page') || 'home';
    var entry = META[page] || META.home;
    I18N.applyMeta(entry[0], entry[1]);
  }

  function runPageHandlers() {
    pageHandlers.forEach(function (fn) {
      try {
        fn(I18N.get());
      } catch (e) {
        /* une page en erreur ne doit pas casser le site */
      }
    });
  }

  /**
   * Remplit les emplacements d'icônes du HTML statique :
   * <span data-icon="wifi"></span> devient le SVG correspondant.
   */
  function hydrateIcons(root) {
    if (!ICONS) return;
    (root || document).querySelectorAll('[data-icon]').forEach(function (node) {
      if (node.firstElementChild) return; // déjà remplie
      node.innerHTML = ICONS.icon(node.getAttribute('data-icon'));
    });
  }

  function init() {
    if (document.documentElement) document.documentElement.lang = I18N.get();

    hydrateIcons(document);
    LAYOUT.mount();
    applyPageMeta();

    I18N.onChange(function () {
      applyPageMeta();
      runPageHandlers();
    });
  }

  window.RGG = {
    t: function (key, params) {
      return I18N.t(key, params);
    },
    pick: function (value) {
      return I18N.pick(value);
    },
    icons: ICONS,
    hydrateIcons: hydrateIcons,
    onLanguageChange: onLanguageChange
  };

  /* Premier rendu une fois le contenu chargé (Supabase ou statique). */
  if (window.RGG_ON_READY) {
    window.RGG_ON_READY(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
