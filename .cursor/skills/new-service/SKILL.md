---
name: new-service
description: >-
  Cria o service async de uma entidade que já está num plano aceito. Use ao
  adicionar um arquivo em src/services. Imite o service ouro do repositório.
  Não crie hook nem página nesta skill. No caderno, use para notebooks, notes
  e tasks.
---

# Service

1. Confirme que a entidade está num plano aceito. Sem plano aceito, pare e use `plan-feature`.
2. Leia o service ouro do repositório e imite a forma. Não copie para outro arquivo a função que lê o usuário: importe a que já existe.
3. Crie `src/services/<entidade>.service.ts`:
   - sem import de React
   - funções `async`
   - mapper snake_case → camelCase no mesmo arquivo
   - `throw new Error(...)` quando o banco devolver erro
   - o id do dono sai da função compartilhada de sessão, nunca de argumento vindo da página
   - o insert manda a coluna do dono com esse id
   - texto obrigatório passa por `trim`; se ficar vazio, `throw` e não grave `''`
   - colunas nomeadas no `select`, iguais ao mapper
   - não envie coluna que o banco preenche sozinho, como `updated_at` ou id gerado
4. Contagem, paginação, busca e ordem são as do plano aceito. Se o plano pede a contagem na mesma leitura, não faça uma query por item.
5. Exporte no barrel `src/services/index.ts` se ele já reexporta os services. A função de sessão não entra no barrel: o service importa o arquivo direto.

Não crie hook, página nem query key nesta skill. A key entra em `new-query-hook`.

## Neste repositório

- Plano aceito: `docs/plans/caderno.md`. Não edite `supabase/schema.sql`.
- Ouro: `src/services/profile.service.ts` e `src/services/current-user.ts`. O insert manda `user_id`.
- Contagem de notas, `range`, `ilike` e a ordem de `created_at` estão na seção Service de `docs/qualidade.md`. A fatia desta branch está em `docs/tasks.md`.

## Qualidade

A seção Service de `docs/qualidade.md` passa inteira antes de encerrar. Se a régua do repositório for mais específica que esta skill, vale a régua.
