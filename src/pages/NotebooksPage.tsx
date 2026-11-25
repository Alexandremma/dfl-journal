import { FormEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { routes } from '@/consts/routes';
import {
  useCreateNotebook,
  useDeleteNotebook,
  useGetNotebooks,
  useToggleNotebookFavorite,
  useUpdateNotebook,
} from '@/hooks';
import type { Notebook } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';

const favoritesParam = 'favoritos';

function notesLabel(count: number) {
  return count === 1 ? '1 nota' : `${count} notas`;
}

export function NotebooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const favoritesOnly = searchParams.get(favoritesParam) === '1';
  const notebooks = useGetNotebooks(favoritesOnly);
  const create = useCreateNotebook();
  const toggleFavorite = useToggleNotebookFavorite();
  const update = useUpdateNotebook();
  const remove = useDeleteNotebook();
  const [title, setTitle] = useState('');
  const trimmedTitle = title.trim();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const trimmedEditTitle = editTitle.trim();

  function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!trimmedTitle) return;
    create.reset();
    create.mutate({ title: trimmedTitle }, { onSuccess: () => setTitle('') });
  }

  function onToggleFavorite(notebook: Notebook) {
    toggleFavorite.reset();
    toggleFavorite.mutate({ id: notebook.id, isFavorite: !notebook.isFavorite });
  }

  function onStartEdit(notebook: Notebook) {
    update.reset();
    setEditingId(notebook.id);
    setEditTitle(notebook.title);
  }

  function onCancelEdit() {
    update.reset();
    setEditingId(null);
  }

  function onRename(event: FormEvent, notebook: Notebook) {
    event.preventDefault();
    if (!trimmedEditTitle) return;
    update.reset();
    update.mutate(
      { id: notebook.id, title: trimmedEditTitle },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function onDelete(notebook: Notebook) {
    const confirmed = window.confirm(
      `Apagar o caderno "${notebook.title}"? As notas dele também serão apagadas.`,
    );
    if (!confirmed) return;
    remove.reset();
    remove.mutate({ id: notebook.id });
  }

  function onToggleFilter() {
    const next = new URLSearchParams(searchParams);
    if (favoritesOnly) {
      next.delete(favoritesParam);
    } else {
      next.set(favoritesParam, '1');
    }
    setSearchParams(next);
  }

  function renderList() {
    if (notebooks.isPending) return <Spinner label="Carregando cadernos…" />;
    if (notebooks.isError) {
      return <ErrorState message={notebooks.error.message} onRetry={() => notebooks.refetch()} />;
    }
    if (notebooks.data.length === 0) {
      return favoritesOnly ? (
        <EmptyState
          title="Nenhum caderno favorito"
          description="Favorite um caderno ou desligue o filtro para ver todos."
        />
      ) : (
        <EmptyState
          title="Nenhum caderno ainda"
          description="Crie o primeiro caderno no campo acima."
        />
      );
    }
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {notebooks.data.map((notebook) => {
          const isSaving =
            toggleFavorite.isPending && toggleFavorite.variables?.id === notebook.id;
          const isDeleting = remove.isPending && remove.variables?.id === notebook.id;

          if (editingId === notebook.id) {
            return (
              <li
                key={notebook.id}
                className="rounded-lg border border-stone-200 p-4 dark:border-stone-800"
              >
                <form className="space-y-2" onSubmit={(event) => onRename(event, notebook)}>
                  <label className="sr-only" htmlFor={`rename-${notebook.id}`}>
                    Novo título do caderno
                  </label>
                  <input
                    id={`rename-${notebook.id}`}
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    autoFocus
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
                  />
                  {!trimmedEditTitle && (
                    <p className="text-sm text-red-700">Informe o título do caderno.</p>
                  )}
                  {update.isError && <p className="text-sm text-red-700">{update.error.message}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={update.isPending || !trimmedEditTitle}
                      className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900"
                    >
                      {update.isPending ? 'Salvando…' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={onCancelEdit}
                      disabled={update.isPending}
                      className="rounded-md border border-stone-300 px-3 py-1.5 text-sm disabled:opacity-60 dark:border-stone-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </li>
            );
          }

          return (
            <li
              key={notebook.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-stone-200 p-4 dark:border-stone-800"
            >
              <Link to={routes.notebook(notebook.id)} className="min-w-0 flex-1">
                <h2 className="truncate font-medium">{notebook.title}</h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {notesLabel(notebook.notesCount)}
                </p>
              </Link>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(notebook)}
                  disabled={toggleFavorite.isPending}
                  aria-pressed={notebook.isFavorite}
                  className="rounded-md border border-stone-300 px-2 py-1 text-sm disabled:opacity-60 dark:border-stone-700"
                >
                  {isSaving ? 'Salvando…' : notebook.isFavorite ? '★ Favorito' : '☆ Favoritar'}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onStartEdit(notebook)}
                    disabled={isDeleting}
                    className="text-sm text-stone-600 underline disabled:opacity-60 dark:text-stone-300"
                  >
                    Renomear
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(notebook)}
                    disabled={remove.isPending}
                    className="text-sm text-red-700 underline disabled:opacity-60"
                  >
                    {isDeleting ? 'Apagando…' : 'Apagar'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Cadernos</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={favoritesOnly} onChange={onToggleFilter} />
          Só favoritos
        </label>
      </div>

      <form className="mt-6 flex gap-2" onSubmit={onCreate}>
        <label className="sr-only" htmlFor="notebook-title">
          Título do caderno
        </label>
        <input
          id="notebook-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Novo caderno"
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
        />
        <button
          type="submit"
          disabled={create.isPending || !trimmedTitle}
          className="shrink-0 rounded-md bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900"
        >
          {create.isPending ? 'Salvando…' : 'Criar'}
        </button>
      </form>
      {create.isError && <p className="mt-2 text-sm text-red-700">{create.error.message}</p>}
      {toggleFavorite.isError && (
        <p className="mt-2 text-sm text-red-700">{toggleFavorite.error.message}</p>
      )}
      {remove.isError && <p className="mt-2 text-sm text-red-700">{remove.error.message}</p>}

      <div className="mt-6">{renderList()}</div>
    </section>
  );
}
