/* =========================================================================
   Royal Guest Garden — Script de la page « Nos chambres »
   -------------------------------------------------------------------------
   Filtres (catégorie, budget maximal, capacité, équipements), tri,
   pagination et synchronisation avec l'URL (?cat=&price=&cap=&amen=…&sort=)
   pour que la sélection puisse être partagée.
   ========================================================================= */

(function () {
  'use strict';

  var DATA = window.RGG_DATA;
  var H = window.RGG_HELPERS;
  var CARDS = window.RGG_CARDS;
  var ICONS = window.RGG_ICONS;

  var PER_PAGE = 6;

  var state = {
    category: 'all',
    maxPrice: null,
    minCapacity: 0,
    amenities: [],
    sort: 'recommended',
    page: 1
  };

  var refs = {};

  /* =====================================================================
     ÉTAT : LECTURE ET ÉCRITURE DANS L'URL
     ===================================================================== */

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    if (cat && cat !== 'all') state.category = cat;
    if (params.get('cap')) state.minCapacity = Number(params.get('cap')) || 0;
    if (params.get('sort')) state.sort = params.get('sort');
    var price = Number(params.get('price'));
    if (price) state.maxPrice = price;
    var amen = params.get('amen');
    if (amen) {
      state.amenities = amen
        .split(',')
        .map(function (id) {
          return id.trim();
        })
        .filter(function (id) {
          return DATA.AMENITIES.some(function (a) {
            return a.id === id;
          });
        });
    }
  }

  function writeUrl() {
    var params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('cat', state.category);
    if (state.maxPrice && state.maxPrice < H.maxPrice()) params.set('price', state.maxPrice);
    if (state.minCapacity) params.set('cap', state.minCapacity);
    if (state.amenities.length) params.set('amen', state.amenities.join(','));
    if (state.sort && state.sort !== 'recommended') params.set('sort', state.sort);
    var query = params.toString();
    var url = window.location.pathname + (query ? '?' + query : '');
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', url);
    }
  }

  /* =====================================================================
     PANNEAU DE FILTRES
     ===================================================================== */

  function chipRadio(name, value, label, checked) {
    return (
      '<label class="chip">' +
      '<input type="radio" name="' + name + '" value="' + H.escapeHtml(value) + '"' +
      (checked ? ' checked' : '') + ' />' +
      '<span>' + H.escapeHtml(label) + '</span>' +
      '</label>'
    );
  }

  function chipCheck(name, value, label, checked) {
    return (
      '<label class="chip">' +
      '<input type="checkbox" name="' + name + '" value="' + H.escapeHtml(value) + '"' +
      (checked ? ' checked' : '') + ' />' +
      '<span class="chip__box" aria-hidden="true">&#10003;</span>' +
      '<span>' + H.escapeHtml(label) + '</span>' +
      '</label>'
    );
  }

  function buildFilters() {
    var host = refs.host;
    if (!host) return;

    var categories = DATA.CATEGORIES.map(function (cat) {
      return chipRadio(
        'category',
        cat.id,
        H.pick(cat),
        state.category === cat.id
      );
    }).join('');
    categories = chipRadio('category', 'all', H.t('rooms.filters.categoryAll'), state.category === 'all') + categories;

    var capacities = [0, 2, 3, 4, 6].map(function (n) {
      var label = n === 0 ? H.t('rooms.filters.capacityAll') : H.t('common.guests') + ' : ' + n + '+';
      return chipRadio('capacity', String(n), label, state.minCapacity === n);
    }).join('');

    var amenities = DATA.AMENITIES.map(function (amenity) {
      return chipCheck(
        'amenities',
        amenity.id,
        H.pick(amenity),
        state.amenities.indexOf(amenity.id) !== -1
      );
    }).join('');

    var sorts = [
      ['recommended', 'rooms.sort.recommended'],
      ['priceAsc', 'rooms.sort.priceAsc'],
      ['priceDesc', 'rooms.sort.priceDesc'],
      ['capacityDesc', 'rooms.sort.capacityDesc']
    ]
      .map(function (row) {
        return (
          '<option value="' + row[0] + '"' +
          (state.sort === row[0] ? ' selected' : '') +
          '>' + H.escapeHtml(H.t(row[1])) + '</option>'
        );
      })
      .join('');

    host.innerHTML = [
      '<form class="filters" data-filters>',
      '  <div class="filters__head">',
      '    <h2 class="filters__title">' + H.escapeHtml(H.t('rooms.filters.title')) + '</h2>',
      '    <span class="filters__count" data-active-count hidden>0</span>',
      '    <button type="button" class="filters__reset" data-filters-reset>',
      H.escapeHtml(H.t('rooms.filters.reset')),
      '    </button>',
      '  </div>',
      '  <button type="button" class="filters__toggle" data-filters-toggle',
      '          aria-expanded="false" aria-controls="filters-body">',
      '    <span>' + H.escapeHtml(H.t('rooms.filters.title')) + '</span>',
      ICONS.icon('chevron-down'),
      '  </button>',
      '  <div class="filters__body" id="filters-body">',
      '    <fieldset class="filters__group">',
      '      <legend class="filters__legend">' + H.escapeHtml(H.t('rooms.filters.category')) + '</legend>',
      '      <div class="chips">' + categories + '</div>',
      '    </fieldset>',
      '    <fieldset class="filters__group">',
      '      <legend class="filters__legend">' + H.escapeHtml(H.t('rooms.filters.budget')) + '</legend>',
      '      <label class="visually-hidden" for="filter-price">' +
      H.escapeHtml(H.t('rooms.filters.budget')) + '</label>',
      '      <input class="range" type="range" id="filter-price" name="maxPrice"',
      '             min="' + H.minPrice() + '" max="' + H.maxPrice() + '" step="5000"',
      '             value="' + (state.maxPrice || H.maxPrice()) + '" />',
      '      <output class="filters__value" data-price-output></output>',
      '      <span class="filters__scale">',
      '        <span>' + H.escapeHtml(H.formatPrice(H.minPrice())) + '</span>',
      '        <span>' + H.escapeHtml(H.formatPrice(H.maxPrice())) + '</span>',
      '      </span>',
      '    </fieldset>',
      '    <fieldset class="filters__group">',
      '      <legend class="filters__legend">' + H.escapeHtml(H.t('rooms.filters.capacity')) + '</legend>',
      '      <div class="chips">' + capacities + '</div>',
      '    </fieldset>',
      '    <fieldset class="filters__group">',
      '      <legend class="filters__legend">' + H.escapeHtml(H.t('rooms.filters.amenities')) + '</legend>',
      '      <div class="chips">' + amenities + '</div>',
      '    </fieldset>',
      '    <fieldset class="filters__group">',
      '      <legend class="filters__legend">' + H.escapeHtml(H.t('rooms.filters.sort')) + '</legend>',
      '      <label class="visually-hidden" for="filter-sort">' +
      H.escapeHtml(H.t('rooms.filters.sort')) + '</label>',
      '      <select class="select" id="filter-sort" name="sort">' + sorts + '</select>',
      '    </fieldset>',
      '  </div>',
      '</form>'
    ].join('\n');

    refs.form = host.querySelector('[data-filters]');
    refs.reset = host.querySelector('[data-filters-reset]');
    refs.toggle = host.querySelector('[data-filters-toggle]');
    refs.body = host.querySelector('#filters-body');
    refs.activeCount = host.querySelector('[data-active-count]');
    refs.price = host.querySelector('#filter-price');
    refs.priceOut = host.querySelector('[data-price-output]');
    refs.sort = host.querySelector('#filter-sort');

    bindFilters();
    syncControls();
    updatePriceOutput();
    updateBodyVisibility();
  }

  function bindFilters() {
    if (!refs.form) return;

    refs.form.addEventListener('change', function (event) {
      var target = event.target;
      if (target.name === 'category') state.category = target.value;
      else if (target.name === 'capacity') state.minCapacity = Number(target.value) || 0;
      else if (target.name === 'amenities') {
        state.amenities = Array.prototype.slice
          .call(refs.form.querySelectorAll('input[name="amenities"]:checked'))
          .map(function (input) {
            return input.value;
          });
      } else if (target.name === 'sort') state.sort = target.value;
      else return;

      state.page = 1;
      apply();
    });

    if (refs.price) {
      refs.price.addEventListener('input', function () {
        state.maxPrice = Number(refs.price.value);
        updatePriceOutput();
      });
      refs.price.addEventListener('change', function () {
        // Le curseur met déjà à jour l'état pendant le glissement ;
        // on le relit ici pour rester cohérent si seul « change » est émis
        // (clavier, technologies d'assistance, scripts externes).
        state.maxPrice = Number(refs.price.value);
        updatePriceOutput();
        state.page = 1;
        apply();
      });
    }

    if (refs.reset) {
      refs.reset.addEventListener('click', resetFilters);
    }

    if (refs.toggle) {
      refs.toggle.addEventListener('click', function () {
        var expanded = refs.toggle.getAttribute('aria-expanded') === 'true';
        refs.toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        refs.toggle.setAttribute('aria-label', H.t(expanded ? 'rooms.filters.expanded' : 'rooms.filters.collapsed'));
        if (refs.body) refs.body.hidden = expanded;
      });
    }
  }

  /** Affiche/masque le corps des filtres sur petits écrans. */
  function updateBodyVisibility() {
    if (!refs.body || !refs.toggle) return;
    var small = H.media('(max-width: 1100px)');
    refs.body.hidden = small;
    refs.toggle.setAttribute('aria-expanded', small ? 'false' : 'true');
    refs.toggle.setAttribute('aria-label', H.t(small ? 'rooms.filters.collapsed' : 'rooms.filters.expanded'));
  }

  function syncControls() {
    if (!refs.form) return;
    var checkedCategory = refs.form.querySelector(
      'input[name="category"][value="' + state.category + '"]'
    );
    if (checkedCategory) checkedCategory.checked = true;

    var checkedCapacity = refs.form.querySelector(
      'input[name="capacity"][value="' + state.minCapacity + '"]'
    );
    if (checkedCapacity) checkedCapacity.checked = true;

    refs.form.querySelectorAll('input[name="amenities"]').forEach(function (input) {
      input.checked = state.amenities.indexOf(input.value) !== -1;
    });

    if (refs.price) refs.price.value = String(state.maxPrice || H.maxPrice());
    if (refs.sort) refs.sort.value = state.sort;
  }

  function updatePriceOutput() {
    if (!refs.priceOut) return;
    var value = Number(refs.price ? refs.price.value : H.maxPrice());
    refs.priceOut.textContent =
      value >= H.maxPrice()
        ? H.t('rooms.filters.budgetValue', { amount: H.formatPrice(H.maxPrice()) })
        : H.t('rooms.filters.budgetMin', { amount: H.formatPrice(value) });
  }

  function resetFilters() {
    state.category = 'all';
    state.maxPrice = null;
    state.minCapacity = 0;
    state.amenities = [];
    state.sort = 'recommended';
    state.page = 1;
    syncControls();
    updatePriceOutput();
    apply();
  }

  /* =====================================================================
     RÉSULTATS ET PAGINATION
     ===================================================================== */

  function currentRooms() {
    return H.filterRooms({
      category: state.category,
      maxPrice: state.maxPrice,
      minCapacity: state.minCapacity,
      amenities: state.amenities,
      sort: state.sort
    });
  }

  function renderPager(total) {
    if (!refs.pager) return;
    var pages = Math.ceil(total / PER_PAGE);
    if (pages <= 1) {
      refs.pager.innerHTML = '';
      return;
    }

    var from = (state.page - 1) * PER_PAGE + 1;
    var to = Math.min(total, state.page * PER_PAGE);

    var buttons = [
      '<button type="button" class="btn btn-outline btn-sm" data-page-prev' +
      (state.page === 1 ? ' disabled' : '') + '>' +
      H.escapeHtml(H.t('rooms.prevPage')) + '</button>'
    ];

    for (var i = 1; i <= pages; i++) {
      buttons.push(
        '<button type="button" class="btn btn-sm' + (i === state.page ? ' btn-gold' : ' btn-outline') +
        '" data-page-goto="' + i + '"' +
        (i === state.page ? ' aria-current="page"' : '') +
        '>' + i + '</button>'
      );
    }

    buttons.push(
      '<button type="button" class="btn btn-outline btn-sm" data-page-next' +
      (state.page === pages ? ' disabled' : '') + '>' +
      H.escapeHtml(H.t('rooms.nextPage')) + '</button>'
    );
    buttons.push(
      '<span class="pager__info">' +
      H.escapeHtml(H.t('rooms.showing', { from: from, to: to, total: total })) +
      '</span>'
    );

    refs.pager.innerHTML = buttons.join('');
  }

  function apply() {
    var rooms = currentRooms();
    var total = rooms.length;
    var pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;

    var visible = rooms.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);

    /* Nombre de résultats */
    if (refs.resultCount) {
      refs.resultCount.textContent =
        total === 1
          ? H.t('rooms.results.countOne', { n: total })
          : H.t('rooms.results.count', { n: total });
    }

    /* Prix affiché dans le bandeau */
    if (refs.minPrice) {
      refs.minPrice.textContent = rooms.length
        ? H.formatPrice(
            rooms.reduce(function (min, room) {
              return Math.min(min, room.price);
            }, Infinity)
          )
        : '—';
    }

    /* Filtres actifs */
    if (refs.activeCount) {
      var active = H.countActiveFilters({
        category: state.category,
        maxPrice: state.maxPrice,
        minCapacity: state.minCapacity,
        amenities: state.amenities
      });
      refs.activeCount.textContent = String(active);
      refs.activeCount.hidden = active === 0;
    }

    /* Grille */
    if (refs.grid) {
      refs.grid.innerHTML = visible
        .map(function (room) {
          return CARDS.roomCard(room);
        })
        .join('');
    }

    /* État vide */
    if (refs.empty) refs.empty.hidden = total !== 0;
    if (refs.grid) refs.grid.hidden = total === 0;

    renderPager(total);
    writeUrl();
  }

  function onPagerClick(event) {
    var prev = event.target.closest('[data-page-prev]');
    var next = event.target.closest('[data-page-next]');
    var goto = event.target.closest('[data-page-goto]');
    if (prev) state.page = Math.max(1, state.page - 1);
    else if (next) state.page = state.page + 1;
    else if (goto) state.page = Number(goto.getAttribute('data-page-goto'));
    else return;
    apply();
    var top = document.querySelector('.rooms-results__bar');
    if (top && top.scrollIntoView) top.scrollIntoView({ block: 'start' });
  }

  /* =====================================================================
     INITIALISATION
     ===================================================================== */

  function init() {
    refs.host = document.querySelector('[data-filters-host]');
    refs.grid = document.querySelector('[data-rooms-grid]');
    refs.resultCount = document.querySelector('[data-rooms-count]');
    refs.minPrice = document.querySelector('[data-rooms-min-price]');
    refs.empty = document.querySelector('[data-rooms-empty]');
    refs.pager = document.querySelector('[data-rooms-pager]');

    readUrl();
    buildFilters();

    var emptyReset = document.querySelector('[data-rooms-reset]');
    if (emptyReset) emptyReset.addEventListener('click', resetFilters);
    if (refs.pager) refs.pager.addEventListener('click', onPagerClick);

    window.addEventListener('resize', function () {
      if (H.media('(min-width: 1101px)') && refs.body) {
        refs.body.hidden = false;
        if (refs.toggle) refs.toggle.setAttribute('aria-expanded', 'true');
      } else if (H.media('(max-width: 1100px)')) {
        updateBodyVisibility();
      }
    });

    apply();
    if (window.RGG) window.RGG.onLanguageChange(renderAll);
  }

  /** Reconstruction complète après un changement de langue. */
  function renderAll() {
    buildFilters();
    apply();
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