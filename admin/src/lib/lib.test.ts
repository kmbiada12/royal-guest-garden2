import { describe, expect, it, vi } from 'vitest';

vi.mock('./env', () => ({ env: { supabaseUrl: 'http://x', supabaseAnonKey: 'k', siteUrl: 'http://site.test' } }));
vi.mock('./supabase', () => ({ supabase: {} }));

import { fromI18nForm, missingEnglish, toI18nForm } from './i18n';
import { friendlyError } from './errors';
import { imagePreviewUrl, isAcceptableImage } from './images';
import { passwordProblem, whatsappLink } from './format';

describe('i18n helpers', () => {
  it('round-trips and drops empty English', () => {
    expect(toI18nForm({ fr: 'Bonjour' })).toEqual({ fr: 'Bonjour', en: '' });
    expect(fromI18nForm({ fr: ' Bonjour ', en: '  ' })).toEqual({ fr: 'Bonjour' });
    expect(fromI18nForm({ fr: 'Bonjour', en: 'Hello' })).toEqual({ fr: 'Bonjour', en: 'Hello' });
    expect(toI18nForm(null)).toEqual({ fr: '', en: '' });
  });
  it('detects a missing English version', () => {
    expect(missingEnglish({ fr: 'a' })).toBe(true);
    expect(missingEnglish({ fr: 'a', en: ' ' })).toBe(true);
    expect(missingEnglish({ fr: 'a', en: 'b' })).toBe(false);
  });
});

describe('friendlyError', () => {
  it('explains known constraints and triggers', () => {
    expect(friendlyError({ code: '23514', message: 'violates check constraint "rooms_images_check"' })).toMatch(/Photos/);
    expect(friendlyError({ message: 'Cannot remove or demote the last admin' })).toMatch(/administrateur/);
    expect(friendlyError({ message: 'Unknown amenity id(s) for room x: y' })).toMatch(/Équipement inconnu/);
    expect(friendlyError({ code: '23505', message: 'duplicate key' })).toMatch(/existe déjà/);
    expect(friendlyError({ code: '42501', message: 'permission denied' })).toMatch(/Droits/);
    expect(friendlyError({ message: 'Invalid login credentials' })).toMatch(/incorrect/);
  });
});

describe('images', () => {
  it('accepts the same values as the database', () => {
    expect(isAcceptableImage('img/chambres/waza/Warm wood, bedroom-2.png')).toBe(true);
    expect(isAcceptableImage('https://images.unsplash.com/photo-1?w=800')).toBe(true);
    expect(isAcceptableImage('http://127.0.0.1:54321/storage/v1/object/public/site-images/rooms/a.webp')).toBe(true);
    expect(isAcceptableImage('javascript:alert(1)')).toBe(false);
    expect(isAcceptableImage('img/../../etc/passwd')).toBe(false);
    expect(isAcceptableImage('http://evil.test/a.png')).toBe(false);
  });
  it('previews site paths through the public site', () => {
    expect(imagePreviewUrl('img/a b.png')).toBe('http://site.test/img/a%20b.png');
    expect(imagePreviewUrl('https://x.test/a.png')).toBe('https://x.test/a.png');
  });
});

describe('format', () => {
  it('enforces the password rule', () => {
    expect(passwordProblem('short')).toMatch(/12/);
    expect(passwordProblem('alllowercase123')).toMatch(/majuscule/);
    expect(passwordProblem('Correct-Horse-42')).toBeNull();
  });
  it('builds WhatsApp links from any phone format', () => {
    expect(whatsappLink('+237 6 99-00 00 00')).toBe('https://wa.me/237699000000');
  });
});
