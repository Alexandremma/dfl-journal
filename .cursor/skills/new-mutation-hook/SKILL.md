---
name: new-mutation-hook
description: >-
  Cria useMutation que grava pelo service e invalida as query keys da seção
  Cache da ficha. Use para criar, editar, apagar e favoritar caderno ou nota,
  e para criar ou marcar tarefa. Não invente query key nova.
---

# Hook de mutation

1. Leia o hook de GET da entidade e anote a key. A mutation invalida essa key, não uma nova.
2. Imite `useUpdateProfile`.
3. `useMutation` chama a função de escrita do service.
4. No sucesso, siga a seção Cache de `docs/ficha-tecnica.md`:
   - caderno invalida o prefixo `['notebooks']`
   - nota invalida `['notes', { notebookId }]`
   - editar, apagar ou favoritar nota também invalida `queryKeys.notes.byId(id)`
   - criar ou apagar nota também invalida `['notebooks']`
   - favoritar nota não invalida cadernos
   - tarefa invalida `queryKeys.tasks.byNote(noteId)`
5. Nomes: `useCreateNotebook`, `useUpdateNotebook`, `useDeleteNotebook`, `useToggleNotebookFavorite`, `useCreateNote`, `useUpdateNote`, `useDeleteNote`, `useToggleNoteFavorite`, `useCreateTask`, `useToggleTask`.

Não altere a página nesta skill.

## Qualidade

A seção Hook de mutation de `docs/qualidade.md` passa inteira. Se a `invalidateQueries` aponta para uma key que o GET não usa, troque pela key do GET.
