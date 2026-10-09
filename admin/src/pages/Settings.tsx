import { useEffect, useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { friendlyError } from '@/lib/errors';
import { fromI18nForm, toI18nForm, type I18nForm } from '@/lib/i18n';
import { ErrorNotice, Loading, PageHeader, Spinner, useToast } from '@/components/ui';
import { I18nInput } from '@/components/fields/I18nInput';
import { I18nListInput } from '@/components/fields/I18nListInput';
import { ImageInput } from '@/components/fields/ImageInput';

type Json = Record<string, unknown>;

interface SettingsForm {
  hotel: {
    name: string;
    slogan: I18nForm;
    type: I18nForm;
    addressLine: string;
    city: string;
    region: string;
    address: I18nForm;
    phoneDisplay: string;
    phoneDisplayAlt: string;
    phoneTel: string;
    phoneTelAlt: string;
    email: string;
    emailBooking: string;
    mapUrl: string;
    mapEmbedNote: I18nForm;
    landmarks: I18nForm[];
  };
  whatsapp: { number: string; numberAlt: string; display: string; displayAlt: string; bookingNumber: string; baseUrl: string };
  currency: { code: string; label: string; decimals: string };
  booking: {
    checkIn: string;
    checkOut: string;
    minNights: string;
    maxRoomsPerRequest: string;
    receptionHours: I18nForm;
    policies: { key: string; text: I18nForm }[];
  };
  demo: { enabled: boolean; badge: I18nForm; notice: I18nForm };
  hero: { home: string; rooms: string; services: string; about: string; contact: string };
}

const HERO_KEYS = ['home', 'rooms', 'services', 'about', 'contact'] as const;
const HERO_LABELS: Record<(typeof HERO_KEYS)[number], string> = {
  home: 'Accueil',
  rooms: 'Chambres',
  services: 'Services',
  about: 'À propos',
  contact: 'Contact'
};

const s = (v: unknown) => (typeof v === 'string' ? v : v === null || v === undefined ? '' : String(v));

/** landmarks are stored as { fr: [...], en: [...] } → list of FR/EN pairs. */
function landmarksToForm(value: unknown): I18nForm[] {
  const v = (value ?? {}) as { fr?: string[]; en?: string[] };
  const fr = Array.isArray(v.fr) ? v.fr : [];
  const en = Array.isArray(v.en) ? v.en : [];
  return Array.from({ length: Math.max(fr.length, en.length) }, (_, i) => ({ fr: fr[i] ?? '', en: en[i] ?? '' }));
}
function landmarksFromForm(list: I18nForm[]) {
  const kept = list.filter((l) => l.fr.trim());
  return { fr: kept.map((l) => l.fr.trim()), en: kept.map((l) => l.en.trim() || l.fr.trim()) };
}

function toForm(row: Json): SettingsForm {
  const h = (row.hotel ?? {}) as Json;
  const w = (row.whatsapp ?? {}) as Json;
  const c = (row.currency ?? {}) as Json;
  const b = (row.booking ?? {}) as Json;
  const d = (row.demo ?? {}) as Json;
  const hero = (row.hero_images ?? {}) as Json;
  return {
    hotel: {
      name: s(h.name),
      slogan: toI18nForm(h.slogan),
      type: toI18nForm(h.type),
      addressLine: s(h.addressLine),
      city: s(h.city),
      region: s(h.region),
      address: toI18nForm(h.address),
      phoneDisplay: s(h.phoneDisplay),
      phoneDisplayAlt: s(h.phoneDisplayAlt),
      phoneTel: s(h.phoneTel),
      phoneTelAlt: s(h.phoneTelAlt),
      email: s(h.email),
      emailBooking: s(h.emailBooking),
      mapUrl: s(h.mapUrl),
      mapEmbedNote: toI18nForm(h.mapEmbedNote),
      landmarks: landmarksToForm(h.landmarks)
    },
    whatsapp: {
      number: s(w.number),
      numberAlt: s(w.numberAlt),
      display: s(w.display),
      displayAlt: s(w.displayAlt),
      bookingNumber: s(w.bookingNumber),
      baseUrl: s(w.baseUrl) || 'https://wa.me/'
    },
    currency: { code: s(c.code), label: s(c.label), decimals: s(c.decimals ?? 0) },
    booking: {
      checkIn: s(b.checkIn),
      checkOut: s(b.checkOut),
      minNights: s(b.minNights ?? 1),
      maxRoomsPerRequest: s(b.maxRoomsPerRequest ?? 5),
      receptionHours: toI18nForm(b.receptionHours),
      policies: (Array.isArray(b.policies) ? b.policies : []).map((p: Json) => ({
        key: s(p.key),
        text: { fr: s(p.fr), en: s(p.en) }
      }))
    },
    demo: { enabled: d.enabled === true, badge: toI18nForm(d.badge), notice: toI18nForm(d.notice) },
    hero: Object.fromEntries(HERO_KEYS.map((k) => [k, s(hero[k])])) as SettingsForm['hero']
  };
}

/** Form → row, preserving any keys the form does not manage. */
function toRow(form: SettingsForm, original: Json) {
  const row = buildRow(form, original);
  // An empty second number is removed (the database requires 8–15 digits when present).
  if (!row.whatsapp.numberAlt) delete (row.whatsapp as Json).numberAlt;
  return row;
}

function buildRow(form: SettingsForm, original: Json) {
  const h = form.hotel;
  const optional = (v: string) => v.trim();
  return {
    hotel: {
      ...((original.hotel ?? {}) as Json),
      name: h.name.trim(),
      slogan: fromI18nForm(h.slogan),
      type: fromI18nForm(h.type),
      addressLine: h.addressLine.trim(),
      city: h.city.trim(),
      region: h.region.trim(),
      address: fromI18nForm(h.address),
      phoneDisplay: optional(h.phoneDisplay),
      phoneDisplayAlt: optional(h.phoneDisplayAlt),
      phoneTel: optional(h.phoneTel),
      phoneTelAlt: optional(h.phoneTelAlt),
      email: optional(h.email),
      emailBooking: optional(h.emailBooking),
      mapUrl: h.mapUrl.trim(),
      mapEmbedNote: fromI18nForm(h.mapEmbedNote),
      landmarks: landmarksFromForm(h.landmarks)
    },
    whatsapp: {
      ...((original.whatsapp ?? {}) as Json),
      number: form.whatsapp.number.replace(/\D/g, ''),
      numberAlt: form.whatsapp.numberAlt.replace(/\D/g, ''),
      display: form.whatsapp.display.trim(),
      displayAlt: form.whatsapp.displayAlt.trim(),
      bookingNumber: form.whatsapp.bookingNumber.replace(/\D/g, '') || null,
      baseUrl: form.whatsapp.baseUrl.trim()
    },
    currency: {
      ...((original.currency ?? {}) as Json),
      code: form.currency.code.trim(),
      label: form.currency.label.trim(),
      decimals: Number(form.currency.decimals) || 0
    },
    booking: {
      ...((original.booking ?? {}) as Json),
      checkIn: form.booking.checkIn.trim(),
      checkOut: form.booking.checkOut.trim(),
      minNights: Number(form.booking.minNights) || 1,
      maxRoomsPerRequest: Number(form.booking.maxRoomsPerRequest) || 1,
      receptionHours: fromI18nForm(form.booking.receptionHours),
      policies: form.booking.policies
        .filter((p) => p.text.fr.trim())
        .map((p, i) => ({ key: p.key.trim() || `regle-${i + 1}`, fr: p.text.fr.trim(), en: p.text.en.trim() || p.text.fr.trim() }))
    },
    demo: {
      ...((original.demo ?? {}) as Json),
      enabled: form.demo.enabled,
      badge: fromI18nForm(form.demo.badge),
      notice: fromI18nForm(form.demo.notice)
    },
    hero_images: { ...((original.hero_images ?? {}) as Json), ...form.hero }
  };
}

function Text({ control, name, label, hint, type = 'text' }: { control: Control<SettingsForm>; name: string; label: string; hint?: string; type?: string }) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <label className="field">
          <span className="field__label">{label}</span>
          <input type={type} value={field.value as string} onChange={field.onChange} />
          {hint && <span className="field__hint">{hint}</span>}
        </label>
      )}
    />
  );
}

function Bilingual({ control, name, label, multiline }: { control: Control<SettingsForm>; name: string; label: string; multiline?: boolean }) {
  return (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <I18nInput id={name} label={label} multiline={multiline} rows={3} value={field.value as I18nForm} onChange={field.onChange} />
      )}
    />
  );
}

export default function Settings() {
  const query = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error: e } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      if (e) throw e;
      return data as Json | null;
    }
  });

  if (query.isLoading) return <div className="page"><Loading /></div>;
  if (!query.data) return <div className="page"><ErrorNotice error={query.error ? friendlyError(query.error) : 'Réglages introuvables.'} /></div>;
  // The form only mounts once the row is loaded: every field has a value.
  return <SettingsEditor row={query.data} />;
}

function SettingsEditor({ row }: { row: Json }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SettingsForm>({ defaultValues: toForm(row) });
  const { control, handleSubmit, reset, formState } = form;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!formState.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formState.isDirty]);

  const save = useMutation({
    mutationFn: async (values: SettingsForm) => {
      const { error: e } = await supabase.from('settings').update(toRow(values, row) as never).eq('id', 1);
      if (e) throw e;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] })
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await save.mutateAsync(values);
      reset(values);
      toast('Réglages enregistrés. Le site public se met à jour sous une minute.');
    } catch (e) {
      setError(friendlyError(e));
    }
  });

  return (
    <div className="page page--form">
      <PageHeader title="Réglages du site" subtitle="Coordonnées, WhatsApp, règles de réservation, bannières." />
      <form className="form" onSubmit={onSubmit}>
        <section className="card">
          <h2>Établissement</h2>
          <Text control={control} name="hotel.name" label="Nom affiché" />
          <Bilingual control={control} name="hotel.slogan" label="Slogan" />
          <Bilingual control={control} name="hotel.type" label="Type d’établissement" />
          <div className="grid-3">
            <Text control={control} name="hotel.addressLine" label="Rue" />
            <Text control={control} name="hotel.city" label="Ville" />
            <Text control={control} name="hotel.region" label="Pays / région" />
          </div>
          <Bilingual control={control} name="hotel.address" label="Adresse complète" />
          <Text control={control} name="hotel.mapUrl" label="Lien de la carte" hint="Doit commencer par https://" />
          <Bilingual control={control} name="hotel.mapEmbedNote" label="Note sous la carte" />
          <Controller
            control={control}
            name="hotel.landmarks"
            render={({ field }) => <I18nListInput label="Repères (distances)" value={field.value} onChange={field.onChange} addLabel="Ajouter un repère" />}
          />
        </section>

        <section className="card">
          <h2>Téléphones et e-mails</h2>
          <div className="grid-2">
            <Text control={control} name="hotel.phoneDisplay" label="Téléphone affiché" />
            <Text control={control} name="hotel.phoneTel" label="Téléphone (format international, liens)" hint="Ex. +237691491948" />
            <Text control={control} name="hotel.phoneDisplayAlt" label="Second téléphone affiché" />
            <Text control={control} name="hotel.phoneTelAlt" label="Second téléphone (international)" />
            <Text control={control} name="hotel.email" label="E-mail de contact" type="email" />
            <Text control={control} name="hotel.emailBooking" label="E-mail réservations" type="email" />
          </div>
        </section>

        <section className="card">
          <h2>WhatsApp</h2>
          <p className="muted">Numéros au format international, chiffres uniquement (ex. 237691491948).</p>
          <div className="grid-2">
            <Text control={control} name="whatsapp.number" label="Numéro principal" />
            <Text control={control} name="whatsapp.display" label="Numéro principal (affichage)" />
            <Text control={control} name="whatsapp.numberAlt" label="Second numéro" />
            <Text control={control} name="whatsapp.displayAlt" label="Second numéro (affichage)" />
            <Text control={control} name="whatsapp.bookingNumber" label="Numéro des réservations" hint="Vide = numéro principal." />
            <Text control={control} name="whatsapp.baseUrl" label="Adresse de base" hint="https://wa.me/" />
          </div>
        </section>

        <section className="card">
          <h2>Réservations</h2>
          <div className="grid-2">
            <Text control={control} name="booking.checkIn" label="Arrivée à partir de" hint="Ex. 15:00" />
            <Text control={control} name="booking.checkOut" label="Départ avant" hint="Ex. 11:00" />
            <Text control={control} name="booking.minNights" label="Nuits minimum" type="number" />
            <Text control={control} name="booking.maxRoomsPerRequest" label="Chambres max. par demande" type="number" />
          </div>
          <Bilingual control={control} name="booking.receptionHours" label="Horaires de la réception" />
          <Controller
            control={control}
            name="booking.policies"
            render={({ field }) => (
              <I18nListInput
                label="Conditions (fiche chambre)"
                value={field.value.map((p) => p.text)}
                onChange={(texts) =>
                  field.onChange(texts.map((text, i) => ({ key: field.value[i]?.key ?? '', text })))
                }
                addLabel="Ajouter une condition"
              />
            )}
          />
          <div className="grid-3">
            <Text control={control} name="currency.code" label="Devise (code)" />
            <Text control={control} name="currency.label" label="Devise (affichage)" />
            <Text control={control} name="currency.decimals" label="Décimales" type="number" />
          </div>
        </section>

        <section className="card">
          <h2>Mention « contenu de démonstration »</h2>
          <Controller
            control={control}
            name="demo.enabled"
            render={({ field }) => (
              <label className="checkbox">
                <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                Afficher la mention (à décocher une fois les vrais contenus en place)
              </label>
            )}
          />
          <Bilingual control={control} name="demo.badge" label="Badge" />
          <Bilingual control={control} name="demo.notice" label="Texte de la mention" multiline />
        </section>

        <section className="card">
          <h2>Images de bannière</h2>
          <div className="grid-2">
            {HERO_KEYS.map((key) => (
              <Controller
                key={key}
                control={control}
                name={`hero.${key}`}
                render={({ field }) => (
                  <ImageInput id={`hero-${key}`} label={HERO_LABELS[key]} value={field.value} onChange={field.onChange} folder="banners" />
                )}
              />
            ))}
          </div>
        </section>

        <ErrorNotice error={error} />
        <div className="form__footer">
          <button className="btn btn--primary" disabled={save.isPending}>
            {save.isPending && <Spinner />} Enregistrer les réglages
          </button>
          {formState.isDirty && <span className="muted">Modifications non enregistrées</span>}
        </div>
      </form>
    </div>
  );
}
