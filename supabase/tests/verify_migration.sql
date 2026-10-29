-- Run as the database administrator. All test data is rolled back.
begin;
select set_config('test.member_id', gen_random_uuid()::text, true);
select set_config('test.outsider_id', gen_random_uuid()::text, true);
insert into auth.users(id,email) values
 (current_setting('test.member_id')::uuid,'migration-member@example.invalid'),
 (current_setting('test.outsider_id')::uuid,'migration-outsider@example.invalid');
insert into public.estoque_membros(user_id) values(current_setting('test.member_id')::uuid);
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.member_id'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare p uuid; initial_count integer; actual_count integer;
begin
 insert into public.produtos(nome,tipo,quantidade) values('Teste transacional','toner',10) returning id into p;
 perform public.registrar_movimentacao(p,'saida',3,'teste');
 if (select quantidade from public.produtos where id=p) <> 7 then raise exception 'Saldo incorreto'; end if;
 select count(*) into initial_count from public.movimentacoes where produto_id=p;
 begin
  perform public.registrar_movimentacao(p,'saida',100,'falha esperada');
  raise exception 'Teste falhou: saída excedente aceita';
 exception when others then
  if sqlerrm <> 'Estoque insuficiente' then raise; end if;
 end;
 select count(*) into actual_count from public.movimentacoes where produto_id=p;
 if actual_count <> initial_count or (select quantidade from public.produtos where id=p) <> 7 then
  raise exception 'Falha alterou saldo ou histórico';
 end if;
 begin
  perform public.registrar_movimentacao(p,'entrada',-1,'inválida');
  raise exception 'Teste falhou: quantidade negativa aceita';
 exception when others then
  if sqlerrm <> 'Movimentação inválida' then raise; end if;
 end;
 insert into public.movimentacoes(produto_id,tipo,quantidade) values(p,'entrada',2);
 if (select quantidade from public.produtos where id=p) <> 9 then raise exception 'INSERT direto não atualizou saldo'; end if;
 begin
  delete from public.movimentacoes where produto_id=p;
  raise exception 'Teste falhou: histórico apagado';
 exception when insufficient_privilege then null;
 end;
end;
$$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.outsider_id'),'role','authenticated')::text,true);
do $$
begin
 if exists(select 1 from public.produtos) or exists(select 1 from public.impressoras) or exists(select 1 from public.movimentacoes) then
  raise exception 'Usuário não autorizado acessou dados';
 end if;
 begin
  insert into public.produtos(nome,quantidade) values('Não autorizado',0);
  raise exception 'Teste falhou: usuário não autorizado inseriu produto';
 exception when insufficient_privilege then null;
 end;
 begin
  insert into public.estoque_membros(user_id) values(current_setting('test.outsider_id')::uuid);
  raise exception 'Teste falhou: usuário concedeu acesso a si mesmo';
 exception when insufficient_privilege then null;
 end;
end;
$$;
set local role anon;
do $$
begin
 begin
  perform id from public.produtos;
  raise exception 'Teste falhou: acesso anônimo permitido';
 exception when insufficient_privilege then null;
 end;
end;
$$;
reset role;
rollback;
select 'PASS: saldo, rollback, validação, INSERT direto, histórico, RLS e acesso anônimo' as result;
