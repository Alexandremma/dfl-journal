---
name: schema-rls
description: >-
  Protege o schema já aceito do caderno. Use quando o pedido for tabela,
  policy, RLS ou coluna de notebooks, notes, tasks ou profiles. Não reescreva
  supabase/schema.sql.
---

# Schema e RLS

`notebooks`, `notes`, `tasks` e `profiles` já estão em `supabase/schema.sql`, com RLS, cascade e a trigger de `updated_at`. O aluno cola esse arquivo no SQL Editor.

1. Leia `docs/ficha-tecnica.md` e o schema atual.
2. Não edite `supabase/schema.sql` para o caderno. Não crie outra migration. Não crie `seed.sql`. Não insira usuário fixo.
3. Não altere `profiles` nem o trigger em `auth.users`.
4. Se o pedido pede coluna, tabela ou policy que a ficha não tem, pare e diga que isso muda o escopo aceito.

Tabela de uma feature nova, com plano aceito que não é o caderno, segue a seção Schema de `docs/qualidade.md`: SQL idempotente, RLS, quatro policies, `auth.uid()`.

## Qualidade

A seção Schema de `docs/qualidade.md` passa inteira. Se o diff reescreve o schema do caderno, reverta antes de seguir para o service.
