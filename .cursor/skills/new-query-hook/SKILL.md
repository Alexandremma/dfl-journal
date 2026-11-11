---
name: new-query-hook
description: >-
  Cria o hook useGet* e a query key de uma entidade já aceita no plano. Antes
  de criar, confira types, services, queryKeys e hooks para não duplicar key.
  Não crie mutation nem página. No caderno, use para useGetNotebooks,
  useGetNotes, useGetNote e useGetTasks.
---

# Hook de leitura

1. Liste o que já existe em `src/types/`, `src/services/`, `src/lib/queryKeys.ts` e `src/hooks/`.
2. Se a entidade não está num plano aceito, pare e pergunte.
3. Se a key já existe, estenda o factory. Não crie uma segunda key para o mesmo dado.
4. A forma da key sai do plano aceito. Filtro, página e busca entram na key quando mudam o resultado. Não use string solta.
5. Crie `useGet<Entidade>` imitando o hook de leitura ouro: `useQuery` com `queryKey` e `queryFn` chamando o service.
6. `enabled` segura a query quando falta o que ela precisa:
   - leitura da conta usa a sessão
   - leitura que depende de um id da rota usa `enabled: Boolean(id)`

Não crie `useMutation` nesta skill.

## Neste repositório

O hook ouro é `useGetProfile`. As keys e o `enabled` de cada leitura estão na seção Cache de `docs/ficha-tecnica.md` e na seção Hook de leitura de `docs/qualidade.md`.

- `useGetNotebooks` usa a sessão
- `useGetNotes` e `useGetNote` usam `enabled: Boolean(notebookId)`; `useGetNote` também exige o id da nota
- `useGetTasks` usa `enabled: Boolean(noteId)`

## Qualidade

A seção Hook de leitura de `docs/qualidade.md` passa inteira. String solta na `queryKey` se corrige antes de seguir. Se a régua do repositório for mais específica que esta skill, vale a régua.
