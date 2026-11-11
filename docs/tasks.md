# Entrega

Ordem fechada. A primeira tarefa é sua: conectar o Supabase. As seguintes são uma branch cada, a partir da `main` atualizada, e só começam quando a anterior já está na `main`.

O comportamento de cada tela está em `docs/ficha-tecnica.md`. A régua está em `docs/qualidade.md`. O plano aceito está em `docs/plans/caderno.md`. Este arquivo só diz a ordem e o que fecha cada passo.

Não reescreva `supabase/schema.sql`, `profiles` nem o trigger de signup. Não junte duas tarefas no mesmo PR.

## 1. Conectar o Supabase

Esta tarefa não vira commit. O `.env` fica na sua máquina.

1. Crie uma conta e um projeto gratuito em [supabase.com](https://supabase.com).
2. Em Authentication → Providers → Email, desligue **Confirm email**.
3. Em Project Settings → API, copie a URL do projeto e a chave **anon**.
4. Na raiz do repositório:

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A chave `service_role` não entra nesse arquivo.

5. No SQL Editor, cole e rode `supabase/schema.sql`.
6. Suba o app:

```bash
npm install
npm run dev
```

7. Abra [http://localhost:5173/login](http://localhost:5173/login), crie uma conta e entre.

Pronto quando:

- A home de cadernos abre vazia.
- Em Ajustes, um nome só com espaços não salva. Com nome preenchido, o botão mostra "Salvando…" e, depois do refresh, nome e tema continuam.
- No Table Editor existem `profiles`, `notebooks`, `notes` e `tasks`, e a sua linha está em `profiles`.
- `git status` não lista `.env`.

## 2. Cadernos: lista, criar e favoritar

Peça: "Liga a lista de cadernos, com criar, favoritar, filtro de favoritos e a quantidade de notas."

Branch: `<usuario>/feat/notebooks-list`.

Arquivos desta fatia:

- `src/types/notebook.ts`
- `src/services/notebooks.service.ts`
- `queryKeys.notebooks.list(favoritesOnly)` em `src/lib/queryKeys.ts`
- `useGetNotebooks`, `useCreateNotebook`, `useToggleNotebookFavorite`
- `NotebooksPage`

O GET pede `notes(count)` na mesma query. O insert manda `user_id` vindo de `currentUserId()` em `src/services/current-user.ts`. Título passa por `trim`; vazio não grava. A lista ordena do atualizado mais recente para o mais antigo. `useGetNotebooks` usa `enabled` com a sessão, como o perfil. A mutation chama `reset()` antes do `mutate` e invalida o prefixo `['notebooks']`.

Pronto quando:

- Criar um caderno grava e o card aparece com quantidade 0.
- Favoritar e desfavoritar sobrevivem ao refresh.
- `?favoritos=1` mostra só os favoritos e continua depois do refresh.
- Lista vazia e filtro sem resultado têm textos diferentes.
- Carregando, erro com "Tentar de novo" e `npm run check` limpo.
- O PR marca só esta parte do roteiro.

## 3. Cadernos: renomear e apagar

Peça: "Renomeia e apaga caderno, com confirmação."

Branch: `<usuario>/feat/notebooks-edit`.

Arquivos: `useUpdateNotebook`, `useDeleteNotebook`, e o uso deles em `NotebooksPage`.

Pronto quando:

- Renomear grava o título sem espaços nas pontas e recusa título vazio.
- Apagar pede confirmação. Cancelar não chama o service.
- Apagar tira o card da lista. A invalidação continua no prefixo `['notebooks']`.
- `npm run check` limpo.

## 4. Notas do caderno

Peça: "Liga as notas do caderno, paginadas, com busca, favorito, editar e apagar."

Branch: `<usuario>/feat/notes-list`.

Arquivos desta fatia:

- `src/types/note.ts`
- `src/services/notes.service.ts`
- `queryKeys.notes.byNotebook(notebookId, page, query)` e `queryKeys.notes.byId(id)`
- `useGetNotes`, `useCreateNote`, `useUpdateNote`, `useDeleteNote`, `useToggleNoteFavorite`
- `NotebookNotesPage`

O GET pede `count: 'exact'`, ordena `updated_at` descendente e usa `range` com `pageSize`. A busca é `ilike` no título, só quando o texto, sem espaços nas pontas, não é vazio. O insert manda `user_id` de `currentUserId()`. `useGetNotes` usa `enabled: Boolean(notebookId)`.

Criar ou apagar nota invalida `['notes', { notebookId }]` e também `['notebooks']`, porque a quantidade do card muda. Favoritar nota invalida as notas daquele caderno e `queryKeys.notes.byId(id)`. Favoritar nota não invalida cadernos.

Pronto quando:

- Seis notas aparecem em duas páginas, 5 e 1. A página 2 continua depois do refresh (`?page=2`).
- Buscar um título volta para a página 1 dos resultados (`?q=`).
- `page` ausente ou inválido mostra a página 1. Página além do fim mostra a última que ainda tem nota.
- Apagar a última nota de uma página maior que 1 volta para a página anterior, com confirmação.
- Caderno sem nota e busca sem resultado têm textos diferentes.
- Caderno que não existe ou não é da conta mostra mensagem e volta para `/`.
- O card do caderno passa a contar as notas.
- `npm run check` limpo.

## 5. Nota aberta e tarefas

Peça: "Liga a nota aberta e as tarefas: editar o texto, favoritar, apagar a nota, criar tarefa e marcar como feita."

Branch: `<usuario>/feat/note-tasks`.

Arquivos desta fatia:

- `src/types/task.ts`
- `src/services/tasks.service.ts`
- `queryKeys.tasks.byNote(noteId)`
- `useGetNote`, `useGetTasks`, `useCreateTask`, `useToggleTask`
- `NotePage`, reusando os hooks de editar, apagar e favoritar nota

O GET de tarefas ordena `created_at` ascendente: `order('created_at', { ascending: true })`. O insert manda `user_id` de `currentUserId()`. `useGetNote` usa `enabled: Boolean(notebookId)` e o id da nota. `useGetTasks` usa `enabled: Boolean(noteId)`. Criar ou marcar tarefa invalida `queryKeys.tasks.byNote(noteId)`. Não há editar nem apagar o título de uma tarefa.

Pronto quando:

- Editar título e texto sobrevive ao refresh. Título vazio, depois do trim, não grava.
- Favoritar a nota atualiza a nota e a lista do caderno, e a quantidade do card não muda.
- Apagar a nota pede confirmação, volta para a lista do caderno e leva as tarefas junto.
- Criar duas tarefas e marcar uma como feita sobrevive ao refresh, na ordem em que foram criadas.
- Nota que não existe, não é da conta, ou não pertence àquele caderno mostra mensagem e volta para a lista do caderno.
- `npm run check` limpo.

## 6. Fechar a entrega

Com as quatro fatias na `main`, percorra o roteiro de `docs/ficha-tecnica.md` numa conta só e depois numa segunda conta.

Pronto quando todos estes pontos são verdadeiros:

- Criar conta, entrar e ver cadernos vazios.
- Favoritar um caderno, ligar "só favoritos" e ver o filtro depois do refresh.
- Seis notas em duas páginas; a página 2 continua depois do refresh.
- A busca abre na página 1 dos resultados.
- Duas tarefas, uma marcada como feita, continuam depois do refresh.
- Apagar a nota remove as tarefas. Apagar o caderno remove as notas.
- As linhas aparecem no Table Editor.
- A outra conta vê a lista de cadernos vazia.
- O tema de Ajustes continua depois do refresh.
- Você explica, em voz alta, o caminho de favoritar uma nota: quais query keys são invalidadas e por que a outra conta não vê essa linha.
