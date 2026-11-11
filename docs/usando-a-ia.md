# Usando a IA neste repositório

Você pede o resultado em frase normal. A IA abre a branch, escreve o plano,
espera o seu aceite, implementa, roda `npm run check` e preenche o PR.
Você lê o diff e comenta se quiser mudar.

A régua está em [qualidade.md](./qualidade.md). A IA se confere nela. Você
não preenche rubrica à mão.

## Pedidos que funcionam

A ordem está em [tasks.md](./tasks.md). Uma frase pede uma tarefa. A primeira
é sua: conectar o Supabase. A IA não cria o projeto, não vê a chave e não
commita o `.env`.

```txt
Liga a lista de cadernos, com criar, favoritar, filtro de favoritos e a quantidade de notas.
```

O plano do caderno já está aceito em `docs/plans/caderno.md`. A IA implementa
a fatia pedida: service, hook e página. Não reescreve o schema. Não antecipa
a tarefa seguinte. Notas e tarefas ficam para o pedido delas. Uma mudança de
coluna, rota ou escopo faz a IA regravar o plano e esperar de novo.

```txt
O empty state da lista está sem texto.
```

Isso está dentro do que já foi aceito. A IA corrige, sem plano novo.

```txt
Vou abrir outro chat. Faz o handoff.
```

A IA regrava `docs/handoff.md`. No chat novo:

```txt
Continua o caderno a partir de docs/handoff.md.
Faz só o próximo passo.
```

## O que a IA não faz sozinha

- Implementar tabela nova sem o seu aceite.
- Commitar direto na `main`, ou commitar `.env` e `service_role`.
- Reescrever o perfil, que já é o exemplo ouro.
- Ampliar o escopo (storage, realtime, login social) porque "ficaria melhor".

## Quando o chat ficar longo

Peça o handoff no fim de uma fatia, com o próximo passo já claro. Um arquivo
curto custa menos do que repetir a conversa, e o chat novo não mistura uma
decisão velha com o pedido atual.
