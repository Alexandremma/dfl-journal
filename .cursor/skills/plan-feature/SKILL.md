---
name: plan-feature
description: >-
  Escreve docs/plans/<slug>.md para uma entidade ou tabela nova e para até o
  aceite. Não implemente nesta skill. No caderno, notebooks, notes e tasks já
  estão aceitos: não grave outro plano para eles.
---

# Plano da feature

1. Se a entidade já está num plano aceito, não grave outro plano e não pare. Siga a skill da camada pedida.
2. Fora de um plano aceito, grave `docs/plans/<slug>.md` e pare. Sem código, sem branch de implementação, sem SQL aplicado.
3. Copie o formato de um plano que já existe no repositório, não o conteúdo.
4. Escreva: tabelas e colunas com tipo, quem lê a linha, rotas, arquivos a criar, query keys, mutations e a key que cada uma invalida, fora de escopo com pelo menos dois itens.
5. A última linha é `Aguardando aceite`.

Implemente só depois de "aceito", "pode executar" ou "ok, executa". Se a resposta mudar coluna, rota ou escopo, regrave o plano e espere de novo.

Correção dentro de um plano já aceito não usa esta skill.

## Neste repositório

`notebooks`, `notes` e `tasks` já estão aceitos em `docs/plans/caderno.md`. Pedido de lista, nota, tarefa, favorito ou paginação segue `new-service`, `new-query-hook`, `new-mutation-hook` ou `wire-page`. Não reescreva `supabase/schema.sql`. O formato para copiar está em `docs/plans/profile.md`.

## Qualidade

A seção Plano de `docs/qualidade.md` passa inteira antes de você dizer que o plano está pronto. Se a régua do repositório for mais específica que esta skill, vale a régua.
