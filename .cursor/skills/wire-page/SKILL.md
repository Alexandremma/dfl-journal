---
name: wire-page
description: >-
  Liga a página ao hook, com pending, erro com tentar de novo e empty. Use ao
  implementar NotebooksPage, NotebookNotesPage ou NotePage. A página não
  importa service nem o client do Supabase.
---

# Página

1. Leia `SettingsPage` e os componentes em `src/components/ui` (pending, erro, empty).
2. A página importa o hook. Não importa service nem `@/lib/supabase`.
3. Links e `navigate` usam `src/consts/routes.ts`. A lista de notas usa `pageSize` de `src/consts/pagination.ts`.
4. Três estados, sempre:
   - `isPending` → indicador de carregamento
   - `isError` → mensagem e botão "Tentar de novo" que chama `refetch`
   - lista vazia → empty state em português
5. Empty de "nenhum caderno" é diferente de "nenhum favorito". Empty de "nenhuma nota" é diferente de "busca sem resultado".
6. Filtro, página e busca vêm da URL: `favoritos=1` na home; `page` e `q` nas notas. Mudar `q` volta para a página 1. `page` ausente ou inválido mostra a página 1. Página além do fim mostra a última que ainda tem nota. Apagar a última nota de uma página maior que 1 volta para a página anterior.
7. Texto da interface em português. Identificadores em inglês.

Não busque dado novo aqui. Se falta um GET ou uma mutation, pare e use a skill do hook.

## Qualidade

A seção Página de `docs/qualidade.md` passa inteira.
