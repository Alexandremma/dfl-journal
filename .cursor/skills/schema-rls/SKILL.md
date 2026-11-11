---
name: schema-rls
description: >-
  Acrescenta tabela idempotente com RLS no schema do repositório, só de um
  plano já aceito. Não reescreva tabela que o plano manda preservar. No
  caderno, notebooks, notes, tasks e profiles já estão no schema: não os
  edite.
---

# Schema e RLS

Só rode com plano aceito. Edite o arquivo de schema do repositório. Não crie `seed.sql` e não insira usuário fixo.

1. Leia o plano aceito e o schema atual.
2. `create table if not exists` com as colunas do plano. A coluna do dono referencia o usuário autenticado.
3. Filho aponta para o pai com `on delete cascade` quando o plano diz que apagar o pai apaga o filho.
4. `enable row level security`.
5. Para cada ação (select, insert, update e delete): `drop policy if exists` e crie de novo. `USING` e `WITH CHECK` comparam o dono ao usuário autenticado.
6. Na policy do filho, o pai também é do mesmo usuário.
7. Não altere tabela nem trigger que o plano manda preservar.
8. Coluna, tabela ou policy que o plano não lista: pare e diga que isso muda o escopo aceito.

Quem for usar o projeto cola o arquivo no SQL Editor. O commit leva o SQL.

## Neste repositório

`notebooks`, `notes`, `tasks` e `profiles` já estão em `supabase/schema.sql`, com RLS, cascade e a trigger de `updated_at`. Não edite esse arquivo para o caderno. Não crie outra migration. Não altere `profiles` nem o trigger em `auth.users`. O aluno cola o arquivo no SQL Editor do projeto dele.

## Qualidade

A seção Schema de `docs/qualidade.md` passa inteira. Se o diff reescreve tabela preservada, reverta antes de seguir para o service. Se a régua do repositório for mais específica que esta skill, vale a régua.
