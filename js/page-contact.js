/* =========================================================================
   Royal Guest Garden — Script de la page « Contact »
   -------------------------------------------------------------------------
   Le formulaire ne fait aucun appel réseau : il valide la saisie, prépare le
   message WhatsApp et ouvre WhatsApp. Si l'onglet ne s'ouvre pas, le
   message est proposé en copie, en SMS ou par appel.
   Aucune donnée n'est stockée.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var ICONS = window.RGG_ICONS;
  var H = window.RGG_HELPERS;
  var WA = window.RGG_WA;

  var HOTEL = CONFIG.hotel;
  var refs = {};

  var HOURS = [
    ['contact.hours.reception', true],
    ['contact.hours.frontdesk', false],
    ['contact.hours.breakfast', false],
    ['contact.hours.restaurant', false],
    ['contact.hours.bar', false],
    ['contact.hours.pool', false],
    ['contact.hours.tennis', false]
  ];

  /* =====================================================================
     BLOCS D'INFORMATION
     ===================================================================== */

  function renderNumbers() {
    var host = document.querySelector('[data-contact-numbers]');
    if (!host) return;
    var rows = [
      ['contact.wa.primary', WA.displayNumber()],
      ['contact.wa.secondary', WA.displayAltNumber()]
    ]
      .map(function (row) {
        return (
          '<div class="wa-panel__number"><span class="wa-panel__label">' +
          H.escapeHtml(H.t(row[0])) + '</span>' +
          '<span class="wa-panel__value">' + H.escapeHtml(row[1]) + '</span></div>'
        );
      })
      .join('');
    host.innerHTML = rows;
  }

  function renderInfo() {
    var host = document.querySelector('[data-contact-info]');
    if (!host) return;

    var rows = [
      { key: 'contact.info.address', value: H.pick(HOTEL.address), icon: 'location' },
      {
        key: 'contact.info.phone',
        value: HOTEL.phoneDisplay + ' / ' + HOTEL.phoneDisplayAlt,
        icon: 'phone',
        href: 'tel:' + HOTEL.phoneTel
      },
      {
        key: 'contact.info.email',
        value: HOTEL.email,
        icon: 'mail',
        href: 'mailto:' + HOTEL.email
      },
      {
        key: 'contact.info.checkIn',
        value: CONFIG.booking.checkIn + ' → ' + CONFIG.booking.checkOut,
        icon: 'calendar'
      }
    ]
      .map(function (row) {
        var value = row.href
          ? '<a href="' + H.escapeHtml(row.href) + '">' + H.escapeHtml(row.value) + '</a>'
          : H.escapeHtml(row.value);
        return (
          '<li><span class="info-list__icon">' + ICONS.icon(row.icon) + '</span>' +
          '<span><span class="info-list__label">' + H.escapeHtml(H.t(row.key)) + '</span>' +
          '<span class="info-list__value">' + value + '</span></span></li>'
        );
      })
      .join('');

    host.innerHTML = rows;
  }

  function renderHours() {
    var body = document.querySelector('[data-contact-hours] tbody');
    if (!body) return;
    body.innerHTML = HOURS.map(function (row) {
      var value = row[1]
        ? '<span class="hours-table__always">' + H.escapeHtml(H.t('contact.hours.always')) + '</span>'
        : H.escapeHtml(H.t(row[0]));
      return (
        '<tr><th scope="row">' + H.escapeHtml(H.t(row[0])) + '</th><td>' + value + '</td></tr>'
      );
    }).join('');
  }

  function renderStaticLinks() {
    document.querySelectorAll('[data-contact-tel]').forEach(function (node) {
      node.setAttribute('href', 'tel:' + HOTEL.phoneTel);
    });
    var sms = document.querySelector('[data-contact-sms]');
    if (sms) sms.setAttribute('href', 'sms:' + HOTEL.phoneTel);
    var map = document.querySelector('[data-contact-map]');
    if (map) map.setAttribute('href', HOTEL.mapUrl);
    var number = document.querySelector('[data-contact-number]');
    if (number) number.textContent = WA.displayNumber();
    var preview = document.querySelector('[data-contact-default-message]');
    if (preview) preview.textContent = H.t('wa.contactGreeting');
  }

  /* =====================================================================
     VALIDATION DU FORMULAIRE
     ===================================================================== */

  function value(name) {
    var field = refs.form.elements[name];
    return field ? String(field.value || '').trim() : '';
  }

  function showError(name, message) {
    var slot = refs.form.querySelector('[data-error-for="' + name + '"]');
    if (slot) {
      slot.textContent = message;
      slot.hidden = false;
    }
    var input = refs.form.elements[name];
    if (input && input.classList) input.classList.add('is-invalid');
  }

  function clearErrors() {
    refs.form.querySelectorAll('[data-error-for]').forEach(function (node) {
      node.hidden = true;
      node.textContent = '';
    });
    refs.form.querySelectorAll('.is-invalid').forEach(function (node) {
      node.classList.remove('is-invalid');
    });
    if (refs.alert) refs.alert.hidden = true;
  }

  /** Renvoie true si tout est valide. */
  function validate() {
    clearErrors();
    var errors = 0;

    if (!value('name')) {
      showError('name', H.t('book.error.name'));
      errors++;
    }
    var phone = value('phone');
    if (!phone) {
      showError('phone', H.t('book.error.phone'));
      errors++;
    } else if (!H.isValidPhone(phone)) {
      showError('phone', H.t('book.error.phone'));
      errors++;
    }
    var email = value('email');
    if (email && !H.isValidEmail(email)) {
      showError('email', H.t('book.error.email'));
      errors++;
    }
    if (!value('message')) {
      showError('message', H.t('book.error.required'));
      errors++;
    }

    if (errors && refs.alert) {
      refs.alert.textContent = H.t('contact.form.errorSummary', { n: errors });
      refs.alert.hidden = false;
      var first = refs.form.querySelector('.is-invalid');
      if (first) first.focus();
    }
    return errors === 0;
  }

  function collect() {
    var select = refs.form.elements.subject;
    return {
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
      subject: select && select.value ? select.options[select.selectedIndex].text : '',
      subjectKey: select ? select.value : '',
      message: value('message')
    };
  }

  /* =====================================================================
     ENVOI (préparation puis ouverture de WhatsApp)
     ===================================================================== */

  function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    var data = collect();
    var message = WA.buildContactMessage(data);
    var link = WA.contactLink(data);

    if (refs.message) refs.message.textContent = message;
    if (refs.success) refs.success.hidden = false;

    var opened = WA.openExternal(link);
    if (refs.fallback) refs.fallback.hidden = opened;
    if (!opened) {
      var first = refs.fallback ? refs.fallback.querySelector('button') : null;
      if (first) first.focus();
    }
  }

  function onCopy(event) {
    var button = event.currentTarget;
    var text = refs.message ? refs.message.textContent : '';
    WA.copyText(text).then(function (ok) {
      var label = button.querySelector('span') || button;
      label.textContent = ok ? H.t('contact.form.copied') : H.t('contact.form.copyFailed');
      window.setTimeout(function () {
        label.textContent = H.t('contact.form.copy');
      }, 2500);
    });
  }

  /* =====================================================================
     INITIALISATION
     ===================================================================== */

  function render() {
    renderNumbers();
    renderInfo();
    renderHours();
    renderStaticLinks();
    if (window.RGG && window.RGG.hydrateIcons) window.RGG.hydrateIcons(document);
  }

  function init() {
    refs.form = document.querySelector('[data-contact-form]');
    if (!refs.form) return;
    refs.alert = document.querySelector('[data-contact-error]');
    refs.success = document.querySelector('[data-contact-success]');
    refs.fallback = document.querySelector('[data-contact-fallback]');
    refs.message = document.querySelector('[data-contact-message]');

    render();
    refs.form.addEventListener('submit', onSubmit);

    var copy = document.querySelector('[data-contact-copy]');
    if (copy) copy.addEventListener('click', onCopy);

    if (window.RGG) window.RGG.onLanguageChange(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();