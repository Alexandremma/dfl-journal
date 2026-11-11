---
name: handoff
description: >-
  Regrava docs/handoff.md para continuar o trabalho num chat novo, sem levar
  o histórico. Use quando a pessoa for abrir outro chat ou quando a conversa
  estiver longa e o próximo passo já estiver claro. Não comece feature nova.
---

# Handoff

Regrave `docs/handoff.md`. Um arquivo só. No máximo 60 linhas. Sem código, sem colar diff.

```md
# Handoff

- **Branch:** <usuario>/<tipo>/<descricao>
- **Objetivo:** uma frase, a fatia atual
- **Plano:** docs/plans/<slug>.md — aceito ou aguardando aceite
- **Feito:** o que já está na branch
- **Falta:** o que a fatia ainda pede
- **Próximo passo:** uma frase e uma skill
- **Abrir só:**
  - o plano aceito
  - a régua de qualidade
  - o arquivo ouro da próxima skill
```

O próximo passo é uma frase e uma skill. A lista "Abrir só" tem os arquivos que essa frase precisa, mais o plano.

No fim, entregue este prompt:

```txt
Continua a partir de docs/handoff.md.
Faz só o próximo passo.
```

## Neste repositório

O plano do diário é `docs/plans/caderno.md`, aceito. A fatia atual sai de `docs/tasks.md`. Exemplo de objetivo: "lista de cadernos com criar, favoritar e a quantidade de notas". Exemplo de próximo passo: "criar o service de cadernos imitando o perfil".

## Qualidade

A seção Handoff de `docs/qualidade.md` passa inteira. Se passar de 60 linhas, corte. Não implemente o próximo passo nesta skill.
