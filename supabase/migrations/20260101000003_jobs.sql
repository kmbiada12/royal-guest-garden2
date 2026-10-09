-- =====================================================================
-- Royal Guest Garden 2 — 0004 Scheduled jobs (pg_cron)
-- Audit entries older than 24 months are deleted daily.
-- =====================================================================

create or replace function public.purge_audit_log(retention interval default interval '24 months')
returns bigint
security definer set search_path = public
language plpgsql as $$
declare
  deleted bigint;
begin
  delete from public.audit_log where created_at < now() - retention;
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke execute on function public.purge_audit_log(interval) from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.schedule(
  'purge-audit-log',
  '30 3 * * *', -- daily, 03:30 UTC (04:30 Africa/Douala)
  $$select public.purge_audit_log()$$
);
