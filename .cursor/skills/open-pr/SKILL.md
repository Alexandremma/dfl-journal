---
name: open-pr
description: >-
  Abre o pull request com título Conventional Commits e o corpo do template
  do repositório. Use depois de review-diff limpo. Você escreve o texto. Não
  peça para a pessoa redigir.
---

# Abrir o PR

1. `review-diff` já passou e o check do repositório está limpo. Se não passou, volte para lá.
2. Traga a `main` para a branch se ela ficou para trás.
3. Título: `tipo(escopo): assunto no imperativo`, sem ponto final. Exemplo: `feat(orders): add list query and service`.
4. Corpo no formato do template de pull request do repositório. Marque em How to verify só o que esta mudança cobre.
5. Você preenche Summary e What was done a partir do diff. Não peça redação a quem está usando.
6. A `main` não recebe push direto.

## Neste repositório

O template é `.github/PULL_REQUEST_TEMPLATE.md`. O check é `npm run check`. Exemplo de título: `feat(notebooks): add list query and service`. O roteiro de verificação está em `docs/ficha-tecnica.md`; marque só a fatia desta branch, descrita em `docs/tasks.md`.

## Qualidade

A seção Pull request de `docs/qualidade.md` passa inteira. Entregue a URL do PR. Se a régua do repositório for mais específica que esta skill, vale a régua.
