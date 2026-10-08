/** Public configuration (Vite env). Never put the service-role key here. */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Variable d'environnement manquante : ${name} (voir admin/.env.example)`);
  return value;
}

const rawBase = import.meta.env.BASE_URL || '/';

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  siteUrl: (import.meta.env.VITE_SITE_URL || 'http://localhost:3003').replace(/\/+$/, ''),
  /** Chemin où l'app est servie, sans slash final ('/' en local, '/admin' en production). */
  basePath: rawBase.replace(/\/+$/, '') || '/',
  /** Même chemin avec slash final, pour construire des liens absolus. */
  baseUrl: rawBase.endsWith('/') ? rawBase : rawBase + '/'
};
