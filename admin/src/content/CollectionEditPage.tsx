import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { collectionBySlug, refLabel } from './collections';
import { buildSchema, firstError, formToRow, rowToForm } from './convert';
import { useContentRow, useContentRows, useDeleteRow, useSaveRow } from './queries';
import { SITE_ICONS } from './icons';
import type { CollectionDef, FieldDef, FormValues } from './types';
import { friendlyError } from '@/lib/errors';
import { env } from '@/lib/env';
import type { I18nForm } from '@/lib/i18n';
import { frText } from '@/lib/i18n';
import { ErrorNotice, Loading, PageHeader, Spinner, useToast } from '@/components/ui';
import { ConfirmButton } from '@/components/ConfirmButton';
import { I18nInput } from '@/components/fields/I18nInput';
import { I18nListInput } from '@/components/fields/I18nListInput';
import { ImageInput } from '@/components/fields/ImageInput';
import { ImageListInput } from '@/components/fields/ImageListInput';
import { PricingInput, type PricingForm } from '@/components/fields/PricingInput';

export default function CollectionEditPage() {
  const { collection, id } = useParams();
  const def = collectionBySlug(collection);
  if (!def) return <div className="page"><ErrorNotice error="Rubrique inconnue." /></div>;
  const isNew = id === 'nouveau';
  return <Editor key={`${def.slug}/${id}`} def={def} id={isNew ? null : (id ?? null)} />;
}

function Editor({ def, id }: { def: CollectionDef; id: string | null }) {
  const navigate = useNavigate();
  const toast = useToast();
  const rowQuery = useContentRow(def.table, id ?? undefined);
  const save = useSaveRow(def.table);
  const remove = useDeleteRow(def.table);
  const [error, setError] = useState<string | null>(null);

  const needsCategories = def.fields.some((f) => f.kind === 'ref' && f.table === 'room_categories');
  const needsGroups = def.fields.some((f) => f.kind === 'ref' && f.table === 'benefit_groups');
  const needsAmenities = def.fields.some((f) => f.kind === 'amenities');
  const categories = useContentRows('room_categories', needsCategories);
  const groups = useContentRows('benefit_groups', needsGroups);
  const amenities = useContentRows('amenities', needsAmenities);

  const schema = useMemo(() => buildSchema(def), [def]);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: rowToForm(def, null),
    mode: 'onBlur'
  });
  const { control, handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (rowQuery.data) reset(rowToForm(def, rowQuery.data));
  }, [rowQuery.data, def, reset]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!formState.isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formState.isDirty]);

  if (id !== null && rowQuery.isLoading) return <div className="page"><Loading /></div>;
  if (id !== null && !rowQuery.isLoading && !rowQuery.data) {
    return (
      <div className="page">
        <ErrorNotice error={rowQuery.error ? friendlyError(rowQuery.error) : 'Élément introuvable (supprimé ?).'} />
        <Link to={`/contenu/${def.slug}`}>← Retour à la liste</Link>
      </div>
    );
  }

  const row = rowQuery.data;
  const title = id === null ? `Nouvel élément — ${def.singular}` : def.titleOf(row ?? {}) || def.singular;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const newId = await save.mutateAsync({ id: id === null ? null : (row!.id as string | number), row: formToRow(def, values, id === null) });
      toast('Enregistré. Le site public se met à jour sous une minute.');
      reset(values);
      if (id === null) navigate(`/contenu/${def.slug}/${encodeURIComponent(String(newId))}`, { replace: true });
    } catch (e) {
      setError(friendlyError(e));
    }
  }, () => setError('Le formulaire contient des erreurs : voir les champs signalés.'));

  const options = { categories: categories.data ?? [], groups: groups.data ?? [], amenities: amenities.data ?? [] };

  return (
    <div className="page page--form">
      <PageHeader
        title={title}
        subtitle={<Link to={`/contenu/${def.slug}`}>← {def.title}</Link>}
        actions={
          id !== null && row?.published === true && def.previewPath ? (
            <a className="btn btn--ghost" href={`${env.siteUrl}/${def.previewPath(row)}`} target="_blank" rel="noreferrer">
              Voir sur le site ↗
            </a>
          ) : undefined
        }
      />
      <form className="form" onSubmit={onSubmit} noValidate>
        {def.fields.map((field) => (
          <Controller
            key={field.key}
            name={field.key}
            control={control}
            render={({ field: f, fieldState }) => (
              <FieldControl
                def={def}
                field={field}
                value={f.value}
                onChange={f.onChange}
                error={firstError(fieldState.error)}
                isNew={id === null}
                options={options}
              />
            )}
          />
        ))}
        <ErrorNotice error={error} />
        <div className="form__footer">
          <button className="btn btn--primary" disabled={save.isPending}>
            {save.isPending && <Spinner />} Enregistrer
          </button>
          {formState.isDirty && <span className="muted">Modifications non enregistrées</span>}
          {id !== null && (
            <span className="form__footer-end">
              <ConfirmButton
                label="Supprimer"
                confirmLabel="Confirmer la suppression"
                onConfirm={async () => {
                  try {
                    await remove.mutateAsync(row!.id as string | number);
                    toast('Supprimé.');
                    navigate(`/contenu/${def.slug}`);
                  } catch (e) {
                    setError(friendlyError(e));
                  }
                }}
              />
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

interface ControlProps {
  def: CollectionDef;
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  isNew: boolean;
  options: { categories: Record<string, unknown>[]; groups: Record<string, unknown>[]; amenities: Record<string, unknown>[] };
}

function FieldControl({ def, field, value, onChange, error, isNew, options }: ControlProps) {
  const id = `f-${field.key}`;
  const hint = 'hint' in field ? field.hint : undefined;
  const wrap = (control: React.ReactNode) => (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {field.label}
      </label>
      {control}
      {error ? <span className="field__error">{error}</span> : hint && <span className="field__hint">{hint}</span>}
    </div>
  );

  switch (field.kind) {
    case 'slug':
      return wrap(
        <input id={id} value={value as string} disabled={!isNew} onChange={(e) => onChange(e.target.value.toLowerCase())} />
      );
    case 'text':
      return wrap(<input id={id} value={value as string} maxLength={field.maxLength} onChange={(e) => onChange(e.target.value)} />);
    case 'int':
      return wrap(
        <span className="input-suffix">
          <input id={id} inputMode="numeric" value={value as string} onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ''))} />
          {field.suffix && <span>{field.suffix}</span>}
        </span>
      );
    case 'bool':
      return (
        <div className="field">
          <label className="checkbox">
            <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
            {field.label}
          </label>
          {hint && <span className="field__hint">{hint}</span>}
        </div>
      );
    case 'i18n':
      return (
        <I18nInput id={id} label={field.label} hint={hint} value={value as I18nForm} onChange={onChange} multiline={field.multiline} rows={field.rows} error={error} />
      );
    case 'i18nList':
      return <I18nListInput label={field.label} hint={hint} value={value as I18nForm[]} onChange={onChange} error={error} />;
    case 'image':
      return <ImageInput id={id} label={field.label} hint={hint} value={value as string} onChange={onChange} folder={def.table} error={error} />;
    case 'images':
      return <ImageListInput label={field.label} hint={hint} value={value as string[]} onChange={onChange} folder={def.table} error={error} />;
    case 'select':
      return wrap(
        <select id={id} value={value as string} onChange={(e) => onChange(e.target.value)}>
          <option value="">— choisir —</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'icon':
      return wrap(
        <select id={id} value={value as string} onChange={(e) => onChange(e.target.value)}>
          <option value="">— choisir —</option>
          {SITE_ICONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      );
    case 'ref': {
      const rows = field.table === 'benefit_groups' ? options.groups : options.categories;
      return wrap(
        <select id={id} value={value as string} onChange={(e) => onChange(e.target.value)}>
          <option value="">— choisir —</option>
          {rows.map((r) => (
            <option key={String(r.id)} value={String(r.id)}>
              {refLabel(r)}
              {r.published === false ? ' (brouillon)' : ''}
            </option>
          ))}
        </select>
      );
    }
    case 'amenities': {
      const selected = new Set(value as string[]);
      const toggle = (amenityId: string) => {
        const next = new Set(selected);
        if (next.has(amenityId)) next.delete(amenityId);
        else next.add(amenityId);
        // Keep the order of the amenities list.
        onChange(options.amenities.map((a) => String(a.id)).filter((a) => next.has(a)));
      };
      return (
        <fieldset className={`field${error ? ' field--error' : ''}`}>
          <legend className="field__label">
            {field.label} <span className="muted">({selected.size})</span>
          </legend>
          <div className="checkbox-grid">
            {options.amenities.map((a) => (
              <label key={String(a.id)} className="checkbox">
                <input type="checkbox" checked={selected.has(String(a.id))} onChange={() => toggle(String(a.id))} />
                {frText(a.label)}
                {a.published === false && <span className="muted"> (masqué)</span>}
              </label>
            ))}
          </div>
          {error && <span className="field__error">{error}</span>}
        </fieldset>
      );
    }
    case 'pricing':
      return <PricingInput label={field.label} value={value as PricingForm} onChange={onChange} error={error} />;
  }
}
