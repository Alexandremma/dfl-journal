---
name: new-mutation-hook
description: >-
  Cria useMutation que grava pelo service e invalida as query keys do plano
  aceito. Não invente query key nova. Não altere a página nesta skill. No
  caderno, use para criar, editar, apagar e favoritar caderno ou nota, e para
  criar ou marcar tarefa.
---

# Hook de mutation

1. Leia o hook de GET da entidade e anote a key. A mutation invalida essa key, não uma nova.
2. Imite o hook de mutation ouro do repositório.
3. `useMutation` chama a função de escrita do service.
4. No sucesso, invalide o que o plano aceito lista:
   - a família inteira, quando qualquer variante da lista precisa atualizar
   - a linha, quando a tela aberta também lê por id
   - uma segunda entidade, só quando o plano diz que o dado dela mudou
5. O nome segue o verbo e a entidade: `useCreate*`, `useUpdate*`, `useDelete*`, `useToggle*`.

Não altere a página nesta skill. `reset()` antes do `mutate` fica em `wire-page`.

## Neste repositório

O ouro é `useUpdateProfile`. A lista do que cada mutation invalida está na seção Cache de `docs/ficha-tecnica.md`. Os nomes dos hooks estão em `docs/plans/caderno.md`. A fatia desta branch está em `docs/tasks.md`.

## Qualidade

A seção Hook de mutation de `docs/qualidade.md` passa inteira. Se a `invalidateQueries` aponta para uma key que o GET não usa, troque pela key do GET. Se a régua do repositório for mais específica que esta skill, vale a régua.
