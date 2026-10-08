/* =========================================================================
   Royal Guest Garden — Connexion Supabase (clés PUBLIQUES uniquement)
   -------------------------------------------------------------------------
   La clé « anon / publishable » est faite pour être exposée côté client :
   elle donne uniquement accès à la fonction publique get_site() (contenu
   publié). La clé service-role ne doit JAMAIS apparaître ici.

   Ordre essayé par js/supabase-loader.js :
     1. local — Supabase local (Docker), uniquement sur un hôte de
        développement (localhost, 127.0.0.1, file://, *.local, *.test,
        ou ?localdb=1 dans l'adresse) ;
     2. cloud — projet Supabase hébergé (production) ;
     3. contenu statique — si aucune source ne répond, le site garde
        js/config.js et js/data.js.
   ========================================================================= */

window.RGG_SUPABASE = {
  /* Supabase hébergé — Project Settings → API. Laissez « À-COMPLÉTER »
     tant que le projet cloud n'existe pas : la source est alors ignorée. */
  cloud: {
    url: 'À-COMPLÉTER', // ex. https://abcdefgh.supabase.co
    anonKey: 'À-COMPLÉTER' // clé « anon public » / « publishable »
  },

  /* Supabase local (supabase start) — clé affichée par `supabase status`. */
  local: {
    url: 'http://127.0.0.1:54321',
    anonKey: 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'
  },

  /* Délai maximal par source (ms) avant de passer à la suivante. */
  timeouts: {
    local: 1500,
    cloud: 3000
  }
};
