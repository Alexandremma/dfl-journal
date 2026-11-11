---
name: debug
description: >-
  Corrige um erro de tipo, lint ou do banco na camada dona do erro e roda o
  check de novo. Use quando o check falhar ou a tela não refletir o que foi
  gravado. Não reescreva a feature nem mude o plano aceito.
---

# Debug

1. Copie a mensagem de erro. Diga a camada dona: type, service, hook, página ou schema.
2. Corrija só essa causa. Um erro de permissão se investiga na policy e no id do dono gravado pelo service, não na página.
3. Rode o check do repositório de novo.
4. Se a correção exigir coluna, rota ou escopo diferentes do plano aceito, pare, regrave o plano e espere aceite. Não aproveite o erro para redesenhar a feature.

## Neste repositório

O check é `npm run check`. Erro de policy do Supabase se investiga no SQL e no `user_id` gravado pelo service. Não reescreva `supabase/schema.sql` para contornar o erro do caderno.

## Qualidade

A seção Debug de `docs/qualidade.md` passa inteira. A resposta mostra o erro original e o que mudou. Se a régua do repositório for mais específica que esta skill, vale a régua.
