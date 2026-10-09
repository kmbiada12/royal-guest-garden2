/* =========================================================================
   Royal Guest Garden — Chargeur de contenu Supabase
   -------------------------------------------------------------------------
   Chargé APRÈS config.js / data.js (contenu statique de secours) et AVANT
   les autres scripts.

   1. Copie locale : si le navigateur a déjà reçu le contenu (moins d'
       1 heure), il est appliqué IMMÉDIATEMENT — la page s'affiche sans
       attendre le réseau — puis une version fraîche est récupérée en
       arrière-plan pour la visite suivante.
   2. Sinon (première visite), appel GET de la fonction publique
      get_site() (clé anon) : Supabase local sur un hôte de
      développement, puis le projet cloud, chacun avec un délai maximal.
   3. Si rien ne répond, le contenu statique reste tel quel.

   Le contenu est appliqué EN PLACE dans RGG_CONFIG et RGG_DATA : mêmes
   objets, mêmes tableaux, si bien que les références déjà prises par les
   autres scripts (CONFIG.hotel, CONFIG.booking.policies…) le voient.

   La copie locale ne contient que le contenu public du site (chambres,
   services, textes) — aucune donnée personnelle.

   window.RGG_ON_READY(fn) : exécute fn quand le DOM est prêt ET que le
   contenu est prêt. main.js et les scripts de page l'utilisent.
   window.RGG_CONTENT_SOURCE : 'cache' | 'local' | 'cloud' | 'static'.
   ========================================================================= */

(function () {
  'use strict';

  var CONFIG_SECTIONS = ['hotel', 'whatsapp', 'currency', 'booking', 'demo'];
  var DATA_ARRAYS = [
    'CATEGORIES', 'AMENITIES', 'ROOMS', 'SERVICES', 'BENEFITS',
    'TESTIMONIALS', 'VALUES', 'GUEST_EXPERIENCE', 'TEAM'
  ];
  var DATA_OBJECTS = ['GALLERY', 'HERO_IMAGES'];

  var CACHE_KEY = 'rgg_site_cache_v1';
  /* 1 heure : les modifications publiées dans le back-office apparaissent
     sur le site dans l'heure (un délai plus long ferait attendre les
     visiteurs réguliers plusieurs jours). */
  var CACHE_MAX_AGE_MS = 60 * 60 * 1000;

  /* ---------------------------------------------------------------------
     Attente commune : DOM prêt + contenu réglé
     --------------------------------------------------------------------- */
  var contentSettled = false;
  var domReady = document.readyState !== 'loading';
  var queue = [];

  function flush() {
    if (!contentSettled || !domReady) return;
    var pending = queue;
    queue = [];
    pending.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        /* un script en erreur ne doit pas bloquer les suivants */
      }
    });
  }

  window.RGG_ON_READY = function (fn) {
    queue.push(fn);
    flush();
  };

  if (!domReady) {
    document.addEventListener('DOMContentLoaded', function () {
      domReady = true;
      flush();
    });
  }

  function settle(source) {
    if (contentSettled) return;
    window.RGG_CONTENT_SOURCE = source;
    contentSettled = true;
    flush();
  }

  /* ---------------------------------------------------------------------
     Sources
     --------------------------------------------------------------------- */
  function isDevHost() {
    var host = window.location.hostname || '';
    var search = window.location.search || '';
    if (/[?&]localdb=1(&|$)/.test(search)) return true;
    if (/[?&]localdb=0(&|$)/.test(search)) return false;
    return (
      host === '' || // file://
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]' ||
      /\.(local|test)$/.test(host)
    );
  }

  function isConfigured(source) {
    return (
      !!source &&
      typeof source.url === 'string' &&
      typeof source.anonKey === 'string' &&
      /^https?:\/\//.test(source.url) &&
      source.anonKey.length > 0 &&
      source.url.indexOf('COMPL') === -1 &&
      source.anonKey.indexOf('COMPL') === -1
    );
  }

  function orderedSources() {
    var cfg = window.RGG_SUPABASE || {};
    var timeouts = cfg.timeouts || {};
    var list = [];
    if (isDevHost() && isConfigured(cfg.local)) {
      list.push({ name: 'local', url: cfg.local.url, key: cfg.local.anonKey, timeout: timeouts.local || 1500 });
    }
    if (isConfigured(cfg.cloud)) {
      list.push({ name: 'cloud', url: cfg.cloud.url, key: cfg.cloud.anonKey, timeout: timeouts.cloud || 3000 });
    }
    return list;
  }

  /* ---------------------------------------------------------------------
     GET /rest/v1/rpc/get_site avec délai maximal (XMLHttpRequest : pas
     besoin de Promise ni de fetch). La réponse est cacheable 60 s.
     --------------------------------------------------------------------- */
  function fetchSite(source, done) {
    var finished = false;
    function finish(result) {
      if (finished) return;
      finished = true;
      done(result);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', source.url.replace(/\/+$/, '') + '/rest/v1/rpc/get_site', true);
    xhr.timeout = source.timeout;
    xhr.setRequestHeader('apikey', source.key);
    xhr.setRequestHeader('Authorization', 'Bearer ' + source.key);
    xhr.onload = function () {
      if (xhr.status !== 200) return finish(null);
      try {
        finish(JSON.parse(xhr.responseText));
      } catch (e) {
        finish(null);
      }
    };
    xhr.onerror = xhr.ontimeout = xhr.onabort = function () {
      finish(null);
    };
    try {
      xhr.send();
    } catch (e) {
      finish(null);
    }
  }

  /** Essaie les sources dans l'ordre ; done(site, source) ou done(null). */
  function fetchFirst(sources, index, done) {
    if (index >= sources.length) {
      done(null, null);
      return;
    }
    fetchSite(sources[index], function (site) {
      if (isValid(site)) done(site, sources[index]);
      else fetchFirst(sources, index + 1, done);
    });
  }

  /* ---------------------------------------------------------------------
     Validation de la forme attendue
     --------------------------------------------------------------------- */
  function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  }
  function isObject(v) {
    return v !== null && typeof v === 'object' && !isArray(v);
  }

  function isValid(site) {
    if (!isObject(site) || !isObject(site.config) || !isObject(site.data)) return false;
    if (!isObject(site.config.hotel) || typeof site.config.hotel.name !== 'string') return false;
    for (var i = 0; i < CONFIG_SECTIONS.length; i++) {
      if (!isObject(site.config[CONFIG_SECTIONS[i]])) return false;
    }
    for (var j = 0; j < DATA_ARRAYS.length; j++) {
      if (!isArray(site.data[DATA_ARRAYS[j]])) return false;
    }
    if (!site.data.ROOMS.length) return false;
    if (!isObject(site.data.GALLERY) || !isArray(site.data.GALLERY.items)) return false;
    return isObject(site.data.HERO_IMAGES);
  }

  /* ---------------------------------------------------------------------
     Copie locale (localStorage) — tolère un stockage indisponible
     --------------------------------------------------------------------- */
  function readCache(sources) {
    try {
      var raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var entry = JSON.parse(raw);
      var known = sources.some(function (s) {
        return s.url === entry.url;
      });
      if (!known || !isValid(entry.site)) return null;
      if (!(Date.now() - entry.savedAt < CACHE_MAX_AGE_MS)) return null;
      return entry.site;
    } catch (e) {
      return null;
    }
  }

  function writeCache(source, site) {
    try {
      window.localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ url: source.url, savedAt: Date.now(), site: site })
      );
    } catch (e) {
      /* stockage plein ou désactivé : sans importance */
    }
  }

  /* ---------------------------------------------------------------------
     Application EN PLACE
     Objets : fusion récursive (les clés absentes du serveur gardent leur
     valeur statique). Tableaux : contenu remplacé, même référence.
     --------------------------------------------------------------------- */
  function replaceArray(target, source) {
    target.length = 0;
    for (var i = 0; i < source.length; i++) target.push(source[i]);
  }

  function mergeInto(target, source) {
    Object.keys(source).forEach(function (key) {
      var from = source[key];
      var to = target[key];
      if (isArray(from) && isArray(to)) replaceArray(to, from);
      else if (isObject(from) && isObject(to)) mergeInto(to, from);
      else target[key] = from;
    });
  }

  function apply(site) {
    var config = window.RGG_CONFIG;
    var data = window.RGG_DATA;
    try {
      CONFIG_SECTIONS.forEach(function (key) {
        if (isObject(config[key])) mergeInto(config[key], site.config[key]);
        else config[key] = site.config[key];
      });
      DATA_ARRAYS.forEach(function (key) {
        if (isArray(data[key])) replaceArray(data[key], site.data[key]);
        else data[key] = site.data[key];
      });
      DATA_OBJECTS.forEach(function (key) {
        if (isObject(data[key])) mergeInto(data[key], site.data[key]);
        else data[key] = site.data[key];
      });
    } catch (e) {
      /* contenu partiellement appliqué : on garde ce qui est en place */
    }
  }

  /* ---------------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------------- */
  if (!window.RGG_CONFIG || !window.RGG_DATA || typeof XMLHttpRequest === 'undefined') {
    settle('static');
    return;
  }

  var sources = orderedSources();
  var cached = readCache(sources);

  if (cached) {
    // Affichage immédiat, rafraîchissement silencieux pour la prochaine page.
    apply(cached);
    settle('cache');
  }

  fetchFirst(sources, 0, function (site, source) {
    if (site) writeCache(source, site);
    if (contentSettled) return; // la page est déjà rendue (copie locale)
    if (site) {
      apply(site);
      settle(source.name);
    } else {
      settle('static');
    }
  });
})();
