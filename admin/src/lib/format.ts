const dateTime = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Douala'
});
const dateOnly = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: 'UTC' });
const money = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export const formatDateTime = (iso: string | null | undefined) => (iso ? dateTime.format(new Date(iso)) : '—');
/** For SQL `date` values (no time zone). */
export const formatDate = (isoDate: string | null | undefined) =>
  isoDate ? dateOnly.format(new Date(`${isoDate}T00:00:00Z`)) : '—';
export const formatXaf = (amount: number | null | undefined) =>
  amount === null || amount === undefined ? '—' : `${money.format(amount)} FCFA`;

/** wa.me link from any phone format (digits only). */
export const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, '')}`;

/** Same password rule as the Supabase Auth configuration. */
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return '12 caractères minimum.';
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Il faut au moins une minuscule, une majuscule et un chiffre.';
  }
  return null;
}
