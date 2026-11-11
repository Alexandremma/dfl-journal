---
name: new-query-hook
description: >-
  Cria o hook useGet* e a query key de uma entidade já aceita no plano do
  caderno. Use para useGetNotebooks, useGetNotes, useGetNote e useGetTasks.
  Antes de criar, confira types, services, queryKeys e hooks para não duplicar
  key. Não crie mutation nem página.
---

# Hook de leitura

1. Liste o que já existe em `src/types/`, `src/services/`, `src/lib/queryKeys.ts` e `src/hooks/`.
2. Se a entidade não está num plano aceito, pare e pergunte. Cadernos, notas e tarefas já estão.
3. Se a key já existe, estenda o factory. Não crie uma segunda key para o mesmo dado.
4. Acrescente a key na forma da seção Cache de `docs/ficha-tecnica.md`:

- `queryKeys.notebooks.list(favoritesOnly)` → `['notebooks', { favoritesOnly }]`
- `queryKeys.notes.byNotebook(notebookId, page, query)` → `['notes', { notebookId, page, query }]`
- `queryKeys.notes.byId(id)` → `['notes', id]`
- `queryKeys.tasks.byNote(noteId)` → `['tasks', { noteId }]`

`query` vazio é `''`. Página 1 é `1`.

5. Crie `useGetNotebooks`, `useGetNotes`, `useGetNote` e `useGetTasks` imitando `useGetProfile`: `useQuery` com `queryKey` e `queryFn` chamando o service. Nome `useGet*`.
6. Hook que depende de sessão usa `enabled` com a sessão, como o perfil.

Não crie `useMutation` nesta skill.

## Qualidade

A seção Hook de leitura de `docs/qualidade.md` passa inteira. String solta na `queryKey` se corrige antes de seguir.
