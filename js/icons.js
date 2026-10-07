/* =========================================================================
   Royal Guest Garden — Jeu d'icônes SVG (inline)
   -------------------------------------------------------------------------
   Toutes les icônes sont décoratives : elles sont marquées aria-hidden et
   le sens est toujours porté par le texte adjacent.
   ========================================================================= */

(function () {
  'use strict';

  /* Chaque entrée contient le contenu interne d'un <svg viewBox="0 0 24 24">. */
  var PATHS = {
    location:
      '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    briefcase:
      '<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 12h18"/>',
    shield:
      '<path d="M12 3 5 6v5.5c0 4.3 3 8.2 7 9.5 4-1.3 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    star: '<path d="m12 3.8 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.9l5.8-.8L12 3.8Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
    bed: '<path d="M3 18v-7h13a4 4 0 0 1 4 4v3M3 18h18M3 18v2M21 18v2M6.5 11V8.5h5V11"/>',
    family:
      '<circle cx="8" cy="8" r="2.6"/><circle cx="16.5" cy="9.5" r="2.2"/><path d="M3.5 19v-1.8A3.7 3.7 0 0 1 7.2 13.5h1.6a3.7 3.7 0 0 1 3.7 3.7V19M14 19v-1.4a3.3 3.3 0 0 1 3.3-3.3h.4a3.3 3.3 0 0 1 3.3 3.3V19"/>',
    heart:
      '<path d="M12 20s-7.2-4.4-7.2-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.2 2.6c0 5-7.2 9.4-7.2 9.4Z"/>',
    restaurant:
      '<path d="M7 3v8M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 3c-1.7 1.3-2.5 3.2-2.5 5.2 0 1.7.8 2.8 2.5 3.1V21"/>',
    bar: '<path d="M5 4h14l-5.5 7v6.5M13.5 17.5h4M5 4l1.5 7M19 4l-1.5 7"/>',
    pool:
      '<path d="M3 18c1.6 0 1.6 1.4 3.2 1.4S7.8 18 9.4 18s1.6 1.4 3.2 1.4S14.2 18 15.8 18s1.6 1.4 3.2 1.4S20.6 18 21 18"/><path d="M8 15V5.5A2.5 2.5 0 0 1 10.5 3M16 15V5.5A2.5 2.5 0 0 0 13.5 3M8 9.5h8"/>',
    tennis:
      '<circle cx="9" cy="9.5" r="5.5"/><path d="M6 4.6c1.4 1.6 2 3 2 4.4s-.6 2.8-2 4.4M13.9 6.2C11.3 8.6 10 10.6 10 13s1.3 4.4 3.9 6.8M4.5 9.5h9M9 4v11"/>',
    event:
      '<path d="M4 8h16v12H4zM8 4v4M16 4v4M4 12h16M9.5 16h5"/>',
    camera:
      '<path d="M3 8.5h4l1.5-2.5h7l1.5 2.5h4v10H3v-10Z"/><circle cx="12" cy="13" r="3.2"/>',
    wifi: '<path d="M4.5 9.5a11 11 0 0 1 15 0M7.5 13a7 7 0 0 1 9 0M10.5 16.4a3 3 0 0 1 3 0"/><circle cx="12" cy="19" r="1.1"/>',
    bell: '<path d="M6.5 16V11a5.5 5.5 0 1 1 11 0v5l1.5 2.5h-14L6.5 16ZM10 20.5a2.2 2.2 0 0 0 4 0"/>',
    calendar:
      '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    users:
      '<circle cx="9" cy="9" r="3.2"/><path d="M2.8 19v-1.4A3.6 3.6 0 0 1 6.4 14h5.2a3.6 3.6 0 0 1 3.6 3.6V19M16.5 6.6a3.2 3.2 0 0 1 0 6.3M18 14.2a3.6 3.6 0 0 1 3.2 3.5V19"/>',
    key: '<circle cx="8" cy="15.5" r="3.5"/><path d="m10.5 13 8-8M16 7.5l2 2M13.8 9.7l2 2"/>',
    car: '<path d="M4 16v-3.2l2-4.3A2 2 0 0 1 7.8 7h8.4A2 2 0 0 1 18 8.5l2 4.3V16M4 16h16M4 16v2M20 16v2M7 12.5h1.5M15.5 12.5H17"/>',
    plane: '<path d="M10.5 20.5 12 15l6.5-1.8a1.5 1.5 0 0 0 0-2.9L12 8.5 10.5 3.5l-1.4.6L10.7 9l-3.4 1L5.4 8.2 4 8.9l3 3.4-3 3.4 1.4.7 1.9-1.8 3.4 1-.6 4.9Z"/>',
    phone:
      '<path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 7 7.1 5.3a2 2 0 0 0 2.2 0L20.2 7"/>',
    wallet:
      '<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H17a2 2 0 0 1 2 2v1.5M3.5 7.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2.5M3.5 7.5h17a1.5 1.5 0 0 1 1.5 1.5v3"/><circle cx="17" cy="14.5" r="1.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.4"/>',
    alert: '<path d="M12 4 2.8 20h18.4L12 4Z"/><path d="M12 10v4.5M12 17.4v.3"/>',
    leaf: '<path d="M5 19c0-7 5-12 15-12 0 10-5 13-11 13H5Z"/><path d="M5 19c3-5 6-7.5 10-9"/>',
    sparkle:
      '<path d="m12 3 1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4L12 3ZM18.5 15l.9 2.3 2.3.8-2.3.8-.9 2.3-.9-2.3-2.3-.8 2.3-.8.9-2.3Z"/>',
    'arrow-right': '<path d="M4 12h15M13.5 6.5 20 12l-6.5 5.5"/>',
    'chevron-down': '<path d="m6 9.5 6 6 6-6"/>',
    'map-pin':
      '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
    ruler:
      '<path d="M3.8 15.2 15.2 3.8l5 5L8.8 20.2a1.8 1.8 0 0 1-2.5 0l-2.5-2.5a1.8 1.8 0 0 1 0-2.5Z"/><path d="m7.8 11.2 1.8 1.8M10.8 8.2l1.8 1.8M13.8 5.2l1.8 1.8"/>',
    expand:
      '<path d="M14.5 4H20v5.5M20 4l-6.5 6.5M9.5 20H4v-5.5M4 20l6.5-6.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/>',
    parking:
      '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M9.5 17V7.5h4a3 3 0 0 1 0 6h-4"/>'
  };

  /**
   * Renvoie le balisage SVG d'une icône.
   * @param {string} name  clé de PATHS
   * @param {string} [className]  classe CSS additionnelle
   */
  function icon(name, className) {
    var body = PATHS[name];
    if (!body) body = PATHS.info;
    return (
      '<svg class="icon' +
      (className ? ' ' + className : '') +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      body +
      '</svg>'
    );
  }

  window.RGG_ICONS = { icon: icon, has: function (name) { return !!PATHS[name]; } };
})();