# Plano — caderno (aceito)

Escopo aceito. O produto está em `docs/ficha-tecnica.md`. O schema de `notebooks`, `notes` e `tasks` já está em `supabase/schema.sql`. Não reescreva essas tabelas, nem `profiles`, nem o trigger de signup.

A entrega do aluno é type, service, hook e página. As três telas já existem em casca.

## Tabelas

Quem lê e escreve: só o dono, `user_id = auth.uid()`. Em `notes`, o caderno pai é do mesmo usuário. Em `tasks`, a nota pai é do mesmo usuário.

`notebooks`: `id`, `user_id`, `title`, `is_favorite`, `created_at`, `updated_at`.

`notes`: `id`, `notebook_id`, `user_id`, `title`, `body`, `is_favorite`, `created_at`, `updated_at`.

`tasks`: `id`, `note_id`, `user_id`, `title`, `is_done`, `created_at`.

Apagar o caderno apaga as notas. Apagar a nota apaga as tarefas. `updated_at` muda por trigger. O service não envia `updated_at`.

## Rotas

- `/` — cadernos
- `/notebooks/:notebookId` — notas paginadas desse caderno
- `/notebooks/:notebookId/notes/:noteId` — nota e tarefas
- `/login` e `/settings` — prontas

Paths em `src/consts/routes.ts`. Tamanho da página em `src/consts/pagination.ts` (`pageSize`, 5).

## Arquivos

Já existem, em casca: `NotebooksPage.tsx`, `NotebookNotesPage.tsx`, `NotePage.tsx`.

Ainda criar:

- `src/types/notebook.ts`
- `src/types/note.ts`
- `src/types/task.ts`
- `src/services/notebooks.service.ts`
- `src/services/notes.service.ts`
- `src/services/tasks.service.ts`
- `src/hooks/useGetNotebooks.ts`
- `src/hooks/useCreateNotebook.ts`
- `src/hooks/useUpdateNotebook.ts`
- `src/hooks/useDeleteNotebook.ts`
- `src/hooks/useToggleNotebookFavorite.ts`
- `src/hooks/useGetNotes.ts`
- `src/hooks/useGetNote.ts`
- `src/hooks/useCreateNote.ts`
- `src/hooks/useUpdateNote.ts`
- `src/hooks/useDeleteNote.ts`
- `src/hooks/useToggleNoteFavorite.ts`
- `src/hooks/useGetTasks.ts`
- `src/hooks/useCreateTask.ts`
- `src/hooks/useToggleTask.ts`

A key entra em `src/lib/queryKeys.ts`, estendendo o factory. Não crie uma segunda key para o mesmo dado.

## Query keys

- `queryKeys.notebooks.list(favoritesOnly)` → `['notebooks', { favoritesOnly }]`
- `queryKeys.notes.byNotebook(notebookId, page, query)` → `['notes', { notebookId, page, query }]`
- `queryKeys.notes.byId(id)` → `['notes', id]`
- `queryKeys.tasks.byNote(noteId)` → `['tasks', { noteId }]`

`query` vazio é `''`. Página 1 é `1`.

## Mutations

- Criar, renomear, apagar ou favoritar caderno invalida o prefixo `['notebooks']`.
- Criar, editar, apagar ou favoritar nota invalida `['notes', { notebookId }]`, que cobre página e busca. Editar, apagar ou favoritar também invalida `queryKeys.notes.byId(id)`.
- Criar ou apagar nota invalida `['notebooks']`, porque o card mostra a quantidade.
- Criar ou marcar tarefa invalida `queryKeys.tasks.byNote(noteId)`.

Não existe key nova para "a versão atualizada".

## Contagem e página

O GET de cadernos pede a quantidade de notas na mesma query, pelo relacionamento: `notes(count)`. O mapper lê esse número. Não faz uma query por card.

O GET de notas usa `count: 'exact'`, `order` por `updated_at` descendente e `range` com `pageSize`. A busca por título é `ilike` só quando o texto, sem espaços nas pontas, não é vazio.

## Fora de escopo

- Reescrever o schema ou inventar coluna.
- Paginação infinita, tags, anexos, tempo real, compartilhar caderno.
- Editar ou apagar o título de uma tarefa.
- Filtrar notas favoritas.

Aceito. Schema pronto no starter. A entrega do aluno é service, hook e página.
