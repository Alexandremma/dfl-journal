---
name: plan-feature
description: >-
  Escreve docs/plans/<slug>.md para uma feature ou tabela nova, fora do
  caderno, e para até o fellow aceitar. O diário já está aceito em
  docs/plans/caderno.md. Não implemente nesta skill.
---

# Plano da feature

O caderno (`notebooks`, `notes`, `tasks`) já está aceito. Se o pedido é lista, nota, tarefa, favorito ou paginação, não grave outro plano e não pare: use `new-service`, `new-query-hook`, `new-mutation-hook` ou `wire-page`. Não reescreva `supabase/schema.sql`.

Para uma entidade que a ficha não descreve:

1. Grave `docs/plans/<slug>.md` e pare. Sem código, sem branch de implementação, sem SQL aplicado.
2. Leia `docs/plans/profile.md` e copie o formato, não o conteúdo.
3. Escreva: tabelas e colunas com tipo, quem lê a linha, rotas, arquivos a criar, query keys, mutations e a key que cada uma invalida, fora de escopo com pelo menos dois itens.
4. A última linha é `Aguardando aceite`.

Implemente só depois de "aceito", "pode executar" ou "ok, executa". Se a resposta mudar coluna, rota ou escopo, regrave o plano e espere de novo.

Correção dentro de um plano já aceito não usa esta skill.

## Qualidade

A seção Plano de `docs/qualidade.md` passa inteira antes de você dizer que o plano está pronto.
