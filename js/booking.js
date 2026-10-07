/* =========================================================================
   Royal Guest Garden — Fenêtre de réservation via WhatsApp
   -------------------------------------------------------------------------
   Ouverte par le bouton « Réserver via WhatsApp » des fiches chambre.
   Elle pré-remplit le nom, la référence, la catégorie et le tarif de la
   chambre, vérifie les dates et la capacité, calcule une estimation en
   FCFA, puis prépare le message WhatsApp.

   Accessibilité : rôle dialog, aria-modal, piège de focus, fermeture par
   Échap, restauration du focus à la fermeture.

   Aucune donnée personnelle n'est conservée (ni localStorage, ni cookie,
   ni journalisation).
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG = window.RGG_CONFIG;
  var I18N = window.RGG_I18N;
  var H = window.RGG_HELPERS;
  var WA = window.RGG_WA;
  var HOTEL = CONFIG.hotel;

  var FIELDS = [
    'name',
    'phone',
    'email',
    'checkIn',
    'checkOut',
    'adults',
    'children',
    'rooms',
    'requests'
  ];

  var currentRoom = null;
  var overlay = null;
  var dialog = null;
  var lastFocused = null;
  var hasOpened = false;

  /* =====================================================================
     CONSTRUCTION DE LA FENÊTRE
     ===================================================================== */

  function field(id, labelKey, type, attrs, hintKey) {
    var extra = '';
    var phAttr = '';
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'phKey') {
          phAttr = ' data-i18n-attr="placeholder:' + attrs.phKey + '"';
          return;
        }
        extra += ' ' + key + '="' + attrs[key] + '"';
      });
    }
    return [
      '<div class="form-field' + (attrs && attrs.required ? ' is-required' : '') + '">',
      '  <label class="form-label" for="bf-' + id + '">',
      '    <span data-i18n="' + labelKey + '"></span>',
      (hintKey ? '<span class="form-hint" data-i18n="' + hintKey + '"></span>' : ''),
      '  </label>',
      '  <input class="input" type="' + type + '" id="bf-' + id + '" name="' + id + '"',
      '         autocomplete="' + (attrs && attrs.autocomplete ? attrs.autocomplete : 'off') + '"' + phAttr + extra,
      '         aria-describedby="bf-' + id + '-error" />',
      '  <p class="form-error" id="bf-' + id + '-error" data-error-for="' + id + '" hidden></p>',
      '</div>'
    ].join('\n');
  }

  function buildModal() {
    return [
      '<div class="modal-overlay" data-modal-overlay hidden>',
      '  <div class="modal" data-modal role="dialog" aria-modal="true"',
      '       aria-labelledby="booking-title" aria-describedby="booking-subtitle">',
      '',
      '    <button type="button" class="modal__close" data-modal-close data-i18n-attr="aria-label:modal.close">',
      '      <span aria-hidden="true">&times;</span>',
      '    </button>',
      '',
      '    <header class="modal__head">',
      '      <p class="modal__eyebrow" data-i18n="modal.room"></p>',
      '      <h2 class="modal__title" id="booking-title" data-i18n="modal.title"></h2>',
      '      <p class="modal__sub" id="booking-subtitle" data-i18n="modal.subtitle"></p>',
      '    </header>',
      '',
      '    <div class="modal__room" data-modal-room></div>',
      '',
      '    <form class="modal__body" data-booking-form novalidate>',
      '      <p class="form-alert" data-error-summary role="alert" hidden></p>',
      '',
      '      <div class="form-grid">',
      '        ' + field('name', 'book.name', 'text', { required: true, autocomplete: 'name', phKey: 'book.namePh' }),
      '        ' + field('phone', 'book.phone', 'tel', { required: true, autocomplete: 'tel', phKey: 'book.phonePh' }),
      '        ' + field('email', 'book.email', 'email', { autocomplete: 'email', phKey: 'book.emailPh' }),
      '      </div>',
      '',
      '      <div class="form-grid form-grid--2">',
      '        ' + field('checkIn', 'book.checkIn', 'date', { required: true }),
      '        ' + field('checkOut', 'book.checkOut', 'date', { required: true }),
      '      </div>',
      '',
      '      <div class="form-grid form-grid--3">',
      '        ' + field('adults', 'book.adults', 'number', { required: true, min: 1, step: 1, inputmode: 'numeric', value: 2 }),
      '        ' + field('children', 'book.children', 'number', { min: 0, step: 1, inputmode: 'numeric', value: 0 }),
      '        ' + field('rooms', 'book.rooms', 'number', { required: true, min: 1, step: 1, inputmode: 'numeric', value: 1 }),
      '      </div>',
      '',
      '      ' + field('requests', 'book.requests', 'text', { phKey: 'book.requestsPh' }, 'book.requestsOptional'),
      '',
      '      <div class="estimate" data-estimate>',
      '        <h3 class="estimate__title" data-i18n="book.estimate.title"></h3>',
      '        <dl class="estimate__list" data-estimate-list></dl>',
      '        <p class="estimate__total">',
      '          <span data-i18n="book.estimate.total"></span>',
      '          <strong data-estimate-total>—</strong>',
      '        </p>',
      '        <p class="estimate__formula" data-estimate-formula></p>',
      '        <details class="estimate__details">',
      '          <summary data-i18n="book.estimate.excludedTitle"></summary>',
      '          <p data-i18n="book.estimate.excluded"></p>',
      '        </details>',
      '        <p class="estimate__note" data-i18n="book.estimate.disclaimer"></p>',
      '      </div>',
      '',
      '      <div class="modal__actions">',
      '        <button type="submit" class="btn btn-gold btn-block btn-lg" data-booking-submit data-i18n="book.submit"></button>',
      '        <p class="modal__explain" data-i18n="book.whatsapp.explain"></p>',
      '        <p class="modal__warn" data-i18n="book.whatsapp.notSent"></p>',
      '      </div>',
      '    </form>',
      '',
      '    <section class="wa-step" data-wa-step hidden aria-labelledby="wa-step-title">',
      '      <h3 class="wa-step__title" id="wa-step-title" data-i18n="book.whatsapp.title"></h3>',
      '      <p class="wa-step__text" data-i18n="book.whatsapp.text"></p>',
      '      <p class="wa-step__explain" data-i18n="book.whatsapp.explain"></p>',
      '',
      '      <a class="btn btn-gold btn-block btn-lg" data-wa-open target="_blank" rel="noopener noreferrer"',
      '         data-i18n="book.whatsapp.open"></a>',
      '      <p class="wa-step__warn" data-i18n="book.whatsapp.notSent"></p>',
      '',
      '      <div class="wa-step__preview">',
      '        <h4 data-i18n="book.whatsapp.preview"></h4>',
      '        <pre class="wa-step__message" data-wa-message tabindex="0"></pre>',
      '      </div>',
      '',
      '      <div class="wa-step__fallback">',
      '        <h4 data-i18n="book.whatsapp.fallback"></h4>',
      '        <div class="wa-step__fallback-actions">',
      '          <button type="button" class="btn btn-outline btn-sm" data-wa-copy data-i18n="book.whatsapp.copy"></button>',
      '          <a class="btn btn-outline btn-sm" data-wa-sms data-i18n="book.whatsapp.sendSms"></a>',
      '          <a class="btn btn-outline btn-sm" href="tel:' + HOTEL.phoneTel + '" data-i18n="book.whatsapp.call"></a>',
      '        </div>',
      '        <p class="wa-step__number">',
      '          <span data-i18n="book.whatsapp.number"></span>: <strong>' + WA.displayNumber() + '</strong>',
      '        </p>',
      '      </div>',
      '',
      '      <button type="button" class="btn btn-ghost btn-block" data-booking-back data-i18n="book.whatsapp.back"></button>',
      '    </section>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /* =====================================================================
     ACCÈS AU MODÈLE
     ===================================================================== */

  function form() {
    return dialog.querySelector('[data-booking-form]');
  }

  function valueOf(name) {
    var input = dialog.querySelector('#bf-' + name);
    return input ? input.value.trim() : '';
  }

  function setValue(name, value) {
    var input = dialog.querySelector('#bf-' + name);
    if (input) input.value = value;
  }

  /* =====================================================================
     VALIDATION
     ===================================================================== */

  function showFieldError(name, message) {
    var errorNode = dialog.querySelector('[data-error-for="' + name + '"]');
    var input = dialog.querySelector('#bf-' + name);
    if (errorNode) {
      errorNode.textContent = message || '';
      errorNode.hidden = !message;
    }
    if (input) {
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('is-invalid');
      } else {
        input.removeAttribute('aria-invalid');
        input.classList.remove('is-invalid');
      }
    }
  }

  function clearErrors() {
    FIELDS.forEach(function (name) {
      showFieldError(name, '');
    });
    var summary = dialog.querySelector('[data-error-summary]');
    if (summary) {
      summary.hidden = true;
      summary.textContent = '';
    }
  }

  /**
   * Valide le formulaire complet.
   * Retourne { valid: bool, errors: {champ: message}, data: {...} }
   */
  function validate() {
    var errors = {};
    var maxRooms = CONFIG.booking.maxRoomsPerRequest || 5;

    // Nom
    var name = valueOf('name');
    if (!name) errors.name = I18N.t('book.error.required');
    else if (name.length < 2) errors.name = I18N.t('book.error.name');

    // Téléphone
    var phone = valueOf('phone');
    if (!phone) errors.phone = I18N.t('book.error.required');
    else if (!H.isValidPhone(phone)) errors.phone = I18N.t('book.error.phone');

    // Email (facultatif)
    var email = valueOf('email');
    if (!H.isValidEmail(email)) errors.email = I18N.t('book.error.email');

    // Dates
    var checkIn = valueOf('checkIn');
    var checkOut = valueOf('checkOut');
    var dateIn = H.parseISODate(checkIn);
    var dateOut = H.parseISODate(checkOut);

    if (!checkIn) {
      errors.checkIn = I18N.t('book.error.required');
    } else if (!dateIn) {
      errors.checkIn = I18N.t('book.error.date');
    } else if (dateIn.getTime() < H.today().getTime()) {
      errors.checkIn = I18N.t('book.error.pastDate');
    }

    if (!checkOut) {
      errors.checkOut = I18N.t('book.error.required');
    } else if (!dateOut) {
      errors.checkOut = I18N.t('book.error.date');
    } else if (dateIn && !errors.checkIn && dateOut <= dateIn) {
      errors.checkOut = I18N.t('book.error.checkOutBefore');
    }

    // Clients et chambres
    var adults = H.parseInteger(valueOf('adults'));
    if (isNaN(adults)) errors.adults = I18N.t('book.error.required');
    else if (adults < 1) errors.adults = I18N.t('book.error.positive', { min: 1 });

    var children = H.parseInteger(valueOf('children'));
    if (isNaN(children)) children = 0;
    else if (children < 0) errors.children = I18N.t('book.error.positive', { min: 0 });

    var rooms = H.parseInteger(valueOf('rooms'));
    if (isNaN(rooms)) errors.rooms = I18N.t('book.error.required');
    else if (rooms < 1) errors.rooms = I18N.t('book.error.positive', { min: 1 });
    else if (rooms > maxRooms) errors.rooms = I18N.t('book.error.maxRooms', { max: maxRooms });

    // Capacité : clients <= capacité × chambres
    if (currentRoom && !errors.adults && !errors.rooms && !isNaN(rooms) && !isNaN(children)) {
      var check = H.checkCapacity(currentRoom, rooms, adults, children);
      if (!check.ok) {
        errors.rooms = I18N.t('book.error.capacity', {
          n: check.guests,
          rooms: rooms,
          max: check.max
        });
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      data: {
        name: name,
        phone: phone,
        email: email,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: isNaN(adults) ? 0 : adults,
        children: isNaN(children) ? 0 : children,
        rooms: isNaN(rooms) ? 1 : rooms,
        requests: valueOf('requests')
      }
    };
  }

  /* =====================================================================
     ESTIMATION
     ===================================================================== */

  function renderEstimate(data) {
    var list = dialog.querySelector('[data-estimate-list]');
    var totalNode = dialog.querySelector('[data-estimate-total]');
    var formulaNode = dialog.querySelector('[data-estimate-formula]');
    if (!list || !totalNode) return;

    var checkIn = H.parseISODate(data.checkIn);
    var checkOut = H.parseISODate(data.checkOut);
    var rooms = Number(data.rooms) || 1;
    var estimate = H.estimateStay(currentRoom, checkIn, checkOut, rooms);

    H.clear(list);

    function row(label, value, extraClass) {
      var dt = H.el('dt', { text: label });
      var dd = H.el('dd', { text: value, class: extraClass || '' });
      list.appendChild(dt);
      list.appendChild(dd);
    }

    row(I18N.t('book.estimate.nightly'), H.formatNightly(estimate.nightly));
    row(
      I18N.t('book.estimate.nights'),
      estimate.nights > 0 ? I18N.t('book.estimate.nightsValue', { n: estimate.nights }) : '—'
    );
    row(I18N.t('book.summary.rooms'), String(estimate.rooms));
    row(I18N.t('book.estimate.guests'), String((Number(data.adults) || 0) + (Number(data.children) || 0)));
    if (currentRoom) {
      row(
        I18N.t('book.summary.capacity'),
        String(estimate.capacity),
        'is-hint'
      );
    }

    totalNode.textContent = estimate.nights > 0 ? H.formatPrice(estimate.total) : '—';
    formulaNode.textContent =
      estimate.nights > 0
        ? I18N.t('book.estimate.formula', {
            price: H.formatPrice(estimate.nightly),
            nights: estimate.nights,
            rooms: estimate.rooms
          })
        : '';
  }

  /** Lecture en direct du formulaire pour l'estimation. */
  function liveEstimate() {
    renderEstimate({
      checkIn: valueOf('checkIn'),
      checkOut: valueOf('checkOut'),
      rooms: valueOf('rooms') || 1,
      adults: valueOf('adults'),
      children: valueOf('children')
    });
  }

  /* =====================================================================
     SOUMISSION ET ÉTAPE WHATSAPP
     ===================================================================== */

  function onSubmit(event) {
    event.preventDefault();
    var result = validate();
    clearErrors();

    if (!result.valid) {
      var count = Object.keys(result.errors).length;
      var summary = dialog.querySelector('[data-error-summary]');
      if (summary) {
        summary.textContent = I18N.t('book.error.summary', { n: count });
        summary.hidden = false;
      }
      Object.keys(result.errors).forEach(function (name) {
        showFieldError(name, result.errors[name]);
      });
      var firstInvalid = dialog.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var message = WA.buildBookingMessage(currentRoom, result.data);
    showWhatsAppStep(message);
  }

  function showWhatsAppStep(message) {
    var bookingForm = form();
    var step = dialog.querySelector('[data-wa-step]');
    var messageNode = dialog.querySelector('[data-wa-message]');
    var openLink = dialog.querySelector('[data-wa-open]');
    var smsLink = dialog.querySelector('[data-wa-sms]');
    var number = WA.primaryNumber();

    if (messageNode) messageNode.textContent = message;
    if (openLink) openLink.setAttribute('href', WA.waLink(message));
    if (smsLink) {
      smsLink.setAttribute(
        'href',
        'sms:+' + number + '?body=' + encodeURIComponent(message)
      );
    }

    if (bookingForm) bookingForm.hidden = true;
    if (step) {
      step.hidden = false;
      var head = step.querySelector('.wa-step__title');
      if (head) head.setAttribute('tabindex', '-1'), head.focus();
    }

    // Ouvre WhatsApp une seule fois : le panneau reste le repli si le
    // navigateur bloque la fenêtre.
    if (!hasOpened) {
      hasOpened = true;
      WA.openExternal(WA.waLink(message));
    }
  }

  function backToForm() {
    var bookingForm = form();
    var step = dialog.querySelector('[data-wa-step]');
    if (bookingForm) bookingForm.hidden = false;
    if (step) step.hidden = true;
    var first = dialog.querySelector('#bf-name');
    if (first) first.focus();
  }

  /* =====================================================================
     OUVERTURE / FERMETURE ET GESTION DU FOCUS
     ===================================================================== */

  function focusableElements() {
    return Array.prototype.filter.call(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
      ),
      function (node) {
        return node.offsetParent !== null || node === document.activeElement;
      }
    );
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    var items = focusableElements();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function ensureModal() {
    var host = document.getElementById('modal-root');
    if (!host) return false;
    if (!overlay) {
      host.innerHTML = buildModal();
      overlay = host.querySelector('[data-modal-overlay]');
      dialog = host.querySelector('[data-modal]');

      var closeBtn = dialog.querySelector('[data-modal-close]');
      closeBtn.addEventListener('click', close);
      overlay.addEventListener('mousedown', function (event) {
        if (event.target === overlay) close();
      });

      var bookingForm = form();
      bookingForm.addEventListener('submit', onSubmit);

      bookingForm.addEventListener('input', liveEstimate);
      bookingForm.addEventListener('change', liveEstimate);

      dialog.querySelector('[data-booking-back]').addEventListener('click', backToForm);

      dialog.querySelector('[data-wa-copy]').addEventListener('click', function (event) {
        var button = event.currentTarget;
        WA.copyText(dialog.querySelector('[data-wa-message]').textContent).then(function (ok) {
          button.textContent = ok
            ? I18N.t('book.whatsapp.copied')
            : I18N.t('book.copyFailed');
          window.setTimeout(function () {
            button.textContent = I18N.t('book.whatsapp.copy');
          }, 4000);
        });
      });

      // Fermeture au clavier
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
        } else {
          trapFocus(event);
        }
      });
    }
    return true;
  }

  /** Remplit la fiche chambre affichée en haut de la fenêtre. */
  function renderRoomCard() {
    var host = dialog.querySelector('[data-modal-room]');
    if (!host || !currentRoom) return;
    H.clear(host);

    var img = H.el('img', {
      class: 'modal__room-img',
      src: H.imageUrl(currentRoom.images[0], 480),
      alt: '',
      loading: 'lazy',
      width: '120',
      height: '90'
    });

    var info = H.el('div', { class: 'modal__room-info' });
    var title = H.el('p', { class: 'modal__room-name' });
    title.appendChild(document.createTextNode(currentRoom.name + ' '));
    var ref = H.el('span', { class: 'tag tag-ref', text: currentRoom.ref });
    title.appendChild(ref);

    var meta = H.el('p', {
      class: 'modal__room-meta',
      text:
        H.categoryLabel(currentRoom.category) +
        ' · ' +
        I18N.t('card.capacityLabel', { n: currentRoom.capacity })
    });

    var price = H.el('p', {
      class: 'modal__room-price',
      text: H.formatNightly(currentRoom.price)
    });

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(price);

    host.appendChild(img);
    host.appendChild(info);
  }

  /** Ouvre la fenêtre pour une chambre. */
  function open(roomOrId) {
    var room = typeof roomOrId === 'string' ? H.getRoomById(roomOrId) : roomOrId;
    if (!room) return;
    if (!ensureModal()) return;

    currentRoom = room;
    hasOpened = false;

    // Traductions + fiche chambre
    I18N.applyStatic(dialog);
    renderRoomCard();

    var bookingForm = form();
    var step = dialog.querySelector('[data-wa-step]');
    if (step) step.hidden = true;
    bookingForm.hidden = false;

    // Valeurs par défaut
    var start = H.addDaysISO(H.todayISO(), 1);
    setValue('name', '');
    setValue('phone', '');
    setValue('email', '');
    setValue('checkIn', start);
    setValue('checkOut', H.addDaysISO(start, 2));
    setValue('adults', Math.min(2, room.capacity));
    setValue('children', 0);
    setValue('rooms', 1);
    setValue('requests', '');

    // Bornes des champs date
    var checkInInput = dialog.querySelector('#bf-checkIn');
    var checkOutInput = dialog.querySelector('#bf-checkOut');
    checkInInput.min = H.todayISO();
    checkOutInput.min = H.todayISO();

    clearErrors();
    liveEstimate();

    // Ouverture visuelle
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });

    var firstField = dialog.querySelector('#bf-name');
    if (firstField) firstField.focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  window.RGG_BOOKING = {
    open: open,
    close: close,
    isOpen: function () {
      return !!overlay && !overlay.hidden;
    }
  };
})();
