# Ficha técnica — Caderno

Escopo aceito. Este arquivo é a fonte do produto: o que é, para que serve e como a entrega precisa estar. A seção Cache trava as query keys. A lista de arquivos está em `docs/plans/caderno.md`. O SQL está em `supabase/schema.sql`.

Identificadores de tabela, coluna e rota em inglês. Texto de interface em português.

## O que é

Caderno é um diário de estudo por conta. A pessoa entra, cria cadernos, e dentro de cada caderno cria notas. Cada nota tem um texto e uma checklist curta. Caderno e nota podem ser favoritos.

Cada conta vê e altera só o que é seu. Outra conta, no mesmo projeto Supabase, vê as listas vazias.

## Finalidade

É o projeto final da disciplina de frontend, até a integração com Supabase. A turma já viu componente, rota, formulário, lista, carregamento, erro e vazio. Aqui isso volta junto, com três tabelas ligadas, favorito, busca e uma lista paginada.

O starter entrega a casca e o schema. O aluno lê as tabelas e constrói a camada de dados no padrão do perfil: página, hook, service, Supabase. A prova não é inventar a tabela. É fazer a tela gravar e ler do jeito certo.

## O que já vem pronto

- Conta: criar, entrar e sair, em `/login`.
- Perfil: nome e tema em `/settings`, com a linha nascendo no signup.
- Layout, tema claro/escuro, rotas protegidas.
- Estados de tela: carregando, erro com "Tentar de novo", lista vazia.
- `profiles`, `notebooks`, `notes` e `tasks` em `supabase/schema.sql`, com RLS. Essas tabelas e o trigger de signup não se reescrevem.
- Cascas em `/`, `/notebooks/:notebookId` e `/notebooks/:notebookId/notes/:noteId`.
- `pageSize` igual a 5, em `src/consts/pagination.ts`.
- O padrão a copiar: `profile.service.ts`, `useGetProfile`, `useUpdateProfile`.

Autenticação já fala com o Supabase. Dado de caderno, nota e tarefa passa por service. A página não importa o client.

## O que a entrega acrescenta

Três recursos, nesta ordem de tela:

1. **Cadernos**, na home. Criar, renomear, apagar, favoritar, filtrar "só favoritos". O card mostra quantas notas o caderno tem.
2. **Notas**, dentro do caderno. Criar, editar, apagar, favoritar. Lista paginada, 5 por página, com busca por título.
3. **Tarefas**, no detalhe da nota. Criar e marcar como feita.

Apagar um caderno apaga as notas dele e, com elas, as tarefas. Apagar uma nota apaga as tarefas dela.

O schema dessas três tabelas já está em `supabase/schema.sql`, com RLS. O aluno cola o arquivo no SQL Editor do projeto dele e constrói service, hook e página em cima. Não redesenha coluna.

## Definição de pronto

A entrega está pronta quando os itens abaixo são verdadeiros ao mesmo tempo.

- Criar conta, entrar, e ver a lista de cadernos vazia.
- Criar um caderno, abrir, criar notas, editar o texto, favoritar, apagar.
- A lista de notas do caderno pagina de 5 em 5, a página sobrevive ao refresh, e a busca por título pagina junto.
- Na nota, criar tarefas e marcar uma como feita. Refresh mantém o estado.
- Apagar a nota remove as tarefas. Apagar o caderno remove as notas.
- Trocar o tema em `/settings` e ver o valor depois do refresh.
- Entrar com outra conta e ver cadernos vazios.
- O aluno explica o caminho de favoritar uma nota: quais query keys são invalidadas e por que a outra conta não vê essa linha.
- `npm run check` limpo. O check não substitui o roteiro acima: a casca, sem dados, também passa no check.

## Features

### Conta e perfil (prontos)

- Criar conta, entrar e sair.
- Alterar nome e tema. O tema pinta a página e continua depois do refresh.

### Cadernos

- Criar com título obrigatório.
- Renomear o título.
- Apagar, com confirmação.
- Favoritar e desfavoritar.
- Filtrar a lista para mostrar só os favoritos.
- Ver, no card, a quantidade de notas daquele caderno.
- Ordenar do atualizado mais recente para o mais antigo.

### Notas

- Criar com título obrigatório. O texto pode ficar vazio.
- Editar título e texto.
- Apagar, com confirmação.
- Favoritar e desfavoritar.
- Listar só as notas daquele caderno, 5 por página.
- Buscar por título, sem diferenciar maiúsculas, dentro daquele caderno.
- Ordenar do atualizado mais recente para o mais antigo.

### Tarefas

- Criar com título obrigatório, na nota aberta.
- Marcar como feita e desmarcar.
- Ordenar da mais antiga para a mais nova, na ordem em que foram criadas.

Não há editar nem apagar o título de uma tarefa. Não há favorito em tarefa. A checklist da nota não é paginada.

## Telas

Cinco telas. As duas primeiras já existem. As três últimas são a entrega.

### Entrar — `/login` (pronta)

Criar conta ou entrar com e-mail e senha. Com sessão, segue para `/`. Sem URL e anon key no `.env`, a tela avisa para preencher e reiniciar o `npm run dev`.

### Ajustes — `/settings` (pronta)

Ler e salvar nome e tema. Mostra carregando, erro com "Tentar de novo", erro da gravação e "Salvo."

### Cadernos — `/`

Lista os cadernos da conta. Dá para criar, renomear, apagar, favoritar e abrir um caderno.

O filtro "só favoritos" fica na URL (`?favoritos=1`), para o refresh manter o filtro. Sem o parâmetro, a lista mostra todos.

Estados:

- Carregando.
- Erro, com a mensagem e "Tentar de novo".
- Nenhum caderno ainda.
- Filtro de favoritos sem resultado, com texto próprio. Isso é diferente da lista vazia de quem nunca criou um caderno.

A lista de cadernos não é paginada.

### Notas do caderno — `/notebooks/:notebookId`

Lista as notas daquele caderno. Dá para criar, editar, apagar, favoritar e abrir uma nota. Mostra o título do caderno e um caminho de volta para `/`.

A página fica na URL (`?page=2`). Sem `page`, vale a página 1. `page` inválido volta para a página 1. Se a página pedida passou do fim, a tela mostra a última página que ainda tem nota.

A busca por título fica na mesma URL (`?q=`). Busca e página são o mesmo carregamento: mudar o texto da busca volta para a página 1. São 5 notas por página, com "anterior", "próxima" e "página 2 de N". Nas pontas, o botão que não tem para onde ir fica desabilitado.

Se a pessoa apaga a última nota da página atual e essa página é maior que 1, a tela volta para a página anterior.

Estados:

- Carregando.
- Erro, com "Tentar de novo".
- Caderno sem nenhuma nota.
- Busca sem resultado, com texto próprio.
- Caderno que não existe ou não é da conta: mensagem clara, sem lista, com volta para `/`.

### Nota — `/notebooks/:notebookId/notes/:noteId`

Mostra título, texto e as tarefas daquela nota. Dá para editar título e texto, favoritar, apagar a nota e criar ou marcar tarefa. Caminho de volta para a lista do caderno.

Estados:

- Carregando.
- Erro, com "Tentar de novo".
- Nenhuma tarefa ainda.
- Nota que não existe, não é da conta, ou não pertence àquele caderno: mensagem clara e volta para a lista do caderno.

## Tabelas

Quem lê e escreve cada linha: só o dono, `user_id = auth.uid()`. Em `notes`, a policy também exige que o caderno pai seja desse usuário. Em `tasks`, exige que a nota pai seja desse usuário.

`updated_at` nasce e muda por trigger no schema. O service não manda esse valor.

### `notebooks`

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | `uuid` | chave primária, gerada no banco |
| `user_id` | `uuid` | dono, referência a `auth.users`, apagar o usuário apaga o caderno |
| `title` | `text` | obrigatório |
| `is_favorite` | `boolean` | padrão `false` |
| `created_at` | `timestamptz` | padrão `now()` |
| `updated_at` | `timestamptz` | a trigger atualiza |

### `notes`

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | `uuid` | chave primária, gerada no banco |
| `notebook_id` | `uuid` | caderno pai; apagar o caderno apaga as notas |
| `user_id` | `uuid` | dono, repetido de propósito para a policy ficar legível |
| `title` | `text` | obrigatório |
| `body` | `text` | padrão vazio |
| `is_favorite` | `boolean` | padrão `false` |
| `created_at` | `timestamptz` | padrão `now()` |
| `updated_at` | `timestamptz` | a trigger atualiza |

### `tasks`

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | `uuid` | chave primária, gerada no banco |
| `note_id` | `uuid` | nota pai; apagar a nota apaga as tarefas |
| `user_id` | `uuid` | dono, a mesma repetição de `notes` |
| `title` | `text` | obrigatório |
| `is_done` | `boolean` | padrão `false` |
| `created_at` | `timestamptz` | padrão `now()` |

Não existe tabela de favoritos. Favorito é `is_favorite` na linha do caderno e da nota, porque cada um já tem um dono só.

`profiles` permanece como está: `id`, `name`, `theme`.

## Regras que atravessam as telas

- Título de caderno, nota e tarefa é obrigatório no formulário, depois de tirar espaços das pontas. Texto da nota pode ser vazio.
- Favoritar grava na mesma linha e a lista passa a refletir o novo valor.
- Criar, editar, apagar ou favoritar uma nota atualiza a lista paginada daquele caderno, inclusive o total de páginas e a quantidade no card.
- Criar ou marcar uma tarefa atualiza a lista de tarefas daquela nota.
- A quantidade no card do caderno conta todas as notas dele, com ou sem o filtro de favoritos da home.
- A interface usa o escape padrão do React.

## Cache

Uma key por leitura. Filtro, página e busca fazem parte da key. Não existe key nova para "a versão atualizada".

- Cadernos: `['notebooks', { favoritesOnly }]`. `favoritesOnly` é verdadeiro quando a URL tem `favoritos=1`.
- Notas do caderno: `['notes', { notebookId, page, query }]`. Sem busca, `query` é `''`. Sem `page` na URL, a página é `1`.
- Uma nota: `['notes', id]`.
- Tarefas da nota: `['tasks', { noteId }]`.

Invalidar o prefixo `['notebooks']` atualiza a lista com e sem o filtro de favoritos. Invalidar `['notes', { notebookId }]` atualiza todas as páginas e buscas daquele caderno.

- Criar, renomear, apagar ou favoritar um caderno invalida `['notebooks']`.
- Criar, editar, apagar ou favoritar uma nota invalida `['notes', { notebookId }]`. Editar, apagar ou favoritar também invalida `['notes', id]`.
- Criar ou apagar uma nota invalida `['notebooks']`, porque a quantidade no card muda.
- Favoritar uma nota não invalida `['notebooks']`: a quantidade não muda.
- Criar ou marcar uma tarefa invalida `['tasks', { noteId }]`.

A quantidade no card vem na mesma query dos cadernos, pelo relacionamento `notes(count)`. Não é uma query por card.

## Fora de escopo

- Compartilhar caderno com outra pessoa.
- Anexos e storage.
- Tempo real.
- Tags.
- Editor de texto rico.
- Arrastar para reordenar.
- Mover nota para outro caderno.
- Paginação infinita. A paginação da prova é numerada, de 5 em 5.
- Paginar a lista de cadernos ou a checklist da nota.
- Editar ou apagar uma tarefa já criada. Dá para criar e marcar.
- Filtrar notas favoritas. O filtro "só favoritos" é da lista de cadernos.
- Foto de avatar, mais de um idioma, login social.
- Update otimista, tipos gerados pelo CLI do Supabase, edge functions.

## Como verificar

1. Criar conta e entrar. A home de cadernos abre vazia.
2. Criar dois cadernos. Favoritar um. Ligar "só favoritos" e ver só esse. Atualizar a página e ver o filtro continuar.
3. Abrir o caderno, criar seis notas e ver duas páginas, 5 e 1. Ir para a página 2, atualizar, e continuar na página 2.
4. Buscar um título que só existe na página 2. A busca abre na página 1 dos resultados.
5. Abrir uma nota, escrever o texto, criar duas tarefas, marcar uma, atualizar a página e ver tudo no lugar.
6. Apagar a nota e confirmar que as tarefas sumiram. Apagar o caderno e confirmar que as notas sumiram.
7. No Table Editor, ver as linhas do próprio usuário.
8. Entrar com outra conta e ver a lista de cadernos vazia.
9. Em `/settings`, trocar o tema, atualizar, e ver o tema continuar.
