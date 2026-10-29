-- Preserve existing records. This migration also supports a fresh project.
create table if not exists public.produtos (
 id uuid primary key default gen_random_uuid(), nome text not null,
 created_at timestamp default now(), quantidade integer default 0,
 codigo text, tipo text, imagem_url text, observacao text
);
create table if not exists public.impressoras (
 id uuid primary key default gen_random_uuid(), model text, serial_number text,
 counter integer, observation text, created_at timestamp default now()
);
create table if not exists public.movimentacoes (
 id uuid primary key default gen_random_uuid(), produto_id uuid not null references public.produtos(id),
 tipo text not null check (tipo in ('entrada','saida')),
 quantidade integer not null check (quantidade > 0), observacao text,
 created_at timestamptz default now()
);
create table public.estoque_membros (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.estoque_membros enable row level security;
revoke all on public.estoque_membros from anon, authenticated;
grant select on public.estoque_membros to authenticated;
create policy membro_consulta_propria on public.estoque_membros for select to authenticated
 using (user_id = (select auth.uid()));

alter table public.produtos enable row level security;
alter table public.impressoras enable row level security;
alter table public.movimentacoes enable row level security;
revoke all on public.produtos, public.impressoras, public.movimentacoes from anon;
grant select, insert, update, delete on public.produtos, public.impressoras to authenticated;
revoke all on public.movimentacoes from authenticated;
grant select, insert on public.movimentacoes to authenticated;
create policy membros_produtos on public.produtos for all to authenticated
 using (exists (select 1 from public.estoque_membros))
 with check (exists (select 1 from public.estoque_membros));
create policy membros_impressoras on public.impressoras for all to authenticated
 using (exists (select 1 from public.estoque_membros))
 with check (exists (select 1 from public.estoque_membros));
create policy membros_leem_movimentacoes on public.movimentacoes for select to authenticated
 using (exists (select 1 from public.estoque_membros));
create policy membros_criam_movimentacoes on public.movimentacoes for insert to authenticated
 with check (exists (select 1 from public.estoque_membros));

alter table public.produtos add constraint quantidade_nao_negativa check (quantidade >= 0);
alter table public.impressoras add constraint contador_nao_negativo check (counter >= 0);
create index if not exists movimentacoes_produto_id_idx on public.movimentacoes(produto_id);

-- The trigger covers RPC calls and direct INSERTs equally, in one transaction.
create function public.aplicar_movimentacao() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare saldo integer;
begin
 if new.tipo is null or new.tipo not in ('entrada','saida') or new.quantidade is null or new.quantidade <= 0 then
  raise exception 'Movimentação inválida';
 end if;
 select quantidade into saldo from public.produtos where id = new.produto_id for update;
 if not found then raise exception 'Produto não encontrado ou acesso não autorizado'; end if;
 saldo := coalesce(saldo, 0) + case when new.tipo = 'entrada' then new.quantidade else -new.quantidade end;
 if saldo < 0 then raise exception 'Estoque insuficiente'; end if;
 update public.produtos set quantidade = saldo where id = new.produto_id;
 return new;
end;
$$;
revoke all on function public.aplicar_movimentacao() from public, anon, authenticated;
create trigger atualizar_saldo_movimentacao before insert on public.movimentacoes
 for each row execute function public.aplicar_movimentacao();

create function public.registrar_movimentacao(p_produto_id uuid, p_tipo text, p_quantidade integer, p_observacao text default '')
returns uuid language plpgsql security invoker set search_path = '' as $$
declare movimento_id uuid;
begin
 if auth.uid() is null or not exists (select 1 from public.estoque_membros) then
  raise exception 'Acesso não autorizado';
 end if;
 insert into public.movimentacoes(produto_id,tipo,quantidade,observacao)
 values (p_produto_id,p_tipo,p_quantidade,p_observacao) returning id into movimento_id;
 return movimento_id;
end;
$$;
revoke all on function public.registrar_movimentacao(uuid,text,integer,text) from public, anon;
grant execute on function public.registrar_movimentacao(uuid,text,integer,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values ('product-images','product-images',false,5242880,array['image/jpeg','image/png','image/webp']);
create policy membros_leem_imagens on storage.objects for select to authenticated
 using (bucket_id = 'product-images' and exists (select 1 from public.estoque_membros));
create policy membros_enviam_imagens on storage.objects for insert to authenticated
 with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text
 and exists (select 1 from public.estoque_membros));
-- Preserve legacy image URLs, but stop unauthenticated uploads to the legacy bucket.
drop policy if exists "Allow public upload 1ifiba2_0" on storage.objects;
