# Caderno

Projeto final da disciplina. O app já sobe com login, perfil, schema e as três
telas do diário em casca. O aluno liga cadernos, notas e tarefas no padrão do
perfil. O produto está em `docs/ficha-tecnica.md`. O plano aceito está em
`docs/plans/caderno.md`.

## Subir local

1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Em Authentication → Providers → Email, desligue **Confirm email**.
3. No SQL Editor, cole e rode `supabase/schema.sql`.
4. Em Project Settings → API, copie a URL e a chave **anon**.
5. Copie o ambiente e preencha:

```bash
cp .env.example .env
```

```txt
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

6. Instale e abra:

```bash
npm install
npm run dev
```

A tela de login fica em [http://localhost:5173/login](http://localhost:5173/login). Criar conta grava uma linha em `profiles`. Em Ajustes, nome e tema persistem depois do refresh. O tema escuro pinta a página.

A chave `service_role` não entra no `.env` do Vite.

## O que já está pronto

- Login: criar conta, entrar e sair.
- Perfil: `profile.service.ts`, `useGetProfile`, `useUpdateProfile`, `/settings`.
- Schema de `notebooks`, `notes` e `tasks`, com RLS. Não reescreva essas tabelas.
- Cascas em `/`, `/notebooks/:notebookId` e `/notebooks/:notebookId/notes/:noteId`.
- `pageSize` igual a 5, em `src/consts/pagination.ts`.
- `npm run check`: TypeScript, lint, teste do mapper e bloqueio de `service_role` no stage. O lint também bloqueia página e componente de importar service ou o client.

## Para a turma

A ordem da entrega está em `docs/tasks.md`. A primeira tarefa é conectar o seu projeto no Supabase. O resto segue uma fatia por branch. A régua está em `docs/qualidade.md`. O uso da IA está em `docs/usando-a-ia.md`. A entrega está pronta quando o roteiro da ficha passa, inclusive explicar o que acontece ao favoritar uma nota.
