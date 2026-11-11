---
name: handoff
description: >-
  Regrava docs/handoff.md para continuar o trabalho num chat novo, sem levar
  o histórico. Use quando o fellow for abrir outro chat ou quando a conversa
  estiver longa e o próximo passo já estiver claro. Não comece feature nova.
---

# Handoff

Regrave `docs/handoff.md`. Um arquivo só. No máximo 60 linhas. Sem código, sem colar diff.

```md
# Handoff

- **Branch:** ana/feat/notebooks-list
- **Objetivo:** lista de cadernos com criar, favoritar e a quantidade de notas
- **Plano:** docs/plans/caderno.md — aceito
- **Feito:** schema em supabase/schema.sql; cascas das três telas
- **Falta:** notebooks.service.ts; hooks; ligar NotebooksPage; review; PR
- **Próximo passo:** criar o service de cadernos imitando o perfil, com notes(count)
- **Abrir só:**
  - docs/ficha-tecnica.md
  - docs/plans/caderno.md
  - src/services/profile.service.ts
  - src/lib/queryKeys.ts
```

O próximo passo é uma frase e uma skill. A lista "Abrir só" tem os arquivos que essa frase precisa, mais o plano.

No fim, entregue este prompt:

```txt
Continua o caderno a partir de docs/handoff.md.
Faz só o próximo passo.
```

## Qualidade

A seção Handoff de `docs/qualidade.md` passa inteira. Se passar de 60 linhas, corte. Não implemente o próximo passo nesta skill.
