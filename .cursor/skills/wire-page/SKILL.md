---
name: wire-page
description: >-
  Liga a página ao hook, com pending, erro com tentar de novo e empty. A
  página não importa service nem o client do banco. No caderno, use ao
  implementar NotebooksPage, NotebookNotesPage ou NotePage.
---

# Página

1. Leia a página ouro e os componentes de pending, erro e empty.
2. A página importa o hook. Não importa service nem o client do banco.
3. Links e `navigate` usam o arquivo de rotas do repositório. Número de página e tamanho de página vêm de consts, quando o plano pede lista paginada.
4. Três estados, sempre:
   - `isPending` → indicador de carregamento
   - `isError` → mensagem e botão "Tentar de novo" que chama `refetch`
   - lista vazia → empty state no idioma da interface
5. Empty de "ainda não existe nenhum" é diferente de empty de filtro ou busca sem resultado.
6. Texto obrigatório passa por `trim`. O botão de criar fica desabilitado quando, sem espaços nas pontas, ele está vazio.
7. Antes de `mutate`, chame `reset()` no hook de mutation. Enquanto `isPending`, o botão mostra o texto de espera e fica desabilitado.
8. Apagar pede confirmação quando o plano pede. Cancelar não chama `mutate`.
9. Filtro, página e busca ficam na URL quando o plano pede. Mudar a busca volta para a página 1. Página ausente ou inválida mostra a página 1. Página além do fim mostra a última que ainda tem item. Apagar o último item de uma página maior que 1 volta para a página anterior.
10. Texto da interface no idioma do produto. Identificadores em inglês.

Não busque dado novo aqui. Se falta um GET ou uma mutation, pare e use a skill do hook.

## Neste repositório

- Página ouro: `SettingsPage`. Componentes em `src/components/ui`. Rotas em `src/consts/routes.ts`. Tamanho da página em `src/consts/pagination.ts`.
- O botão de espera mostra "Salvando…".
- Filtro `favoritos=1` na home. `page` e `q` nas notas. Confirmação ao apagar caderno ou nota.
- A fatia desta branch está em `docs/tasks.md`.

## Qualidade

A seção Página de `docs/qualidade.md` passa inteira. Se a régua do repositório for mais específica que esta skill, vale a régua.
