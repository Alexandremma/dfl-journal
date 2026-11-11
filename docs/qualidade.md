# Qualidade

Lista canônica. Cada skill repete só a seção dela. Se uma skill e este arquivo
divergirem, vale este arquivo. O produto está em `docs/ficha-tecnica.md`. Se
este arquivo e a ficha divergirem no que a tela faz, vale a ficha.

Um item falho se corrige antes de seguir para a próxima skill. A IA não pede
para o fellow preencher isto à mão.

## Plano

- Um arquivo `docs/plans/<slug>.md` por feature. O diário já está aceito em `docs/plans/caderno.md`: `notebooks`, `notes` e `tasks` juntas.
- Tem tabelas e colunas com tipo, rotas, arquivos a criar, query keys, mutations e qual key cada mutation invalida.
- Diz quem pode ler a linha (o dono, via `auth.uid()`).
- Tem "fora de escopo" com pelo menos dois itens.
- Não traz código.
- Plano novo termina com "Aguardando aceite". A implementação não começa sem o aceite. O plano do caderno já foi aceito: service, hook e página seguem direto.

## Schema

- `notebooks`, `notes`, `tasks` e `profiles` já estão em `supabase/schema.sql`. Não se reescrevem. Não se inventa coluna.
- SQL idempotente (`create table if not exists`, `drop policy if exists` antes de criar).
- `enable row level security` na tabela nova.
- Quatro policies: select, insert, update, delete. `USING` e `WITH CHECK` com `auth.uid()`.
- `notes.notebook_id` referencia `notebooks` com `on delete cascade`, e a policy de nota exige que o caderno pai seja do mesmo usuário.
- `tasks.note_id` referencia `notes` com `on delete cascade`, e a policy de tarefa exige que a nota pai seja do mesmo usuário.
- `profiles` e o trigger de signup não são reescritos.
- Nenhum insert de usuário fixo.

## Service

- Arquivo em `src/services/`, sem import de React.
- Funções `async`. Mapper snake_case → camelCase no mesmo arquivo.
- Erro do Supabase vira `throw new Error(...)`.
- O dono vem de `currentUserId()` em `src/services/current-user.ts`. A função não recebe `userId` da página. O insert manda `user_id` com esse valor.
- A query pede as colunas pelo nome. Sem `select('*')` solto quando o mapper já lista os campos.
- Título de caderno, nota e tarefa passa por `trim`. Vazio vira `throw`. O service não grava `''`.
- O GET de cadernos pede `notes(count)` na mesma query. O mapper expõe a quantidade. Não faz uma query por card.
- O GET de notas pede `count: 'exact'`, ordena `updated_at` descendente e usa `range` com `pageSize` de `src/consts/pagination.ts`. `ilike` no título só quando a busca, sem espaços nas pontas, não é vazia.
- O GET de tarefas ordena `created_at` ascendente: `order('created_at', { ascending: true })`.
- O service não envia `updated_at`. A trigger do schema atualiza.

## Hook de leitura

- Antes de criar, lista o que já existe em `src/types/`, `src/services/`, `src/lib/queryKeys.ts` e `src/hooks/`.
- A key sai de `queryKeys`. String solta não passa.
- Key que já existe é estendida, não duplicada. A forma está na ficha, seção Cache.
- `useQuery` com `queryKey` e `queryFn`. `useGetProfile` e `useGetNotebooks` só buscam com sessão (`enabled`).
- `useGetNotes` e `useGetNote` usam `enabled: Boolean(notebookId)`. `useGetNote` também exige o id da nota.
- `useGetTasks` usa `enabled: Boolean(noteId)`.
- Cadernos: `queryKeys.notebooks.list(favoritesOnly)`.
- Notas do caderno: `queryKeys.notes.byNotebook(notebookId, page, query)`.
- Uma nota: `queryKeys.notes.byId(id)`.
- Tarefas: `queryKeys.tasks.byNote(noteId)`.
- Entidade que não está num plano aceito: para e pergunta.

## Hook de mutation

- `useMutation` chama o service e invalida a key do GET que a tela usa. Não cria uma key nova para "a versão atualizada".
- Criar, renomear, apagar ou favoritar caderno invalida o prefixo `['notebooks']`.
- Criar, editar, apagar ou favoritar nota invalida `['notes', { notebookId }]`. Editar, apagar ou favoritar também invalida `queryKeys.notes.byId(id)`.
- Criar ou apagar nota invalida `['notebooks']`, porque a quantidade no card muda. Favoritar nota não invalida cadernos.
- Criar ou marcar tarefa invalida `queryKeys.tasks.byNote(noteId)`.

## Página

- Importa hook. Não importa service nem `@/lib/supabase`.
- Path vem de `src/consts/routes.ts`.
- Trata `isPending`, `isError` com "Tentar de novo" (`refetch`) e empty quando a lista vem vazia.
- Texto da interface em português.
- Título de caderno, nota e tarefa é obrigatório depois do `trim`. O botão de criar fica desabilitado quando o título, sem espaços nas pontas, está vazio.
- Antes de `mutate`, a página chama `reset()` no hook de mutation. Enquanto `isPending`, o botão mostra "Salvando…" e fica desabilitado.
- Apagar caderno ou nota pede confirmação antes do `mutate`. Cancelar não chama o service.
- Filtro "só favoritos" na URL (`favoritos=1`). Página e busca das notas na URL (`page`, `q`). Mudar a busca volta para a página 1.
- `page` ausente ou inválido mostra a página 1. Página além do fim mostra a última que ainda tem nota.
- Apagar a última nota da página atual, se ela for maior que 1, volta para a página anterior.
- Empty de lista vazia é diferente de empty de filtro ou busca sem resultado.
- São `pageSize` notas por página, com anterior, próxima e "página 2 de N". Na ponta, o botão sem destino fica desabilitado.

## Diff, antes do PR

1. Página → hook → service.
2. Query key no factory, na forma da ficha. Path em `consts/routes.ts`.
3. Service `async`, sem React, com `throw`. Dono via `currentUserId()`. O insert manda `user_id`.
4. `isPending`, `isError` com ação, empty na lista.
5. Sem `any` desnecessário.
6. Diff dentro do plano aceito. Sem coluna nova e sem reescrever o schema.
7. `npm run check` limpo.
8. `.env` fora do stage. Nenhuma `service_role`.

## Pull request

- Título: `tipo(escopo): assunto no imperativo`, sem ponto final.
- Corpo com Summary, What was done e How to verify.
- How to verify marca só o que esta mudança cobre do roteiro da ficha: criar conta, favorito que sobrevive ao refresh, seis notas em duas páginas, busca, tarefa marcada, cascade ao apagar, Table Editor, outra conta com lista vazia, tema que sobrevive ao refresh.

## Git

- `git pull` na `main` antes de abrir `<usuario>/<tipo>/<descricao-curta>`.
- Uma branch, um objetivo. Commit Conventional Commits.
- `main` sem commit direto e sem force push.
- `.env` não entra no stage.

## Debug

- A mensagem de erro entra na resposta, com a camada dona (type, service, hook, página, schema).
- Uma correção nessa camada. `npm run check` de novo.
- A correção não muda coluna, rota ou escopo do plano aceito. Se precisar mudar, volta para o plano e espera aceite.

## Handoff

- Um arquivo, `docs/handoff.md`, no máximo 60 linhas, sem código.
- Tem branch, objetivo, se o plano está aceito, feito, falta, próximo passo em uma frase e a lista curta de arquivos para abrir.
- O próximo chat faz só esse próximo passo.
