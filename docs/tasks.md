# Entrega

Ordem fechada. A primeira tarefa é sua: ter o seu repositório e conectar o Supabase. As seguintes são uma branch cada, a partir da sua `main` atualizada, e só começam quando a anterior já está nessa `main`.

O repositório da turma, `Alexandremma/dfl-journal`, é o ponto de partida. O fork, os commits e os pull requests ficam no seu GitHub. A base do pull request é a sua `main`. Se o GitHub sugerir `Alexandremma/dfl-journal` como destino, troque para o seu repositório.

O comportamento de cada tela está em `docs/ficha-tecnica.md`. A régua está em `docs/qualidade.md`. O plano aceito está em `docs/plans/caderno.md`. Este arquivo diz a ordem, os arquivos da branch e o que fecha cada passo.

Não reescreva `supabase/schema.sql`, `profiles` nem o trigger de signup. Não junte duas tarefas no mesmo pull request. O diff mostra os arquivos de "Nesta branch" e não mostra os de "Fora desta branch".

## 1. O seu repositório e o Supabase

Esta tarefa não vira commit de código. O `.env` fica na sua máquina.

1. Abra [github.com/Alexandremma/dfl-journal](https://github.com/Alexandremma/dfl-journal) e faça um fork para a sua conta.
2. Clone o seu fork. Os próximos pull requests abrem nele.
3. Crie uma conta e um projeto gratuito em [supabase.com](https://supabase.com).
4. Em Authentication → Providers → Email, desligue **Confirm email**.
5. Em Project Settings → API, copie a URL do projeto e a chave **anon**.
6. Na raiz do repositório:

```bash
cp .env.example .env
```

Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A chave `service_role` não entra nesse arquivo.

7. No SQL Editor, cole e rode `supabase/schema.sql`.
8. Suba o app:

```bash
npm install
npm run dev
```

9. Abra [http://localhost:5173/login](http://localhost:5173/login), crie uma conta e entre.

Pronto quando:

- A home de cadernos abre vazia.
- Em Ajustes, um nome só com espaços não salva. Com nome preenchido, o botão mostra "Salvando…" e, depois do refresh, nome e tema continuam.
- No Table Editor existem `profiles`, `notebooks`, `notes` e `tasks`, e a sua linha está em `profiles`.
- `git status` não lista `.env`.
- O remote que recebe o push é o seu fork.

## 2. Cadernos: lista, criar e favoritar

Peça: "Liga a lista de cadernos, com criar, favoritar, filtro de favoritos e a quantidade de notas."

Branch: `<usuario>/feat/notebooks-list`, a partir da sua `main`.

### Nesta branch

- `src/types/notebook.ts`
- `src/services/notebooks.service.ts`, exportado em `src/services/index.ts`
- `queryKeys.notebooks` em `src/lib/queryKeys.ts`
- `useGetNotebooks`, `useCreateNotebook`, `useToggleNotebookFavorite`, exportados em `src/hooks/index.ts`
- `NotebooksPage`

### Fora desta branch

Renomear, apagar, nota e tarefa. Nenhum arquivo em `src/types/note.ts`, `src/types/task.ts`, `src/services/notes.service.ts` ou `src/services/tasks.service.ts`.

### Passos

1. O tipo `Notebook` leva `id`, `title`, `isFavorite`, `notesCount`, `createdAt` e `updatedAt`.
2. No service, `getNotebooks`, `createNotebook` e `setNotebookFavorite`. O GET pede as colunas pelo nome e `notes(count)` na mesma query, ordena `updated_at` descendente e filtra `is_favorite` quando a tela pede só favoritos. O insert manda `user_id` de `currentUserId()`. O título passa por `trim`; vazio vira `throw`. O service não envia `updated_at`. Erro do Supabase vira `throw new Error(...)`.
3. A key é `queryKeys.notebooks.list(favoritesOnly)`, no formato `['notebooks', { favoritesOnly }]`.
4. `useGetNotebooks` usa `enabled` com a sessão, como o perfil. Criar e favoritar chamam o service e invalidam o prefixo `['notebooks']`.
5. A página importa os hooks. Não importa service nem o client. O título vazio deixa o botão desabilitado. `reset()` roda antes do `mutate`. Enquanto `isPending`, o botão mostra "Salvando…" e fica desabilitado. O filtro fica na URL (`?favoritos=1`). Lista vazia e filtro sem resultado têm textos diferentes. Há carregando e erro com "Tentar de novo".

### Conferir

- Criar um caderno grava e o card aparece com quantidade 0.
- Favoritar e desfavoritar sobrevivem ao refresh.
- `?favoritos=1` mostra só os favoritos e continua depois do refresh.
- Lista vazia e filtro sem resultado têm textos diferentes.
- Carregando, erro com "Tentar de novo" e `npm run check` limpo.
- O pull request está no seu repositório e marca só esta parte do roteiro.

## 3. Cadernos: renomear e apagar

Peça: "Renomeia e apaga caderno, com confirmação."

Branch: `<usuario>/feat/notebooks-edit`, a partir da sua `main`, depois que a tarefa 2 já está nela.

### Nesta branch

- `updateNotebook` e `deleteNotebook` em `src/services/notebooks.service.ts`
- `useUpdateNotebook` e `useDeleteNotebook`
- o uso desses hooks em `NotebooksPage`

### Fora desta branch

Nota, tarefa e qualquer key nova. A invalidação continua no prefixo `['notebooks']`.

### Passos

1. `updateNotebook` faz `trim` no título, recusa título vazio e não envia `updated_at`.
2. `deleteNotebook` apaga a linha do caderno. As notas saem pelo cascade do schema.
3. Os dois hooks invalidam o prefixo `['notebooks']`.
4. Na página, renomear grava o título sem espaços nas pontas. Apagar pede confirmação. Cancelar não chama o service. `reset()` roda antes de cada `mutate`. Enquanto `isPending`, o botão mostra "Salvando…" ou "Apagando…" e fica desabilitado.

### Conferir

- Renomear grava o título sem espaços nas pontas e recusa título vazio.
- Apagar pede confirmação. Cancelar não chama o service.
- Apagar tira o card da lista.
- `npm run check` limpo.
- O diff não traz arquivo de nota nem de tarefa.

## 4. Notas do caderno

Peça: "Liga as notas do caderno, paginadas, com busca, favorito, editar e apagar."

Branch: `<usuario>/feat/notes-list`, a partir da sua `main`, depois que a tarefa 3 já está nela.

### Nesta branch

- `src/types/note.ts`
- `src/services/notes.service.ts`, exportado no barrel
- `queryKeys.notes.byNotebook(notebookId, page, query)` e `queryKeys.notes.byId(id)`
- `useGetNotes`, `useCreateNote`, `useUpdateNote`, `useDeleteNote`, `useToggleNoteFavorite`
- `NotebookNotesPage`

### Fora desta branch

Tarefa. Nenhum arquivo `src/types/task.ts`, `src/services/tasks.service.ts`, `useGetTasks`, `useCreateTask` ou `useToggleTask`. A nota aberta continua casca.

### Passos

1. O tipo `Note` leva `id`, `notebookId`, `title`, `body`, `isFavorite`, `createdAt` e `updatedAt`.
2. No service: listar, criar, editar, apagar e favoritar. O GET pede `count: 'exact'`, ordena `updated_at` descendente e usa `range` com `pageSize`. A busca é `ilike` no título, só quando o texto, sem espaços nas pontas, não é vazio. O insert manda `notebook_id` e `user_id` de `currentUserId()`. Título passa por `trim`; vazio vira `throw`. O texto da nota pode ir vazio. O service não envia `updated_at`.
3. As keys seguem a ficha: `['notes', { notebookId, page, query }]` e `['notes', id]`. Sem busca, `query` é `''`. Sem `page` na URL, a página é `1`.
4. `useGetNotes` usa `enabled: Boolean(notebookId)`. Criar ou apagar invalida `['notes', { notebookId }]` e também `['notebooks']`, porque a quantidade do card muda. Editar invalida as notas daquele caderno e `queryKeys.notes.byId(id)`. Favoritar invalida as notas daquele caderno e `queryKeys.notes.byId(id)`, e não invalida cadernos.
5. A página lê `page` e `q` da URL. Mudar a busca volta para a página 1. `page` ausente ou inválido mostra a página 1. Página além do fim mostra a última que ainda tem nota. Apagar a última nota de uma página maior que 1 volta para a página anterior, com confirmação. Cancelar não chama o service. Caderno sem nota e busca sem resultado têm textos diferentes. Caderno que não existe ou não é da conta mostra mensagem e volta para `/`. São 5 notas por página, com anterior, próxima e "página 2 de N". Na ponta, o botão sem destino fica desabilitado. `reset()` roda antes do `mutate`. Enquanto `isPending`, o botão mostra "Salvando…" e fica desabilitado.

### Conferir

- Seis notas aparecem em duas páginas, 5 e 1. A página 2 continua depois do refresh (`?page=2`).
- Buscar um título volta para a página 1 dos resultados (`?q=`).
- `page` ausente ou inválido mostra a página 1. Página além do fim mostra a última que ainda tem nota.
- Apagar a última nota de uma página maior que 1 volta para a página anterior, com confirmação.
- Caderno sem nota e busca sem resultado têm textos diferentes.
- Caderno que não existe ou não é da conta mostra mensagem e volta para `/`.
- O card do caderno passa a contar as notas.
- `npm run check` limpo.
- O diff não traz tarefa.

## 5. Nota aberta e tarefas

Peça: "Liga a nota aberta e as tarefas: editar o texto, favoritar, apagar a nota, criar tarefa e marcar como feita."

Branch: `<usuario>/feat/note-tasks`, a partir da sua `main`, depois que a tarefa 4 já está nela.

### Nesta branch

- `src/types/task.ts`
- `src/services/tasks.service.ts`, exportado no barrel
- `queryKeys.tasks.byNote(noteId)`
- `useGetNote`, `useGetTasks`, `useCreateTask`, `useToggleTask`
- `NotePage`, reusando `useUpdateNote`, `useDeleteNote` e `useToggleNoteFavorite`

### Fora desta branch

Um segundo service de nota. Editar ou apagar o título de uma tarefa. Favorito em tarefa. Paginação da checklist.

### Passos

1. O tipo `Task` leva `id`, `noteId`, `title`, `isDone` e `createdAt`.
2. No service de tarefa: listar, criar e marcar. O GET ordena `created_at` ascendente, `order('created_at', { ascending: true })`. O insert manda `note_id` e `user_id` de `currentUserId()`. Título passa por `trim`; vazio vira `throw`.
3. A key é `queryKeys.tasks.byNote(noteId)`, no formato `['tasks', { noteId }]`.
4. `useGetNote` usa `enabled: Boolean(notebookId)` e o id da nota. `useGetTasks` usa `enabled: Boolean(noteId)`. Criar ou marcar tarefa invalida `queryKeys.tasks.byNote(noteId)`.
5. A página reusa os hooks de editar, apagar e favoritar nota. Favoritar a nota invalida a nota e a lista do caderno, e não invalida `['notebooks']`. Apagar a nota pede confirmação, volta para a lista do caderno e leva as tarefas pelo cascade. Nota que não existe, não é da conta, ou não pertence àquele caderno mostra mensagem e volta para a lista do caderno. `reset()` roda antes do `mutate`. Enquanto `isPending`, o botão mostra "Salvando…" e fica desabilitado.

### Conferir

- Editar título e texto sobrevive ao refresh. Título vazio, depois do trim, não grava.
- Favoritar a nota atualiza a nota e a lista do caderno, e a quantidade do card não muda.
- Apagar a nota pede confirmação, volta para a lista do caderno e leva as tarefas junto.
- Criar duas tarefas e marcar uma como feita sobrevive ao refresh, na ordem em que foram criadas.
- Nota que não existe, não é da conta, ou não pertence àquele caderno mostra mensagem e volta para a lista do caderno.
- `npm run check` limpo.

## 6. Fechar a entrega

Com as quatro fatias na sua `main`, percorra o roteiro de `docs/ficha-tecnica.md` numa conta só e depois numa segunda conta.

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
