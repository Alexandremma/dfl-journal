---
name: new-service
description: >-
  Cria o service async de uma entidade do plano aceito do caderno. Use ao
  adicionar notebooks.service.ts, notes.service.ts ou tasks.service.ts. Imite
  profile.service.ts. Não crie hook nem página nesta skill.
---

# Service

1. Confirme `docs/plans/caderno.md`. O schema já existe. Não o edite.
2. Leia `src/services/profile.service.ts` e imite a forma.
3. Crie `src/services/<entidade>.service.ts`:
   - sem import de React
   - funções `async`
   - mapper snake_case → camelCase no mesmo arquivo
   - `throw new Error(...)` quando o Supabase devolver `error`
   - dono via `supabase.auth.getUser()`, nunca por argumento vindo da página
   - colunas nomeadas no `select`, iguais ao mapper
   - não envie `updated_at`
4. No GET de cadernos, peça `notes(count)` na mesma query. O mapper expõe a quantidade. Não faça uma query por card.
5. No GET de notas, peça `count: 'exact'`, ordene `updated_at` descendente e use `range` com `pageSize` de `src/consts/pagination.ts`. Use `ilike` no título só quando a busca, sem espaços nas pontas, não for vazia. Devolva as linhas e o total.
6. Exporte no barrel `src/services/index.ts` se ele já reexporta os services.

Não crie hook, página nem query key nesta skill. A key entra em `new-query-hook`.

## Qualidade

A seção Service de `docs/qualidade.md` passa inteira antes de encerrar.
