-- TEXTOS DO /edit — uma linha por salvamento, 24-09.
-- A mais nova por `page_key` é a publicada; as outras são o histórico.
create table if not exists public.page_copy_versions (
  id bigint generated always as identity primary key,
  page_key text not null,
  copy jsonb not null,
  source text not null default 'editor',
  created_at timestamptz not null default now()
);

create index if not exists page_copy_versions_latest
  on public.page_copy_versions (page_key, created_at desc, id desc);

-- RLS ligado e SEM policy: só a secret key (que ignora RLS) lê e grava.
-- A publishable key, que é pública, não enxerga esta tabela.
alter table public.page_copy_versions enable row level security;
