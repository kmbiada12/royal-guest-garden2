/* =========================================================================
   Royal Guest Garden — Visionneuse de photos (lightbox)
   -------------------------------------------------------------------------
   Ouverture au clic sur une vignette, navigation au clavier (flèches,
   Échap), piège de focus et restauration du focus à la fermeture.
   ========================================================================= */

(function () {
  'use strict';

  var I18N = window.RGG_I18N;
  var H = window.RGG_HELPERS;

  var items = [];
  var index = 0;
  var overlay = null;
  var dialog = null;
  var lastFocused = null;

  function ensureModal() {
    var host = document.getElementById('modal-root');
    if (!host) return false;
    if (overlay) return true;

    var existing = host.querySelector('[data-lightbox]');
    if (existing) existing.remove();

    var markup = [
      '<div class="lightbox" data-lightbox hidden>',
      '  <div class="lightbox__backdrop" data-lb-backdrop></div>',
      '  <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lb-caption">',
      '    <button type="button" class="lightbox__close" data-lb-close data-i18n-attr="aria-label:a11y.close">',
      '      <span aria-hidden="true">&times;</span>',
      '    </button>',
      '    <button type="button" class="lightbox__nav lightbox__nav--prev" data-lb-prev',
      '            data-i18n-attr="aria-label:a11y.prev"><span aria-hidden="true">&#8249;</span></button>',
      '    <button type="button" class="lightbox__nav lightbox__nav--next" data-lb-next',
      '            data-i18n-attr="aria-label:a11y.next"><span aria-hidden="true">&#8250;</span></button>',
      '    <figure class="lightbox__figure">',
      '      <img class="lightbox__image" data-lb-image src="" alt="" />',
      '      <figcaption class="lightbox__caption" id="lb-caption" data-lb-caption></figcaption>',
      '    </figure>',
      '  </div>',
      '</div>'
    ].join('\n');

    var temp = document.createElement('div');
    temp.innerHTML = markup;
    var node = temp.firstElementChild;
    host.appendChild(node);

    overlay = node;
    dialog = node.querySelector('.lightbox__dialog');

    node.querySelector('[data-lb-close]').addEventListener('click', close);
    node.querySelector('[data-lb-prev]').addEventListener('click', function () {
      go(-1);
    });
    node.querySelector('[data-lb-next]').addEventListener('click', function () {
      go(1);
    });
    node.querySelector('[data-lb-backdrop]').addEventListener('click', close);

    /* Les raccourcis sont écoutes sur l'ensemble de la visionneuse et non sur
       la seule boîte de dialogue : Échap et les flèches restent actifs même
       si le focus se trouve sur le fond ou sur l'image. */
    node.addEventListener('keydown', onKeydown);
    return true;
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    } else if (event.key === 'Tab') {
      trap(event);
    }
  }

  function trap(event) {
    var focusables = dialog.querySelectorAll('button');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function render() {
    var item = items[index];
    if (!item) return;
    var image = dialog.querySelector('[data-lb-image]');
    var caption = dialog.querySelector('[data-lb-caption]');
    var counter = I18N.t('room.gallery.counter', {
      current: index + 1,
      total: items.length
    });
    image.setAttribute('src', H.imageUrl(item.src, 1600));
    image.setAttribute('alt', item.alt || '');
    caption.textContent = item.caption ? item.caption + ' — ' + counter : counter;
    var single = items.length < 2;
    dialog.querySelector('[data-lb-prev]').hidden = single;
    dialog.querySelector('[data-lb-next]').hidden = single;
  }

  function go(step) {
    if (items.length < 2) return;
    index = (index + step + items.length) % items.length;
    render();
  }

  function open(list, startIndex) {
    if (!list || !list.length) return;
    if (!ensureModal()) return;
    items = list;
    index = Math.max(0, Math.min(startIndex || 0, list.length - 1));
    I18N.applyStatic(dialog);
    render();
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    window.requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });
    dialog.querySelector('[data-lb-close]').focus();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  window.RGG_LIGHTBOX = { open: open, close: close };
})();
